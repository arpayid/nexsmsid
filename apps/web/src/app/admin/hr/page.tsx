"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertCircle, BriefcaseBusiness, CalendarOff, Loader2, UserCheck, Users } from "lucide-react";

import { Card, CardContent, PageHeader, StatCard } from "@nexsmsid/ui";
import { createBrowserApiClient } from "@/lib/api-client";

export default function Page() {
  const api = useMemo(() => createBrowserApiClient(), []);
  const [summary, setSummary] = useState<Record<string, any> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadData() {
    setLoading(true);
    setError(null);
    try {
      setSummary((await api.getHRSummary()) as Record<string, any>);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Gagal memuat ringkasan HR");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadData();
  }, []);

  return (
    <div className="space-y-8">
      <PageHeader
        breadcrumb={["Admin", "HR", "Dashboard"]}
        description="Ringkasan pegawai, kehadiran, dan pengajuan cuti/izin."
        eyebrow="Phase 12.5 HR Management"
        title="HR Dashboard"
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
              <span className="inline-flex items-center gap-2"><Loader2 className="h-5 w-5 animate-spin text-primary" /> Memuat ringkasan HR...</span>
            </div>
          </CardContent>
        </Card>
      ) : summary ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
          <StatCard title="Total Pegawai" value={summary.totalEmployees ?? 0} description="Semua profil pegawai" icon={<Users className="h-5 w-5" />} tone="blue" />
          <StatCard title="Kontrak" value={summary.contractEmployees ?? 0} description="Pegawai kontrak" icon={<BriefcaseBusiness className="h-5 w-5" />} tone="violet" />
          <StatCard title="Hadir Hari Ini" value={summary.presentToday ?? 0} description="Presensi PRESENT" icon={<UserCheck className="h-5 w-5" />} tone="emerald" />
          <StatCard title="Cuti Pending" value={summary.pendingLeaves ?? 0} description="Menunggu approval" icon={<CalendarOff className="h-5 w-5" />} tone="amber" />
          <StatCard title="Tidak Aktif" value={summary.inactiveEmployees ?? 0} description="Inactive/terminated/retired" icon={<AlertCircle className="h-5 w-5" />} tone="amber" />
        </div>
      ) : null}
    </div>
  );
}
