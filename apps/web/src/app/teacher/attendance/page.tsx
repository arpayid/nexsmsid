"use client";

import { useEffect, useMemo, useState } from "react";
import { ClipboardCheck, Loader2 } from "lucide-react";

import { Badge, EmptyState, ErrorState, PageHeader, SectionCard, StatusBadge } from "@nexsmsid/ui";

import { createBrowserApiClient } from "@/lib/api-client";

type AttendanceSession = {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  topic: string | null;
  status: string;
  teachingAssignment?: {
    subject?: { name: string } | null;
    classroom?: { name: string } | null;
  } | null;
  _count?: { records: number };
};

const ATTENDANCE_SESSION_LABEL: Record<string, { label: string }> = {
  DRAFT: { label: "Draft" },
  SUBMITTED: { label: "Dikirim" },
  LOCKED: { label: "Terkunci" }
};

export default function TeacherAttendancePage() {
  const api = useMemo(() => createBrowserApiClient(), []);
  const [items, setItems] = useState<AttendanceSession[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = (await api.getTeacherPortalAttendanceSessions({ limit: 50 })) as AttendanceSession[];
        if (!active) return;
        setItems(data);
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : "Gagal memuat presensi");
      } finally {
        if (active) setLoading(false);
      }
    }
    void load();
    return () => {
      active = false;
    };
  }, [api]);

  if (loading)
    return (
      <div className="grid min-h-[60vh] place-items-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  if (error) return <ErrorState message={error} title="Gagal memuat presensi" />;
  if (items.length === 0) return <EmptyState description="Belum ada sesi presensi." title="Belum ada data" />;

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb={["Portal Guru", "Presensi"]}
        description="Daftar sesi presensi yang Anda buat"
        eyebrow="Portal Guru"
        title="Presensi Saya"
      />
      <SectionCard description={`${items.length} sesi terakhir`} title="Sesi Presensi">
        <ul className="divide-y divide-slate-100">
          {items.map((s) => (
            <li className="flex flex-wrap items-center justify-between gap-3 py-3" key={s.id}>
              <div>
                <p className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                  <ClipboardCheck className="h-4 w-4 text-primary" />
                  {s.teachingAssignment?.subject?.name ?? "-"} • {s.teachingAssignment?.classroom?.name ?? "-"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(s.date).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })} •{" "}
                  {s.startTime}–{s.endTime}
                </p>
                {s.topic ? <p className="mt-1 text-xs text-slate-600">Topik: {s.topic}</p> : null}
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="info">{s._count?.records ?? 0} siswa</Badge>
                <StatusBadge map={ATTENDANCE_SESSION_LABEL} value={s.status} />
              </div>
            </li>
          ))}
        </ul>
      </SectionCard>
    </div>
  );
}
