"use client";

import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button, ErrorState, Input, PageHeader } from "@nexsmsid/ui";

import { createBrowserApiClient } from "@/lib/api-client";

export default function CreateExamPage() {
  const router = useRouter();
  const client = createBrowserApiClient();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [examTypes, setExamTypes] = useState<any[]>([]);
  const [academicYears, setAcademicYears] = useState<any[]>([]);
  const [loadingRefs, setLoadingRefs] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [typesRes, yearsRes] = await Promise.all([
          client.listExamTypes({ limit: 100 }),
          client.masterDataList("academic-years", { limit: 100 }),
        ]);
        setExamTypes(typesRes.data);
        setAcademicYears(yearsRes.data);
      } catch {
        setError("Gagal memuat data referensi");
      } finally {
        setLoadingRefs(false);
      }
    }
    void load();
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const form = new FormData(e.currentTarget);
    const payload: Record<string, any> = {};
    for (const [key, value] of form.entries()) {
      if (key === "isCbt") { payload[key] = value === "on"; continue; }
      if (["duration", "totalQuestions", "maxScore", "passingScore"].includes(key)) {
        payload[key] = Number(value); continue;
      }
      payload[key] = value;
    }
    try {
      await client.createExam(payload);
      router.push("/admin/exams");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal membuat ujian");
    } finally {
      setSubmitting(false);
    }
  }

  if (loadingRefs) return <div className="py-20 text-center text-sm text-muted-foreground">Memuat data referensi...</div>;

  return (
    <div className="space-y-8">
      <PageHeader
        actions={
          <Button asChild variant="outline">
            <Link href="/admin/exams"><ArrowLeft className="h-4 w-4" /> Kembali</Link>
          </Button>
        }
        breadcrumb={["Admin", "Ujian / CBT", "Buat Ujian"]}
        description="Buat ujian baru dengan mengisi form berikut."
        title="Buat Ujian"
      />

      {error ? <ErrorState message={error} title="Gagal menyimpan" /> : null}

      <form className="max-w-2xl space-y-6" onSubmit={handleSubmit}>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-bold text-slate-700">Tipe Ujian</span>
            <select className="w-full h-11 rounded-2xl border border-input bg-white px-4 text-sm shadow-sm outline-none" name="examTypeId" required>
              <option value="">Pilih tipe</option>
              {examTypes.map((t: any) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </label>
          <label className="space-y-2">
            <span className="text-sm font-bold text-slate-700">Tahun Ajaran</span>
            <select className="w-full h-11 rounded-2xl border border-input bg-white px-4 text-sm shadow-sm outline-none" name="academicYearId" required>
              <option value="">Pilih tahun ajaran</option>
              {academicYears.map((y: any) => <option key={y.id} value={y.id}>{y.name}</option>)}
            </select>
          </label>
          <label className="space-y-2">
            <span className="text-sm font-bold text-slate-700">Kode</span>
            <Input name="code" placeholder="CTH-001" required />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-bold text-slate-700">Nama</span>
            <Input name="name" placeholder="Ujian Tengah Semester" required />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-bold text-slate-700">Durasi (menit)</span>
            <Input name="duration" type="number" placeholder="120" required />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-bold text-slate-700">Total Soal</span>
            <Input name="totalQuestions" type="number" placeholder="40" />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-bold text-slate-700">Skor Maksimal</span>
            <Input name="maxScore" type="number" placeholder="100" />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-bold text-slate-700">Skor Lulus</span>
            <Input name="passingScore" type="number" placeholder="60" />
          </label>
          <label className="flex items-center gap-3 rounded-2xl border bg-white px-4 py-3 text-sm font-bold text-slate-700">
            <input name="isCbt" type="checkbox" defaultChecked />
            Ujian CBT (Berbasis Komputer)
          </label>
        </div>

        <label className="space-y-2">
          <span className="text-sm font-bold text-slate-700">Deskripsi</span>
          <textarea className="w-full min-h-20 rounded-2xl border border-input bg-white px-4 py-3 text-sm shadow-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10" name="description" placeholder="Deskripsi ujian" />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-bold text-slate-700">Instruksi</span>
          <textarea className="w-full min-h-28 rounded-2xl border border-input bg-white px-4 py-3 text-sm shadow-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10" name="instruction" placeholder="Instruksi pengerjaan ujian" />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-bold text-slate-700">Catatan</span>
          <textarea className="w-full min-h-20 rounded-2xl border border-input bg-white px-4 py-3 text-sm shadow-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10" name="notes" placeholder="Catatan internal" />
        </label>

        <div className="flex gap-3">
          <Button asChild variant="outline">
            <Link href="/admin/exams">Batal</Link>
          </Button>
          <Button disabled={submitting} type="submit">
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null} Simpan
          </Button>
        </div>
      </form>
    </div>
  );
}
