"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertCircle, BookOpen, Layers, Users, HeartHandshake, Loader2, AlertTriangle, Clock, Banknote } from "lucide-react";

import { Card, CardContent, PageHeader, StatCard, SectionCard } from "@nexsmsid/ui";
import { createBrowserApiClient } from "@/lib/api-client";

export default function LibraryDashboardPage() {
  const api = useMemo(() => createBrowserApiClient(), []);
  const [summary, setSummary] = useState<Record<string, any> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadData() {
    setError(null);
    setLoading(true);
    try {
      const response = await api.getLibrarySummary();
      setSummary(response as Record<string, any>);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Gagal memuat ringkasan perpustakaan");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-8">
      <PageHeader
        breadcrumb={["Admin", "Perpustakaan", "Dashboard"]}
        description="Ringkasan koleksi buku, sirkulasi peminjaman, dan denda perpustakaan."
        eyebrow="Phase 12.4 Library"
        title="Dashboard Perpustakaan"
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
              <span className="inline-flex items-center gap-2"><Loader2 className="h-5 w-5 animate-spin text-primary" /> Memuat ringkasan perpustakaan...</span>
            </div>
          </CardContent>
        </Card>
      ) : summary ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <StatCard
            description="Total semua judul buku di perpustakaan"
            icon={<BookOpen className="h-5 w-5" />}
            title="Total Judul Buku"
            tone="blue"
            value={summary.totalBooks ?? 0}
          />
          <StatCard
            description="Total seluruh eksemplar buku"
            icon={<Layers className="h-5 w-5" />}
            title="Total Eksemplar"
            tone="emerald"
            value={summary.totalCopies ?? 0}
          />
          <StatCard
            description="Eksemplar yang tersedia untuk dipinjam"
            icon={<BookOpen className="h-5 w-5" />}
            title="Tersedia"
            tone="emerald"
            value={summary.availableCopies ?? 0}
          />
          <StatCard
            description="Eksemplar yang sedang dipinjam"
            icon={<HeartHandshake className="h-5 w-5" />}
            title="Sedang Dipinjam"
            tone="violet"
            value={summary.borrowedCopies ?? 0}
          />
          <StatCard
            description="Peminjaman yang terlambat dikembalikan"
            icon={<AlertTriangle className="h-5 w-5" />}
            title="Terlambat (Overdue)"
            tone="amber"
            value={summary.overdueLoans ?? 0}
          />
          <StatCard
            description="Total denda keterlambatan yang belum dibayar"
            icon={<Banknote className="h-5 w-5" />}
            title="Denda Belum Dibayar"
            tone="amber"
            value={`Rp ${Number(summary.unpaidFines ?? 0).toLocaleString('id-ID')}`}
          />
        </div>
      ) : null}
    </div>
  );
}
