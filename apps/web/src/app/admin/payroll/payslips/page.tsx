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
      const response = await client.request("/payroll/payslips");
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
    { key: "payrollRunId", header: "ID Payroll Run", cell: (item: any) => String(item.payrollRunId ?? "-") },
    { key: "status", header: "Status", cell: (item: any) => String(item.status ?? "-") },
    { key: "issuedAt", header: "Tgl Terbit", cell: (item: any) => String(item.issuedAt ?? "-") }
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Slip Gaji"
        description="Manajemen slip gaji."
        breadcrumb={["Admin", "HR & Payroll", "Slip Gaji"]}
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

      <SectionCard title="Daftar Slip Gaji">
        <DataTable
          columns={columns}
          data={items}
          loading={loading}
          getRowId={(item) => item.id}
          emptyState={{
            title: "Data kosong",
            description: "Belum ada data slip gaji.",
          }}
        />
      </SectionCard>
    </div>
  );
}
