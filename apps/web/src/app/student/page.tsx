"use client";

import { useEffect, useMemo, useState } from "react";
import { Bell, ClipboardCheck, GraduationCap, Loader2, School, Wallet } from "lucide-react";

import { Badge, Card, CardContent, CardHeader, CardTitle, EmptyState, ErrorState, PageHeader, SectionCard, StatCard } from "@nexsmsid/ui";

import { createBrowserApiClient } from "@/lib/api-client";

type Summary = {
  student: { id: string; nis: string; nisn: string | null; name: string; classroom: { id: string; name: string; code: string } | null; competency: string | null };
  counts: {
    attendanceThisMonth: Record<string, number>;
    totalSessionsThisMonth: number;
    approvedGradeCount: number;
    averageScore: number;
    outstandingInvoices: number;
    outstandingAmount: number;
    unreadNotifications: number;
  };
};

type Notification = { id: string; title: string; body: string; status: string; createdAt: string };
type Announcement = { id: string; title: string; body: string; publishedAt: string | null; createdBy?: { name: string } | null };

const formatRupiah = (value: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);

export default function StudentDashboardPage() {
  const api = useMemo(() => createBrowserApiClient(), []);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [s, a, n] = await Promise.all([
          api.getStudentPortalSummary() as Promise<Summary>,
          api.getStudentPortalAnnouncements({ limit: 3 }) as Promise<Announcement[]>,
          api.getStudentPortalNotifications({ limit: 5 }) as Promise<Notification[]>
        ]);
        if (!active) return;
        setSummary(s);
        setAnnouncements(a);
        setNotifications(n);
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : "Gagal memuat data portal");
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
  if (error) return <ErrorState message={error} title="Gagal memuat dashboard" />;
  if (!summary) return <EmptyState description="Belum ada data." title="Data masih kosong" />;

  const att = summary.counts.attendanceThisMonth;
  const hadir = (att.PRESENT ?? 0) + (att.LATE ?? 0);

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb={["Portal Siswa"]}
        description={`Halo ${summary.student.name} (${summary.student.nis}). Tetap semangat belajar!`}
        eyebrow="Portal Siswa"
        title="Beranda Siswa"
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <School className="h-4 w-4 text-primary" /> Identitas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 text-sm">
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Nama</p>
              <p className="font-semibold">{summary.student.name}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">NIS / NISN</p>
              <p className="font-semibold">{summary.student.nis} / {summary.student.nisn ?? "-"}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Kelas</p>
              <p className="font-semibold">{summary.student.classroom?.name ?? "-"}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Kompetensi</p>
              <p className="font-semibold">{summary.student.competency ?? "-"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={<ClipboardCheck className="h-5 w-5" />}
          title="Hadir Bulan Ini"
          tone="emerald"
          value={`${hadir}/${summary.counts.totalSessionsThisMonth}`}
        />
        <StatCard
          icon={<GraduationCap className="h-5 w-5" />}
          title="Rata-rata Nilai"
          tone="violet"
          value={String(summary.counts.averageScore || 0)}
        />
        <StatCard
          icon={<Wallet className="h-5 w-5" />}
          title="Tagihan Aktif"
          tone="amber"
          value={String(summary.counts.outstandingInvoices)}
        />
        <StatCard
          icon={<Bell className="h-5 w-5" />}
          title="Notifikasi Belum Dibaca"
          tone="blue"
          value={String(summary.counts.unreadNotifications)}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard description="Pengumuman terbaru sekolah" title="Pengumuman">
          {announcements.length === 0 ? (
            <EmptyState description="Belum ada pengumuman." title="Tidak ada pengumuman" />
          ) : (
            <ul className="space-y-3">
              {announcements.map((a) => (
                <li className="rounded-2xl border border-slate-100 p-3" key={a.id}>
                  <p className="text-sm font-semibold text-slate-900">{a.title}</p>
                  <p className="text-xs text-muted-foreground line-clamp-2">{a.body}</p>
                  <p className="mt-1 text-[10px] uppercase tracking-widest text-muted-foreground">
                    {a.publishedAt ? new Date(a.publishedAt).toLocaleDateString("id-ID") : "Draft"} • {a.createdBy?.name ?? "-"}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>

        <SectionCard description="Notifikasi terbaru untuk Anda" title="Notifikasi">
          {notifications.length === 0 ? (
            <EmptyState description="Belum ada notifikasi." title="Tidak ada notifikasi" />
          ) : (
            <ul className="space-y-3">
              {notifications.map((n) => (
                <li className="rounded-2xl border border-slate-100 p-3" key={n.id}>
                  <p className="text-sm font-semibold text-slate-900">{n.title}</p>
                  <p className="text-xs text-muted-foreground line-clamp-2">{n.body}</p>
                  <p className="mt-1 text-[10px] uppercase tracking-widest text-muted-foreground">
                    {new Date(n.createdAt).toLocaleString("id-ID")}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>
      </div>
    </div>
  );
}
