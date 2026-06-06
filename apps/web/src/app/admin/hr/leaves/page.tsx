"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { PageHeader, SectionCard, DataTable, Button, ErrorState, FormModal, Input } from "@nexsmsid/ui";
import { createBrowserApiClient } from "@/lib/api-client";
import { Loader2, Plus, RefreshCcw } from "lucide-react";

export default function Page() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [employees, setEmployees] = useState<any[]>([]);
  const client = useMemo(() => createBrowserApiClient(), []);

  async function loadData() {
    setLoading(true);
    setError(null);
    try {
      const response = await client.listLeaveRequests({ limit: 50, page: 1 });
      setItems((response as any).data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat data");
    } finally {
      setLoading(false);
    }
  }

  async function loadEmployees() {
    try {
      const response = await client.listEmployees({ limit: 100 });
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
      type: formData.get("type") as string,
      startDate: formData.get("startDate") as string,
      endDate: formData.get("endDate") as string,
      reason: formData.get("reason") as string
    };

    try {
      await client.createLeaveRequest(payload);
      setFormOpen(false);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan pengajuan cuti");
    } finally {
      setSubmitting(false);
    }
  }

  const columns = [
    { key: "employee", header: "Pegawai", cell: (item: any) => String(item.employee?.fullName ?? item.employeeId ?? "-") },
    { key: "type", header: "Tipe", cell: (item: any) => String(item.type ?? "-") },
    { key: "period", header: "Periode", cell: (item: any) => `${formatDate(item.startDate)} - ${formatDate(item.endDate)}` },
    { key: "totalDays", header: "Hari", cell: (item: any) => String(item.totalDays ?? "-") },
    { key: "status", header: "Status", cell: (item: any) => String(item.status ?? "-") }
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Cuti & Izin"
        description="Manajemen cuti & izin."
        breadcrumb={["Admin", "HR & Payroll", "Cuti & Izin"]}
        actions={
          <>
            <Button onClick={loadData} variant="outline">
              <RefreshCcw className="h-4 w-4" /> Refresh
            </Button>
            <Button onClick={() => setFormOpen(true)}>
              <Plus className="h-4 w-4" /> Tambah
            </Button>
          </>
        }
      />

      {error ? <ErrorState message={error} title="Terjadi Kesalahan" /> : null}

      <SectionCard title="Daftar Cuti & Izin">
        <DataTable
          columns={columns}
          data={items}
          loading={loading}
          getRowId={(item) => item.id}
          emptyState={{
            title: "Data kosong",
            description: "Belum ada data cuti & izin.",
          }}
        />
      </SectionCard>

      <FormModal
        onClose={() => setFormOpen(false)}
        open={formOpen}
        title="Tambah Pengajuan Cuti"
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
            <span className="text-sm font-bold text-slate-700">Tipe</span>
            <select className="w-full rounded-2xl border border-input bg-white px-4 py-2 text-sm shadow-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
              name="type" defaultValue="ANNUAL">
              <option value="ANNUAL">Cuti Tahunan</option>
              <option value="SICK">Sakit</option>
              <option value="MARRIAGE">Menikah</option>
              <option value="MATERNITY">Melahirkan</option>
              <option value="OTHER">Lainnya</option>
            </select>
          </label>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block space-y-2">
              <span className="text-sm font-bold text-slate-700">Mulai</span>
              <Input name="startDate" type="date" required defaultValue={new Date().toISOString().split("T")[0]} />
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-bold text-slate-700">Selesai</span>
              <Input name="endDate" type="date" required defaultValue={new Date().toISOString().split("T")[0]} />
            </label>
          </div>
          <label className="block space-y-2">
            <span className="text-sm font-bold text-slate-700">Alasan</span>
            <textarea className="w-full rounded-2xl border border-input bg-white px-4 py-2 text-sm shadow-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
              name="reason" required rows={3} placeholder="Jelaskan alasan cuti..." />
          </label>
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
