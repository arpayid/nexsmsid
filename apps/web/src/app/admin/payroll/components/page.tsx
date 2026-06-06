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
  const client = useMemo(() => createBrowserApiClient(), []);

  async function loadData() {
    setLoading(true);
    setError(null);
    try {
      const response = await client.listPayrollComponents({ limit: 50, page: 1 });
      setItems((response as any).data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat data");
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
      type: formData.get("type") as string,
      calculationType: formData.get("calculationType") as string,
      defaultAmount: Number(formData.get("defaultAmount") || 0),
      isTaxable: formData.get("isTaxable") === "on",
      isActive: formData.get("isActive") === "on"
    };

    try {
      await client.createPayrollComponent(payload);
      setFormOpen(false);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan komponen gaji");
    } finally {
      setSubmitting(false);
    }
  }

  const columns = [
    { key: "code", header: "Kode", cell: (item: any) => String(item.code ?? "-") },
    { key: "name", header: "Nama Komponen", cell: (item: any) => String(item.name ?? "-") },
    { key: "type", header: "Tipe", cell: (item: any) => String(item.type ?? "-") },
    { key: "calculationType", header: "Hitung", cell: (item: any) => String(item.calculationType ?? "-") },
    { key: "defaultAmount", header: "Nominal", cell: (item: any) => formatCurrency(item.defaultAmount) }
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Komponen Gaji"
        description="Manajemen komponen gaji."
        breadcrumb={["Admin", "HR & Payroll", "Komponen Gaji"]}
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

      <SectionCard title="Daftar Komponen Gaji">
        <DataTable
          columns={columns}
          data={items}
          loading={loading}
          getRowId={(item) => item.id}
          emptyState={{
            title: "Data kosong",
            description: "Belum ada data komponen gaji.",
          }}
        />
      </SectionCard>

      <FormModal
        onClose={() => setFormOpen(false)}
        open={formOpen}
        title="Tambah Komponen Gaji"
      >
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block space-y-2">
              <span className="text-sm font-bold text-slate-700">Kode</span>
              <Input name="code" placeholder="Misal: GAPOK, TUNJ_JAB" required />
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-bold text-slate-700">Nama Komponen</span>
              <Input name="name" placeholder="Misal: Gaji Pokok" required />
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-bold text-slate-700">Tipe</span>
              <select className="w-full rounded-2xl border border-input bg-white px-4 py-2 text-sm shadow-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                name="type" defaultValue="EARNING">
                <option value="EARNING">Penerimaan (Earning)</option>
                <option value="DEDUCTION">Potongan (Deduction)</option>
              </select>
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-bold text-slate-700">Jenis Perhitungan</span>
              <select className="w-full rounded-2xl border border-input bg-white px-4 py-2 text-sm shadow-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                name="calculationType" defaultValue="FIXED">
                <option value="FIXED">Tetap (Fixed)</option>
                <option value="PERCENTAGE">Persentase</option>
                <option value="FORMULA">Rumus (Formula)</option>
              </select>
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-bold text-slate-700">Nominal Default</span>
              <Input name="defaultAmount" type="number" defaultValue="0" min="0" />
            </label>
            <div className="flex flex-col gap-2 pt-6">
              <label className="flex items-center gap-3 text-sm font-bold text-slate-700">
                <input name="isTaxable" type="checkbox" /> Kena Pajak
              </label>
              <label className="flex items-center gap-3 text-sm font-bold text-slate-700">
                <input defaultChecked name="isActive" type="checkbox" /> Aktif
              </label>
            </div>
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

function formatCurrency(value: unknown) {
  return `Rp ${Number(value ?? 0).toLocaleString("id-ID")}`;
}
