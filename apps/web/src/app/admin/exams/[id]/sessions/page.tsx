"use client";

import { ArrowLeft, Loader2, Play, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import type { ExamScheduleRecord, ExamSessionRecord } from "@nexsmsid/api-client";
import { Button, Card, CardContent, CardHeader, CardTitle, DataTable, ErrorState, PageHeader, StatusBadge } from "@nexsmsid/ui";
import type { DataTableColumn } from "@nexsmsid/ui";

import { createBrowserApiClient } from "@/lib/api-client";

export default function ExamSessionsPage() {
  const { id } = useParams<{ id: string }>();
  const client = createBrowserApiClient();
  const [schedules, setSchedules] = useState<ExamScheduleRecord[]>([]);
  const [sessionsMap, setSessionsMap] = useState<Record<string, ExamSessionRecord[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creatingFor, setCreatingFor] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const sched = await client.listExamSchedules(id);
      setSchedules(sched);
      const map: Record<string, ExamSessionRecord[]> = {};
      await Promise.all(sched.map(async (s: ExamScheduleRecord) => {
        try {
          map[s.id] = await client.listExamSessions(s.id);
        } catch { map[s.id] = []; }
      }));
      setSessionsMap(map);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat sesi");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void load(); }, [id]);

  async function handleCreate(scheduleId: string) {
    setSubmitting(true);
    try {
      await client.createExamSession(scheduleId, {});
      setCreatingFor(null);
      await load();
    } catch {
      setError("Gagal membuat sesi");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleUpdateStatus(sessionId: string, status: string) {
    try {
      await client.updateExamSessionStatus(sessionId, status);
      await load();
    } catch {
      setError("Gagal memperbarui status sesi");
    }
  }

  if (loading) return <div className="py-20 text-center text-muted-foreground">Memuat sesi...</div>;

  const sessionCols: DataTableColumn<ExamSessionRecord>[] = [
    { header: "Kode", key: "code" },
    { header: "Nama", key: "name", cell: (row) => row.name ?? "-" },
    { header: "Status", key: "status", cell: (row) => <StatusBadge value={row.status} /> },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        actions={
          <Button asChild variant="outline">
            <Link href={`/admin/exams/${id}`}><ArrowLeft className="h-4 w-4" /> Kembali</Link>
          </Button>
        }
        breadcrumb={["Admin", "Ujian / CBT", "Sesi"]}
        description="Kelola sesi untuk setiap jadwal."
        title="Sesi Ujian"
      />

      {error ? <ErrorState message={error} title="Gagal" /> : null}

      <div className="space-y-6">
        {schedules.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">Belum ada jadwal. Buat jadwal terlebih dahulu.</CardContent>
          </Card>
        ) : schedules.map((sched) => {
          const sessions = sessionsMap[sched.id] ?? [];
          return (
            <Card key={sched.id}>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>{new Date(sched.date).toLocaleDateString("id-ID")} - {sched.startTime} s.d {sched.endTime}</CardTitle>
                  <p className="text-sm text-muted-foreground">{sched.room?.name ?? "Tanpa ruangan"}</p>
                </div>
                <Button disabled={submitting} onClick={() => handleCreate(sched.id)} size="sm">
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null} Buat Sesi
                </Button>
              </CardHeader>
              <CardContent>
                {sessions.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Belum ada sesi untuk jadwal ini.</p>
                ) : (
                  <DataTable
                    actions={(row) => (
                      <div className="flex gap-2">
                        {row.status === "PENDING" ? (
                          <Button onClick={() => handleUpdateStatus(row.id, "ACTIVE")} size="sm" variant="outline">
                            <Play className="h-4 w-4" /> Mulai
                          </Button>
                        ) : null}
                        {row.status === "ACTIVE" ? (
                          <Button onClick={() => handleUpdateStatus(row.id, "COMPLETED")} size="sm" variant="outline">
                            <CheckCircle2 className="h-4 w-4" /> Selesai
                          </Button>
                        ) : null}
                      </div>
                    )}
                    columns={sessionCols}
                    data={sessions}
                    getRowId={(r) => r.id}
                    minWidth="min-w-[500px]"
                  />
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
