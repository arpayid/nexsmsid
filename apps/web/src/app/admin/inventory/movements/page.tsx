"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { AlertCircle, Plus, RefreshCcw, Search, Loader2 } from "lucide-react";

import { Button, Card, CardContent, CardHeader, CardTitle, EmptyState, Input, PageHeader, StatusBadge } from "@nexsmsid/ui";
import { createBrowserApiClient } from "@/lib/api-client";

export default function InventoryMovementsPage() {
  const api = useMemo(() => createBrowserApiClient(), []);
  const [items, setItems] = useState<any[]>([]);
  const [inventoryItems, setInventoryItems] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function loadReferenceData() {
    try {
      const [itRes, locRes] = await Promise.all([
        api.getInventoryItems({ limit: 500 }),
        api.getInventoryLocations()
      ]);
      setInventoryItems((itRes as any).data || []);
      setLocations(locRes);
    } catch { /* ignore */ }
  }

  async function loadData() {
    setError(null);
    setLoading(true);
    try {
      const response = await api.getInventoryMovements({ limit: 50, page: 1, search: search || undefined });
      setItems((response as any).data || []);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Gagal memuat mutasi barang");
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

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    const formData = new FormData(event.currentTarget);

    const payload: Record<string, any> = {
      itemId: formData.get("itemId"),
      type: formData.get("type"),
      quantity: Number(formData.get("quantity") || 1),
      fromLocationId: formData.get("fromLocationId") || undefined,
      toLocationId: formData.get("toLocationId") || undefined,
      note: formData.get("note") || undefined
    };

    try {
      await api.createInventoryMovement(payload);
      setFormOpen(false);
      await loadData();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Gagal menyimpan mutasi barang");
    } finally {
      setSubmitting(false);
    }
  }

  const MOVEMENT_TYPE_MAP: Record<string, any> = {
    IN: { label: "Barang Masuk", variant: "success" },
    OUT: { label: "Barang Keluar", variant: "warning" },
    TRANSFER: { label: "Pindah Lokasi", variant: "info" },
    DISPOSE: { label: "Afkir/Dibuang", variant: "outline" },
    MAINTENANCE: { label: "Pemeliharaan", variant: "secondary" },
    RETURN: { label: "Pengembalian", variant: "success" }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        actions={
          <>
            <Button onClick={loadData} variant="outline"><RefreshCcw className="h-4 w-4" /> Refresh</Button>
            <Button onClick={() => setFormOpen(true)}><Plus className="h-4 w-4" /> Tambah Mutasi</Button>
          </>
        }
        breadcrumb={["Admin", "Inventaris", "Mutasi Barang"]}
        description="Pencatatan pergerakan barang, transfer lokasi, masuk dan keluar."
        eyebrow="Phase 12.3 Sarpras"
        title="Mutasi Barang"
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
              <CardTitle>Riwayat Mutasi</CardTitle>
            </div>
            <form className="flex w-full flex-col gap-3 lg:w-auto lg:flex-row lg:items-center" onSubmit={handleSearch}>
              <div className="relative w-full lg:max-w-sm">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input className="pl-11" onChange={(event) => setSearch(event.target.value)} placeholder="Cari mutasi..." value={search} />
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
                    <th className="px-4 py-3 font-black">Waktu</th>
                    <th className="px-4 py-3 font-black">Barang</th>
                    <th className="px-4 py-3 font-black">Jenis</th>
                    <th className="px-4 py-3 font-black">Qty</th>
                    <th className="px-4 py-3 font-black">Lokasi Asal</th>
                    <th className="px-4 py-3 font-black">Lokasi Tujuan</th>
                    <th className="px-4 py-3 font-black">Petugas</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr className="border-b last:border-0" key={item.id}>
                      <td className="px-4 py-4 font-semibold text-slate-700">{new Date(item.performedAt).toLocaleString("id-ID")}</td>
                      <td className="px-4 py-4 font-semibold text-slate-700">{item.item?.name ?? "-"}</td>
                      <td className="px-4 py-4"><StatusBadge map={MOVEMENT_TYPE_MAP} value={item.type} /></td>
                      <td className="px-4 py-4 font-semibold text-slate-700">{item.quantity}</td>
                      <td className="px-4 py-4 font-semibold text-slate-700">{item.fromLocation?.name ?? "-"}</td>
                      <td className="px-4 py-4 font-semibold text-slate-700">{item.toLocation?.name ?? "-"}</td>
                      <td className="px-4 py-4 font-semibold text-slate-700">{item.performedBy?.name ?? "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState
              action={<Button onClick={() => setFormOpen(true)} variant="soft">Tambah mutasi pertama</Button>}
              description="Belum ada riwayat mutasi barang."
              title="Data masih kosong"
            />
          )}
        </CardContent>
      </Card>

      {formOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
          <Card className="w-full max-w-xl">
            <CardHeader>
              <CardTitle>Catat Mutasi / Transfer Barang</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="grid gap-4" onSubmit={handleSubmit}>
                <label className="space-y-2">
                  <span className="text-sm font-bold text-slate-700">Pilih Barang</span>
                  <select className="w-full rounded-2xl border border-input bg-white px-4 py-2 text-sm shadow-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                    name="itemId" required>
                    <option value="" disabled>Pilih Barang</option>
                    {inventoryItems.map((c) => <option key={c.id} value={c.id}>{c.name} ({c.code}) - Stok: {c.quantity}</option>)}
                  </select>
                </label>
                
                <div className="grid grid-cols-2 gap-4">
                  <label className="space-y-2">
                    <span className="text-sm font-bold text-slate-700">Jenis Mutasi</span>
                    <select className="w-full rounded-2xl border border-input bg-white px-4 py-2 text-sm shadow-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                      name="type" required>
                      <option value="IN">Barang Masuk (IN)</option>
                      <option value="OUT">Barang Keluar (OUT)</option>
                      <option value="TRANSFER">Pindah Lokasi (TRANSFER)</option>
                      <option value="DISPOSE">Afkir (DISPOSE)</option>
                    </select>
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm font-bold text-slate-700">Kuantitas</span>
                    <Input defaultValue="1" name="quantity" type="number" min="1" required />
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <label className="space-y-2">
                    <span className="text-sm font-bold text-slate-700">Dari Lokasi</span>
                    <select className="w-full rounded-2xl border border-input bg-white px-4 py-2 text-sm shadow-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                      name="fromLocationId">
                      <option value="">(Tidak Ada / Sesuai Barang)</option>
                      {locations.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
                    </select>
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm font-bold text-slate-700">Ke Lokasi</span>
                    <select className="w-full rounded-2xl border border-input bg-white px-4 py-2 text-sm shadow-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                      name="toLocationId">
                      <option value="">(Tidak Ada)</option>
                      {locations.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
                    </select>
                  </label>
                </div>

                <label className="space-y-2">
                  <span className="text-sm font-bold text-slate-700">Catatan Mutasi</span>
                  <textarea className="w-full rounded-2xl border border-input bg-white px-4 py-2 text-sm shadow-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                    name="note" rows={2} />
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
