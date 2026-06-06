"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { Loader2, Plus, RefreshCcw } from "lucide-react";

import { Button, DataTable, ErrorState, FormModal, Input, PageHeader, SectionCard } from "@nexsmsid/ui";
import { createBrowserApiClient } from "@/lib/api-client";

export default function Page() {
  const api = useMemo(() => createBrowserApiClient(), []);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [employees, setEmployees] = useState<any[]>([]);

  async function loadData() {
    setLoading(true);
    setError(null);
    try {
      const response = await api.listEmployeeAttendance({ limit: 50, page: 1 });
      setItems((response as any).data || []);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Gagal memuat kehadiran pegawai");
    } finally {
      setLoading(false);
    }
  }

  async function loadEmployees() {
    try {
      const response = await api.listEmployees({ limit: 100 });
      setEmployees((response as any).data || []);
    } catch { /* ignore */ }
  }

  useEffect(() => {
    void loadData();
    void loadEmployees();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    const formData = new FormData(event.currentTarget);
    const payload = {
      employeeId: formData.get("employeeId") as string,
      date: formData.get("date") as string,
      status: formData.get("status") as string,
      checkInAt: formData.get("checkInAt") ? `${formData.get("date")}T${formData.get("checkInAt")}:00.000Z` : undefined,
      checkOutAt: formData.get("checkOutAt") ? `${formData.get("date")}T${formData.get("checkOutAt")}:00.000Z` : undefined
    };

    try {
      await api.createEmployeeAttendance(payload);
      setFormOpen(false);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mencatat kehadiran");
    } finally {
      setSubmitting(false);
    }
  }

  const columns = [
    { key: "date", header: "Tanggal", cell: (item: any) => formatDate(item.date) },
    { key: "employee", header: "Pegawai", cell: (item: any) => String(item.employee?.fullName ?? item.employeeId ?? "-") },
    { key: "status", header: "Status", cell: (item: any) => String(item.status ?? "-") },
    { key: "checkInAt", header: "Masuk", cell: (item: any) => formatTime(item.checkInAt) },
    { key: "checkOutAt", header: "Pulang", cell: (item: any) => formatTime(item.checkOutAt) },
    { key: "lateMinutes", header: "Terlambat", cell: (item: any) => `${Number(item.lateMinutes ?? 0)} menit` }
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Kehadiran Pegawai"
        description="Rekap presensi pegawai dan staf."
        breadcrumb={["Admin", "HR & Payroll", "Kehadiran"]}
        actions={
          <>
            <Button onClick={loadData} variant="outline"><RefreshCcw className="h-4 w-4" /> Refresh</Button>
            <Button onClick={() => setFormOpen(true)}><Plus className="h-4 w-4" /> Catat Kehadiran</Button>
          </>
        }
      />

      {error ? <ErrorState message={error} title="Terjadi Kesalahan" /> : null}

      <SectionCard title="Daftar Kehadiran Pegawai">
        <DataTable
          columns={columns}
          data={items}
          loading={loading}
          getRowId={(item) => item.id}
          emptyState={{ title: "Data kosong", description: "Belum ada catatan kehadiran pegawai." }}
        />
      </SectionCard>

      <FormModal
        onClose={() => setFormOpen(false)}
        open={formOpen}
        title="Catat Kehadiran"
      >
        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="block space-y-2">
            <span className="text-sm font-bold text-slate-700">Pegawai</span>
            <select className="w-full rounded-2xl border border-input bg-white px-4 py-2 text-sm shadow-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
              name="employeeId" required defaultValue="">
              <option value="" disabled>Pilih Pegawai</option>
              {employees.map((e) => <option key={e.id} value={e.id}>{e.fullName}</option>)}
            </select>
          </label>
          <label className="block space-y-2">
            <span className="text-sm font-bold text-slate-700">Tanggal</span>
            <Input name="date" type="date" required defaultValue={new Date().toISOString().split("T")[0]} />
          </label>
          <label className="block space-y-2">
            <span className="text-sm font-bold text-slate-700">Status</span>
            <select className="w-full rounded-2xl border border-input bg-white px-4 py-2 text-sm shadow-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
              name="status" defaultValue="PRESENT">
              <option value="PRESENT">Hadir</option>
              <option value="ABSENT">Alpa</option>
              <option value="LATE">Terlambat</option>
              <option value="PERMIT">Izin</option>
              <option value="SICK">Sakit</option>
              <option value="OFF">Libur</option>
            </select>
          </label>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block space-y-2">
              <span className="text-sm font-bold text-slate-700">Jam Masuk</span>
              <Input name="checkInAt" type="time" />
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-bold text-slate-700">Jam Pulang</span>
              <Input name="checkOutAt" type="time" />
            </label>
          </div>
          <div className="flex gap-3 pt-2">
            <Button disabled={submitting} type="submit">
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null} Simpan
            </Button>
            <Button onClick={() => setFormOpen(false)} type="button" variant="outline">Batal</Button>
          </div>
        </form>
      </FormModal>
    </div>
  );
}

function formatDate(value: unknown) {
  return value ? new Date(String(value)).toLocaleDateString("id-ID") : "-";
}

function formatTime(value: unknown) {
  return value ? new Date(String(value)).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) : "-";
}
