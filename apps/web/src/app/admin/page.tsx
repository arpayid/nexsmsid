"use client";

import {
  Activity,
  ArrowUpRight,
  BarChart3,
  BookOpenCheck,
  BriefcaseBusiness,
  Building2,
  CalendarCheck,
  FileText,
  GraduationCap,
  Landmark,
  Newspaper,
  Plus,
  School,
  TrendingUp,
  UsersRound,
  WalletCards
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  ChartCard,
  EmptyState,
  ModuleCard,
  PageHeader,
  StatCard
} from "@nexsmsid/ui";

const studentTrend = [
  { month: "Jan", siswa: 1188 },
  { month: "Feb", siswa: 1204 },
  { month: "Mar", siswa: 1218 },
  { month: "Apr", siswa: 1236 },
  { month: "Mei", siswa: 1260 },
  { month: "Jun", siswa: 1284 }
];

const cashFlow = [
  { month: "Jan", masuk: 118, keluar: 76 },
  { month: "Feb", masuk: 132, keluar: 81 },
  { month: "Mar", masuk: 126, keluar: 79 },
  { month: "Apr", masuk: 149, keluar: 88 },
  { month: "Mei", masuk: 154, keluar: 92 },
  { month: "Jun", masuk: 168, keluar: 96 }
];

const ppdbStages = [
  { label: "Formulir masuk", total: 342, width: "82%" },
  { label: "Berkas diverifikasi", total: 216, width: "58%" },
  { label: "Wawancara terjadwal", total: 128, width: "34%" },
  { label: "Daftar ulang", total: 74, width: "22%" }
];

const activities = [
  { label: "Agenda kelas industri ditambahkan", meta: "10 menit lalu", icon: CalendarCheck },
  { label: "Data pendaftar PPDB diperbarui", meta: "34 menit lalu", icon: Building2 },
  { label: "Ringkasan kas bulan Juni direkap", meta: "1 jam lalu", icon: WalletCards },
  { label: "Draft berita prestasi siswa disiapkan", meta: "2 jam lalu", icon: Newspaper }
];

const modules = [
  { title: "Siswa", description: "Shortcut data siswa aktif dan alumni.", icon: UsersRound, tone: "violet" as const },
  { title: "Guru & Staf", description: "Direktori pendidik dan tenaga kependidikan.", icon: GraduationCap, tone: "blue" as const },
  { title: "Akademik", description: "Kelas, jadwal, kalender, dan operasional KBM.", icon: BookOpenCheck, tone: "cyan" as const },
  { title: "Keuangan", description: "SPP, pembayaran, dan ringkasan arus kas.", icon: Landmark, tone: "emerald" as const },
  { title: "PPDB", description: "Pendaftaran siswa baru dan verifikasi calon siswa.", icon: Building2, tone: "amber" as const },
  { title: "Magang", description: "PKL, mitra industri, dan monitoring pembimbing.", icon: BriefcaseBusiness, tone: "violet" as const },
  { title: "BKK", description: "Bursa kerja khusus, lowongan, dan alumni.", icon: BarChart3, tone: "blue" as const },
  { title: "Website CMS", description: "Berita, agenda, halaman profil, dan publikasi.", icon: Newspaper, tone: "cyan" as const },
  { title: "Laporan", description: "Rekap operasional dan dokumen manajemen.", icon: FileText, tone: "slate" as const }
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        actions={
          <>
            <Button variant="outline">Export Ringkasan</Button>
            <Button>
              <Plus className="h-4 w-4" /> Quick Action
            </Button>
          </>
        }
        breadcrumb={["Admin", "Dashboard"]}
        description="Ringkasan dummy data untuk memvalidasi UI shell NexSMSID. Belum terhubung ke API dan belum membuat modul backend."
        eyebrow="Dashboard Sekolah"
        title="Selamat datang, Admin Sekolah"
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={<UsersRound className="h-5 w-5" />}
          title="Siswa Aktif"
          tone="violet"
          trend={{ label: "dari bulan lalu", value: "+2,4%", variant: "positive" }}
          value="1.284"
        />
        <StatCard
          icon={<GraduationCap className="h-5 w-5" />}
          title="Guru & Staf"
          tone="blue"
          trend={{ label: "pegawai aktif", value: "86", variant: "neutral" }}
          value="86"
        />
        <StatCard
          icon={<WalletCards className="h-5 w-5" />}
          title="Keuangan Bulan Ini"
          tone="emerald"
          trend={{ label: "penerimaan dummy", value: "Rp168 jt", variant: "positive" }}
          value="Rp72 jt"
        />
        <StatCard
          icon={<Building2 className="h-5 w-5" />}
          title="PPDB Pendaftar"
          tone="amber"
          trend={{ label: "gelombang 1", value: "+48", variant: "positive" }}
          value="342"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <ChartCard
          action={<Badge variant="info">6 bulan</Badge>}
          description="Perkembangan siswa aktif berdasarkan dummy data."
          title="Chart Siswa Aktif"
        >
          <div className="h-72">
            <ResponsiveContainer height="100%" width="100%">
              <AreaChart data={studentTrend} margin={{ bottom: 0, left: -18, right: 8, top: 10 }}>
                <defs>
                  <linearGradient id="studentGradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.38} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#e2e8f0" strokeDasharray="4 4" vertical={false} />
                <XAxis axisLine={false} dataKey="month" tickLine={false} tickMargin={12} />
                <YAxis axisLine={false} tickLine={false} tickMargin={12} />
                <Tooltip
                  contentStyle={{ border: "1px solid #e2e8f0", borderRadius: 16, boxShadow: "0 16px 45px rgba(15, 23, 42, 0.08)" }}
                />
                <Area dataKey="siswa" fill="url(#studentGradient)" stroke="#4f46e5" strokeWidth={3} type="monotone" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          action={<Badge variant="success">Rp juta</Badge>}
          description="Penerimaan dan pengeluaran bulanan statis."
          title="Chart Arus Kas"
        >
          <div className="h-72">
            <ResponsiveContainer height="100%" width="100%">
              <BarChart data={cashFlow} margin={{ bottom: 0, left: -18, right: 8, top: 10 }}>
                <CartesianGrid stroke="#e2e8f0" strokeDasharray="4 4" vertical={false} />
                <XAxis axisLine={false} dataKey="month" tickLine={false} tickMargin={12} />
                <YAxis axisLine={false} tickLine={false} tickMargin={12} />
                <Tooltip
                  contentStyle={{ border: "1px solid #e2e8f0", borderRadius: 16, boxShadow: "0 16px 45px rgba(15, 23, 42, 0.08)" }}
                />
                <Bar dataKey="masuk" fill="#4f46e5" name="Masuk" radius={[10, 10, 0, 0]} />
                <Bar dataKey="keluar" fill="#38bdf8" name="Keluar" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardTitle>PPDB Summary</CardTitle>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">Pipeline pendaftaran siswa baru dengan dummy data.</p>
              </div>
              <Badge variant="warning">Gelombang 1</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            {ppdbStages.map((stage) => (
              <div key={stage.label}>
                <div className="mb-2 flex items-center justify-between gap-4 text-sm">
                  <span className="font-bold text-slate-700">{stage.label}</span>
                  <span className="font-black text-slate-950">{stage.total}</span>
                </div>
                <div className="h-2.5 rounded-full bg-slate-100">
                  <div className="h-2.5 rounded-full bg-primary" style={{ width: stage.width }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardTitle>Recent Activity</CardTitle>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">Aktivitas statis untuk memberi rasa dashboard hidup.</p>
              </div>
              <Activity className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activities.map((activity) => {
                const Icon = activity.icon;

                return (
                  <div className="flex items-center gap-4 rounded-2xl border bg-white p-4" key={activity.label}>
                    <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-indigo-50 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-slate-950">{activity.label}</p>
                      <p className="text-xs font-semibold text-muted-foreground">{activity.meta}</p>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-slate-400" />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <section>
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Badge variant="outline">Shortcut Modul</Badge>
            <h2 className="mt-3 text-2xl font-black tracking-tight text-slate-950">Akses cepat operasional sekolah</h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-muted-foreground">
            Kartu ini hanya shortcut UI. Modul detail belum dibuat pada Phase 1.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {modules.map((module) => (
            <ModuleCard
              description={module.description}
              href="#"
              icon={<module.icon className="h-5 w-5" />}
              key={module.title}
              meta="Soon"
              title={module.title}
              tone={module.tone}
            />
          ))}
        </div>
      </section>

      <EmptyState
        action={<Button variant="soft">Tetap di Phase 1</Button>}
        description="Integrasi API, auth, dan modul domain baru akan dikerjakan pada phase berikutnya sesuai roadmap."
        icon={<School className="h-5 w-5" />}
        title="Belum ada koneksi backend untuk dashboard ini"
      />
    </div>
  );
}
