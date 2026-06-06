"use client";

import { useEffect, useState } from "react";
import { PageHeader, SectionCard, DataTable, Button, ErrorState } from "@nexsmsid/ui";
import { createBrowserApiClient } from "@/lib/api-client";
import { Plus, RefreshCcw } from "lucide-react";

export default function Page() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const client = createBrowserApiClient();

  async function loadData() {
    setLoading(true);
    setError(null);
    try {
      // Basic fetch directly mapping to our new resource endpoints
      const response = await client.request("/payroll/runs");
      setItems(response.data || []);
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
    { key: "employeeId", header: "ID Pegawai", cell: (item: any) => String(item.employeeId ?? "-") },
    { key: "periodId", header: "Periode", cell: (item: any) => String(item.periodId ?? "-") },
    { key: "netAmount", header: "Total Gaji Bersih", cell: (item: any) => String(item.netAmount ?? "-") },
    { key: "paymentStatus", header: "Status Pembayaran", cell: (item: any) => String(item.paymentStatus ?? "-") }
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
