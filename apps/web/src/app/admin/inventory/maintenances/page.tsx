"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { AlertCircle, Edit3, Plus, RefreshCcw, Search, Trash2, Loader2, PlayCircle, CheckCircle2, XCircle } from "lucide-react";

import { Button, Card, CardContent, CardHeader, CardTitle, EmptyState, Input, PageHeader, StatusBadge } from "@nexsmsid/ui";
import { createBrowserApiClient } from "@/lib/api-client";

export default function InventoryMaintenancesPage() {
  const api = useMemo(() => createBrowserApiClient(), []);
  const [items, setItems] = useState<any[]>([]);
  const [inventoryItems, setInventoryItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function loadReferenceData() {
    try {
      const itRes = await api.getInventoryItems({ limit: 500 });
      setInventoryItems((itRes as any).data || []);
    } catch { /* ignore */ }
  }

  async function loadData() {
    setError(null);
    setLoading(true);
    try {
      const response = await api.getInventoryMaintenances({ limit: 50, page: 1, search: search || undefined });
      setItems((response as any).data || []);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Gagal memuat data pemeliharaan");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadReferenceData();
    void loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await loadData();
  }

  function openCreate() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(item: any) {
    setEditing(item);
    setFormOpen(true);
  }

  async function handleDelete(item: any) {
    if (!window.confirm("Hapus data pemeliharaan ini?")) return;
    setError(null);
    try {
      await api.deleteInventoryMaintenance(item.id);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menghapus");
    }
  }

  async function handleAction(item: any, actionType: "start" | "complete" | "cancel") {
    if (!window.confirm(`Yakin ingin melakukan aksi: ${actionType}?`)) return;
    setError(null);
    try {
      if (actionType === "start") await api.startInventoryMaintenance(item.id);
      if (actionType === "complete") await api.completeInventoryMaintenance(item.id);
      if (actionType === "cancel") await api.cancelInventoryMaintenance(item.id);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : `Gagal melakukan aksi ${actionType}`);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    const formData = new FormData(event.currentTarget);

    const payload: Record<string, any> = {
      itemId: formData.get("itemId"),
      title: formData.get("title"),
      description: formData.get("description") || undefined,
      scheduledAt: formData.get("scheduledAt") ? new Date(formData.get("scheduledAt") as string).toISOString() : undefined,
      cost: formData.get("cost") ? Number(formData.get("cost")) : undefined,
      vendor: formData.get("vendor") || undefined
    };

    try {
      if (editing) {
        await api.updateInventoryMaintenance(editing.id, payload);
      } else {
        await api.createInventoryMaintenance(payload);
      }
      setFormOpen(false);
      setEditing(null);
      await loadData();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Gagal menyimpan pemeliharaan");
    } finally {
      setSubmitting(false);
    }
  }

  const MAINT_STATUS_MAP: Record<string, any> = {
    SCHEDULED: { label: "Terjadwal", variant: "outline" },
    IN_PROGRESS: { label: "Sedang Berjalan", variant: "warning" },
    COMPLETED: { label: "Selesai", variant: "success" },
    CANCELLED: { label: "Dibatalkan", variant: "secondary" }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        actions={
          <>
            <Button onClick={loadData} variant="outline"><RefreshCcw className="h-4 w-4" /> Refresh</Button>
            <Button onClick={openCreate}><Plus className="h-4 w-4" /> Jadwalkan Pemeliharaan</Button>
          </>
        }
        breadcrumb={["Admin", "Inventaris", "Pemeliharaan"]}
        description="Jadwal servis, pemeliharaan rutin, dan catatan biaya."
        eyebrow="Phase 12.3 Sarpras"
        title="Pemeliharaan Barang"
      />

      {error ? (
        <div className="flex items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
          <AlertCircle className="h-5 w-5" /> {error}
        </div>
      ) : null}

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <CardTitle>Riwayat Pemeliharaan</CardTitle>
            </div>
            <form className="flex w-full flex-col gap-3 lg:w-auto lg:flex-row lg:items-center" onSubmit={handleSearch}>
              <div className="relative w-full lg:max-w-sm">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input className="pl-11" onChange={(event) => setSearch(event.target.value)} placeholder="Cari tiket..." value={search} />
              </div>
              <Button type="submit" variant="soft">Cari</Button>
            </form>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="grid min-h-48 place-items-center rounded-3xl border border-dashed bg-slate-50 text-sm font-bold text-slate-600">
              <span className="inline-flex items-center gap-2"><Loader2 className="h-5 w-5 animate-spin text-primary" /> Memuat data...</span>
            </div>
          ) : items.length ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead>
                  <tr className="border-b text-xs uppercase tracking-[0.14em] text-muted-foreground">
                    <th className="px-4 py-3 font-black">Jadwal</th>
                    <th className="px-4 py-3 font-black">Tiket / Judul</th>
                    <th className="px-4 py-3 font-black">Barang</th>
                    <th className="px-4 py-3 font-black">Vendor/Biaya</th>
                    <th className="px-4 py-3 font-black">Status</th>
                    <th className="px-4 py-3 text-right font-black">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr className="border-b last:border-0" key={item.id}>
                      <td className="px-4 py-4 font-semibold text-slate-700">{item.scheduledAt ? new Date(item.scheduledAt).toLocaleDateString("id-ID") : "-"}</td>
                      <td className="px-4 py-4 font-semibold text-slate-700">{item.title}</td>
                      <td className="px-4 py-4 font-semibold text-slate-700">{item.item?.name ?? "-"}</td>
                      <td className="px-4 py-4 font-semibold text-slate-700">
                        {item.vendor || "-"}<br/>
                        <span className="text-muted-foreground font-normal">Rp {Number(item.cost ?? 0).toLocaleString("id-ID")}</span>
                      </td>
                      <td className="px-4 py-4"><StatusBadge map={MAINT_STATUS_MAP} value={item.status} /></td>
                      <td className="px-4 py-4">
                        <div className="flex justify-end gap-2">
                          {item.status === "SCHEDULED" ? (
                            <>
                              <Button onClick={() => handleAction(item, "start")} size="sm" variant="soft" aria-label="Mulai"><PlayCircle className="h-4 w-4" /></Button>
                              <Button onClick={() => openEdit(item)} size="sm" variant="outline" aria-label="Edit"><Edit3 className="h-4 w-4" /></Button>
                              <Button onClick={() => handleAction(item, "cancel")} size="sm" variant="ghost" aria-label="Batal"><XCircle className="h-4 w-4" /></Button>
                            </>
                          ) : item.status === "IN_PROGRESS" ? (
                            <Button onClick={() => handleAction(item, "complete")} size="sm" variant="soft" aria-label="Selesai"><CheckCircle2 className="h-4 w-4" /></Button>
                          ) : null}
                          <Button onClick={() => handleDelete(item)} size="sm" variant="ghost" aria-label="Hapus"><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState
              action={<Button onClick={openCreate} variant="soft">Jadwalkan pemeliharaan pertama</Button>}
              description="Belum ada data pemeliharaan."
              title="Data masih kosong"
            />
          )}
        </CardContent>
      </Card>

      {formOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
          <Card className="w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>{editing ? "Edit" : "Jadwalkan"} Pemeliharaan</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="grid gap-4" onSubmit={handleSubmit}>
                <label className="space-y-2">
                  <span className="text-sm font-bold text-slate-700">Pilih Barang</span>
                  <select className="w-full rounded-2xl border border-input bg-white px-4 py-2 text-sm shadow-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                    defaultValue={editing?.itemId ?? ""} name="itemId" required>
                    <option value="" disabled>Pilih Barang</option>
                    {inventoryItems.map((c) => <option key={c.id} value={c.id}>{c.name} ({c.code})</option>)}
                  </select>
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-bold text-slate-700">Judul / Pekerjaan</span>
                  <Input defaultValue={editing?.title ?? ""} name="title" required />
                </label>
                
                <div className="grid grid-cols-2 gap-4">
                  <label className="space-y-2">
                    <span className="text-sm font-bold text-slate-700">Tanggal Terjadwal</span>
                    <Input defaultValue={editing?.scheduledAt ? new Date(editing.scheduledAt).toISOString().split("T")[0] : ""} name="scheduledAt" type="date" required />
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm font-bold text-slate-700">Estimasi Biaya</span>
                    <Input defaultValue={editing?.cost ?? ""} name="cost" type="number" min="0" />
                  </label>
                </div>

                <label className="space-y-2">
                  <span className="text-sm font-bold text-slate-700">Vendor / Teknisi</span>
                  <Input defaultValue={editing?.vendor ?? ""} name="vendor" />
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-bold text-slate-700">Deskripsi Pekerjaan</span>
                  <textarea className="w-full rounded-2xl border border-input bg-white px-4 py-2 text-sm shadow-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                    defaultValue={editing?.description ?? ""} name="description" rows={3} />
                </label>

                <div className="flex gap-3 justify-end mt-4">
                  <Button onClick={() => setFormOpen(false)} type="button" variant="outline">Batal</Button>
                  <Button disabled={submitting} type="submit">
                    {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null} Simpan
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      ) : null}
    </div>
  );
}
