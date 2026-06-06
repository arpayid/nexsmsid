"use client";

import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import type { ExamRecord } from "@nexsmsid/api-client";
import { Button, ErrorState, Input, PageHeader } from "@nexsmsid/ui";

import { createBrowserApiClient } from "@/lib/api-client";

export default function EditExamPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const client = createBrowserApiClient();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [exam, setExam] = useState<ExamRecord | null>(null);
  const [examTypes, setExamTypes] = useState<any[]>([]);
  const [academicYears, setAcademicYears] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [examData, typesRes, yearsRes] = await Promise.all([
          client.getExam(id),
          client.listExamTypes({ limit: 100 }),
          client.masterDataList("academic-years", { limit: 100 }),
        ]);
        setExam(examData);
        setExamTypes(typesRes.data);
        setAcademicYears(yearsRes.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Gagal memuat data");
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, [id]);

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
      await client.updateExam(id, payload);
      router.push(`/admin/exams/${id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memperbarui ujian");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <div className="py-20 text-center text-sm text-muted-foreground">Memuat data...</div>;
  if (!exam) return <ErrorState message="Data tidak ditemukan" title="Gagal memuat" />;

  return (
    <div className="space-y-8">
      <PageHeader
        actions={
          <Button asChild variant="outline">
            <Link href={`/admin/exams/${id}`}><ArrowLeft className="h-4 w-4" /> Kembali</Link>
          </Button>
        }
        breadcrumb={["Admin", "Ujian / CBT", exam.code, "Edit"]}
        description="Perbarui data ujian."
        title={`Edit ${exam.name}`}
      />

      {error ? <ErrorState message={error} title="Gagal menyimpan" /> : null}

      <form className="max-w-2xl space-y-6" onSubmit={handleSubmit}>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-bold text-slate-700">Tipe Ujian</span>
            <select className="w-full h-11 rounded-2xl border border-input bg-white px-4 text-sm shadow-sm outline-none" name="examTypeId" required defaultValue={exam.examTypeId}>
              <option value="">Pilih tipe</option>
              {examTypes.map((t: any) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </label>
          <label className="space-y-2">
            <span className="text-sm font-bold text-slate-700">Tahun Ajaran</span>
            <select className="w-full h-11 rounded-2xl border border-input bg-white px-4 text-sm shadow-sm outline-none" name="academicYearId" required defaultValue={exam.academicYearId}>
              <option value="">Pilih tahun ajaran</option>
              {academicYears.map((y: any) => <option key={y.id} value={y.id}>{y.name}</option>)}
            </select>
          </label>
          <label className="space-y-2">
            <span className="text-sm font-bold text-slate-700">Kode</span>
            <Input name="code" defaultValue={exam.code} required />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-bold text-slate-700">Nama</span>
            <Input name="name" defaultValue={exam.name} required />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-bold text-slate-700">Durasi (menit)</span>
            <Input name="duration" type="number" defaultValue={exam.duration} required />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-bold text-slate-700">Total Soal</span>
            <Input name="totalQuestions" type="number" defaultValue={exam.totalQuestions ?? ""} />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-bold text-slate-700">Skor Maksimal</span>
            <Input name="maxScore" type="number" defaultValue={exam.maxScore ?? ""} />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-bold text-slate-700">Skor Lulus</span>
            <Input name="passingScore" type="number" defaultValue={exam.passingScore ?? ""} />
          </label>
          <label className="flex items-center gap-3 rounded-2xl border bg-white px-4 py-3 text-sm font-bold text-slate-700">
            <input name="isCbt" type="checkbox" defaultChecked={exam.isCbt} />
            Ujian CBT (Berbasis Komputer)
          </label>
        </div>

        <label className="space-y-2">
          <span className="text-sm font-bold text-slate-700">Deskripsi</span>
          <textarea className="w-full min-h-20 rounded-2xl border border-input bg-white px-4 py-3 text-sm shadow-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10" name="description" defaultValue={exam.description ?? ""} />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-bold text-slate-700">Instruksi</span>
          <textarea className="w-full min-h-28 rounded-2xl border border-input bg-white px-4 py-3 text-sm shadow-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10" name="instruction" defaultValue={exam.instruction ?? ""} />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-bold text-slate-700">Catatan</span>
          <textarea className="w-full min-h-20 rounded-2xl border border-input bg-white px-4 py-3 text-sm shadow-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10" name="notes" defaultValue={exam.notes ?? ""} />
        </label>

        <div className="flex gap-3">
          <Button asChild variant="outline">
            <Link href={`/admin/exams/${id}`}>Batal</Link>
          </Button>
          <Button disabled={submitting} type="submit">
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null} Simpan
          </Button>
        </div>
      </form>
    </div>
  );
}
