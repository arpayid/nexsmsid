"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";

import { DataTable, EmptyState, ErrorState, PageHeader, SectionCard, StatusBadge } from "@nexsmsid/ui";

import { createBrowserApiClient } from "@/lib/api-client";

type Summary = {
  latestAchievements?: Array<Record<string, any>>;
  latestViolations?: Array<Record<string, any>>;
  netPoints?: number;
  totalAchievementPoints?: number;
  totalViolationPoints?: number;
};

export default function StudentDisciplinePage() {
  const api = useMemo(() => createBrowserApiClient(), []);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await api.getStudentPortalDiscipline() as Summary;
        if (active) setSummary(data);
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : "Gagal memuat discipline summary");
      } finally {
        if (active) setLoading(false);
      }
    }
    void load();
    return () => {
      active = false;
    };
  }, [api]);

  if (loading) return <div className="grid min-h-[60vh] place-items-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;
  if (error) return <ErrorState message={error} title="Gagal memuat kedisiplinan" />;
  if (!summary) return <EmptyState description="Belum ada data discipline." title="Data kosong" />;

  return (
    <div className="space-y-6">
      <PageHeader breadcrumb={["Portal Siswa", "Kedisiplinan"]} description="Ringkasan poin pelanggaran confirmed dan prestasi Anda." eyebrow="Portal Siswa" title="Kedisiplinan" />
      <div className="grid gap-3 sm:grid-cols-3">
        <MetricCard label="Poin Pelanggaran" value={summary.totalViolationPoints ?? 0} />
        <MetricCard label="Poin Prestasi" value={summary.totalAchievementPoints ?? 0} />
        <MetricCard label="Saldo Poin" value={summary.netPoints ?? 0} />
      </div>
      <SectionCard description="Hanya pelanggaran yang sudah CONFIRMED." title="Pelanggaran Terkonfirmasi">
        <DataTable
          columns={[
            { key: "incidentDate", header: "Tanggal", cell: (row) => formatDate(row.incidentDate) },
            { key: "rule", header: "Aturan", cell: (row) => row.rule?.name ?? "-" },
            { key: "severity", header: "Severity", cell: (row) => <StatusBadge value={row.rule?.severity ?? "-"} /> },
            { key: "point", header: "Poin" }
          ]}
          data={summary.latestViolations ?? []}
          getRowId={(row, index) => String(row.id ?? index)}
          minWidth="min-w-[680px]"
        />
      </SectionCard>
      <SectionCard description="Poin positif dari prestasi yang dicatat sekolah." title="Prestasi">
        <DataTable
          columns={[
            { key: "awardedAt", header: "Tanggal", cell: (row) => formatDate(row.awardedAt) },
            { key: "title", header: "Prestasi" },
            { key: "category", header: "Kategori" },
            { key: "point", header: "Poin" }
          ]}
          data={summary.latestAchievements ?? []}
          getRowId={(row, index) => String(row.id ?? index)}
          minWidth="min-w-[680px]"
        />
      </SectionCard>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-soft">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
      <p className="mt-3 text-3xl font-black text-slate-950">{value}</p>
    </div>
  );
}

function formatDate(value: unknown) {
  if (!value) return "-";
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
}
