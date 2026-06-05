"use client";

import { useEffect, useMemo, useState } from "react";
import { BookOpenCheck, CalendarDays, ClipboardList, GraduationCap, Loader2 } from "lucide-react";

import { Badge, Card, CardContent, CardHeader, CardTitle, EmptyState, ErrorState, PageHeader, SectionCard, StatCard } from "@nexsmsid/ui";

import { createBrowserApiClient } from "@/lib/api-client";

type Summary = {
  teacher: { id: string; name: string; nip: string | null; email: string | null };
  counts: {
    teachingAssignments: number;
    schedules: number;
    attendanceSessionsThisMonth: number;
    assessments: number;
    pendingScores: number;
    unreadNotifications: number;
  };
};

type TeachingAssignment = {
  id: string;
  subject?: { name: string } | null;
  classroom?: { name: string; code: string; competency?: { name: string } | null } | null;
  semester?: { name: string; academicYear?: { name: string } | null } | null;
  isActive: boolean;
};

type Assessment = {
  id: string;
  name: string;
  type: string;
  maxScore: number;
  teachingAssignment?: { subject?: { name: string }; classroom?: { name: string } } | null;
  _count?: { grades: number };
};

type Notification = {
  id: string;
  title: string;
  body: string;
  status: string;
  createdAt: string;
};

const ASSESSMENT_TYPE_LABEL: Record<string, string> = {
  DAILY: "Harian",
  QUIZ: "Kuis",
  MIDTERM: "PTS",
  FINAL: "PAS",
  PROJECT: "Proyek"
};

export default function TeacherDashboardPage() {
  const api = useMemo(() => createBrowserApiClient(), []);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [assignments, setAssignments] = useState<TeachingAssignment[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [s, ta, a, n] = await Promise.all([
          api.getTeacherPortalSummary() as Promise<Summary>,
          api.getTeacherPortalTeachingAssignments() as Promise<TeachingAssignment[]>,
          api.getTeacherPortalAssessments() as Promise<Assessment[]>,
          api.getTeacherPortalNotifications({ limit: 5 }) as Promise<Notification[]>
        ]);
        if (!active) return;
        setSummary(s);
        setAssignments(ta);
        setAssessments(a);
        setNotifications(n);
      } catch (loadError) {
        if (active) {
          setError(loadError instanceof Error ? loadError.message : "Gagal memuat data portal");
        }
      } finally {
        if (active) setLoading(false);
      }
    }
    void load();
    return () => {
      active = false;
    };
  }, [api]);

  if (loading) {
    return (
      <div className="grid min-h-[60vh] place-items-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error} title="Gagal memuat dashboard" />;
  }

  if (!summary) {
    return <EmptyState description="Belum ada data." title="Data masih kosong" />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb={["Portal", "Guru"]}
        description={`Selamat datang, ${summary.teacher.name}. Berikut ringkasan mengajar Anda.`}
        eyebrow="Portal Guru"
        title="Dashboard Guru"
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={<BookOpenCheck className="h-5 w-5" />}
          title="Teaching Assignment"
          tone="violet"
          value={String(summary.counts.teachingAssignments)}
        />
        <StatCard
          icon={<CalendarDays className="h-5 w-5" />}
          title="Jadwal / Minggu"
          tone="blue"
          value={String(summary.counts.schedules)}
        />
        <StatCard
          icon={<ClipboardList className="h-5 w-5" />}
          title="Sesi Presensi Bulan Ini"
          tone="emerald"
          value={String(summary.counts.attendanceSessionsThisMonth)}
        />
        <StatCard
          icon={<GraduationCap className="h-5 w-5" />}
          title="Penilaian Aktif"
          tone="amber"
          value={String(summary.counts.assessments)}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <SectionCard className="lg:col-span-2" description="Mata pelajaran yang Anda ampu semester ini" title="Mata Pelajaran">
          {assignments.length === 0 ? (
            <EmptyState description="Belum ada teaching assignment." title="Belum ada data" />
          ) : (
            <ul className="divide-y divide-slate-100">
              {assignments.map((ta) => (
                <li className="flex flex-wrap items-center justify-between gap-2 py-3" key={ta.id}>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{ta.subject?.name ?? "-"}</p>
                    <p className="text-xs text-muted-foreground">
                      {ta.classroom?.name ?? "-"} {ta.classroom?.code ? `(${ta.classroom.code})` : ""} • {ta.classroom?.competency?.name ?? "-"}
                    </p>
                  </div>
                  <Badge variant={ta.isActive ? "success" : "secondary"}>
                    {ta.semester?.academicYear?.name ?? ta.semester?.name ?? "-"}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>

        <SectionCard description="5 notifikasi terbaru" title="Notifikasi">
          {notifications.length === 0 ? (
            <EmptyState description="Tidak ada notifikasi baru." title="Tidak ada notifikasi" />
          ) : (
            <ul className="space-y-3">
              {notifications.map((n) => (
                <li className="rounded-2xl border border-slate-100 p-3" key={n.id}>
                  <p className="text-sm font-semibold text-slate-900">{n.title}</p>
                  <p className="text-xs text-muted-foreground">{n.body}</p>
                  <p className="mt-1 text-[10px] uppercase tracking-widest text-muted-foreground">
                    {new Date(n.createdAt).toLocaleString("id-ID")}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>
      </div>

      <SectionCard description="Daftar penilaian Anda yang aktif" title="Penilaian">
        {assessments.length === 0 ? (
          <EmptyState description="Belum ada penilaian." title="Belum ada data" />
        ) : (
          <ul className="divide-y divide-slate-100">
            {assessments.map((a) => (
              <li className="flex flex-wrap items-center justify-between gap-2 py-3" key={a.id}>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{a.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {ASSESSMENT_TYPE_LABEL[a.type] ?? a.type} • {a.teachingAssignment?.subject?.name ?? "-"} • {a.teachingAssignment?.classroom?.name ?? "-"}
                  </p>
                </div>
                <Badge variant="info">
                  Nilai {a._count?.grades ?? 0} / Max {a.maxScore}
                </Badge>
              </li>
            ))}
          </ul>
        )}
      </SectionCard>
    </div>
  );
}
