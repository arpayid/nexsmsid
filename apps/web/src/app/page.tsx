import {
  ArrowRight,
  BarChart3,
  BookOpenCheck,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  CheckCircle2,
  GraduationCap,
  Landmark,
  LayoutDashboard,
  Megaphone,
  Newspaper,
  Rocket,
  School,
  ShieldCheck,
  Sparkles,
  UsersRound
} from "lucide-react";
import Link from "next/link";

import { Badge, Button, Card, CardContent, CardHeader, CardTitle, ModuleCard, StatCard } from "@nexsmsid/ui";

const schoolStats = [
  { label: "Siswa Aktif", value: "1.284", description: "lintas tingkat X, XI, XII" },
  { label: "Guru & Staf", value: "86", description: "pendidik dan tenaga kependidikan" },
  { label: "Program Keahlian", value: "6", description: "jurusan siap industri" },
  { label: "Mitra Industri", value: "42", description: "untuk PKL dan rekrutmen" }
];

const schoolStatIcons = [
  <UsersRound className="h-5 w-5" key="students" />,
  <GraduationCap className="h-5 w-5" key="teachers" />,
  <Building2 className="h-5 w-5" key="programs" />,
  <ShieldCheck className="h-5 w-5" key="partners" />
];

const schoolStatTones = ["violet", "blue", "emerald", "amber"] as const;

const features = [
  {
    title: "Akademik Terpadu",
    description: "Rancang jadwal, pantau kelas, dan siapkan operasional akademik dari satu shell dashboard.",
    icon: BookOpenCheck,
    tone: "violet" as const
  },
  {
    title: "PPDB Lebih Rapi",
    description: "Tampilkan alur pendaftaran yang jelas untuk calon siswa tanpa membuat modul backend dulu.",
    icon: Megaphone,
    tone: "blue" as const
  },
  {
    title: "Keuangan Sekolah",
    description: "Visualisasi ringkas untuk arus kas, tagihan, dan penerimaan bulanan secara statis.",
    icon: Landmark,
    tone: "emerald" as const
  },
  {
    title: "BKK dan Magang",
    description: "Siapkan shortcut untuk PKL, mitra industri, alumni, dan bursa kerja khusus SMK.",
    icon: BriefcaseBusiness,
    tone: "amber" as const
  }
];

const programs = [
  "Rekayasa Perangkat Lunak",
  "Teknik Komputer dan Jaringan",
  "Desain Komunikasi Visual",
  "Akuntansi dan Keuangan",
  "Bisnis Digital",
  "Teknik Kendaraan Ringan"
];

const agenda = [
  {
    type: "Berita",
    title: "Kolaborasi Industri untuk Kelas XI",
    date: "12 Juni 2026",
    description: "Sesi kelas tamu dan simulasi project bersama mitra industri lokal."
  },
  {
    type: "Agenda",
    title: "Tryout PPDB Gelombang 1",
    date: "18 Juni 2026",
    description: "Calon siswa dapat mengikuti simulasi seleksi dan konsultasi jurusan."
  },
  {
    type: "Pengumuman",
    title: "Pameran Karya Siswa Produktif",
    date: "24 Juni 2026",
    description: "Showcase project RPL, DKV, TKJ, dan program keahlian lainnya."
  }
];

export default function Home() {
  return (
    <main className="overflow-hidden">
      <header className="sticky top-0 z-40 border-b border-white/70 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link className="flex items-center gap-3" href="/">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-soft">
              <School className="h-5 w-5" />
            </span>
            <span>
              <span className="block text-lg font-black tracking-tight text-slate-950">NexSMSID</span>
              <span className="hidden text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground sm:block">
                School OS
              </span>
            </span>
          </Link>
          <nav className="hidden items-center gap-7 text-sm font-bold text-slate-600 lg:flex">
            <a className="hover:text-primary" href="#fitur">Fitur</a>
            <a className="hover:text-primary" href="#jurusan">Jurusan</a>
            <a className="hover:text-primary" href="#ppdb">PPDB</a>
            <a className="hover:text-primary" href="#agenda">Agenda</a>
          </nav>
          <div className="flex items-center gap-2">
            <Button asChild className="hidden sm:inline-flex" variant="ghost">
              <Link href="/admin">Dashboard</Link>
            </Button>
            <Button asChild size="sm">
              <a href="#ppdb">Daftar PPDB</a>
            </Button>
          </div>
        </div>
      </header>

      <section className="relative px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="absolute inset-x-0 top-0 -z-10 h-[42rem] bg-grid-soft opacity-60" />
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <Badge className="mb-6" variant="secondary">
              <Sparkles className="mr-2 h-3.5 w-3.5" /> UI Shell Phase 1
            </Badge>
            <h1 className="max-w-4xl text-5xl font-black tracking-[-0.06em] text-slate-950 sm:text-6xl lg:text-7xl">
              Website sekolah dan dashboard operasional dalam satu sistem modern.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
              NexSMSID menyiapkan tampilan publik untuk sekolah/SMK dan dashboard admin SaaS-style dengan
              tema violet-blue yang bersih, responsif, dan siap dikembangkan ke fase berikutnya.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/admin">
                  Lihat Dashboard <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href="#fitur">Jelajahi Fitur</a>
              </Button>
            </div>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {["Mobile-first", "Tanpa API dulu", "Dummy data"].map((item) => (
                <div className="flex items-center gap-2 text-sm font-bold text-slate-600" key={item}>
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <Card className="relative overflow-hidden border-white/80 bg-white/90 p-4 shadow-soft">
            <div className="absolute right-8 top-8 h-24 w-24 rounded-full bg-blue-400/20 blur-3xl" />
            <div className="rounded-3xl bg-slate-950 p-4 text-white shadow-2xl">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-200">Dashboard</p>
                  <h2 className="mt-1 text-xl font-black">SMK Nusantara</h2>
                </div>
                <LayoutDashboard className="h-6 w-6 text-indigo-200" />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-sm text-slate-300">Siswa Aktif</p>
                  <p className="mt-3 text-3xl font-black">1.284</p>
                </div>
                <div className="rounded-2xl bg-indigo-500 p-4">
                  <p className="text-sm text-indigo-100">PPDB Baru</p>
                  <p className="mt-3 text-3xl font-black">342</p>
                </div>
              </div>
              <div className="mt-4 rounded-2xl bg-white p-4 text-slate-950">
                <div className="mb-4 flex items-center justify-between">
                  <p className="font-bold">Aktivitas terbaru</p>
                  <Badge variant="info">Live shell</Badge>
                </div>
                {[
                  "Agenda kelas industri dipublikasikan",
                  "Gelombang PPDB masuk tahap verifikasi",
                  "Laporan kas bulanan siap direview"
                ].map((item) => (
                  <div className="flex items-center gap-3 border-t py-3 text-sm font-semibold" key={item}>
                    <span className="h-2.5 w-2.5 rounded-full bg-primary" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </section>

      <section className="px-4 pb-14 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {schoolStats.map((stat, index) => (
            <StatCard
              description={stat.description}
              icon={schoolStatIcons[index]}
              key={stat.label}
              title={stat.label}
              tone={schoolStatTones[index]}
              value={stat.value}
            />
          ))}
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8" id="fitur">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <Badge variant="outline">Fitur Utama</Badge>
            <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              Shell siap untuk operasional sekolah modern.
            </h2>
            <p className="mt-4 leading-7 text-muted-foreground">
              Bagian ini masih statis dan memakai dummy data, tetapi struktur visualnya sudah siap untuk integrasi API pada fase berikutnya.
            </p>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <ModuleCard
                description={feature.description}
                icon={<feature.icon className="h-5 w-5" />}
                key={feature.title}
                title={feature.title}
                tone={feature.tone}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white/70 px-4 py-16 sm:px-6 lg:px-8" id="jurusan">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div>
            <Badge variant="secondary">Program Keahlian</Badge>
            <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              Profil jurusan dibuat menonjol untuk calon siswa.
            </h2>
            <p className="mt-4 leading-7 text-muted-foreground">
              Homepage menampilkan program keahlian sebagai entry point PPDB, website sekolah, dan komunikasi publik.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {programs.map((program, index) => (
              <Card className="p-5" key={program}>
                <div className="flex items-center gap-4">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-indigo-50 font-black text-primary">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-bold text-slate-950">{program}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">Kurikulum siap dunia kerja</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8" id="ppdb">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-slate-950 p-8 text-white shadow-soft sm:p-10 lg:p-12">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <Badge className="border-white/10 bg-white/10 text-white">PPDB 2026</Badge>
              <h2 className="mt-5 text-3xl font-black tracking-tight sm:text-5xl">
                Buka pendaftaran siswa baru dengan CTA yang jelas.
              </h2>
              <p className="mt-5 max-w-2xl leading-8 text-slate-300">
                CTA PPDB disiapkan untuk landing page publik. Integrasi formulir dan backend belum dibuat pada Phase 1.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button size="lg" variant="secondary">Mulai Pendaftaran</Button>
                <Button size="lg" variant="ghost" className="text-white hover:bg-white/10 hover:text-white">
                  Download Brosur
                </Button>
              </div>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/10 p-6">
              {[
                ["Gelombang 1", "Sedang berjalan", "78%"],
                ["Verifikasi Berkas", "Dalam proses", "62%"],
                ["Kuota Terisi", "342 dari 520", "66%"]
              ].map(([label, status, width]) => (
                <div className="border-b border-white/10 py-5 last:border-0" key={label}>
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-bold">{label}</p>
                      <p className="text-sm text-slate-300">{status}</p>
                    </div>
                    <span className="font-black">{width}</span>
                  </div>
                  <div className="mt-4 h-2 rounded-full bg-white/10">
                    <div className="h-2 rounded-full bg-blue-400" style={{ width }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8" id="agenda">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <Badge variant="outline">Berita & Agenda</Badge>
              <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                Preview konten website sekolah.
              </h2>
            </div>
            <Button variant="outline">Lihat Semua</Button>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {agenda.map((item) => (
              <Card className="overflow-hidden" key={item.title}>
                <CardHeader>
                  <div className="mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-indigo-50 text-primary">
                    {item.type === "Berita" ? <Newspaper className="h-6 w-6" /> : <CalendarDays className="h-6 w-6" />}
                  </div>
                  <Badge variant="secondary">{item.type}</Badge>
                  <CardTitle>{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm font-bold text-primary">{item.date}</p>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t bg-white/80 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p className="font-semibold">NexSMSID Phase 1 UI Shell</p>
          <p className="flex items-center gap-2">
            <Rocket className="h-4 w-4 text-primary" /> Siap dilanjutkan ke integrasi API pada phase berikutnya.
          </p>
        </div>
      </footer>
    </main>
  );
}
