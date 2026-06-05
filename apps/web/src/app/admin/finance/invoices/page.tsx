"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { AlertCircle, Edit3, FileText, Loader2, Plus, Printer, RefreshCcw, Search, Trash2, X } from "lucide-react";

import type { InvoiceRecord, MasterDataRecord, StudentRecord } from "@nexsmsid/api-client";
import { Badge, Button, Card, CardContent, CardHeader, CardTitle, EmptyState, Input, PageHeader } from "@nexsmsid/ui";

import { createBrowserApiClient } from "@/lib/api-client";

const INVOICE_STATUS_MAP: Record<string, { label: string; variant: "outline" | "info" | "warning" | "success" | "secondary" }> = {
  DRAFT: { label: "Draf", variant: "outline" },
  ISSUED: { label: "Diterbitkan", variant: "info" },
  PARTIAL: { label: "Sebagian Dibayar", variant: "warning" },
  PAID: { label: "Lunas", variant: "success" },
  OVERDUE: { label: "Jatuh Tempo", variant: "warning" },
  CANCELLED: { label: "Dibatalkan", variant: "secondary" }
};

export default function InvoicesPage() {
  const api = useMemo(() => createBrowserApiClient(), []);
  const [editing, setEditing] = useState<InvoiceRecord | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [items, setItems] = useState<InvoiceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [total, setTotal] = useState(0);
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [printingId, setPrintingId] = useState<string | null>(null);

  async function loadReferenceData() {
    try {
      const studentsRes = await api.listStudents({ limit: 500 });
      setStudents(studentsRes.items);
    } catch { /* ignore reference load errors */ }
  }

  async function loadData() {
    setError(null);
    setLoading(true);
    try {
      const response = await api.listInvoices({ limit: 50, page: 1, search: search || undefined });
      const resp = response as unknown as { data: InvoiceRecord[]; meta?: { total?: number } };
      setItems(resp.data);
      setTotal(resp.meta?.total ?? resp.data.length);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Gagal memuat data invoice");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadReferenceData();
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

  function openEdit(item: InvoiceRecord) {
    setEditing(item);
    setFormOpen(true);
  }

  async function handleIssue(item: InvoiceRecord) {
    const confirmed = window.confirm("Terbitkan invoice ini?");
    if (!confirmed) return;
    setError(null);
    try {
      await api.issueInvoice((item as Record<string, unknown>).id as string);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menerbitkan invoice");
    }
  }

  async function handleCancel(item: InvoiceRecord) {
    const confirmed = window.confirm("Batalkan invoice ini?");
    if (!confirmed) return;
    setError(null);
    try {
      await api.cancelInvoice((item as Record<string, unknown>).id as string);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal membatalkan invoice");
    }
  }

  async function handleDelete(item: InvoiceRecord) {
    const confirmed = window.confirm("Hapus invoice ini? Tindakan ini tidak dapat dibatalkan.");
    if (!confirmed) return;
    setError(null);
    try {
      await api.deleteInvoice((item as Record<string, unknown>).id as string);
      await loadData();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Gagal menghapus invoice");
    }
  }

  async function handlePrintInvoice(item: InvoiceRecord) {
    const id = (item as Record<string, unknown>).id as string;
    setError(null);
    setPrintingId(id);
    try {
      const blob = await api.downloadInvoicePdf(id);
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank", "noopener,noreferrer");
      setTimeout(() => URL.revokeObjectURL(url), 60_000);
    } catch (printError) {
      setError(printError instanceof Error ? printError.message : "Gagal membuat PDF invoice");
    } finally {
      setPrintingId(null);
    }
  }

  function getItemStatus(item: InvoiceRecord): string {
    return (item as Record<string, unknown>).status as string ?? "DRAFT";
  }

  function getItemId(item: InvoiceRecord): string {
    return (item as Record<string, unknown>).id as string;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    const formData = new FormData(event.currentTarget);

    const itemsInput = formData.get("items");
    const parsedItems = itemsInput ? JSON.parse(itemsInput as string) : [];

    const payload: Record<string, unknown> = {
      studentId: formData.get("studentId"),
      items: parsedItems,
      discount: formData.get("discount") ? Number(formData.get("discount")) : 0,
      penalty: formData.get("penalty") ? Number(formData.get("penalty")) : 0,
      note: formData.get("note") || undefined
    };

    try {
      if (editing) {
        await api.updateInvoice(getItemId(editing), payload);
      } else {
        await api.createInvoice(payload);
      }
      setFormOpen(false);
      setEditing(null);
      await loadData();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Gagal menyimpan invoice");
    } finally {
      setSubmitting(false);
    }
  }

  const statusInfo = (status: string) => INVOICE_STATUS_MAP[status] ?? { label: status, variant: "outline" as const };

  return (
    <div className="space-y-8">
      <PageHeader
        actions={
          <>
            <Button onClick={loadData} variant="outline"><RefreshCcw className="h-4 w-4" /> Refresh</Button>
            <Button onClick={openCreate}><Plus className="h-4 w-4" /> Tambah</Button>
          </>
        }
        breadcrumb={["Admin", "Keuangan", "Invoice"]}
        description="Kelola penerbitan invoice dan tagihan siswa."
        eyebrow="Phase 8 Keuangan"
        title="Invoice"
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
              <CardTitle>Data Invoice</CardTitle>
              <p className="mt-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">Total: {total} data</p>
            </div>
            <form className="flex w-full flex-col gap-3 lg:w-auto lg:flex-row lg:items-center" onSubmit={handleSearch}>
              <div className="relative w-full lg:max-w-sm">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input className="pl-11" onChange={(event) => setSearch(event.target.value)} placeholder="Cari invoice, siswa..." value={search} />
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
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead>
                  <tr className="border-b text-xs uppercase tracking-[0.14em] text-muted-foreground">
                    <th className="px-4 py-3 font-black">No. Invoice</th>
                    <th className="px-4 py-3 font-black">Siswa</th>
                    <th className="px-4 py-3 font-black">Subtotal</th>
                    <th className="px-4 py-3 font-black">Diskon</th>
                    <th className="px-4 py-3 font-black">Denda</th>
                    <th className="px-4 py-3 font-black">Total</th>
                    <th className="px-4 py-3 font-black">Dibayar</th>
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
                        <td className="px-4 py-4 font-semibold text-slate-700">{row.invoiceNumber as string ?? "-"}</td>
                        <td className="px-4 py-4 font-semibold text-slate-700">{(row.student as Record<string, unknown>)?.name as string ?? "-"}</td>
                        <td className="px-4 py-4 font-semibold text-slate-700">Rp {Number(row.subtotal ?? 0).toLocaleString("id-ID")}</td>
                        <td className="px-4 py-4 font-semibold text-slate-700">Rp {Number(row.discount ?? 0).toLocaleString("id-ID")}</td>
                        <td className="px-4 py-4 font-semibold text-slate-700">Rp {Number(row.penalty ?? 0).toLocaleString("id-ID")}</td>
                        <td className="px-4 py-4 font-semibold text-slate-700">Rp {Number(row.total ?? 0).toLocaleString("id-ID")}</td>
                        <td className="px-4 py-4 font-semibold text-slate-700">Rp {Number(row.paidAmount ?? 0).toLocaleString("id-ID")}</td>
                        <td className="px-4 py-4"><Badge variant={st.variant}>{st.label}</Badge></td>
                        <td className="px-4 py-4">
                          <div className="flex justify-end gap-2">
                            {status === "DRAFT" ? (
                              <>
                                <Button onClick={() => handleIssue(item)} size="sm" variant="soft"><FileText className="h-4 w-4" /> Terbitkan</Button>
                                <Button onClick={() => openEdit(item)} size="sm" variant="outline"><Edit3 className="h-4 w-4" /> Edit</Button>
                                <Button onClick={() => handleDelete(item)} size="sm" variant="ghost"><Trash2 className="h-4 w-4" /> Hapus</Button>
                              </>
                            ) : null}
                            <Button
                              disabled={printingId === ((row as Record<string, unknown>).id as string)}
                              onClick={() => handlePrintInvoice(item)}
                              size="sm"
                              variant="soft"
                            >
                              {printingId === ((row as Record<string, unknown>).id as string) ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Printer className="h-4 w-4" />
                              )}
                              Cetak PDF
                            </Button>
                            {(status === "ISSUED" || status === "PARTIAL") ? (
                              <Button onClick={() => handleCancel(item)} size="sm" variant="ghost"><X className="h-4 w-4" /> Batalkan</Button>
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
              action={<Button onClick={openCreate} variant="soft">Tambah invoice pertama</Button>}
              description="Belum ada data invoice."
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
                <CardTitle>{editing ? "Edit" : "Tambah"} Invoice</CardTitle>
              </div>
              <Button onClick={() => setFormOpen(false)} size="icon" variant="ghost"><X className="h-5 w-5" /></Button>
            </div>
          </CardHeader>
          <CardContent>
            <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
              <label className="space-y-2">
                <span className="text-sm font-bold text-slate-700">Siswa</span>
                <select className="w-full rounded-2xl border border-input bg-white px-4 py-2 text-sm shadow-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                  defaultValue={(editing as Record<string, unknown>)?.studentId as string ?? ""} name="studentId" required>
                  <option value="" disabled>Pilih Siswa</option>
                  {students.map((s) => <option key={s.id} value={s.id}>{s.name} ({s.nis})</option>)}
                </select>
              </label>
              <label className="space-y-2">
                <span className="text-sm font-bold text-slate-700">Items (JSON)</span>
                <textarea className="w-full rounded-2xl border border-input bg-white px-4 py-2 text-sm shadow-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                  defaultValue={editing ? JSON.stringify((editing as Record<string, unknown>).items ?? []) : "[{\"name\":\"\",\"quantity\":1,\"unitPrice\":0}]"}
                  name="items" rows={3} required />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-bold text-slate-700">Diskon</span>
                <Input defaultValue={(editing as Record<string, unknown>)?.discount as string ?? "0"} name="discount" type="number" min="0" />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-bold text-slate-700">Denda</span>
                <Input defaultValue={(editing as Record<string, unknown>)?.penalty as string ?? "0"} name="penalty" type="number" min="0" />
              </label>
              <div className="md:col-span-2">
                <label className="space-y-2">
                  <span className="text-sm font-bold text-slate-700">Catatan</span>
                  <textarea className="w-full rounded-2xl border border-input bg-white px-4 py-2 text-sm shadow-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                    defaultValue={(editing as Record<string, unknown>)?.note as string ?? ""} name="note" rows={2} />
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
