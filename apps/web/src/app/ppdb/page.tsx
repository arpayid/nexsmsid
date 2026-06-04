import { ArrowRight, CheckCircle2, FileText, GraduationCap, School } from "lucide-react";
import Link from "next/link";

import { Badge, Button, Card } from "@nexsmsid/ui";

export default function PpdbLandingPage() {
  return (
    <main className="overflow-hidden">
      <section className="relative px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="absolute inset-x-0 top-0 -z-10 h-[42rem] bg-grid-soft opacity-60" />
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <Badge className="mb-6" variant="secondary">
              <GraduationCap className="mr-2 h-3.5 w-3.5" /> PPDB Online
            </Badge>
            <h1 className="text-5xl font-black tracking-[-0.06em] text-slate-950 sm:text-6xl lg:text-7xl">
              Penerimaan Peserta Didik Baru
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Selamat datang di PPDB Online. Proses pendaftaran siswa baru dilakukan secara daring.
              Lengkapi data diri, pilih jurusan, dan upload dokumen persyaratan untuk mendaftar.
            </p>
            <div className="mt-10 flex justify-center">
              <Button asChild size="lg">
                <Link href="/ppdb/register">
                  Daftar Sekarang <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="mt-20 grid gap-6 md:grid-cols-3">
            <Card className="p-6 text-center">
              <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-violet-50">
                <FileText className="h-6 w-6 text-violet-600" />
              </div>
              <h3 className="font-bold text-slate-950">Isi Data Diri</h3>
              <p className="mt-2 text-sm text-muted-foreground">Lengkapi data pribadi dan pilih jurusan yang diminati.</p>
            </Card>
            <Card className="p-6 text-center">
              <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-blue-50">
                <School className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-bold text-slate-950">Upload Dokumen</h3>
              <p className="mt-2 text-sm text-muted-foreground">Unggah dokumen persyaratan untuk verifikasi berkas.</p>
            </Card>
            <Card className="p-6 text-center">
              <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-emerald-50">
                <CheckCircle2 className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="font-bold text-slate-950">Konfirmasi</h3>
              <p className="mt-2 text-sm text-muted-foreground">Pantau status pendaftaran dan terima hasil seleksi.</p>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}
