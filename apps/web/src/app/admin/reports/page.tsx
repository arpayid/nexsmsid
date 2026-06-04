"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { AlertCircle, BarChart3, Download, FileText, Loader2 } from "lucide-react";

import { Button, Card, CardContent, CardHeader, CardTitle, Input, PageHeader, StatCard } from "@nexsmsid/ui";

import { createBrowserApiClient } from "@/lib/api-client";

export default function AdminReportsPage() {
  const api = useMemo(() => createBrowserApiClient(), []);
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  async function loadData() {
    setError(null);
    try {
      setData(await api.getReportSummary());
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Gagal memuat report center");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadData();
  }, []);

  async function handleGenerate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setSubmitting(true);
    setError(null);
    try {
      await api.generateReport({ type: formData.get("type"), format: formData.get("format"), title: formData.get("title") });
      event.currentTarget.reset();
      await loadData();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Gagal generate laporan");
    } finally {
      setSubmitting(false);
    }
  }

  const jobs = data?.jobs as Record<string, unknown> | undefined;
  const exportsData = data?.exports as Record<string, unknown> | undefined;

  return (
    <div className="space-y-8">
      <PageHeader breadcrumb={["Admin", "Laporan"]} description="Pusat ringkasan laporan, dummy queue report generation, dan riwayat export." eyebrow="Phase 10 Report Center" title="Report Center" />
      {error ? <div className="flex items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700"><AlertCircle className="h-5 w-5" /> {error}</div> : null}
      {loading ? <Card><CardContent><div className="grid min-h-48 place-items-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div></CardContent></Card> : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Total Job" value={String(jobs?.total ?? 0)} description="Semua report job" icon={<BarChart3 className="h-5 w-5" />} tone="violet" />
          <StatCard title="Completed" value={String(jobs?.completed ?? 0)} description="Job berhasil" icon={<FileText className="h-5 w-5" />} tone="emerald" />
          <StatCard title="Pending" value={String(jobs?.pending ?? 0)} description="Menunggu proses" icon={<Loader2 className="h-5 w-5" />} tone="blue" />
          <StatCard title="Export" value={String(exportsData?.total ?? 0)} description="Riwayat export" icon={<Download className="h-5 w-5" />} tone="violet" />
        </div>
      )}
      <Card>
        <CardHeader><CardTitle>Generate Laporan Dummy</CardTitle></CardHeader>
        <CardContent>
          <form className="grid gap-4 md:grid-cols-4" onSubmit={handleGenerate}>
            <label className="space-y-2">
              <span className="text-sm font-bold text-slate-700">Tipe</span>
              <select className="h-11 w-full rounded-xl border border-border bg-white px-4 text-sm font-semibold text-slate-700" name="type" required>
                <option value="STUDENTS">STUDENTS</option>
                <option value="FINANCE">FINANCE</option>
                <option value="PPDB">PPDB</option>
                <option value="BKK">BKK</option>
              </select>
            </label>
            <label className="space-y-2">
              <span className="text-sm font-bold text-slate-700">Format</span>
              <select className="h-11 w-full rounded-xl border border-border bg-white px-4 text-sm font-semibold text-slate-700" name="format" required>
                <option value="CSV">CSV</option>
                <option value="XLSX">XLSX</option>
                <option value="PDF">PDF</option>
                <option value="JSON">JSON</option>
              </select>
            </label>
            <label className="space-y-2 md:col-span-2">
              <span className="text-sm font-bold text-slate-700">Judul</span>
              <Input name="title" placeholder="Contoh: Rekap siswa aktif" />
            </label>
            <div className="md:col-span-4"><Button disabled={submitting} type="submit">{submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null} Generate</Button></div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
