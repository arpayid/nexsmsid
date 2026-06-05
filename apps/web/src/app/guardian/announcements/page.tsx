"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2, Megaphone } from "lucide-react";

import { EmptyState, ErrorState, PageHeader, SectionCard } from "@nexsmsid/ui";

import { createBrowserApiClient } from "@/lib/api-client";

type Announcement = {
  id: string;
  title: string;
  body: string;
  publishedAt: string | null;
  createdBy?: { name: string } | null;
};

export default function GuardianAnnouncementsPage() {
  const api = useMemo(() => createBrowserApiClient(), []);
  const [items, setItems] = useState<Announcement[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = (await api.getGuardianPortalAnnouncements({ limit: 30 })) as Announcement[];
        if (!active) return;
        setItems(data);
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : "Gagal memuat pengumuman");
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
  if (error) return <ErrorState message={error} title="Gagal memuat pengumuman" />;
  if (items.length === 0) return <EmptyState description="Belum ada pengumuman." title="Belum ada pengumuman" />;

  return (
    <div className="space-y-6">
      <PageHeader breadcrumb={["Portal Wali", "Pengumuman"]} description="Pengumuman resmi sekolah" eyebrow="Portal Wali" title="Pengumuman" />
      <SectionCard description={`${items.length} pengumuman`} title="Daftar Pengumuman">
        <ul className="space-y-3">
          {items.map((a) => (
            <li className="rounded-2xl border border-slate-100 p-4" key={a.id}>
              <p className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                <Megaphone className="h-4 w-4 text-primary" /> {a.title}
              </p>
              <p className="mt-1 whitespace-pre-line text-xs text-slate-700">{a.body}</p>
              <p className="mt-2 text-[10px] uppercase tracking-widest text-muted-foreground">
                {a.publishedAt ? new Date(a.publishedAt).toLocaleString("id-ID") : "Belum dipublikasikan"} • {a.createdBy?.name ?? "-"}
              </p>
            </li>
          ))}
        </ul>
      </SectionCard>
    </div>
  );
}
