"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertCircle, Banknote, Calculator, Loader2, Receipt, Wallet } from "lucide-react";

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
      setSummary((await api.getPayrollSummary()) as Record<string, any>);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Gagal memuat ringkasan payroll");
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
        breadcrumb={["Admin", "Payroll", "Dashboard"]}
        description="Ringkasan periode, daftar gaji, potongan, dan total gaji bersih."
        eyebrow="Phase 12.5 Payroll Management"
        title="Payroll Dashboard"
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
              <span className="inline-flex items-center gap-2"><Loader2 className="h-5 w-5 animate-spin text-primary" /> Memuat ringkasan payroll...</span>
            </div>
          </CardContent>
        </Card>
      ) : summary ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
          <StatCard title="Periode Aktif" value={summary.currentPeriod?.code ?? "-"} description={summary.currentPeriod?.status ?? "Belum ada periode"} icon={<Receipt className="h-5 w-5" />} tone="blue" />
          <StatCard title="Payroll Run" value={summary.runsCount ?? 0} description="Pegawai dihitung" icon={<Calculator className="h-5 w-5" />} tone="violet" />
          <StatCard title="Total Penerimaan" value={formatCurrency(summary.totalGross)} description="Gross payroll" icon={<Wallet className="h-5 w-5" />} tone="emerald" />
          <StatCard title="Total Potongan" value={formatCurrency(summary.totalDeductions)} description="Deduction payroll" icon={<Banknote className="h-5 w-5" />} tone="amber" />
          <StatCard title="Gaji Bersih" value={formatCurrency(summary.totalNet)} description="Net payroll" icon={<Wallet className="h-5 w-5" />} tone="blue" />
        </div>
      ) : null}
    </div>
  );
}

function formatCurrency(value: unknown) {
  return `Rp ${Number(value ?? 0).toLocaleString("id-ID")}`;
}
