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
      const response = await client.listPayslips({ limit: 50, page: 1 });
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
    { key: "payslipNumber", header: "Nomor Slip", cell: (item: any) => String(item.payslipNumber ?? "-") },
    { key: "employee", header: "Pegawai", cell: (item: any) => String(item.payrollRun?.employee?.fullName ?? "-") },
    { key: "period", header: "Periode", cell: (item: any) => String(item.payrollRun?.period?.name ?? "-") },
    { key: "status", header: "Status", cell: (item: any) => String(item.status ?? "-") },
    { key: "issuedAt", header: "Tgl Terbit", cell: (item: any) => formatDate(item.issuedAt) }
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
            <Button onClick={() => window.alert("Slip gaji (payslip) dibuat otomatis saat memproses periode penggajian.")}>
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

function formatDate(value: unknown) {
  return value ? new Date(String(value)).toLocaleDateString("id-ID") : "-";
}
