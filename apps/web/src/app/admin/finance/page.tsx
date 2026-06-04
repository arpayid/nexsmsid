"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertCircle, CreditCard, DollarSign, Landmark, Loader2, Percent, TrendingDown, TrendingUp } from "lucide-react";

import type { FinanceSummary } from "@nexsmsid/api-client";
import { Card, CardContent, CardHeader, CardTitle, PageHeader, StatCard } from "@nexsmsid/ui";

import { createBrowserApiClient } from "@/lib/api-client";

export default function FinancePage() {
  const api = useMemo(() => createBrowserApiClient(), []);
  const [data, setData] = useState<FinanceSummary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadData() {
    setError(null);
    setLoading(true);
    try {
      const response = await api.financeSummary();
      setData(response as unknown as FinanceSummary);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Gagal memuat data keuangan");
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
        breadcrumb={["Admin", "Keuangan"]}
        description="Ringkasan dan statistik keuangan sekolah."
        eyebrow="Phase 8 Keuangan"
        title="Dashboard Keuangan"
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
              <span className="inline-flex items-center gap-2"><Loader2 className="h-5 w-5 animate-spin text-primary" /> Memuat data keuangan...</span>
            </div>
          </CardContent>
        </Card>
      ) : summary ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <StatCard
            description="Total seluruh invoice yang diterbitkan"
            icon={<DollarSign className="h-5 w-5" />}
            title="Total Invoice"
            tone="violet"
            value={`Rp ${Number(summary.totalInvoice ?? 0).toLocaleString("id-ID")}`}
          />
          <StatCard
            description="Pembayaran yang sudah diterima"
            icon={<CreditCard className="h-5 w-5" />}
            title="Pembayaran Terkumpul"
            tone="emerald"
            value={`Rp ${Number(summary.collectedPayments ?? 0).toLocaleString("id-ID")}`}
          />
          <StatCard
            description="Pembayaran yang masih menunggu"
            icon={<Loader2 className="h-5 w-5" />}
            title="Pembayaran Tertunda"
            tone="amber"
            value={`Rp ${Number(summary.pendingPayments ?? 0).toLocaleString("id-ID")}`}
          />
          <StatCard
            description="Sisa tagihan yang belum dibayar"
            icon={<Percent className="h-5 w-5" />}
            title="Jumlah Outstanding"
            tone="amber"
            value={`Rp ${Number(summary.outstandingAmount ?? 0).toLocaleString("id-ID")}`}
          />
          <StatCard
            description="Total pengeluaran sekolah"
            icon={<TrendingDown className="h-5 w-5" />}
            title="Total Pengeluaran"
            tone="blue"
            value={`Rp ${Number(summary.totalExpenses ?? 0).toLocaleString("id-ID")}`}
          />
          <StatCard
            description="Pemasukan bersih setelah pengeluaran"
            icon={<TrendingUp className="h-5 w-5" />}
            title="Pendapatan Bersih"
            tone={Number(summary.netIncome ?? 0) >= 0 ? "emerald" : "amber"}
            value={`Rp ${Number(summary.netIncome ?? 0).toLocaleString("id-ID")}`}
          />
        </div>
      ) : null}
    </div>
  );
}
