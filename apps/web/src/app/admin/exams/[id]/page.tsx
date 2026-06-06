"use client";

import { ArrowLeft, Calendar, Clock, Edit3, FileText, Layers, Loader2, Users } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import type { ExamRecord } from "@nexsmsid/api-client";
import { Badge, Button, Card, CardContent, CardHeader, CardTitle, ErrorState, PageHeader, StatusBadge } from "@nexsmsid/ui";

import { createBrowserApiClient } from "@/lib/api-client";

export default function ExamDetailPage() {
  const { id } = useParams<{ id: string }>();
  const client = createBrowserApiClient();
  const [exam, setExam] = useState<ExamRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await client.getExam(id);
        setExam(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Gagal memuat detail ujian");
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, [id]);

  if (loading) return <div className="py-20 text-center text-sm text-muted-foreground">Memuat detail ujian...</div>;
  if (error || !exam) return <ErrorState message={error ?? "Data tidak ditemukan"} title="Gagal memuat" />;

  const info = [
    { label: "Kode", value: exam.code },
    { label: "Nama", value: exam.name },
    { label: "Tipe", value: exam.examType?.name ?? "-" },
    { label: "Durasi", value: `${exam.duration} menit` },
    { label: "Total Soal", value: String(exam.totalQuestions ?? "-") },
    { label: "Skor Maksimal", value: String(exam.maxScore ?? "-") },
    { label: "Skor Lulus", value: String(exam.passingScore ?? "-") },
    { label: "CBT", value: exam.isCbt ? "Ya" : "Tidak" },
    { label: "Status", value: <StatusBadge value={exam.status} /> },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        actions={
          <Button asChild variant="outline">
            <Link href="/admin/exams"><ArrowLeft className="h-4 w-4" /> Kembali</Link>
          </Button>
        }
        breadcrumb={["Admin", "Ujian / CBT", exam.code]}
        description={exam.description ?? "Detail ujian"}
        title={exam.name}
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {info.map((item) => (
          <Card key={item.label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{item.label}</CardTitle>
            </CardHeader>
            <CardContent><span className="text-lg font-bold">{item.value}</span></CardContent>
          </Card>
        ))}
      </div>

      {exam.instruction ? (
        <Card>
          <CardHeader><CardTitle>Instruksi</CardTitle></CardHeader>
          <CardContent><p className="text-sm leading-7 text-slate-700 whitespace-pre-wrap">{exam.instruction}</p></CardContent>
        </Card>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Button asChild className="h-24 flex-col gap-2" variant="outline">
          <Link href={`/admin/exams/${id}/schedule`}><Calendar className="h-6 w-6" /> Jadwal ({exam.schedules?.length ?? 0})</Link>
        </Button>
        <Button asChild className="h-24 flex-col gap-2" variant="outline">
          <Link href={`/admin/exams/${id}/participants`}><Users className="h-6 w-6" /> Peserta ({exam._count?.participants ?? 0})</Link>
        </Button>
        <Button asChild className="h-24 flex-col gap-2" variant="outline">
          <Link href={`/admin/exams/${id}/questions`}><FileText className="h-6 w-6" /> Soal ({exam._count?.questions ?? 0})</Link>
        </Button>
        <Button asChild className="h-24 flex-col gap-2" variant="outline">
          <Link href={`/admin/exams/${id}/results`}><Layers className="h-6 w-6" /> Hasil</Link>
        </Button>
      </div>

      <div className="flex gap-3">
        <Button asChild variant="outline">
          <Link href={`/admin/exams/${id}/edit`}><Edit3 className="h-4 w-4" /> Edit Ujian</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href={`/admin/exams/${id}/sessions`}><Clock className="h-4 w-4" /> Sesi Ujian</Link>
        </Button>
      </div>
    </div>
  );
}
