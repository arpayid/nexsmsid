"use client";

import { ArrowLeft, Loader2, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import type { ExamQuestionRecord } from "@nexsmsid/api-client";
import { Button, DataTable, ErrorState, Input, PageHeader } from "@nexsmsid/ui";
import type { DataTableColumn } from "@nexsmsid/ui";

import { createBrowserApiClient } from "@/lib/api-client";

export default function ExamQuestionsPage() {
  const { id } = useParams<{ id: string }>();
  const client = createBrowserApiClient();
  const [questions, setQuestions] = useState<ExamQuestionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const data = await client.listExamQuestions(id);
      setQuestions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat soal");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void load(); }, [id]);

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    const form = new FormData(e.currentTarget);
    const payload: Record<string, any> = {};
    for (const [key, value] of form.entries()) {
      if (key === "score") { payload[key] = Number(value); continue; }
      if (key === "number") { payload[key] = Number(value); continue; }
      payload[key] = value;
    }
    try {
      await client.addExamQuestion(id, payload);
      setShowForm(false);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menambah soal");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(questionId: string) {
    try {
      await client.deleteExamQuestion(questionId);
      await load();
    } catch {
      setError("Gagal menghapus soal");
    }
  }

  const columns: DataTableColumn<ExamQuestionRecord>[] = [
    { header: "No", key: "number" },
    { header: "Tipe", key: "type", cell: (row) => row.type.replace(/_/g, " ") },
    { header: "Konten", key: "content", cell: (row) => <span className="max-w-xs truncate block">{row.content}</span> },
    { header: "Jawaban", key: "correctAnswer", cell: (row) => row.correctAnswer ?? "-" },
    { header: "Skor", key: "score" },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        actions={
          <Button asChild variant="outline">
            <Link href={`/admin/exams/${id}`}><ArrowLeft className="h-4 w-4" /> Kembali</Link>
          </Button>
        }
        breadcrumb={["Admin", "Ujian / CBT", "Soal"]}
        description="Kelola soal ujian."
        title="Soal Ujian"
      />

      {error ? <ErrorState message={error} title="Gagal" /> : null}

      <Button onClick={() => setShowForm(!showForm)}>
        <Plus className="h-4 w-4" /> Tambah Soal
      </Button>

      {showForm ? (
        <form className="max-w-xl rounded-3xl border border-border bg-white p-6 space-y-4" onSubmit={handleCreate}>
          <div className="grid gap-4 sm:grid-cols-3">
            <label className="space-y-2">
              <span className="text-sm font-bold text-slate-700">No</span>
              <Input name="number" type="number" placeholder="1" required />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-bold text-slate-700">Tipe</span>
              <select className="w-full h-11 rounded-2xl border border-input bg-white px-4 text-sm shadow-sm outline-none" name="type" required>
                <option value="MULTIPLE_CHOICE">Multiple Choice</option>
                <option value="ESSAY">Essay</option>
                <option value="TRUE_FALSE">True/False</option>
                <option value="MATCHING">Matching</option>
                <option value="SHORT_ANSWER">Short Answer</option>
              </select>
            </label>
            <label className="space-y-2">
              <span className="text-sm font-bold text-slate-700">Skor</span>
              <Input name="score" type="number" placeholder="5" required />
            </label>
          </div>
          <label className="space-y-2">
            <span className="text-sm font-bold text-slate-700">Konten Soal</span>
            <textarea className="w-full min-h-24 rounded-2xl border border-input bg-white px-4 py-3 text-sm shadow-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10" name="content" required placeholder="Tulis soal di sini..." />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-bold text-slate-700">Jawaban Benar</span>
            <Input name="correctAnswer" placeholder="A / Benar / ..." />
          </label>
          <div className="flex gap-3">
            <Button disabled={submitting} type="submit">
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null} Simpan
            </Button>
            <Button onClick={() => setShowForm(false)} type="button" variant="outline">Batal</Button>
          </div>
        </form>
      ) : null}

      <DataTable
        actions={(row) => (
          <Button onClick={() => handleDelete(row.id)} size="sm" variant="ghost">
            <Trash2 className="h-4 w-4" /> Hapus
          </Button>
        )}
        columns={columns}
        data={questions}
        emptyState={{ title: "Belum ada soal", description: "Tambah soal untuk ujian ini." }}
        getRowId={(row) => row.id}
        loading={loading}
        minWidth="min-w-[800px]"
      />
    </div>
  );
}
