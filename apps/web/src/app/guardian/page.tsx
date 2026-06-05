"use client";

import { useEffect, useMemo, useState } from "react";
import { Bell, ClipboardCheck, Loader2, Users, Wallet } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, EmptyState, ErrorState, PageHeader, SectionCard, StatCard } from "@nexsmsid/ui";

import { createBrowserApiClient } from "@/lib/api-client";

type Summary = {
  guardian: { id: string; name: string; phone: string | null; email: string | null };
  unreadNotifications: number;
  children: Array<{
    id: string;
    nis: string;
    name: string;
    classroom: string | null;
    competency: string | null;
    attendanceThisMonth: Record<string, number>;
    approvedGradeCount: number;
    averageScore: number;
    outstandingInvoices: number;
    outstandingAmount: number;
  }>;
};

const formatRupiah = (value: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);

export default function GuardianDashboardPage() {
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
        const data = (await api.getGuardianPortalSummary()) as Summary;
        if (!active) return;
        setSummary(data);
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : "Gagal memuat data wali");
      } finally {
        if (active) setLoading(false);
      }
    }
    void load();
    return () => {
      active = false;
    };
  }, [api]);

  if (loading)
    return (
      <div className="grid min-h-[60vh] place-items-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  if (error) return <ErrorState message={error} title="Gagal memuat dashboard" />;
  if (!summary) return <EmptyState description="Belum ada data." title="Data masih kosong" />;

  const childCount = summary.children.length;
  const totalOutstanding = summary.children.reduce((s, c) => s + c.outstandingAmount, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb={["Portal Wali"]}
        description={`Halo ${summary.guardian.name}, berikut ringkasan data anak Anda.`}
        eyebrow="Portal Wali"
        title="Beranda Wali"
      />
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" /> Identitas Wali
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 text-sm">
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Nama</p>
              <p className="font-semibold">{summary.guardian.name}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">No. HP</p>
              <p className="font-semibold">{summary.guardian.phone ?? "-"}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Email</p>
              <p className="font-semibold">{summary.guardian.email ?? "-"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={<Users className="h-5 w-5" />} title="Jumlah Anak" tone="violet" value={String(childCount)} />
        <StatCard
          icon={<Bell className="h-5 w-5" />}
          title="Notifikasi Belum Dibaca"
          tone="blue"
          value={String(summary.unreadNotifications)}
        />
        <StatCard
          icon={<Wallet className="h-5 w-5" />}
          title="Total Tagihan Aktif"
          tone="amber"
          value={formatRupiah(totalOutstanding)}
        />
        <StatCard
          icon={<ClipboardCheck className="h-5 w-5" />}
          title="Sesi Presensi (Bulan Ini)"
          tone="emerald"
          value={String(
            summary.children.reduce(
              (sum, c) => sum + Object.values(c.attendanceThisMonth).reduce((a, b) => a + b, 0),
              0
            )
          )}
        />
      </div>

      <SectionCard description="Ringkasan per anak" title="Daftar Anak">
        {summary.children.length === 0 ? (
          <EmptyState description="Belum ada anak yang terhubung." title="Tidak ada anak" />
        ) : (
          <ul className="divide-y divide-slate-100">
            {summary.children.map((c) => {
              const att = c.attendanceThisMonth;
              const hadir = (att.PRESENT ?? 0) + (att.LATE ?? 0);
              const total = Object.values(att).reduce((a, b) => a + b, 0);
              return (
                <li className="flex flex-wrap items-center justify-between gap-3 py-3" key={c.id}>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {c.name} <span className="font-normal text-muted-foreground">({c.nis})</span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {c.classroom ?? "-"} • {c.competency ?? "-"}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-emerald-700">
                      Hadir {hadir}/{total}
                    </span>
                    <span className="rounded-full bg-violet-50 px-2 py-0.5 text-violet-700">
                      Rata-rata {c.averageScore || 0}
                    </span>
                    <span className="rounded-full bg-amber-50 px-2 py-0.5 text-amber-700">
                      {c.outstandingInvoices} tagihan ({formatRupiah(c.outstandingAmount)})
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </SectionCard>
    </div>
  );
}
