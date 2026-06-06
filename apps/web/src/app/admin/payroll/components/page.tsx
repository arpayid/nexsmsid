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
      const response = await client.request("/payroll/components");
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
    { key: "code", header: "Kode", cell: (item: any) => String(item.code ?? "-") },
    { key: "name", header: "Nama Komponen", cell: (item: any) => String(item.name ?? "-") },
    { key: "type", header: "Tipe", cell: (item: any) => String(item.type ?? "-") },
    { key: "defaultAmount", header: "Nominal", cell: (item: any) => String(item.defaultAmount ?? "-") }
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Komponen Gaji"
        description="Manajemen komponen gaji."
        breadcrumb={["Admin", "HR & Payroll", "Komponen Gaji"]}
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

      <SectionCard title="Daftar Komponen Gaji">
        <DataTable
          columns={columns}
          data={items}
          loading={loading}
          getRowId={(item) => item.id}
          emptyState={{
            title: "Data kosong",
            description: "Belum ada data komponen gaji.",
          }}
        />
      </SectionCard>
    </div>
  );
}
