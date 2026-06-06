"use client";

import { useEffect, useMemo, useState } from "react";
import { PageHeader, SectionCard, DataTable, Button, ErrorState } from "@nexsmsid/ui";
import { createBrowserApiClient } from "@/lib/api-client";
import { Plus, RefreshCcw } from "lucide-react";

export default function Page() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const client = useMemo(() => createBrowserApiClient(), []);

  async function loadData() {
    setLoading(true);
    setError(null);
    try {
      const response = await client.listPayrollRuns({ limit: 50, page: 1 });
      setItems((response as any).data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadData();
  }, []);

  const columns = [
    { key: "employee", header: "Pegawai", cell: (item: any) => String(item.employee?.fullName ?? item.employeeId ?? "-") },
    { key: "periodId", header: "Periode", cell: (item: any) => String(item.periodId ?? "-") },
    { key: "totalEarnings", header: "Penerimaan", cell: (item: any) => formatCurrency(item.totalEarnings) },
    { key: "totalDeductions", header: "Potongan", cell: (item: any) => formatCurrency(item.totalDeductions) },
    { key: "netAmount", header: "Gaji Bersih", cell: (item: any) => formatCurrency(item.netAmount) },
    { key: "status", header: "Status", cell: (item: any) => String(item.status ?? "-") }
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Daftar Gaji (Payroll Run)"
        description="Manajemen daftar gaji (payroll run)."
        breadcrumb={["Admin", "HR & Payroll", "Daftar Gaji (Payroll Run)"]}
        actions={
          <>
            <Button onClick={loadData} variant="outline">
              <RefreshCcw className="h-4 w-4" /> Refresh
            </Button>
            <Button>
              <Plus className="h-4 w-4" /> Tambah
            </Button>
          </>
        }
      />

      {error ? <ErrorState message={error} title="Terjadi Kesalahan" /> : null}

      <SectionCard title="Daftar Daftar Gaji (Payroll Run)">
        <DataTable
          columns={columns}
          data={items}
          loading={loading}
          getRowId={(item) => item.id}
          emptyState={{
            title: "Data kosong",
            description: "Belum ada data daftar gaji (payroll run).",
          }}
        />
      </SectionCard>
    </div>
  );
}

function formatCurrency(value: unknown) {
  return `Rp ${Number(value ?? 0).toLocaleString("id-ID")}`;
}
