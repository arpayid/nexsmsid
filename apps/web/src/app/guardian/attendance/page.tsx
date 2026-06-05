"use client";

import { useEffect, useMemo, useState } from "react";
import { ClipboardCheck, Loader2 } from "lucide-react";

import { Badge, EmptyState, ErrorState, PageHeader, SectionCard } from "@nexsmsid/ui";

import { ChildSelector } from "@/components/child-selector";
import { createBrowserApiClient } from "@/lib/api-client";

type Attendance = {
  status: string;
  note?: string | null;
  session: {
    id: string;
    date: string;
    startTime: string;
    endTime: string;
    topic?: string | null;
    schedule?: { teachingAssignment?: { subject?: { name: string } } | null; lessonHour?: { name: string } | null } | null;
  };
};

const STATUS_LABEL: Record<string, string> = { PRESENT: "Hadir", ABSENT: "Alpha", LATE: "Terlambat", PERMIT: "Izin", SICK: "Sakit" };
const STATUS_VARIANT: Record<string, "success" | "outline" | "warning" | "secondary" | "outline"> = {
  PRESENT: "success",
  ABSENT: "outline",
  LATE: "warning",
  PERMIT: "secondary",
  SICK: "outline"
};

export default function GuardianAttendancePage() {
  const api = useMemo(() => createBrowserApiClient(), []);
  const [childId, setChildId] = useState<string | null>(null);
  const [items, setItems] = useState<Attendance[]>([]);
  const [summary, setSummary] = useState<Record<string, number>>({});
  const [total, setTotal] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!childId) return;
    let active = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = (await api.getGuardianPortalChildAttendance(childId as string, { limit: 50 })) as {
          summary: Record<string, number>;
          total: number;
          records: Attendance[];
        };
        if (!active) return;
        setItems(data.records);
        setSummary(data.summary);
        setTotal(data.total);
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : "Gagal memuat presensi");
      } finally {
        if (active) setLoading(false);
      }
    }
    void load();
    return () => {
      active = false;
    };
  }, [api, childId]);

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb={["Portal Wali", "Presensi"]}
        description="Riwayat presensi anak yang Anda pilih"
        eyebrow="Portal Wali"
        title="Presensi Anak"
      />
      <ChildSelector onChange={setChildId} />
      {!childId ? (
        <EmptyState description="Pilih anak terlebih dahulu." title="Pilih anak" />
      ) : loading ? (
        <div className="grid min-h-[40vh] place-items-center">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : error ? (
        <ErrorState message={error} title="Gagal memuat presensi" />
      ) : items.length === 0 ? (
        <EmptyState description="Belum ada data presensi untuk anak ini." title="Belum ada presensi" />
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-5">
            {Object.keys(STATUS_LABEL).map((key) => (
              <div className="rounded-2xl border border-slate-100 bg-white p-4 text-center" key={key}>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">{STATUS_LABEL[key]}</p>
                <p className="mt-2 text-2xl font-bold text-slate-900">{summary[key] ?? 0}</p>
              </div>
            ))}
          </div>
          <SectionCard description={`${total} catatan`} title="Riwayat Presensi">
            <ul className="divide-y divide-slate-100">
              {items.map((r) => (
                <li className="flex flex-wrap items-center justify-between gap-3 py-3" key={r.session.id}>
                  <div>
                    <p className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                      <ClipboardCheck className="h-4 w-4 text-primary" />
                      {r.session.schedule?.teachingAssignment?.subject?.name ?? "-"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(r.session.date).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })} • {r.session.startTime}–{r.session.endTime}
                    </p>
                    {r.note ? <p className="mt-1 text-xs text-slate-600">Catatan: {r.note}</p> : null}
                  </div>
                  <Badge variant={STATUS_VARIANT[r.status] ?? "secondary"}>{STATUS_LABEL[r.status] ?? r.status}</Badge>
                </li>
              ))}
            </ul>
          </SectionCard>
        </>
      )}
    </div>
  );
}
