"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { AlertCircle, Edit3, Loader2, Plus, Printer, RefreshCcw, Search, Trash2 } from "lucide-react";

import { Button, Card, CardContent, CardHeader, CardTitle, EmptyState, Input, PageHeader, StatusBadge, SectionCard } from "@nexsmsid/ui";
import { createBrowserApiClient } from "@/lib/api-client";

export default function InventoryItemsPage() {
  const api = useMemo(() => createBrowserApiClient(), []);
  const [items, setItems] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [printingId, setPrintingId] = useState<string | null>(null);

  async function loadReferenceData() {
    try {
      const [catRes, locRes] = await Promise.all([
        api.getInventoryCategories(),
        api.getInventoryLocations()
      ]);
      setCategories(catRes);
      setLocations(locRes);
    } catch { /* ignore reference load errors */ }
  }

  async function loadData() {
    setError(null);
    setLoading(true);
    try {
      const response = await api.getInventoryItems({ limit: 50, page: 1, search: search || undefined });
      setItems(response.data);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Gagal memuat data barang");
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
    const confirmed = window.confirm("Hapus barang ini? Tindakan ini tidak dapat dibatalkan.");
    if (!confirmed) return;
    setError(null);
    try {
      await api.deleteInventoryItem(item.id);
      await loadData();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Gagal menghapus barang");
    }
  }

  async function handlePrint(item: any) {
    setError(null);
    setPrintingId(item.id);
    try {
      await api.downloadInventoryItemPdf(item.id);
    } catch (printError) {
      setError(printError instanceof Error ? printError.message : "Gagal membuat PDF barang");
    } finally {
      setPrintingId(null);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    const formData = new FormData(event.currentTarget);

    const payload: Record<string, any> = {
      code: formData.get("code"),
      name: formData.get("name"),
      categoryId: formData.get("categoryId"),
      locationId: formData.get("locationId") || undefined,
      type: formData.get("type"),
      quantity: Number(formData.get("quantity") || 0),
      minStock: formData.get("minStock") ? Number(formData.get("minStock")) : undefined,
      unit: formData.get("unit") || undefined,
      status: formData.get("status") || "ACTIVE",
      condition: formData.get("condition") || "GOOD",
      brand: formData.get("brand") || undefined,
      model: formData.get("model") || undefined,
      supplier: formData.get("supplier") || undefined,
      purchasePrice: formData.get("purchasePrice") ? Number(formData.get("purchasePrice")) : undefined,
      purchaseDate: formData.get("purchaseDate") || undefined
    };

    try {
      if (editing) {
        await api.updateInventoryItem(editing.id, payload);
      } else {
        await api.createInventoryItem(payload);
      }
      setFormOpen(false);
      setEditing(null);
      await loadData();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Gagal menyimpan barang");
    } finally {
      setSubmitting(false);
    }
  }

  const ITEM_STATUS_MAP: Record<string, any> = {
    ACTIVE: { label: "Aktif", variant: "success" },
    MAINTENANCE: { label: "Perbaikan", variant: "warning" },
    BORROWED: { label: "Dipinjam", variant: "info" },
    DISPOSED: { label: "Dihapus/Afkir", variant: "secondary" },
    LOST: { label: "Hilang", variant: "outline" }
  };

  const ITEM_CONDITION_MAP: Record<string, any> = {
    GOOD: { label: "Baik", variant: "success" },
    FAIR: { label: "Cukup", variant: "info" },
    DAMAGED: { label: "Rusak", variant: "warning" },
    HEAVILY_DAMAGED: { label: "Rusak Berat", variant: "outline" }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        actions={
          <>
            <Button onClick={loadData} variant="outline"><RefreshCcw className="h-4 w-4" /> Refresh</Button>
            <Button onClick={openCreate}><Plus className="h-4 w-4" /> Tambah</Button>
          </>
        }
        breadcrumb={["Admin", "Inventaris", "Data Barang"]}
        description="Kelola data barang inventaris, aset tetap, dan barang habis pakai."
        eyebrow="Phase 12.3 Sarpras"
        title="Data Barang"
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
              <CardTitle>Daftar Barang</CardTitle>
            </div>
            <form className="flex w-full flex-col gap-3 lg:w-auto lg:flex-row lg:items-center" onSubmit={handleSearch}>
              <div className="relative w-full lg:max-w-sm">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input className="pl-11" onChange={(event) => setSearch(event.target.value)} placeholder="Cari nama atau kode barang..." value={search} />
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
                    <th className="px-4 py-3 font-black">Kode</th>
                    <th className="px-4 py-3 font-black">Nama</th>
                    <th className="px-4 py-3 font-black">Kategori</th>
                    <th className="px-4 py-3 font-black">Lokasi</th>
                    <th className="px-4 py-3 font-black">Qty</th>
                    <th className="px-4 py-3 font-black">Status</th>
                    <th className="px-4 py-3 font-black">Kondisi</th>
                    <th className="px-4 py-3 text-right font-black">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => {
                    const st = ITEM_STATUS_MAP[item.status] ?? { label: item.status, variant: "outline" };
                    const cond = ITEM_CONDITION_MAP[item.condition] ?? { label: item.condition, variant: "outline" };
                    return (
                      <tr className="border-b last:border-0" key={item.id}>
                        <td className="px-4 py-4 font-semibold text-slate-700">{item.code}</td>
                        <td className="px-4 py-4 font-semibold text-slate-700">{item.name}</td>
                        <td className="px-4 py-4 font-semibold text-slate-700">{item.category?.name ?? "-"}</td>
                        <td className="px-4 py-4 font-semibold text-slate-700">{item.location?.name ?? "-"}</td>
                        <td className="px-4 py-4 font-semibold text-slate-700">{item.quantity} {item.unit}</td>
                        <td className="px-4 py-4"><StatusBadge map={ITEM_STATUS_MAP} value={item.status} /></td>
                        <td className="px-4 py-4"><StatusBadge map={ITEM_CONDITION_MAP} value={item.condition} /></td>
                        <td className="px-4 py-4">
                          <div className="flex justify-end gap-2">
                            <Button onClick={() => openEdit(item)} size="sm" variant="outline" aria-label="Edit">
                              <Edit3 className="h-4 w-4" />
                            </Button>
                            <Button
                              disabled={printingId === item.id}
                              onClick={() => handlePrint(item)}
                              size="sm"
                              variant="soft"
                              aria-label="Cetak PDF"
                            >
                              {printingId === item.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Printer className="h-4 w-4" />}
                            </Button>
                            <Button onClick={() => handleDelete(item)} size="sm" variant="ghost" aria-label="Hapus">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState
              action={<Button onClick={openCreate} variant="soft">Tambah barang pertama</Button>}
              description="Belum ada data barang."
              title="Data masih kosong"
            />
          )}
        </CardContent>
      </Card>

      {formOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
          <Card className="w-full max-w-3xl overflow-y-auto max-h-[90vh]">
            <CardHeader className="sticky top-0 z-10 bg-white shadow-sm">
              <div className="flex items-center justify-between">
                <CardTitle>{editing ? "Edit" : "Tambah"} Barang</CardTitle>
                <Button onClick={() => setFormOpen(false)} size="icon" variant="ghost">tutup</Button>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
                <label className="space-y-2">
                  <span className="text-sm font-bold text-slate-700">Kode Barang</span>
                  <Input defaultValue={editing?.code ?? ""} name="code" required />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-bold text-slate-700">Nama Barang</span>
                  <Input defaultValue={editing?.name ?? ""} name="name" required />
                </label>
                
                <label className="space-y-2">
                  <span className="text-sm font-bold text-slate-700">Kategori</span>
                  <select className="w-full rounded-2xl border border-input bg-white px-4 py-2 text-sm shadow-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                    defaultValue={editing?.categoryId ?? ""} name="categoryId" required>
                    <option value="" disabled>Pilih Kategori</option>
                    {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-bold text-slate-700">Lokasi</span>
                  <select className="w-full rounded-2xl border border-input bg-white px-4 py-2 text-sm shadow-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                    defaultValue={editing?.locationId ?? ""} name="locationId">
                    <option value="">(Tidak ada lokasi)</option>
                    {locations.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
                  </select>
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-bold text-slate-700">Jenis Barang</span>
                  <select className="w-full rounded-2xl border border-input bg-white px-4 py-2 text-sm shadow-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                    defaultValue={editing?.type ?? "ASSET"} name="type" required>
                    <option value="ASSET">Aset Tetap (Asset)</option>
                    <option value="CONSUMABLE">Barang Habis Pakai (Consumable)</option>
                  </select>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <label className="space-y-2">
                    <span className="text-sm font-bold text-slate-700">Kuantitas</span>
                    <Input defaultValue={editing?.quantity ?? "1"} name="quantity" type="number" min="0" required />
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm font-bold text-slate-700">Satuan</span>
                    <Input defaultValue={editing?.unit ?? "pcs"} name="unit" placeholder="pcs/unit" />
                  </label>
                </div>

                <label className="space-y-2">
                  <span className="text-sm font-bold text-slate-700">Status</span>
                  <select className="w-full rounded-2xl border border-input bg-white px-4 py-2 text-sm shadow-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                    defaultValue={editing?.status ?? "ACTIVE"} name="status">
                    <option value="ACTIVE">Aktif / Tersedia</option>
                    <option value="MAINTENANCE">Dalam Perbaikan</option>
                    <option value="BORROWED">Sedang Dipinjam</option>
                    <option value="DISPOSED">Afkir / Dibuang</option>
                    <option value="LOST">Hilang</option>
                  </select>
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-bold text-slate-700">Kondisi</span>
                  <select className="w-full rounded-2xl border border-input bg-white px-4 py-2 text-sm shadow-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                    defaultValue={editing?.condition ?? "GOOD"} name="condition">
                    <option value="GOOD">Baik</option>
                    <option value="FAIR">Cukup</option>
                    <option value="DAMAGED">Rusak</option>
                    <option value="HEAVILY_DAMAGED">Rusak Berat</option>
                  </select>
                </label>
                
                <label className="space-y-2">
                  <span className="text-sm font-bold text-slate-700">Stok Minimum (opsional)</span>
                  <Input defaultValue={editing?.minStock ?? ""} name="minStock" type="number" min="0" />
                </label>

                <div className="flex gap-3 md:col-span-2 justify-end mt-4">
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
