"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertCircle, Building2, ClipboardCheck, BriefcaseBusiness, Settings, HeartHandshake, Loader2, AlertTriangle, Clock } from "lucide-react";

import { Card, CardContent, PageHeader, StatCard, SectionCard } from "@nexsmsid/ui";
import { createBrowserApiClient } from "@/lib/api-client";

export default function InventoryDashboardPage() {
  const api = useMemo(() => createBrowserApiClient(), []);
  const [summary, setSummary] = useState<Record<string, any> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadData() {
    setError(null);
    setLoading(true);
    try {
      const response = await api.getInventorySummary();
      setSummary(response as Record<string, any>);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Gagal memuat ringkasan inventaris");
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
        breadcrumb={["Admin", "Inventaris", "Dashboard"]}
        description="Ringkasan aset, barang, dan pemeliharaan sarana prasarana sekolah."
        eyebrow="Phase 12.3 Sarpras"
        title="Dashboard Inventaris"
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
              <span className="inline-flex items-center gap-2"><Loader2 className="h-5 w-5 animate-spin text-primary" /> Memuat ringkasan inventaris...</span>
            </div>
          </CardContent>
        </Card>
      ) : summary ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <StatCard
            description="Total semua barang & aset tercatat"
            icon={<BriefcaseBusiness className="h-5 w-5" />}
            title="Total Barang/Aset"
            tone="blue"
            value={summary.totalItems ?? 0}
          />
          <StatCard
            description="Aset yang sedang berstatus ACTIVE"
            icon={<ClipboardCheck className="h-5 w-5" />}
            title="Aset Aktif"
            tone="emerald"
            value={summary.activeAssets ?? 0}
          />
          <StatCard
            description="Aset rusak (DAMAGED / HEAVILY_DAMAGED)"
            icon={<AlertTriangle className="h-5 w-5" />}
            title="Aset Rusak"
            tone="amber"
            value={summary.damagedAssets ?? 0}
          />
          <StatCard
            description="Aset dalam pemeliharaan (MAINTENANCE)"
            icon={<Settings className="h-5 w-5" />}
            title="Sedang Pemeliharaan"
            tone="amber"
            value={summary.inMaintenance ?? 0}
          />
          <StatCard
            description="Barang yang sedang dipinjam (BORROWED)"
            icon={<HeartHandshake className="h-5 w-5" />}
            title="Dipinjam"
            tone="violet"
            value={summary.borrowedLoans ?? 0}
          />
          <StatCard
            description="Barang dengan kuantitas <= stok minimum"
            icon={<AlertCircle className="h-5 w-5" />}
            title="Stok Menipis / Habis"
            tone="amber"
            value={summary.lowStockItems ?? 0}
          />
        </div>
      ) : null}
    </div>
  );
}
