"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertCircle, FileText, Loader2, UserCheck, UserMinus, UserPlus, UserX, Users } from "lucide-react";

import { Card, CardContent, PageHeader, StatCard } from "@nexsmsid/ui";

import { createBrowserApiClient } from "@/lib/api-client";

export default function PpdbDashboardPage() {
  const api = useMemo(() => createBrowserApiClient(), []);
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadData() {
    setError(null);
    setLoading(true);
    try {
      const response = await api.getPpdbSummary();
      setData(response as unknown as Record<string, unknown>);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Gagal memuat ringkasan PPDB");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const summary = data as Record<string, unknown> | null;

  return (
    <div className="space-y-8">
      <PageHeader
        breadcrumb={["Admin", "PPDB"]}
        description="Ringkasan dan statistik PPDB."
        eyebrow="Phase 8 PPDB"
        title="Dashboard PPDB"
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
              <span className="inline-flex items-center gap-2"><Loader2 className="h-5 w-5 animate-spin text-primary" /> Memuat ringkasan PPDB...</span>
            </div>
          </CardContent>
        </Card>
      ) : summary ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <StatCard
            description="Total seluruh pendaftar"
            icon={<Users className="h-5 w-5" />}
            title="Total Pendaftaran"
            tone="violet"
            value={String(summary.total ?? summary.totalRegistrations ?? 0)}
          />
          <StatCard
            description="Pendaftar menunggu verifikasi"
            icon={<FileText className="h-5 w-5" />}
            title="SUBMITTED"
            tone="blue"
            value={String(summary.submitted ?? 0)}
          />
          <StatCard
            description="Pendaftar sudah diverifikasi"
            icon={<UserCheck className="h-5 w-5" />}
            title="VERIFIED"
            tone="emerald"
            value={String(summary.verified ?? 0)}
          />
          <StatCard
            description="Pendaftar diterima"
            icon={<UserPlus className="h-5 w-5" />}
            title="ACCEPTED"
            tone="emerald"
            value={String(summary.accepted ?? 0)}
          />
          <StatCard
            description="Pendaftar ditolak"
            icon={<UserMinus className="h-5 w-5" />}
            title="REJECTED"
            tone="amber"
            value={String(summary.rejected ?? 0)}
          />
          <StatCard
            description="Pendaftar dikonversi ke siswa"
            icon={<UserX className="h-5 w-5" />}
            title="CONVERTED"
            tone="blue"
            value={String(summary.converted ?? 0)}
          />
          <StatCard
            description="Periode PPDB yang sedang aktif"
            icon={<Users className="h-5 w-5" />}
            title="Periode Aktif"
            tone="violet"
            value={String(summary.activePeriods ?? summary.activePeriod ?? 0)}
          />
        </div>
      ) : null}
    </div>
  );
}
