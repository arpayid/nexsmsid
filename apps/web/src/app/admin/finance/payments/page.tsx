"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { AlertCircle, CheckCircle, Loader2, Plus, Printer, RefreshCcw, Search, X, XCircle } from "lucide-react";

import type { InvoiceRecord, PaymentRecord, StudentRecord } from "@nexsmsid/api-client";
import { Badge, Button, Card, CardContent, CardHeader, CardTitle, EmptyState, Input, PageHeader } from "@nexsmsid/ui";

import { createBrowserApiClient } from "@/lib/api-client";

const PAYMENT_STATUS_MAP: Record<string, { label: string; variant: "warning" | "success" | "secondary" | "outline" }> = {
  PENDING: { label: "Menunggu", variant: "warning" },
  VERIFIED: { label: "Terverifikasi", variant: "success" },
  REJECTED: { label: "Ditolak", variant: "secondary" },
  CANCELLED: { label: "Dibatalkan", variant: "outline" }
};

export default function PaymentsPage() {
  const api = useMemo(() => createBrowserApiClient(), []);
  const [editing, setEditing] = useState<PaymentRecord | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [items, setItems] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [total, setTotal] = useState(0);
  const [invoices, setInvoices] = useState<InvoiceRecord[]>([]);
  const [printingId, setPrintingId] = useState<string | null>(null);

  async function loadReferenceData() {
    try {
      const result = await api.listInvoices({ limit: 100 });
      setInvoices(result.items);
    } catch { /* ignore reference load errors */ }
  }

  async function loadData() {
    setError(null);
    setLoading(true);
    try {
      const result = await api.listPayments({ limit: 50, page: 1, search: search || undefined });
      setItems(result.items);
      setTotal(result.meta?.total ?? result.items.length);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Gagal memuat data pembayaran");
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

  async function handleVerify(item: PaymentRecord) {
    const confirmed = window.confirm("Verifikasi pembayaran ini?");
    if (!confirmed) return;
    setError(null);
    try {
      await api.verifyPayment((item as Record<string, unknown>).id as string);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memverifikasi pembayaran");
    }
  }

  async function handleReject(item: PaymentRecord) {
    const reason = window.prompt("Alasan penolakan:");
    if (reason === null) return;
    setError(null);
    try {
      await api.rejectPayment((item as Record<string, unknown>).id as string, { reason: reason || undefined });
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menolak pembayaran");
    }
  }

  async function handleCancel(item: PaymentRecord) {
    const confirmed = window.confirm("Batalkan pembayaran ini?");
    if (!confirmed) return;
    setError(null);
    try {
      await api.cancelPayment((item as Record<string, unknown>).id as string);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal membatalkan pembayaran");
    }
  }

  function getItemStatus(item: PaymentRecord): string {
    return (item as Record<string, unknown>).status as string ?? "PENDING";
  }

  function getItemId(item: PaymentRecord): string {
    return (item as Record<string, unknown>).id as string;
  }

  async function handlePrintReceipt(item: PaymentRecord) {
    const id = getItemId(item);
    setError(null);
    setPrintingId(id);
    try {
      const blob = await api.downloadPaymentReceiptPdf(id);
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank", "noopener,noreferrer");
      setTimeout(() => URL.revokeObjectURL(url), 60_000);
    } catch (printError) {
      setError(printError instanceof Error ? printError.message : "Gagal membuat bukti pembayaran");
    } finally {
      setPrintingId(null);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    const formData = new FormData(event.currentTarget);
    const payload: Record<string, unknown> = {
      invoiceId: formData.get("invoiceId"),
      amount: Number(formData.get("amount")),
      method: formData.get("method"),
      proofUrl: (formData.get("proofUrl") as string) || undefined,
      note: (formData.get("note") as string) || undefined
    };
    try {
      await api.createPayment(payload);
      setFormOpen(false);
      setEditing(null);
      await loadData();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Gagal menyimpan pembayaran");
    } finally {
      setSubmitting(false);
    }
  }

  const statusInfo = (status: string) => PAYMENT_STATUS_MAP[status] ?? { label: status, variant: "outline" as const };

  return (
    <div className="space-y-8">
      <PageHeader
        actions={
          <>
            <Button onClick={loadData} variant="outline"><RefreshCcw className="h-4 w-4" /> Refresh</Button>
            <Button onClick={openCreate}><Plus className="h-4 w-4" /> Tambah</Button>
          </>
        }
        breadcrumb={["Admin", "Keuangan", "Pembayaran"]}
        description="Kelola pembayaran invoice dari siswa."
        eyebrow="Phase 8 Keuangan"
        title="Pembayaran"
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
              <CardTitle>Data Pembayaran</CardTitle>
              <p className="mt-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">Total: {total} data</p>
            </div>
            <form className="flex w-full flex-col gap-3 lg:w-auto lg:flex-row lg:items-center" onSubmit={handleSearch}>
              <div className="relative w-full lg:max-w-sm">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input className="pl-11" onChange={(event) => setSearch(event.target.value)} placeholder="Cari pembayaran, invoice..." value={search} />
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
                    <th className="px-4 py-3 font-black">No. Pembayaran</th>
                    <th className="px-4 py-3 font-black">Invoice</th>
                    <th className="px-4 py-3 font-black">Siswa</th>
                    <th className="px-4 py-3 font-black">Jumlah</th>
                    <th className="px-4 py-3 font-black">Metode</th>
                    <th className="px-4 py-3 font-black">Status</th>
                    <th className="px-4 py-3 font-black">Tanggal</th>
                    <th className="px-4 py-3 text-right font-black">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => {
                    const row = item as Record<string, unknown>;
                    const status = row.status as string ?? "PENDING";
                    const st = statusInfo(status);
                    return (
                      <tr className="border-b last:border-0" key={row.id as string}>
                        <td className="px-4 py-4 font-semibold text-slate-700">{row.paymentNumber as string ?? "-"}</td>
                        <td className="px-4 py-4 font-semibold text-slate-700">{(row.invoice as Record<string, unknown>)?.invoiceNumber as string ?? "-"}</td>
                        <td className="px-4 py-4 font-semibold text-slate-700">{(row.student as Record<string, unknown>)?.name as string ?? "-"}</td>
                        <td className="px-4 py-4 font-semibold text-slate-700">Rp {Number(row.amount ?? 0).toLocaleString("id-ID")}</td>
                        <td className="px-4 py-4 font-semibold text-slate-700">{row.method as string ?? "-"}</td>
                        <td className="px-4 py-4"><Badge variant={st.variant}>{st.label}</Badge></td>
                        <td className="px-4 py-4 font-semibold text-slate-700">{row.paymentDate as string ? new Date(row.paymentDate as string).toLocaleDateString("id-ID") : "-"}</td>
                        <td className="px-4 py-4">
                          <div className="flex justify-end gap-2">
                            {status === "PENDING" ? (
                              <>
                                <Button onClick={() => handleVerify(item)} size="sm" variant="soft"><CheckCircle className="h-4 w-4" /> Verifikasi</Button>
                                <Button onClick={() => handleReject(item)} size="sm" variant="outline"><XCircle className="h-4 w-4" /> Tolak</Button>
                              </>
                            ) : null}
                            {(status === "PENDING" || status === "VERIFIED") ? (
                              <Button onClick={() => handleCancel(item)} size="sm" variant="ghost"><XCircle className="h-4 w-4" /> Batalkan</Button>
                            ) : null}
                            <Button
                              disabled={printingId === getItemId(item)}
                              onClick={() => handlePrintReceipt(item)}
                              size="sm"
                              variant="soft"
                            >
                              {printingId === getItemId(item) ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Printer className="h-4 w-4" />
                              )}
                              Bukti
                            </Button>
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
              action={<Button onClick={openCreate} variant="soft">Tambah pembayaran pertama</Button>}
              description="Belum ada data pembayaran."
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
                <CardTitle>Tambah Pembayaran</CardTitle>
              </div>
              <Button onClick={() => setFormOpen(false)} size="icon" variant="ghost"><X className="h-5 w-5" /></Button>
            </div>
          </CardHeader>
          <CardContent>
            <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
              <label className="space-y-2">
                <span className="text-sm font-bold text-slate-700">Invoice</span>
                <select className="w-full rounded-2xl border border-input bg-white px-4 py-2 text-sm shadow-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                  name="invoiceId" required>
                  <option value="" disabled>Pilih Invoice</option>
                  {invoices.map((inv) => {
                    const invRow = inv as Record<string, unknown>;
                    return (
                      <option key={invRow.id as string} value={invRow.id as string}>
                        {invRow.invoiceNumber as string ?? "-"} - {(invRow.student as Record<string, unknown>)?.name as string ?? ""}
                      </option>
                    );
                  })}
                </select>
              </label>
              <label className="space-y-2">
                <span className="text-sm font-bold text-slate-700">Jumlah</span>
                <Input name="amount" type="number" min="0" required />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-bold text-slate-700">Metode Pembayaran</span>
                <select className="w-full rounded-2xl border border-input bg-white px-4 py-2 text-sm shadow-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                  name="method" required>
                  <option value="" disabled>Pilih Metode</option>
                  <option value="CASH">Tunai</option>
                  <option value="TRANSFER">Transfer Bank</option>
                  <option value="VA">Virtual Account</option>
                  <option value="QRIS">QRIS</option>
                  <option value="OTHER">Lainnya</option>
                </select>
              </label>
              <label className="space-y-2">
                <span className="text-sm font-bold text-slate-700">URL Bukti Pembayaran</span>
                <Input name="proofUrl" placeholder="https://..." type="url" />
              </label>
              <div className="md:col-span-2">
                <label className="space-y-2">
                  <span className="text-sm font-bold text-slate-700">Catatan</span>
                  <textarea className="w-full rounded-2xl border border-input bg-white px-4 py-2 text-sm shadow-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                    name="note" rows={2} />
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
