"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { Button, DataTable, ErrorState, PageHeader } from "@nexsmsid/ui";
import type { DataTableColumn } from "@nexsmsid/ui";

import { createBrowserApiClient } from "@/lib/api-client";

export default function ExamResultsPage() {
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const client = createBrowserApiClient();
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const params: Record<string, string> = {};
        const page = searchParams.get("page");
        if (page) params.page = page;
        const res = await client.listExamResults(id, params);
        setResults(res.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Gagal memuat hasil");
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, [id, searchParams]);

  const columns: DataTableColumn<any>[] = [
    { header: "Peserta", key: "participant", cell: (row) => row.participantName ?? row.participantId ?? "-" },
    { header: "Soal", key: "questionNumber", cell: (row) => row.questionNumber ?? row.questionId ?? "-" },
    { header: "Jawaban", key: "answer", cell: (row) => row.answer ?? "-" },
    { header: "Skor", key: "score", cell: (row) => row.score ?? "-" },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        actions={
          <Button asChild variant="outline">
            <Link href={`/admin/exams/${id}`}><ArrowLeft className="h-4 w-4" /> Kembali</Link>
          </Button>
        }
        breadcrumb={["Admin", "Ujian / CBT", "Hasil"]}
        description="Lihat hasil ujian peserta."
        title="Hasil Ujian"
      />

      {error ? <ErrorState message={error} title="Gagal" /> : null}

      <DataTable
        columns={columns}
        data={results}
        emptyState={{ title: "Belum ada hasil", description: "Hasil akan muncul setelah peserta mengerjakan ujian." }}
        getRowId={(row, i) => row.id ?? `row-${i}`}
        loading={loading}
        minWidth="min-w-[700px]"
      />
    </div>
  );
}
