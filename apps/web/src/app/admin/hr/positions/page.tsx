"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { Loader2, Plus, RefreshCcw } from "lucide-react";

import { Button, DataTable, ErrorState, FormModal, Input, PageHeader, SectionCard } from "@nexsmsid/ui";
import { createBrowserApiClient } from "@/lib/api-client";

export default function HRPositionsPage() {
  const api = useMemo(() => createBrowserApiClient(), []);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function loadData() {
    setLoading(true);
    setError(null);
    try {
      const response = await api.listHRPositions({ limit: 50, page: 1 });
      setItems((response as any).data || []);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Gagal memuat jabatan HR");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadData();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    const formData = new FormData(event.currentTarget);
    const payload = {
      code: formData.get("code") as string,
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      isActive: formData.get("isActive") === "on"
    };

    try {
      await api.createHRPosition(payload);
      setFormOpen(false);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan jabatan");
    } finally {
      setSubmitting(false);
    }
  }

  const columns = [
    { key: "code", header: "Kode", cell: (item: any) => String(item.code ?? "-") },
    { key: "name", header: "Nama Jabatan", cell: (item: any) => String(item.name ?? "-") },
    { key: "description", header: "Deskripsi", cell: (item: any) => String(item.description ?? "-") },
    { key: "isActive", header: "Status", cell: (item: any) => (item.isActive ? "Aktif" : "Nonaktif") }
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Jabatan HR"
        description="Kelola posisi dan jabatan pegawai."
        breadcrumb={["Admin", "HR & Payroll", "Jabatan"]}
        actions={
          <>
            <Button onClick={loadData} variant="outline"><RefreshCcw className="h-4 w-4" /> Refresh</Button>
            <Button onClick={() => setFormOpen(true)}><Plus className="h-4 w-4" /> Tambah Jabatan</Button>
          </>
        }
      />

      {error ? <ErrorState message={error} title="Terjadi Kesalahan" /> : null}

      <SectionCard title="Daftar Jabatan HR">
        <DataTable
          columns={columns}
          data={items}
          loading={loading}
          getRowId={(item) => item.id}
          emptyState={{ title: "Data kosong", description: "Belum ada jabatan HR." }}
        />
      </SectionCard>

      <FormModal
        onClose={() => setFormOpen(false)}
        open={formOpen}
        title="Tambah Jabatan"
      >
        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="block space-y-2">
            <span className="text-sm font-bold text-slate-700">Kode Jabatan</span>
            <Input name="code" placeholder="Misal: TCHR, STF" required />
          </label>
          <label className="block space-y-2">
            <span className="text-sm font-bold text-slate-700">Nama Jabatan</span>
            <Input name="name" placeholder="Misal: Guru Mapel, Staf TU" required />
          </label>
          <label className="block space-y-2">
            <span className="text-sm font-bold text-slate-700">Deskripsi</span>
            <Input name="description" placeholder="Penjelasan singkat..." />
          </label>
          <label className="flex items-center gap-3 rounded-2xl border bg-white px-4 py-3 text-sm font-bold text-slate-700">
            <input defaultChecked name="isActive" type="checkbox" /> Aktif
          </label>
          <div className="flex gap-3">
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
