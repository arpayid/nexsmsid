"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertCircle, Download, FileText, Loader2, BarChart3, ListFilter, PlayCircle } from "lucide-react";
import Link from "next/link";

import { Button, Card, CardContent, CardHeader, CardTitle, PageHeader } from "@nexsmsid/ui";
import { createBrowserApiClient } from "@/lib/api-client";

export default function InventoryReportsPage() {
  const api = useMemo(() => createBrowserApiClient(), []);
  const [summary, setSummary] = useState<any>(null);
  const [lowStock, setLowStock] = useState<any[]>([]);
  const [overdueLoans, setOverdueLoans] = useState<any[]>([]);
  const [maintenanceDue, setMaintenanceDue] = useState<any[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [printing, setPrinting] = useState(false);

  async function loadData() {
    setError(null);
    setLoading(true);
    try {
      const [sumRes, lowRes, overdueRes, maintRes] = await Promise.all([
        api.getInventorySummary(),
        api.getInventoryLowStock(),
        api.getInventoryLoansOverdue(),
        api.getInventoryMaintenanceDue()
      ]);
      setSummary(sumRes);
      setLowStock((lowRes as any).data || []);
      setOverdueLoans((overdueRes as any).data || []);
      setMaintenanceDue((maintRes as any).data || []);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Gagal memuat data laporan");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handlePrintSummary() {
    setError(null);
    setPrinting(true);
    try {
      await api.downloadInventorySummaryPdf();
    } catch (printError) {
      setError(printError instanceof Error ? printError.message : "Gagal membuat PDF ringkasan");
    } finally {
      setPrinting(false);
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader
        actions={
          <Button disabled={printing} onClick={handlePrintSummary} variant="outline">
            {printing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />} Cetak Ringkasan PDF
          </Button>
        }
        breadcrumb={["Admin", "Inventaris", "Laporan & Peringatan"]}
        description="Ringkasan eksekutif, peringatan stok, dan akses ke pembuat laporan."
        eyebrow="Phase 12.3 Sarpras"
        title="Laporan & Peringatan"
      />

      {error ? (
        <div className="flex items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
          <AlertCircle className="h-5 w-5" /> {error}
        </div>
      ) : null}

      {loading ? (
        <Card>
          <CardContent>
            <div className="grid min-h-48 place-items-center rounded-3xl border border-dashed bg-slate-50 text-sm font-bold text-slate-600">
              <span className="inline-flex items-center gap-2"><Loader2 className="h-5 w-5 animate-spin text-primary" /> Memuat laporan...</span>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border-rose-200 bg-rose-50/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-rose-700">
                <AlertCircle className="h-5 w-5" /> Stok Menipis / Habis
              </CardTitle>
            </CardHeader>
            <CardContent>
              {lowStock.length ? (
                <ul className="space-y-3">
                  {lowStock.map((item) => (
                    <li key={item.id} className="flex justify-between items-center rounded-xl bg-white p-3 shadow-sm border border-rose-100">
                      <div>
                        <p className="font-bold text-slate-800">{item.name}</p>
                        <p className="text-xs text-muted-foreground">Kategori: {item.category?.name ?? "-"} | Kode: {item.code}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-rose-600">{item.quantity} {item.unit}</p>
                        <p className="text-xs text-muted-foreground">Min: {item.minStock ?? 0}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm font-medium text-slate-600">Tidak ada barang dengan stok menipis.</p>
              )}
            </CardContent>
          </Card>

          <Card className="border-amber-200 bg-amber-50/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-700">
                <ListFilter className="h-5 w-5" /> Peminjaman Terlambat (Overdue)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {overdueLoans.length ? (
                <ul className="space-y-3">
                  {overdueLoans.map((loan) => (
                    <li key={loan.id} className="flex justify-between items-center rounded-xl bg-white p-3 shadow-sm border border-amber-100">
                      <div>
                        <p className="font-bold text-slate-800">{loan.borrowerName}</p>
                        <p className="text-xs text-muted-foreground">{loan.item?.name} ({loan.quantity} unit)</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-amber-600">{loan.dueAt ? new Date(loan.dueAt).toLocaleDateString("id-ID") : "-"}</p>
                        <p className="text-xs text-muted-foreground">Jatuh Tempo</p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm font-medium text-slate-600">Tidak ada peminjaman yang terlambat.</p>
              )}
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-blue-50/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-700">
                <PlayCircle className="h-5 w-5" /> Pemeliharaan Mendatang / Jatuh Tempo
              </CardTitle>
            </CardHeader>
            <CardContent>
              {maintenanceDue.length ? (
                <ul className="space-y-3">
                  {maintenanceDue.map((maint) => (
                    <li key={maint.id} className="flex justify-between items-center rounded-xl bg-white p-3 shadow-sm border border-blue-100">
                      <div>
                        <p className="font-bold text-slate-800">{maint.title}</p>
                        <p className="text-xs text-muted-foreground">{maint.item?.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-blue-600">{maint.scheduledAt ? new Date(maint.scheduledAt).toLocaleDateString("id-ID") : "-"}</p>
                        <p className="text-xs text-muted-foreground">Jadwal</p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm font-medium text-slate-600">Tidak ada jadwal pemeliharaan terdekat.</p>
              )}
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" /> Report Center Inventaris
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-muted-foreground">
                Untuk mencetak laporan lengkap (Excel, CSV, PDF) berdasarkan periode tertentu, gunakan fitur Report Center utama kami.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2 text-sm font-medium text-slate-700"><FileText className="h-4 w-4 text-primary" /> Laporan Rekap Barang/Aset</li>
                <li className="flex items-center gap-2 text-sm font-medium text-slate-700"><FileText className="h-4 w-4 text-primary" /> Laporan Rekap Mutasi</li>
                <li className="flex items-center gap-2 text-sm font-medium text-slate-700"><FileText className="h-4 w-4 text-primary" /> Laporan Rekap Pemeliharaan</li>
                <li className="flex items-center gap-2 text-sm font-medium text-slate-700"><FileText className="h-4 w-4 text-primary" /> Laporan Rekap Peminjaman</li>
                <li className="flex items-center gap-2 text-sm font-medium text-slate-700"><FileText className="h-4 w-4 text-primary" /> Laporan Barang Stok Menipis</li>
              </ul>
              <Button asChild className="w-full">
                <Link href="/admin/reports">Buka Report Center Utama</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
