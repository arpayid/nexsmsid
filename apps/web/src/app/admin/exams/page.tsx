"use client";

import { BarChart3, Search, Loader2, Eye, Edit3, Trash2, Plus, RefreshCcw } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import type { ExamRecord } from "@nexsmsid/api-client";
import { Button, ConfirmDialog, DataTable, ErrorState, Input, PageHeader, StatusBadge } from "@nexsmsid/ui";
import type { DataTableColumn } from "@nexsmsid/ui";

import { createBrowserApiClient } from "@/lib/api-client";

export default function ExamsPage() {
  const client = createBrowserApiClient();
  const [data, setData] = useState<ExamRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  async function loadData() {
    setError(null);
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      const res = await client.listExams(params);
      setData(res.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat data ujian");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void loadData(); }, []);

  async function handleRefresh() {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }

  async function confirmDelete() {
    if (!pendingDelete) return;
    try {
      await client.deleteExam(pendingDelete);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menghapus ujian");
    }
    setPendingDelete(null);
    await loadData();
  }

  const columns: DataTableColumn<ExamRecord>[] = [
    { header: "Kode", key: "code", cell: (row) => <span className="font-mono font-bold">{row.code}</span> },
    { header: "Nama", key: "name", cell: (row) => <span className="font-bold">{row.name}</span> },
    { header: "Tipe", key: "examType", cell: (row) => row.examType?.name ?? "-" },
    { header: "Durasi (menit)", key: "duration" },
    { header: "Status", key: "status", cell: (row) => <StatusBadge value={row.status} /> },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        actions={
          <>
            <Button asChild variant="outline">
              <Link href="/admin/exams/reports"><BarChart3 className="h-4 w-4" /> Laporan</Link>
            </Button>
            <Button onClick={handleRefresh} variant="outline">
              {refreshing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCcw className="h-4 w-4" />} Refresh
            </Button>
            <Button asChild>
              <Link href="/admin/exams/create"><Plus className="h-4 w-4" /> Buat Ujian</Link>
            </Button>
          </>
        }
        breadcrumb={["Admin", "Ujian / CBT"]}
        description="Kelola data ujian, jadwal, peserta, sesi, soal, dan hasil."
        title="Data Ujian"
      />

      {error ? <ErrorState message={error} title="Gagal memuat data" /> : null}

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input className="pl-11" placeholder="Cari ujian..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select
          className="h-11 rounded-2xl border border-input bg-white px-4 text-sm shadow-sm outline-none"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">Semua Status</option>
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">Published</option>
          <option value="ONGOING">Ongoing</option>
          <option value="COMPLETED">Completed</option>
          <option value="ARCHIVED">Archived</option>
        </select>
        <Button onClick={handleRefresh} size="sm" variant="secondary">Cari</Button>
      </div>

      <DataTable
        actions={(row) => (
          <>
            <Button asChild size="sm" variant="outline">
              <Link href={`/admin/exams/${row.id}`}><Eye className="h-4 w-4" /> Lihat</Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href={`/admin/exams/${row.id}/edit`}><Edit3 className="h-4 w-4" /> Edit</Link>
            </Button>
            <Button onClick={() => setPendingDelete(row.id)} size="sm" variant="ghost">
              <Trash2 className="h-4 w-4" /> Hapus
            </Button>
          </>
        )}
        columns={columns}
        data={data}
        emptyState={{ title: "Belum ada ujian", description: "Buat ujian pertama untuk memulai." }}
        getRowId={(row) => row.id}
        loading={loading}
        minWidth="min-w-[720px]"
      />

      <ConfirmDialog
        description="Hapus ujian ini? Semua data terkait juga akan dihapus."
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => void confirmDelete()}
        open={Boolean(pendingDelete)}
        title="Konfirmasi hapus"
      />
    </div>
  );
}
