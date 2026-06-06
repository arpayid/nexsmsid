"use client";

import { ArrowLeft, Loader2, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import type { ExamScheduleRecord, ExamRoomRecord } from "@nexsmsid/api-client";
import { Button, DataTable, ErrorState, PageHeader } from "@nexsmsid/ui";
import type { DataTableColumn } from "@nexsmsid/ui";

import { createBrowserApiClient } from "@/lib/api-client";

export default function ExamSchedulePage() {
  const { id } = useParams<{ id: string }>();
  const client = createBrowserApiClient();
  const [schedules, setSchedules] = useState<ExamScheduleRecord[]>([]);
  const [rooms, setRooms] = useState<ExamRoomRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const [sched, roomRes] = await Promise.all([
        client.listExamSchedules(id),
        client.listExamRooms({ limit: 100 }),
      ]);
      setSchedules(sched);
      setRooms(roomRes.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat jadwal");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void load(); }, [id]);

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    const form = new FormData(e.currentTarget);
    const payload: Record<string, any> = {};
    for (const [key, value] of form.entries()) {
      payload[key] = value;
    }
    try {
      await client.createExamSchedule(id, payload);
      setShowForm(false);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal membuat jadwal");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(scheduleId: string) {
    try {
      await client.deleteExamSchedule(scheduleId);
      await load();
    } catch {
      setError("Gagal menghapus jadwal");
    }
  }

  const columns: DataTableColumn<ExamScheduleRecord>[] = [
    { header: "Tanggal", key: "date", cell: (row) => new Date(row.date).toLocaleDateString("id-ID") },
    { header: "Mulai", key: "startTime" },
    { header: "Selesai", key: "endTime" },
    { header: "Ruangan", key: "room", cell: (row) => row.room?.name ?? "-" },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        actions={
          <Button asChild variant="outline">
            <Link href={`/admin/exams/${id}`}><ArrowLeft className="h-4 w-4" /> Kembali</Link>
          </Button>
        }
        breadcrumb={["Admin", "Ujian / CBT", "Jadwal"]}
        description="Kelola jadwal pelaksanaan ujian."
        title="Jadwal Ujian"
      />

      {error ? <ErrorState message={error} title="Gagal" /> : null}

      <Button onClick={() => setShowForm(!showForm)}>
        <Plus className="h-4 w-4" /> Tambah Jadwal
      </Button>

      {showForm ? (
        <form className="max-w-lg rounded-3xl border border-border bg-white p-6 space-y-4" onSubmit={handleCreate}>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-bold text-slate-700">Tanggal</span>
              <input className="w-full h-11 rounded-2xl border border-input bg-white px-4 text-sm shadow-sm outline-none" name="date" type="date" required />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-bold text-slate-700">Ruangan</span>
              <select className="w-full h-11 rounded-2xl border border-input bg-white px-4 text-sm shadow-sm outline-none" name="roomId">
                <option value="">Pilih ruangan</option>
                {rooms.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
              </select>
            </label>
            <label className="space-y-2">
              <span className="text-sm font-bold text-slate-700">Mulai</span>
              <input className="w-full h-11 rounded-2xl border border-input bg-white px-4 text-sm shadow-sm outline-none" name="startTime" type="time" required />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-bold text-slate-700">Selesai</span>
              <input className="w-full h-11 rounded-2xl border border-input bg-white px-4 text-sm shadow-sm outline-none" name="endTime" type="time" required />
            </label>
          </div>
          <div className="flex gap-3">
            <Button disabled={submitting} type="submit">
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null} Simpan
            </Button>
            <Button onClick={() => setShowForm(false)} type="button" variant="outline">Batal</Button>
          </div>
        </form>
      ) : null}

      <DataTable
        actions={(row) => (
          <Button onClick={() => handleDelete(row.id)} size="sm" variant="ghost">
            <Trash2 className="h-4 w-4" /> Hapus
          </Button>
        )}
        columns={columns}
        data={schedules}
        emptyState={{ title: "Belum ada jadwal", description: "Tambah jadwal untuk ujian ini." }}
        getRowId={(row) => row.id}
        loading={loading}
      />
    </div>
  );
}
