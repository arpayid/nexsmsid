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
  const [positions, setPositions] = useState<any[]>([]);
  const client = useMemo(() => createBrowserApiClient(), []);

  async function loadData() {
    setLoading(true);
    setError(null);
    try {
      const response = await client.listEmployees({ limit: 50, page: 1 });
      setItems((response as any).data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat data");
    } finally {
      setLoading(false);
    }
  }

  async function loadPositions() {
    try {
      const response = await client.listHRPositions({ limit: 100 });
      setPositions((response as any).data || []);
    } catch { /* ignore */ }
  }

  useEffect(() => {
    void loadData();
    void loadPositions();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    const formData = new FormData(event.currentTarget);
    const payload = {
      employeeCode: formData.get("employeeCode") as string,
      fullName: formData.get("fullName") as string,
      positionId: (formData.get("positionId") as string) || undefined,
      employmentType: (formData.get("employmentType") as string) || "PERMANENT",
      status: (formData.get("status") as string) || "ACTIVE",
      basicSalary: Number(formData.get("basicSalary") || 0)
    };

    try {
      await client.createEmployee(payload);
      setFormOpen(false);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan data pegawai");
    } finally {
      setSubmitting(false);
    }
  }

  const columns = [
    { key: "employeeCode", header: "Kode Pegawai", cell: (item: any) => String(item.employeeCode ?? "-") },
    { key: "fullName", header: "Nama Lengkap", cell: (item: any) => String(item.fullName ?? "-") },
    { key: "position", header: "Jabatan", cell: (item: any) => String(item.position?.name ?? "-") },
    { key: "employmentType", header: "Tipe", cell: (item: any) => String(item.employmentType ?? "-") },
    { key: "status", header: "Status", cell: (item: any) => String(item.status ?? "-") }
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Data Pegawai"
        description="Manajemen data pegawai."
        breadcrumb={["Admin", "HR & Payroll", "Data Pegawai"]}
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

      <SectionCard title="Daftar Data Pegawai">
        <DataTable
          columns={columns}
          data={items}
          loading={loading}
          getRowId={(item) => item.id}
          emptyState={{
            title: "Data kosong",
            description: "Belum ada data data pegawai.",
          }}
        />
      </SectionCard>

      <FormModal
        onClose={() => setFormOpen(false)}
        open={formOpen}
        title="Tambah Pegawai"
      >
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block space-y-2">
              <span className="text-sm font-bold text-slate-700">Kode Pegawai</span>
              <Input name="employeeCode" placeholder="Misal: EMP001" required />
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-bold text-slate-700">Nama Lengkap</span>
              <Input name="fullName" placeholder="Nama lengkap pegawai" required />
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-bold text-slate-700">Jabatan</span>
              <select className="w-full rounded-2xl border border-input bg-white px-4 py-2 text-sm shadow-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                name="positionId" defaultValue="">
                <option value="">Pilih Jabatan</option>
                {positions.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-bold text-slate-700">Tipe Pegawai</span>
              <select className="w-full rounded-2xl border border-input bg-white px-4 py-2 text-sm shadow-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                name="employmentType" defaultValue="PERMANENT">
                <option value="PERMANENT">Tetap</option>
                <option value="CONTRACT">Kontrak</option>
                <option value="INTERN">Magang</option>
              </select>
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-bold text-slate-700">Gaji Pokok</span>
              <Input name="basicSalary" type="number" defaultValue="0" min="0" />
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-bold text-slate-700">Status</span>
              <select className="w-full rounded-2xl border border-input bg-white px-4 py-2 text-sm shadow-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                name="status" defaultValue="ACTIVE">
                <option value="ACTIVE">Aktif</option>
                <option value="INACTIVE">Nonaktif</option>
              </select>
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
