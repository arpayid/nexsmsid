"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, RefreshCcw } from "lucide-react";

import { Button, DataTable, ErrorState, PageHeader, SectionCard } from "@nexsmsid/ui";
import { createBrowserApiClient } from "@/lib/api-client";

export default function PayrollSettingsPage() {
  const api = useMemo(() => createBrowserApiClient(), []);
  const [employees, setEmployees] = useState<any[]>([]);
  const [components, setComponents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadData() {
    setLoading(true);
    setError(null);
    try {
      const [employeeResponse, componentResponse] = await Promise.all([
        api.listEmployees({ limit: 50, page: 1 }),
        api.listPayrollComponents({ limit: 50, page: 1 })
      ]);
      setEmployees((employeeResponse as any).data || []);
      setComponents((componentResponse as any).data || []);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Gagal memuat pengaturan gaji pegawai");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadData();
  }, []);

  const employeeColumns = [
    { key: "employeeCode", header: "Kode Pegawai", cell: (item: any) => String(item.employeeCode ?? "-") },
    { key: "fullName", header: "Nama Pegawai", cell: (item: any) => String(item.fullName ?? "-") },
    { key: "position", header: "Jabatan", cell: (item: any) => String(item.position?.name ?? "-") },
    { key: "basicSalary", header: "Gaji Pokok", cell: (item: any) => formatCurrency(item.basicSalary) },
    { key: "status", header: "Status", cell: (item: any) => String(item.status ?? "-") }
  ];

  const componentColumns = [
    { key: "code", header: "Kode", cell: (item: any) => String(item.code ?? "-") },
    { key: "name", header: "Komponen", cell: (item: any) => String(item.name ?? "-") },
    { key: "type", header: "Tipe", cell: (item: any) => String(item.type ?? "-") },
    { key: "defaultAmount", header: "Default", cell: (item: any) => formatCurrency(item.defaultAmount) }
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Pengaturan Gaji Pegawai"
        description="Pantau gaji pokok pegawai dan komponen gaji aktif."
        breadcrumb={["Admin", "HR & Payroll", "Pengaturan Gaji"]}
        actions={
          <>
            <Button onClick={loadData} variant="outline"><RefreshCcw className="h-4 w-4" /> Refresh</Button>
            <Button onClick={() => window.alert("Komponen gaji pegawai dapat dikelola dari detail data pegawai di menu 'Data Pegawai'.")}>
              <Plus className="h-4 w-4" /> Tambah Komponen Pegawai
            </Button>
          </>
        }
      />

      {error ? <ErrorState message={error} title="Terjadi Kesalahan" /> : null}

      <SectionCard title="Gaji Pokok Pegawai">
        <DataTable
          columns={employeeColumns}
          data={employees}
          loading={loading}
          getRowId={(item) => item.id}
          emptyState={{ title: "Data kosong", description: "Belum ada profil pegawai untuk pengaturan gaji." }}
        />
      </SectionCard>

      <SectionCard title="Komponen Gaji Tersedia">
        <DataTable
          columns={componentColumns}
          data={components}
          loading={loading}
          getRowId={(item) => item.id}
          emptyState={{ title: "Data kosong", description: "Belum ada komponen gaji." }}
        />
      </SectionCard>
    </div>
  );
}

function formatCurrency(value: unknown) {
  return `Rp ${Number(value ?? 0).toLocaleString("id-ID")}`;
}
