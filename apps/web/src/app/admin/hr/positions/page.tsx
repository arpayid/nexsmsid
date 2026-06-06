"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, RefreshCcw } from "lucide-react";

import { Button, DataTable, ErrorState, PageHeader, SectionCard } from "@nexsmsid/ui";
import { createBrowserApiClient } from "@/lib/api-client";

export default function HRPositionsPage() {
  const api = useMemo(() => createBrowserApiClient(), []);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadData() {
    setLoading(true);
    setError(null);
    try {
      const response = await api.listHRPositions({ limit: 50, page: 1 });
      setItems((response as any).data || []);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Gagal memuat jabatan HR");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadData();
  }, []);

  const columns = [
    { key: "code", header: "Kode", cell: (item: any) => String(item.code ?? "-") },
    { key: "name", header: "Nama Jabatan", cell: (item: any) => String(item.name ?? "-") },
    { key: "description", header: "Deskripsi", cell: (item: any) => String(item.description ?? "-") },
    { key: "isActive", header: "Status", cell: (item: any) => (item.isActive ? "Aktif" : "Nonaktif") }
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Jabatan HR"
        description="Kelola posisi dan jabatan pegawai."
        breadcrumb={["Admin", "HR & Payroll", "Jabatan"]}
        actions={
          <>
            <Button onClick={loadData} variant="outline"><RefreshCcw className="h-4 w-4" /> Refresh</Button>
            <Button><Plus className="h-4 w-4" /> Tambah Jabatan</Button>
          </>
        }
      />

      {error ? <ErrorState message={error} title="Terjadi Kesalahan" /> : null}

      <SectionCard title="Daftar Jabatan HR">
        <DataTable
          columns={columns}
          data={items}
          loading={loading}
          getRowId={(item) => item.id}
          emptyState={{ title: "Data kosong", description: "Belum ada jabatan HR." }}
        />
      </SectionCard>
    </div>
  );
}
