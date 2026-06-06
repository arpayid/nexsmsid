"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Download,
  Eye,
  Loader2,
  Plus,
  Printer,
  RefreshCcw,
  Search,
  ThumbsUp,
  UserCheck,
  UserMinus,
  UserPlus,
  XCircle
} from "lucide-react";

import type { PpdbRegistrationRecord } from "@nexsmsid/api-client";
import { Badge, Button, Card, CardContent, CardHeader, CardTitle, EmptyState, Input, PageHeader } from "@nexsmsid/ui";

import { createBrowserApiClient } from "@/lib/api-client";

const STATUS_BADGE: Record<string, "outline" | "info" | "secondary" | "warning" | "success"> = {
  DRAFT: "outline",
  SUBMITTED: "info",
  VERIFIED: "secondary",
  REVISION: "warning",
  ACCEPTED: "success",
  REJECTED: "warning",
  CONVERTED: "secondary"
};

const STATUS_LABEL: Record<string, string> = {
  DRAFT: "Draft",
  SUBMITTED: "Terkirim",
  VERIFIED: "Terverifikasi",
  REVISION: "Revisi",
  ACCEPTED: "Diterima",
  REJECTED: "Ditolak",
  CONVERTED: "Dikonversi"
};

const SELECTION_BADGE: Record<string, "outline" | "success" | "warning"> = {
  PENDING: "outline",
  PASSED: "success",
  FAILED: "warning"
};

const SELECTION_LABEL: Record<string, string> = {
  PENDING: "Menunggu",
  PASSED: "Lulus",
  FAILED: "Tidak Lulus"
};

function formatDate(dateStr: string | null | undefined) {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
}

function FormatDate({ date }: { date: string | null | undefined }) {
  return <>{formatDate(date)}</>;
}

export default function PpdbRegistrationsPage() {
  const api = useMemo(() => createBrowserApiClient(), []);
  const [detail, setDetail] = useState<PpdbRegistrationRecord | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<PpdbRegistrationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [printingId, setPrintingId] = useState<string | null>(null);

  async function loadData() {
    setError(null);
    setLoading(true);
    try {
      const response = await api.listPpdbRegistrations({ limit: 50, page: 1, search: search || undefined });
      const result = response as { items: PpdbRegistrationRecord[]; meta?: { total?: number } };
      setItems(result.items);
      setTotal(result.meta?.total ?? result.items.length);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Gagal memuat data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await loadData();
  }

  async function loadDetail(id: string) {
    setDetailLoading(true);
    try {
      const response = await api.getPpdbRegistration(id);
      setDetail(response as unknown as PpdbRegistrationRecord);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat detail");
    } finally {
      setDetailLoading(false);
    }
  }

  async function toggleExpand(id: string) {
    if (expandedId === id) {
      setExpandedId(null);
      setDetail(null);
      return;
    }
    setExpandedId(id);
    await loadDetail(id);
  }

  async function handlePrintProof(id: string) {
    setError(null);
    setPrintingId(id);
    try {
      const blob = await api.downloadPpdbProofPdf(id);
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank", "noopener,noreferrer");
      setTimeout(() => URL.revokeObjectURL(url), 60_000);
    } catch (printError) {
      setError(printError instanceof Error ? printError.message : "Gagal membuat bukti pendaftaran");
    } finally {
      setPrintingId(null);
    }
  }

  async function handleVerify(id: string) {
    try {
      await api.verifyPpdbRegistration(id);
      await loadData();
      if (expandedId === id) await loadDetail(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal verifikasi");
    }
  }

  async function handleAccept(id: string) {
    try {
      await api.acceptPpdbRegistration(id);
      await loadData();
      if (expandedId === id) await loadDetail(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menerima");
    }
  }

  async function handleReject(id: string) {
    const reason = window.prompt("Alasan penolakan:");
    if (!reason) return;
    try {
      await api.rejectPpdbRegistration(id, { reason });
      await loadData();
      if (expandedId === id) await loadDetail(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menolak");
    }
  }

  async function handleConvert(id: string) {
    const confirmed = window.confirm("Konversi pendaftar ini menjadi siswa?");
    if (!confirmed) return;
    try {
      await api.convertPpdbRegistration(id);
      await loadData();
      if (expandedId === id) await loadDetail(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal konversi");
    }
  }

  const detailData = detail as Record<string, unknown> | null;
  const documents = (detailData?.documents as Array<Record<string, unknown>>) ?? [];
  const statusHistory = (detailData?.statusHistory as Array<Record<string, unknown>>) ?? [];
  const status = (detailData?.status as string) ?? "";

  return (
    <div className="space-y-8">
      <PageHeader
        actions={
          <>
            <Button onClick={loadData} variant="outline"><RefreshCcw className="h-4 w-4" /> Refresh</Button>
            <Button onClick={() => window.alert("Pendaftaran PPDB dilakukan oleh calon siswa melalui portal publik.")}><Plus className="h-4 w-4" /> Tambah</Button>
          </>
        }
        breadcrumb={["Admin", "PPDB", "Pendaftaran"]}
        description="Kelola pendaftaran PPDB."
        eyebrow="Phase 8 PPDB"
        title="Pendaftaran PPDB"
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
              <CardTitle>Data Pendaftaran</CardTitle>
              <p className="mt-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">Total: {total} data</p>
            </div>
            <form className="flex w-full flex-col gap-3 lg:w-auto lg:flex-row lg:items-center" onSubmit={handleSearch}>
              <div className="relative w-full lg:max-w-sm">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input className="pl-11" onChange={(event) => setSearch(event.target.value)} placeholder="Cari nama, no. registrasi..." value={search} />
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
                    <th className="px-4 py-3 font-black">No. Registrasi</th>
                    <th className="px-4 py-3 font-black">Nama</th>
                    <th className="px-4 py-3 font-black">Jenis Kelamin</th>
                    <th className="px-4 py-3 font-black">Telepon</th>
                    <th className="px-4 py-3 font-black">Status</th>
                    <th className="px-4 py-3 font-black">Seleksi</th>
                    <th className="px-4 py-3 font-black">Tgl Daftar</th>
                    <th className="px-4 py-3 text-right font-black">Detail</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => {
                    const reg = item as Record<string, unknown>;
                    return (
                      <tr className="border-b last:border-0 hover:bg-slate-50" key={item.id as string}>
                        <td className="px-4 py-4 font-mono text-xs font-bold text-slate-700">{reg.registrationNumber as string ?? "-"}</td>
                        <td className="px-4 py-4 font-semibold text-slate-700">{reg.name as string ?? "-"}</td>
                        <td className="px-4 py-4 text-slate-600">{reg.gender === "MALE" ? "Laki-laki" : reg.gender === "FEMALE" ? "Perempuan" : "-"}</td>
                        <td className="px-4 py-4 text-slate-600">{reg.phone as string ?? "-"}</td>
                        <td className="px-4 py-4">
                          <Badge variant={STATUS_BADGE[reg.status as string] ?? "outline"}>{STATUS_LABEL[reg.status as string] ?? (reg.status as string)}</Badge>
                        </td>
                        <td className="px-4 py-4">
                          <Badge variant={SELECTION_BADGE[reg.selectionStatus as string] ?? "outline"}>{SELECTION_LABEL[reg.selectionStatus as string] ?? (reg.selectionStatus as string)}</Badge>
                        </td>
                        <td className="px-4 py-4 text-slate-600"><FormatDate date={reg.createdAt as string} /></td>
                        <td className="px-4 py-4">
                          <div className="flex justify-end gap-2">
                            <Button
                              disabled={printingId === (item.id as string)}
                              onClick={() => handlePrintProof(item.id as string)}
                              size="sm"
                              variant="soft"
                            >
                              {printingId === (item.id as string) ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Printer className="h-4 w-4" />
                              )}
                              Bukti
                            </Button>
                            <Button onClick={() => toggleExpand(item.id as string)} size="sm" variant="ghost">
                              {expandedId === (item.id as string) ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
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
              description="Belum ada pendaftaran PPDB."
              title="Data masih kosong"
            />
          )}
        </CardContent>
      </Card>

      {expandedId ? (
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle>Detail Pendaftaran</CardTitle>
          </CardHeader>
          <CardContent>
            {detailLoading ? (
              <div className="grid min-h-48 place-items-center rounded-3xl border border-dashed bg-slate-50 text-sm font-bold text-slate-600">
                <span className="inline-flex items-center gap-2"><Loader2 className="h-5 w-5 animate-spin text-primary" /> Memuat detail...</span>
              </div>
            ) : detailData ? (
              <div className="space-y-8">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Nama</p>
                    <p className="mt-1 font-semibold text-slate-800">{detailData.name as string ?? "-"}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Jenis Kelamin</p>
                    <p className="mt-1 font-semibold text-slate-800">{detailData.gender === "MALE" ? "Laki-laki" : detailData.gender === "FEMALE" ? "Perempuan" : "-"}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Tempat Lahir</p>
                    <p className="mt-1 font-semibold text-slate-800">{detailData.birthPlace as string ?? "-"}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Tanggal Lahir</p>
                    <p className="mt-1 font-semibold text-slate-800"><FormatDate date={detailData.birthDate as string} /></p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Alamat</p>
                    <p className="mt-1 font-semibold text-slate-800">{detailData.address as string ?? "-"}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Telepon</p>
                    <p className="mt-1 font-semibold text-slate-800">{detailData.phone as string ?? "-"}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Email</p>
                    <p className="mt-1 font-semibold text-slate-800">{detailData.email as string ?? "-"}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Asal Sekolah</p>
                    <p className="mt-1 font-semibold text-slate-800">{detailData.previousSchool as string ?? "-"}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Jurusan</p>
                    <p className="mt-1 font-semibold text-slate-800">{(detailData.department as Record<string, unknown>)?.name as string ?? "-"}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Kompetensi</p>
                    <p className="mt-1 font-semibold text-slate-800">{(detailData.competency as Record<string, unknown>)?.name as string ?? "-"}</p>
                  </div>
                </div>

                <div>
                  <h4 className="mb-3 text-sm font-bold uppercase tracking-widest text-muted-foreground">Dokumen</h4>
                  {documents.length ? (
                    <div className="space-y-3">
                      {documents.map((doc, idx) => (
                        <div className="flex items-center justify-between rounded-2xl border bg-slate-50 px-4 py-3" key={idx}>
                          <div className="flex items-center gap-3">
                            <Download className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-semibold text-slate-700">{doc.name as string ?? "-"}</p>
                              <p className="text-xs text-muted-foreground">{doc.type as string ?? "-"}</p>
                            </div>
                            <Badge variant={doc.verified ? "success" : "outline"}>{doc.verified ? "Terverifikasi" : "Belum"}</Badge>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              onClick={() => {
                                /* verify doc - pass documentId */
                              }}
                              size="sm"
                              variant="outline"
                            >
                              <CheckCircle2 className="h-3 w-3" /> Verifikasi
                            </Button>
                            <Button
                              onClick={() => {
                                /* reject doc - pass documentId */
                              }}
                              size="sm"
                              variant="ghost"
                            >
                              <XCircle className="h-3 w-3" /> Tolak
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Belum ada dokumen.</p>
                  )}
                </div>

                <div>
                  <h4 className="mb-3 text-sm font-bold uppercase tracking-widest text-muted-foreground">Riwayat Status</h4>
                  {statusHistory.length ? (
                    <div className="space-y-3">
                      {statusHistory.map((entry, idx) => (
                        <div className="flex items-start gap-4" key={idx}>
                          <div className="flex flex-col items-center">
                            <div className="grid h-8 w-8 place-items-center rounded-full bg-primary/10">
                              <Clock className="h-4 w-4 text-primary" />
                            </div>
                            {idx < statusHistory.length - 1 ? <div className="h-full w-px bg-slate-200" /> : null}
                          </div>
                          <div className="pb-4">
                            <p className="font-semibold text-slate-700">{STATUS_LABEL[entry.status as string] ?? (entry.status as string)}</p>
                            <p className="text-xs text-muted-foreground"><FormatDate date={entry.createdAt as string} /></p>
                            {entry.note ? <p className="mt-1 text-sm text-slate-600">{entry.note as string}</p> : null}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Belum ada riwayat.</p>
                  )}
                </div>

                <div className="flex flex-wrap gap-3 border-t pt-6">
                  {status === "SUBMITTED" ? (
                    <Button onClick={() => handleVerify(expandedId)}><UserCheck className="h-4 w-4" /> Verifikasi</Button>
                  ) : null}
                  {status === "VERIFIED" ? (
                    <Button onClick={() => handleAccept(expandedId)}><ThumbsUp className="h-4 w-4" /> Terima</Button>
                  ) : null}
                  {["SUBMITTED", "VERIFIED", "REVISION"].includes(status) ? (
                    <Button onClick={() => handleReject(expandedId)} variant="secondary" className="text-red-600"><UserMinus className="h-4 w-4" /> Tolak</Button>
                  ) : null}
                  {status === "ACCEPTED" ? (
                    <Button onClick={() => handleConvert(expandedId)}><UserPlus className="h-4 w-4" /> Konversi ke Siswa</Button>
                  ) : null}
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
