"use client";

import { type FormEvent, useEffect, useMemo, useState } from "react";
import { Archive, Bell, Check, CheckCheck, Loader2, Plus, RefreshCcw } from "lucide-react";

import { Badge, Button, EmptyState, ErrorState, FormModal, Input, LoadingState, PageHeader, SectionCard, cn } from "@nexsmsid/ui";

import { createBrowserApiClient } from "@/lib/api-client";

type NotificationItem = {
  body: string;
  channel?: string;
  createdAt: string;
  id: string;
  status: "UNREAD" | "READ" | "ARCHIVED" | string;
  title: string;
};

type NotificationCenterProps = {
  allowArchive?: boolean;
  allowCreate?: boolean;
  breadcrumb: string[];
  description: string;
  eyebrow: string;
  title: string;
};

export function NotificationCenter({ allowArchive = false, allowCreate = false, breadcrumb, description, eyebrow, title }: NotificationCenterProps) {
  const api = useMemo(() => createBrowserApiClient(), []);
  const [createOpen, setCreateOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [markAllLoading, setMarkAllLoading] = useState(false);
  const [submittingCreate, setSubmittingCreate] = useState(false);
  const [workingId, setWorkingId] = useState<string | null>(null);
  const unreadTotal = items.filter((item) => item.status === "UNREAD").length;

  async function loadData() {
    setError(null);
    setLoading(true);
    try {
      const response = await api.listNotifications({ limit: 50 });
      setItems(response.items as NotificationItem[]);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Gagal memuat notifikasi");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function markRead(id: string) {
    setWorkingId(id);
    setError(null);
    try {
      await api.markNotificationRead(id);
      await loadData();
    } catch (actionError) {
      setError(actionError instanceof Error ? actionError.message : "Gagal menandai notifikasi");
    } finally {
      setWorkingId(null);
    }
  }

  async function markAllRead() {
    setMarkAllLoading(true);
    setError(null);
    try {
      await api.markAllNotificationsRead();
      await loadData();
    } catch (actionError) {
      setError(actionError instanceof Error ? actionError.message : "Gagal menandai semua notifikasi");
    } finally {
      setMarkAllLoading(false);
    }
  }

  async function archive(id: string) {
    setWorkingId(id);
    setError(null);
    try {
      await api.archiveNotification(id);
      await loadData();
    } catch (actionError) {
      setError(actionError instanceof Error ? actionError.message : "Gagal mengarsipkan notifikasi");
    } finally {
      setWorkingId(null);
    }
  }

  async function createNotification(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmittingCreate(true);
    setError(null);
    const formData = new FormData(event.currentTarget);
    const payload = {
      userId: String(formData.get("userId") ?? ""),
      title: String(formData.get("title") ?? ""),
      body: String(formData.get("body") ?? ""),
      channel: String(formData.get("channel") ?? "IN_APP")
    };

    try {
      await api.createNotification(payload);
      setCreateOpen(false);
      await loadData();
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : "Gagal membuat notifikasi");
    } finally {
      setSubmittingCreate(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        actions={(
          <>
            <Button onClick={() => void loadData()} variant="outline"><RefreshCcw className="h-4 w-4" /> Refresh</Button>
            <Button disabled={unreadTotal === 0 || markAllLoading} onClick={() => void markAllRead()} variant="soft">
              {markAllLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCheck className="h-4 w-4" />}
              Tandai semua dibaca
            </Button>
            {allowCreate ? <Button onClick={() => setCreateOpen(true)}><Plus className="h-4 w-4" /> Buat Notifikasi</Button> : null}
          </>
        )}
        breadcrumb={breadcrumb}
        description={description}
        eyebrow={eyebrow}
        title={title}
      />

      {error ? <ErrorState message={error} title="Gagal memproses notifikasi" /> : null}

      <SectionCard
        description={<span><strong>{unreadTotal}</strong> belum dibaca dari <strong>{items.length}</strong> notifikasi terbaru.</span>}
        title="Daftar Notifikasi"
      >
        {loading ? <LoadingState label="Memuat notifikasi..." /> : null}
        {!loading && items.length === 0 ? (
          <EmptyState description="Belum ada notifikasi untuk akun ini." icon={<Bell className="h-5 w-5" />} title="Tidak ada notifikasi" />
        ) : null}
        {!loading && items.length > 0 ? (
          <ul className="space-y-3">
            {items.map((item) => (
              <li
                className={cn(
                  "rounded-2xl border border-slate-100 bg-white p-4 transition-colors",
                  item.status === "UNREAD" && "border-blue-200 bg-blue-50/50"
                )}
                key={item.id}
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="grid h-8 w-8 place-items-center rounded-xl bg-primary/10 text-primary">
                        <Bell className="h-4 w-4" />
                      </span>
                      <p className="font-bold text-slate-950">{item.title}</p>
                      <Badge variant={item.status === "UNREAD" ? "info" : item.status === "ARCHIVED" ? "outline" : "success"}>{item.status}</Badge>
                      {item.channel ? <Badge variant="outline">{item.channel}</Badge> : null}
                    </div>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.body}</p>
                    <p className="mt-3 text-xs font-bold uppercase tracking-[0.16em] text-slate-400">{formatDate(item.createdAt)}</p>
                  </div>
                  <div className="flex shrink-0 flex-wrap gap-2">
                    {item.status === "UNREAD" ? (
                      <Button disabled={workingId === item.id} onClick={() => void markRead(item.id)} size="sm" variant="soft">
                        {workingId === item.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                        Dibaca
                      </Button>
                    ) : null}
                    {allowArchive && item.status !== "ARCHIVED" ? (
                      <Button disabled={workingId === item.id} onClick={() => void archive(item.id)} size="sm" variant="outline">
                        <Archive className="h-4 w-4" /> Arsip
                      </Button>
                    ) : null}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : null}
      </SectionCard>

      <FormModal description="Kirim notifikasi manual ke user tertentu." onClose={() => setCreateOpen(false)} open={createOpen} title="Buat Notifikasi">
        <form className="grid gap-4" onSubmit={createNotification}>
          <label className="space-y-2">
            <span className="text-sm font-bold text-slate-700">Recipient User ID</span>
            <Input name="userId" required />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-bold text-slate-700">Judul</span>
            <Input name="title" required />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-bold text-slate-700">Channel</span>
            <select className="h-11 w-full rounded-xl border border-border bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10" defaultValue="IN_APP" name="channel">
              <option value="IN_APP">IN_APP</option>
              <option value="EMAIL">EMAIL</option>
              <option value="SMS">SMS</option>
              <option value="WHATSAPP">WHATSAPP</option>
            </select>
          </label>
          <label className="space-y-2">
            <span className="text-sm font-bold text-slate-700">Isi Notifikasi</span>
            <textarea className="min-h-28 w-full rounded-xl border border-border bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10" name="body" required />
          </label>
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button onClick={() => setCreateOpen(false)} type="button" variant="outline">Batal</Button>
            <Button disabled={submittingCreate} type="submit">{submittingCreate ? <Loader2 className="h-4 w-4 animate-spin" /> : null} Kirim</Button>
          </div>
        </form>
      </FormModal>
    </div>
  );
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString("id-ID");
}
