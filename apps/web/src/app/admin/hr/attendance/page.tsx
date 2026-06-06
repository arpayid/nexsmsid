"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, RefreshCcw } from "lucide-react";

import { Button, DataTable, ErrorState, PageHeader, SectionCard } from "@nexsmsid/ui";
import { createBrowserApiClient } from "@/lib/api-client";

export default function Page() {
  const api = useMemo(() => createBrowserApiClient(), []);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadData() {
    setLoading(true);
    setError(null);
    try {
      const response = await api.listEmployeeAttendance({ limit: 50, page: 1 });
      setItems((response as any).data || []);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Gagal memuat kehadiran pegawai");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadData();
  }, []);

  const columns = [
    { key: "date", header: "Tanggal", cell: (item: any) => formatDate(item.date) },
    { key: "employee", header: "Pegawai", cell: (item: any) => String(item.employee?.fullName ?? item.employeeId ?? "-") },
    { key: "status", header: "Status", cell: (item: any) => String(item.status ?? "-") },
    { key: "checkInAt", header: "Masuk", cell: (item: any) => formatTime(item.checkInAt) },
    { key: "checkOutAt", header: "Pulang", cell: (item: any) => formatTime(item.checkOutAt) },
    { key: "lateMinutes", header: "Terlambat", cell: (item: any) => `${Number(item.lateMinutes ?? 0)} menit` }
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Kehadiran Pegawai"
        description="Rekap presensi pegawai dan staf."
        breadcrumb={["Admin", "HR & Payroll", "Kehadiran"]}
        actions={
          <>
            <Button onClick={loadData} variant="outline"><RefreshCcw className="h-4 w-4" /> Refresh</Button>
            <Button><Plus className="h-4 w-4" /> Catat Kehadiran</Button>
          </>
        }
      />

      {error ? <ErrorState message={error} title="Terjadi Kesalahan" /> : null}

      <SectionCard title="Daftar Kehadiran Pegawai">
        <DataTable
          columns={columns}
          data={items}
          loading={loading}
          getRowId={(item) => item.id}
          emptyState={{ title: "Data kosong", description: "Belum ada catatan kehadiran pegawai." }}
        />
      </SectionCard>
    </div>
  );
}

function formatDate(value: unknown) {
  return value ? new Date(String(value)).toLocaleDateString("id-ID") : "-";
}

function formatTime(value: unknown) {
  return value ? new Date(String(value)).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) : "-";
}
