"use client";

import { ArrowLeft, Loader2, Trash2, UserPlus } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import type { ExamParticipantRecord } from "@nexsmsid/api-client";
import { Button, DataTable, ErrorState, Input, PageHeader } from "@nexsmsid/ui";
import type { DataTableColumn } from "@nexsmsid/ui";

import { createBrowserApiClient } from "@/lib/api-client";

export default function ExamParticipantsPage() {
  const { id } = useParams<{ id: string }>();
  const client = createBrowserApiClient();
  const [participants, setParticipants] = useState<ExamParticipantRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [studentId, setStudentId] = useState("");
  const [adding, setAdding] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await client.listExamParticipants(id);
      setParticipants(res.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat peserta");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void load(); }, [id]);

  async function handleAdd() {
    if (!studentId.trim()) return;
    setAdding(true);
    try {
      await client.addExamParticipant(id, studentId.trim());
      setStudentId("");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menambah peserta");
    } finally {
      setAdding(false);
    }
  }

  async function handleRemove(participantId: string) {
    try {
      await client.removeExamParticipant(id, participantId);
      await load();
    } catch {
      setError("Gagal menghapus peserta");
    }
  }

  const columns: DataTableColumn<ExamParticipantRecord>[] = [
    { header: "No", key: "number", cell: (row) => row.number ?? "-" },
    { header: "ID Siswa", key: "studentId" },
    { header: "Status", key: "status", cell: (row) => row.status },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        actions={
          <Button asChild variant="outline">
            <Link href={`/admin/exams/${id}`}><ArrowLeft className="h-4 w-4" /> Kembali</Link>
          </Button>
        }
        breadcrumb={["Admin", "Ujian / CBT", "Peserta"]}
        description="Kelola peserta ujian."
        title="Peserta Ujian"
      />

      {error ? <ErrorState message={error} title="Gagal" /> : null}

      <div className="flex items-end gap-3 max-w-md">
        <label className="space-y-2 flex-1">
          <span className="text-sm font-bold text-slate-700">ID Siswa</span>
          <Input placeholder="Masukkan ID siswa" value={studentId} onChange={(e) => setStudentId(e.target.value)} />
        </label>
        <Button disabled={adding || !studentId.trim()} onClick={handleAdd}>
          {adding ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />} Tambah
        </Button>
      </div>

      <DataTable
        actions={(row) => (
          <Button onClick={() => handleRemove(row.id)} size="sm" variant="ghost">
            <Trash2 className="h-4 w-4" /> Hapus
          </Button>
        )}
        columns={columns}
        data={participants}
        emptyState={{ title: "Belum ada peserta", description: "Tambah peserta dengan memasukkan ID siswa." }}
        getRowId={(row) => row.id}
        loading={loading}
      />
    </div>
  );
}
