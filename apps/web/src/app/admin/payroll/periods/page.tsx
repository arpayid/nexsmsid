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
      const response = await client.listPayrollPeriods({ limit: 50, page: 1 });
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
      month: Number(formData.get("month")),
      year: Number(formData.get("year")),
      startDate: formData.get("startDate") as string,
      endDate: formData.get("endDate") as string,
      paymentDate: (formData.get("paymentDate") as string) || undefined
    };

    try {
      await client.createPayrollPeriod(payload);
      setFormOpen(false);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan periode penggajian");
    } finally {
      setSubmitting(false);
    }
  }

  const columns = [
    { key: "code", header: "Kode", cell: (item: any) => String(item.code ?? "-") },
    { key: "name", header: "Nama Periode", cell: (item: any) => String(item.name ?? "-") },
    { key: "month", header: "Bulan", cell: (item: any) => String(item.month ?? "-") },
    { key: "year", header: "Tahun", cell: (item: any) => String(item.year ?? "-") },
    { key: "paymentDate", header: "Tanggal Bayar", cell: (item: any) => formatDate(item.paymentDate) },
    { key: "status", header: "Status", cell: (item: any) => String(item.status ?? "-") }
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Periode Penggajian"
        description="Manajemen periode penggajian."
        breadcrumb={["Admin", "HR & Payroll", "Periode Penggajian"]}
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

      <SectionCard title="Daftar Periode Penggajian">
        <DataTable
          columns={columns}
          data={items}
          loading={loading}
          getRowId={(item) => item.id}
          emptyState={{
            title: "Data kosong",
            description: "Belum ada data periode penggajian.",
          }}
        />
      </SectionCard>

      <FormModal
        onClose={() => setFormOpen(false)}
        open={formOpen}
        title="Tambah Periode Penggajian"
      >
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block space-y-2">
              <span className="text-sm font-bold text-slate-700">Kode</span>
              <Input name="code" placeholder="Misal: JUN2026" required />
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-bold text-slate-700">Nama Periode</span>
              <Input name="name" placeholder="Misal: Juni 2026" required />
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-bold text-slate-700">Bulan (1-12)</span>
              <Input max={12} min={1} name="month" required type="number" defaultValue={new Date().getMonth() + 1} />
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-bold text-slate-700">Tahun</span>
              <Input name="year" required type="number" defaultValue={new Date().getFullYear()} />
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-bold text-slate-700">Tanggal Mulai</span>
              <Input name="startDate" required type="date" />
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-bold text-slate-700">Tanggal Selesai</span>
              <Input name="endDate" required type="date" />
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-bold text-slate-700">Tanggal Bayar (Opsional)</span>
              <Input name="paymentDate" type="date" />
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
