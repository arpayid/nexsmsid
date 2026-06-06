const fs = require('fs');
const path = require('path');

const pages = [
  {
    path: 'apps/web/src/app/admin/hr/employees/page.tsx',
    title: 'Data Pegawai',
    resource: 'hr/employees',
    fields: [
      { name: 'employeeCode', label: 'Kode Pegawai' },
      { name: 'fullName', label: 'Nama Lengkap' },
      { name: 'employmentStatus', label: 'Status' }
    ]
  },
  {
    path: 'apps/web/src/app/admin/hr/leaves/page.tsx',
    title: 'Cuti & Izin',
    resource: 'hr/leaves',
    fields: [
      { name: 'employeeId', label: 'ID Pegawai' },
      { name: 'leaveType', label: 'Tipe' },
      { name: 'status', label: 'Status' }
    ]
  },
  {
    path: 'apps/web/src/app/admin/payroll/components/page.tsx',
    title: 'Komponen Gaji',
    resource: 'payroll/components',
    fields: [
      { name: 'code', label: 'Kode' },
      { name: 'name', label: 'Nama Komponen' },
      { name: 'type', label: 'Tipe' },
      { name: 'defaultAmount', label: 'Nominal' }
    ]
  },
  {
    path: 'apps/web/src/app/admin/payroll/periods/page.tsx',
    title: 'Periode Penggajian',
    resource: 'payroll/periods',
    fields: [
      { name: 'code', label: 'Kode' },
      { name: 'name', label: 'Nama Periode' },
      { name: 'month', label: 'Bulan' },
      { name: 'year', label: 'Tahun' },
      { name: 'status', label: 'Status' }
    ]
  },
  {
    path: 'apps/web/src/app/admin/payroll/runs/page.tsx',
    title: 'Daftar Gaji (Payroll Run)',
    resource: 'payroll/runs',
    fields: [
      { name: 'employeeId', label: 'ID Pegawai' },
      { name: 'periodId', label: 'Periode' },
      { name: 'netAmount', label: 'Total Gaji Bersih' },
      { name: 'paymentStatus', label: 'Status Pembayaran' }
    ]
  },
  {
    path: 'apps/web/src/app/admin/payroll/payslips/page.tsx',
    title: 'Slip Gaji',
    resource: 'payroll/payslips',
    fields: [
      { name: 'payrollRunId', label: 'ID Payroll Run' },
      { name: 'status', label: 'Status' },
      { name: 'issuedAt', label: 'Tgl Terbit' }
    ]
  }
];

for (const p of pages) {
  const content = `"use client";

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
      const response = await client.request("/${p.resource}");
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
${p.fields.map(f => `    { key: "${f.name}", header: "${f.label}", cell: (item: any) => String(item.${f.name} ?? "-") }`).join(',\n')}
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="${p.title}"
        description="Manajemen ${p.title.toLowerCase()}."
        breadcrumb={["Admin", "HR & Payroll", "${p.title}"]}
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

      <SectionCard title="Daftar ${p.title}">
        <DataTable
          columns={columns}
          data={items}
          loading={loading}
          getRowId={(item) => item.id}
          emptyState={{
            title: "Data kosong",
            description: "Belum ada data ${p.title.toLowerCase()}.",
          }}
        />
      </SectionCard>
    </div>
  );
}
`;
  // Ensure directory exists
  const dir = path.dirname(p.path);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(p.path, content);
}
