"use client";

import { useEffect, useMemo, useState } from "react";
import { FileText, Loader2, RefreshCcw } from "lucide-react";

import { Button, DataTable, ErrorState, PageHeader, SectionCard } from "@nexsmsid/ui";
import { createBrowserApiClient } from "@/lib/api-client";

export default function PayrollReportsPage() {
  const api = useMemo(() => createBrowserApiClient(), []);
  const [reports, setReports] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadData() {
    setLoading(true);
    setError(null);
    try {
      const [types, jobResponse] = await Promise.all([
        api.listReportTypes(),
        api.listReportJobs({ limit: 10, page: 1 })
      ]);
      setReports(types.filter((report: any) => report.category === "HR" || report.category === "Payroll"));
      setJobs(jobResponse.items.filter((job: any) => String(job.type).startsWith("hr-") || String(job.type).startsWith("payroll-")));
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Gagal memuat laporan HR/payroll");
    } finally {
      setLoading(false);
    }
  }

  async function generateEmployeeRecap() {
    setSubmitting(true);
    setError(null);
    try {
      await api.generateReport({ type: "hr-employee-recap", format: "CSV", title: "HR Employee Recap" });
      await loadData();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Gagal generate laporan HR/payroll");
    } finally {
      setSubmitting(false);
    }
  }

  useEffect(() => {
    void loadData();
  }, []);

  const reportColumns = [
    { key: "code", header: "Kode", cell: (item: any) => String(item.code ?? "-") },
    { key: "name", header: "Nama Laporan", cell: (item: any) => String(item.name ?? "-") },
    { key: "category", header: "Kategori", cell: (item: any) => String(item.category ?? "-") },
    { key: "supportedFormats", header: "Format", cell: (item: any) => (item.supportedFormats || []).join(", ") || "-" }
  ];

  const jobColumns = [
    { key: "type", header: "Tipe", cell: (item: any) => String(item.type ?? "-") },
    { key: "title", header: "Judul", cell: (item: any) => String(item.title ?? "-") },
    { key: "format", header: "Format", cell: (item: any) => String(item.format ?? "-") },
    { key: "status", header: "Status", cell: (item: any) => String(item.status ?? "-") },
    { key: "createdAt", header: "Dibuat", cell: (item: any) => formatDate(item.createdAt) }
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Laporan HR & Payroll"
        description="Daftar report engine untuk HR, payroll, pembayaran, dan payslip."
        breadcrumb={["Admin", "HR & Payroll", "Laporan"]}
        actions={
          <>
            <Button onClick={loadData} variant="outline"><RefreshCcw className="h-4 w-4" /> Refresh</Button>
            <Button disabled={submitting} onClick={generateEmployeeRecap}>
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />} Generate Rekap Pegawai
            </Button>
          </>
        }
      />

      {error ? <ErrorState message={error} title="Terjadi Kesalahan" /> : null}

      <SectionCard title="Report Type HR & Payroll">
        <DataTable
          columns={reportColumns}
          data={reports}
          loading={loading}
          getRowId={(item) => item.code}
          emptyState={{ title: "Data kosong", description: "Belum ada report type HR/payroll." }}
        />
      </SectionCard>

      <SectionCard title="Job Laporan Terbaru">
        <DataTable
          columns={jobColumns}
          data={jobs}
          loading={loading}
          getRowId={(item) => item.id}
          emptyState={{ title: "Data kosong", description: "Belum ada job laporan HR/payroll." }}
        />
      </SectionCard>
    </div>
  );
}

function formatDate(value: unknown) {
  return value ? new Date(String(value)).toLocaleString("id-ID") : "-";
}
