"use client";

import { useEffect, useMemo, useState } from "react";
import { RefreshCcw, Wallet } from "lucide-react";

import { Button, DataTable, ErrorState, PageHeader, SectionCard } from "@nexsmsid/ui";
import { createBrowserApiClient } from "@/lib/api-client";

export default function PayrollPaymentsPage() {
  const api = useMemo(() => createBrowserApiClient(), []);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadData() {
    setLoading(true);
    setError(null);
    try {
      const response = await api.listPayrollPayments({ limit: 50, page: 1 });
      setItems((response as any).data || []);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Gagal memuat pembayaran payroll");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadData();
  }, []);

  const columns = [
    { key: "payslipNumber", header: "Nomor Slip", cell: (item: any) => String(item.payslipNumber ?? "-") },
    { key: "employee", header: "Pegawai", cell: (item: any) => String(item.payrollRun?.employee?.fullName ?? "-") },
    { key: "period", header: "Periode", cell: (item: any) => String(item.payrollRun?.period?.name ?? "-") },
    { key: "netAmount", header: "Gaji Bersih", cell: (item: any) => formatCurrency(item.payrollRun?.netAmount) },
    { key: "paidAt", header: "Tanggal Bayar", cell: (item: any) => formatDate(item.paidAt) },
    { key: "paymentMethod", header: "Metode", cell: (item: any) => String(item.paymentMethod ?? "-") },
    { key: "status", header: "Status", cell: (item: any) => String(item.status ?? "-") }
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Pembayaran Payroll"
        description="Pantau pembayaran gaji berdasarkan payslip."
        breadcrumb={["Admin", "HR & Payroll", "Pembayaran Payroll"]}
        actions={
          <>
            <Button onClick={loadData} variant="outline"><RefreshCcw className="h-4 w-4" /> Refresh</Button>
            <Button><Wallet className="h-4 w-4" /> Tandai Dibayar</Button>
          </>
        }
      />

      {error ? <ErrorState message={error} title="Terjadi Kesalahan" /> : null}

      <SectionCard title="Daftar Pembayaran Payroll">
        <DataTable
          columns={columns}
          data={items}
          loading={loading}
          getRowId={(item) => item.id}
          emptyState={{ title: "Data kosong", description: "Belum ada payslip pembayaran payroll." }}
        />
      </SectionCard>
    </div>
  );
}

function formatCurrency(value: unknown) {
  return `Rp ${Number(value ?? 0).toLocaleString("id-ID")}`;
}

function formatDate(value: unknown) {
  return value ? new Date(String(value)).toLocaleDateString("id-ID") : "-";
}
