"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { AlertCircle, Edit3, Loader2, Plus, RefreshCcw, Search, Trash2, X } from "lucide-react";

import type { MasterDataRecord, PpdbPeriodRecord } from "@nexsmsid/api-client";
import { Badge, Button, Card, CardContent, CardHeader, CardTitle, EmptyState, Input, PageHeader } from "@nexsmsid/ui";

import { createBrowserApiClient } from "@/lib/api-client";

export default function PpdbPeriodsPage() {
  const api = useMemo(() => createBrowserApiClient(), []);
  const [editing, setEditing] = useState<PpdbPeriodRecord | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [items, setItems] = useState<PpdbPeriodRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [total, setTotal] = useState(0);
  const [academicYears, setAcademicYears] = useState<MasterDataRecord[]>([]);

  async function loadReferenceData() {
    try {
      const yearsRes = await api.masterDataList("academic-years", { limit: 100 });
      setAcademicYears(yearsRes.data);
    } catch { /* ignore reference load errors */ }
  }

  async function loadData() {
    setError(null);
    setLoading(true);
    try {
      const response = await api.listPpdbPeriods({ limit: 50, page: 1, search: search || undefined });
      const result = response as { items: PpdbPeriodRecord[]; meta?: { total?: number } };
      setItems(result.items);
      setTotal(result.meta?.total ?? result.items.length);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Gagal memuat data");
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

  function openEdit(item: PpdbPeriodRecord) {
    setEditing(item);
    setFormOpen(true);
  }

  async function handleDelete(item: PpdbPeriodRecord) {
    const confirmed = window.confirm(`Hapus periode PPDB ${(item.name as string) ?? ""}?`);
    if (!confirmed) return;
    setError(null);
    try {
      await api.deletePpdbPeriod(item.id as string);
      await loadData();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Gagal menghapus data");
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    const formData = new FormData(event.currentTarget);
    const payload: Record<string, unknown> = {
      name: formData.get("name"),
      academicYearId: formData.get("academicYearId"),
      startDate: formData.get("startDate"),
      endDate: formData.get("endDate"),
      quota: Number(formData.get("quota")),
      isActive: formData.get("isActive") === "on"
    };
    try {
      if (editing) {
        await api.updatePpdbPeriod(editing.id as string, payload);
      } else {
        await api.createPpdbPeriod(payload);
      }
      setFormOpen(false);
      setEditing(null);
      await loadData();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Gagal menyimpan data");
    } finally {
      setSubmitting(false);
    }
  }

  const activeAcademicYear = academicYears.find((y) => y.isActive);

  return (
    <div className="space-y-8">
      <PageHeader
        actions={
          <>
            <Button onClick={loadData} variant="outline"><RefreshCcw className="h-4 w-4" /> Refresh</Button>
            <Button onClick={openCreate}><Plus className="h-4 w-4" /> Tambah</Button>
          </>
        }
        breadcrumb={["Admin", "PPDB", "Periode"]}
        description="Atur periode pendaftaran PPDB."
        eyebrow="Phase 8 PPDB"
        title="Periode PPDB"
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
              <CardTitle>Data Periode PPDB</CardTitle>
              <p className="mt-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">Total: {total} data</p>
            </div>
            <form className="flex w-full flex-col gap-3 lg:w-auto lg:flex-row lg:items-center" onSubmit={handleSearch}>
              <div className="relative w-full lg:max-w-sm">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input className="pl-11" onChange={(event) => setSearch(event.target.value)} placeholder="Cari periode..." value={search} />
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
              <table className="w-full min-w-[700px] text-left text-sm">
                <thead>
                  <tr className="border-b text-xs uppercase tracking-[0.14em] text-muted-foreground">
                    <th className="px-4 py-3 font-black">Nama</th>
                    <th className="px-4 py-3 font-black">Tahun Ajaran</th>
                    <th className="px-4 py-3 font-black">Tanggal Mulai</th>
                    <th className="px-4 py-3 font-black">Tanggal Selesai</th>
                    <th className="px-4 py-3 font-black">Kuota</th>
                    <th className="px-4 py-3 font-black">Status</th>
                    <th className="px-4 py-3 text-right font-black">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr className="border-b last:border-0" key={item.id as string}>
                      <td className="px-4 py-4 font-semibold text-slate-700">{item.name as string}</td>
                      <td className="px-4 py-4 text-slate-600">{(item.academicYear as Record<string, unknown>)?.name as string ?? "-"}</td>
                      <td className="px-4 py-4 text-slate-600">{item.startDate as string ? new Date(item.startDate as string).toLocaleDateString("id-ID") : "-"}</td>
                      <td className="px-4 py-4 text-slate-600">{item.endDate as string ? new Date(item.endDate as string).toLocaleDateString("id-ID") : "-"}</td>
                      <td className="px-4 py-4 font-semibold text-slate-700">{String(item.quota ?? "-")}</td>
                      <td className="px-4 py-4">
                        <Badge variant={item.isActive ? "success" : "outline"}>{item.isActive ? "Aktif" : "Tidak Aktif"}</Badge>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex justify-end gap-2">
                          <Button onClick={() => openEdit(item)} size="sm" variant="outline"><Edit3 className="h-4 w-4" /> Edit</Button>
                          <Button onClick={() => handleDelete(item)} size="sm" variant="ghost"><Trash2 className="h-4 w-4" /> Hapus</Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState
              action={<Button onClick={openCreate} variant="soft">Tambah periode pertama</Button>}
              description="Belum ada periode PPDB."
              title="Data masih kosong"
            />
          )}
        </CardContent>
      </Card>

      {formOpen ? (
        <Card className="border-primary/20">
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardTitle>{editing ? "Edit" : "Tambah"} Periode PPDB</CardTitle>
              </div>
              <Button onClick={() => setFormOpen(false)} size="icon" variant="ghost"><X className="h-5 w-5" /></Button>
            </div>
          </CardHeader>
          <CardContent>
            <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
              <label className="space-y-2">
                <span className="text-sm font-bold text-slate-700">Nama Periode</span>
                <input className="w-full rounded-2xl border border-input bg-white px-4 py-2 text-sm shadow-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                  defaultValue={editing?.name as string ?? ""} name="name" required type="text" />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-bold text-slate-700">Tahun Ajaran</span>
                <select className="w-full rounded-2xl border border-input bg-white px-4 py-2 text-sm shadow-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                  defaultValue={editing?.academicYearId as string ?? activeAcademicYear?.id ?? ""} name="academicYearId" required>
                  <option value="" disabled>Pilih Tahun Ajaran</option>
                  {academicYears.map((y) => <option key={y.id} value={y.id}>{y.name}</option>)}
                </select>
              </label>
              <label className="space-y-2">
                <span className="text-sm font-bold text-slate-700">Tanggal Mulai</span>
                <input className="w-full rounded-2xl border border-input bg-white px-4 py-2 text-sm shadow-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                  defaultValue={editing?.startDate as string ?? ""} name="startDate" required type="date" />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-bold text-slate-700">Tanggal Selesai</span>
                <input className="w-full rounded-2xl border border-input bg-white px-4 py-2 text-sm shadow-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                  defaultValue={editing?.endDate as string ?? ""} name="endDate" required type="date" />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-bold text-slate-700">Kuota</span>
                <input className="w-full rounded-2xl border border-input bg-white px-4 py-2 text-sm shadow-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                  defaultValue={editing?.quota as number ?? ""} min="1" name="quota" required type="number" />
              </label>
              <label className="flex items-center gap-3 rounded-2xl border bg-white px-4 py-3 text-sm font-bold text-slate-700">
                <input defaultChecked={editing?.isActive as boolean ?? true} name="isActive" type="checkbox" /> Aktif
              </label>
              <div className="flex gap-3 md:col-span-2">
                <Button disabled={submitting} type="submit">
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null} Simpan
                </Button>
                <Button onClick={() => setFormOpen(false)} type="button" variant="outline">Batal</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
