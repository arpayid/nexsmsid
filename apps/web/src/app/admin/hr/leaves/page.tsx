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
      const response = await client.request("/hr/leaves");
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
    { key: "leaveType", header: "Tipe", cell: (item: any) => String(item.leaveType ?? "-") },
    { key: "status", header: "Status", cell: (item: any) => String(item.status ?? "-") }
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Cuti & Izin"
        description="Manajemen cuti & izin."
        breadcrumb={["Admin", "HR & Payroll", "Cuti & Izin"]}
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

      <SectionCard title="Daftar Cuti & Izin">
        <DataTable
          columns={columns}
          data={items}
          loading={loading}
          getRowId={(item) => item.id}
          emptyState={{
            title: "Data kosong",
            description: "Belum ada data cuti & izin.",
          }}
        />
      </SectionCard>
    </div>
  );
}
