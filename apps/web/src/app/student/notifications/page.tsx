"use client";

import { useEffect, useMemo, useState } from "react";
import { Bell, Loader2 } from "lucide-react";

import { Badge, EmptyState, ErrorState, PageHeader, SectionCard } from "@nexsmsid/ui";

import { createBrowserApiClient } from "@/lib/api-client";

type Notification = { id: string; title: string; body: string; status: string; createdAt: string };

export default function StudentNotificationsPage() {
  const api = useMemo(() => createBrowserApiClient(), []);
  const [items, setItems] = useState<Notification[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = (await api.getStudentPortalNotifications({ limit: 50 })) as Notification[];
        if (!active) return;
        setItems(data);
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : "Gagal memuat notifikasi");
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
  if (error) return <ErrorState message={error} title="Gagal memuat notifikasi" />;
  if (items.length === 0) return <EmptyState description="Belum ada notifikasi." title="Tidak ada notifikasi" />;

  return (
    <div className="space-y-6">
      <PageHeader breadcrumb={["Portal Siswa", "Notifikasi"]} description="Pemberitahuan untuk Anda" eyebrow="Portal Siswa" title="Notifikasi" />
      <SectionCard description={`${items.length} notifikasi`} title="Daftar Notifikasi">
        <ul className="space-y-3">
          {items.map((n) => (
            <li className="rounded-2xl border border-slate-100 p-4" key={n.id}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                    <Bell className="h-4 w-4 text-primary" /> {n.title}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">{n.body}</p>
                </div>
                <Badge variant={n.status === "UNREAD" ? "info" : "outline"}>{n.status}</Badge>
              </div>
              <p className="mt-2 text-[10px] uppercase tracking-widest text-muted-foreground">
                {new Date(n.createdAt).toLocaleString("id-ID")}
              </p>
            </li>
          ))}
        </ul>
      </SectionCard>
    </div>
  );
}
