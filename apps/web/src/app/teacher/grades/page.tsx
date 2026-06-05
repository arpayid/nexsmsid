"use client";

import { useEffect, useMemo, useState } from "react";
import { GraduationCap, Loader2 } from "lucide-react";

import { Badge, EmptyState, ErrorState, PageHeader, SectionCard } from "@nexsmsid/ui";

import { createBrowserApiClient } from "@/lib/api-client";

type Assessment = {
  id: string;
  name: string;
  type: string;
  maxScore: number;
  weight: number;
  date: string;
  teachingAssignment?: { subject?: { name: string }; classroom?: { name: string } } | null;
  _count?: { grades: number };
};

const TYPE_LABEL: Record<string, string> = {
  DAILY: "Harian",
  QUIZ: "Kuis",
  MIDTERM: "PTS",
  FINAL: "PAS",
  PROJECT: "Proyek"
};

export default function TeacherGradesPage() {
  const api = useMemo(() => createBrowserApiClient(), []);
  const [items, setItems] = useState<Assessment[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = (await api.getTeacherPortalAssessments()) as Assessment[];
        if (!active) return;
        setItems(data);
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : "Gagal memuat penilaian");
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
  if (error) return <ErrorState message={error} title="Gagal memuat penilaian" />;
  if (items.length === 0) return <EmptyState description="Belum ada penilaian." title="Belum ada data" />;

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb={["Portal Guru", "Penilaian"]}
        description="Daftar penilaian aktif"
        eyebrow="Portal Guru"
        title="Penilaian Saya"
      />
      <SectionCard description={`${items.length} penilaian`} title="Daftar Penilaian">
        <ul className="divide-y divide-slate-100">
          {items.map((a) => (
            <li className="flex flex-wrap items-center justify-between gap-3 py-3" key={a.id}>
              <div>
                <p className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                  <GraduationCap className="h-4 w-4 text-primary" />
                  {a.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {TYPE_LABEL[a.type] ?? a.type} • {a.teachingAssignment?.subject?.name ?? "-"} •{" "}
                  {a.teachingAssignment?.classroom?.name ?? "-"} •{" "}
                  {new Date(a.date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="info">Bobot {a.weight}</Badge>
                <Badge variant="secondary">Max {a.maxScore}</Badge>
                <Badge variant="outline">{a._count?.grades ?? 0} nilai</Badge>
              </div>
            </li>
          ))}
        </ul>
      </SectionCard>
    </div>
  );
}
