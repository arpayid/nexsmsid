"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { AlertCircle, CheckCircle, Edit3, Loader2, Plus, RefreshCcw, Search, Trash2, X } from "lucide-react";

import type { ExpenseRecord } from "@nexsmsid/api-client";
import { Badge, Button, Card, CardContent, CardHeader, CardTitle, EmptyState, Input, PageHeader } from "@nexsmsid/ui";

import { createBrowserApiClient } from "@/lib/api-client";

const EXPENSE_STATUS_MAP: Record<string, { label: string; variant: "outline" | "info" | "success" | "secondary" }> = {
  DRAFT: { label: "Draf", variant: "outline" },
  APPROVED: { label: "Disetujui", variant: "info" },
  PAID: { label: "Dibayar", variant: "success" },
  CANCELLED: { label: "Dibatalkan", variant: "secondary" }
};

export default function ExpensesPage() {
  const api = useMemo(() => createBrowserApiClient(), []);
  const [editing, setEditing] = useState<ExpenseRecord | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [items, setItems] = useState<ExpenseRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [total, setTotal] = useState(0);

  async function loadData() {
    setError(null);
    setLoading(true);
    try {
      const result = await api.listExpenses({ limit: 50, page: 1, search: search || undefined });
      setItems(result.items);
      setTotal(result.meta?.total ?? result.items.length);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Gagal memuat data pengeluaran");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await loadData();
  }

  function openCreate() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(item: ExpenseRecord) {
    setEditing(item);
    setFormOpen(true);
  }

  async function handleApprove(item: ExpenseRecord) {
    const confirmed = window.confirm("Setujui pengeluaran ini?");
    if (!confirmed) return;
    setError(null);
    try {
      await api.approveExpense((item as Record<string, unknown>).id as string);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyetujui pengeluaran");
    }
  }

  async function handleMarkPaid(item: ExpenseRecord) {
    const confirmed = window.confirm("Tandai pengeluaran ini sebagai dibayar?");
    if (!confirmed) return;
    setError(null);
    try {
      await api.markExpensePaid((item as Record<string, unknown>).id as string);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menandai pengeluaran sebagai dibayar");
    }
  }

  async function handleDelete(item: ExpenseRecord) {
    const confirmed = window.confirm("Hapus pengeluaran ini? Tindakan ini tidak dapat dibatalkan.");
    if (!confirmed) return;
    setError(null);
    try {
      await api.deleteExpense((item as Record<string, unknown>).id as string);
      await loadData();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Gagal menghapus pengeluaran");
    }
  }

  function getItemStatus(item: ExpenseRecord): string {
    return (item as Record<string, unknown>).status as string ?? "DRAFT";
  }

  function getItemId(item: ExpenseRecord): string {
    return (item as Record<string, unknown>).id as string;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    const formData = new FormData(event.currentTarget);
    const payload: Record<string, unknown> = {
      title: formData.get("title"),
      category: formData.get("category"),
      amount: Number(formData.get("amount")),
      description: (formData.get("description") as string) || undefined,
      expenseDate: (formData.get("expenseDate") as string) || undefined
    };
    try {
      if (editing) {
        await api.updateExpense(getItemId(editing), payload);
      } else {
        await api.createExpense(payload);
      }
      setFormOpen(false);
      setEditing(null);
      await loadData();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Gagal menyimpan pengeluaran");
    } finally {
      setSubmitting(false);
    }
  }

  const statusInfo = (status: string) => EXPENSE_STATUS_MAP[status] ?? { label: status, variant: "outline" as const };

  return (
    <div className="space-y-8">
      <PageHeader
        actions={
          <>
            <Button onClick={loadData} variant="outline"><RefreshCcw className="h-4 w-4" /> Refresh</Button>
            <Button onClick={openCreate}><Plus className="h-4 w-4" /> Tambah</Button>
          </>
        }
        breadcrumb={["Admin", "Keuangan", "Pengeluaran"]}
        description="Kelola pencatatan pengeluaran sekolah."
        eyebrow="Phase 8 Keuangan"
        title="Pengeluaran"
      />

      {error ? (
        <div className="flex items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
          <AlertCircle className="h-5 w-5" /> {error}
        </div>
      ) : null}

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <CardTitle>Data Pengeluaran</CardTitle>
              <p className="mt-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">Total: {total} data</p>
            </div>
            <form className="flex w-full flex-col gap-3 lg:w-auto lg:flex-row lg:items-center" onSubmit={handleSearch}>
              <div className="relative w-full lg:max-w-sm">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input className="pl-11" onChange={(event) => setSearch(event.target.value)} placeholder="Cari pengeluaran..." value={search} />
              </div>
              <Button type="submit" variant="soft">Cari</Button>
            </form>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="grid min-h-48 place-items-center rounded-3xl border border-dashed bg-slate-50 text-sm font-bold text-slate-600">
              <span className="inline-flex items-center gap-2"><Loader2 className="h-5 w-5 animate-spin text-primary" /> Memuat data...</span>
            </div>
          ) : items.length ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] text-left text-sm">
                <thead>
                  <tr className="border-b text-xs uppercase tracking-[0.14em] text-muted-foreground">
                    <th className="px-4 py-3 font-black">No. Pengeluaran</th>
                    <th className="px-4 py-3 font-black">Judul</th>
                    <th className="px-4 py-3 font-black">Kategori</th>
                    <th className="px-4 py-3 font-black">Jumlah</th>
                    <th className="px-4 py-3 font-black">Tanggal</th>
                    <th className="px-4 py-3 font-black">Status</th>
                    <th className="px-4 py-3 text-right font-black">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => {
                    const row = item as Record<string, unknown>;
                    const status = row.status as string ?? "DRAFT";
                    const st = statusInfo(status);
                    return (
                      <tr className="border-b last:border-0" key={row.id as string}>
                        <td className="px-4 py-4 font-semibold text-slate-700">{row.expenseNumber as string ?? "-"}</td>
                        <td className="px-4 py-4 font-semibold text-slate-700">{row.title as string ?? "-"}</td>
                        <td className="px-4 py-4 font-semibold text-slate-700">{row.category as string ?? "-"}</td>
                        <td className="px-4 py-4 font-semibold text-slate-700">Rp {Number(row.amount ?? 0).toLocaleString("id-ID")}</td>
                        <td className="px-4 py-4 font-semibold text-slate-700">{row.expenseDate as string ? new Date(row.expenseDate as string).toLocaleDateString("id-ID") : "-"}</td>
                        <td className="px-4 py-4"><Badge variant={st.variant}>{st.label}</Badge></td>
                        <td className="px-4 py-4">
                          <div className="flex justify-end gap-2">
                            {status === "DRAFT" ? (
                              <>
                                <Button onClick={() => handleApprove(item)} size="sm" variant="soft"><CheckCircle className="h-4 w-4" /> Setujui</Button>
                                <Button onClick={() => openEdit(item)} size="sm" variant="outline"><Edit3 className="h-4 w-4" /> Edit</Button>
                                <Button onClick={() => handleDelete(item)} size="sm" variant="ghost"><Trash2 className="h-4 w-4" /> Hapus</Button>
                              </>
                            ) : null}
                            {status === "APPROVED" ? (
                              <Button onClick={() => handleMarkPaid(item)} size="sm" variant="soft"><CheckCircle className="h-4 w-4" /> Tandai Dibayar</Button>
                            ) : null}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState
              action={<Button onClick={openCreate} variant="soft">Tambah pengeluaran pertama</Button>}
              description="Belum ada data pengeluaran."
              title="Data masih kosong"
            />
          )}
        </CardContent>
      </Card>

      {formOpen ? (
        <Card className="border-primary/20">
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardTitle>{editing ? "Edit" : "Tambah"} Pengeluaran</CardTitle>
              </div>
              <Button onClick={() => setFormOpen(false)} size="icon" variant="ghost"><X className="h-5 w-5" /></Button>
            </div>
          </CardHeader>
          <CardContent>
            <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
              <label className="space-y-2">
                <span className="text-sm font-bold text-slate-700">Judul</span>
                <Input defaultValue={(editing as Record<string, unknown>)?.title as string ?? ""} name="title" required />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-bold text-slate-700">Kategori</span>
                <select className="w-full rounded-2xl border border-input bg-white px-4 py-2 text-sm shadow-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                  defaultValue={(editing as Record<string, unknown>)?.category as string ?? ""} name="category" required>
                  <option value="" disabled>Pilih Kategori</option>
                  <option value="UTILITIES">Utilitas</option>
                  <option value="MAINTENANCE">Perawatan</option>
                  <option value="SUPPLIES">Perlengkapan</option>
                  <option value="SALARY">Gaji</option>
                  <option value="TRANSPORT">Transportasi</option>
                  <option value="EVENT">Kegiatan</option>
                  <option value="OTHER">Lainnya</option>
                </select>
              </label>
              <label className="space-y-2">
                <span className="text-sm font-bold text-slate-700">Jumlah</span>
                <Input defaultValue={(editing as Record<string, unknown>)?.amount as string ?? ""} name="amount" type="number" min="0" required />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-bold text-slate-700">Tanggal</span>
                <Input defaultValue={(editing as Record<string, unknown>)?.expenseDate as string ?? ""} name="expenseDate" type="date" />
              </label>
              <div className="md:col-span-2">
                <label className="space-y-2">
                  <span className="text-sm font-bold text-slate-700">Deskripsi</span>
                  <textarea className="w-full rounded-2xl border border-input bg-white px-4 py-2 text-sm shadow-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                    defaultValue={(editing as Record<string, unknown>)?.description as string ?? ""} name="description" rows={3} />
                </label>
              </div>
              <div className="flex gap-3 md:col-span-2">
                <Button disabled={submitting} type="submit">
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null} Simpan
                </Button>
                <Button onClick={() => setFormOpen(false)} type="button" variant="outline">Batal</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
