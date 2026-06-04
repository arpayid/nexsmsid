"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { AlertCircle, Edit3, Loader2, Plus, RefreshCcw, Search, Trash2, X } from "lucide-react";

import type { MasterDataRecord, ScheduleRecord } from "@nexsmsid/api-client";
import { Badge, Button, Card, CardContent, CardHeader, CardTitle, EmptyState, Input, PageHeader } from "@nexsmsid/ui";

import { createBrowserApiClient } from "@/lib/api-client";

const DAYS = [
  { value: "MONDAY", label: "Senin" },
  { value: "TUESDAY", label: "Selasa" },
  { value: "WEDNESDAY", label: "Rabu" },
  { value: "THURSDAY", label: "Kamis" },
  { value: "FRIDAY", label: "Jumat" },
  { value: "SATURDAY", label: "Sabtu" },
  { value: "SUNDAY", label: "Minggu" }
];

export default function SchedulesPage() {
  const api = useMemo(() => createBrowserApiClient(), []);
  const [editing, setEditing] = useState<ScheduleRecord | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [items, setItems] = useState<ScheduleRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [total, setTotal] = useState(0);
  const [teachingAssignments, setTeachingAssignments] = useState<MasterDataRecord[]>([]);
  const [lessonHours, setLessonHours] = useState<MasterDataRecord[]>([]);
  const [rooms, setRooms] = useState<MasterDataRecord[]>([]);

  async function loadReferenceData() {
    try {
      const [taRes, lhRes, roomsRes] = await Promise.all([
        api.masterDataList("teaching-assignments", { limit: 500 }),
        api.masterDataList("lesson-hours", { limit: 500 }),
        api.masterDataList("rooms", { limit: 500 })
      ]);
      setTeachingAssignments(taRes.data);
      setLessonHours(lhRes.data);
      setRooms(roomsRes.data);
    } catch { /* ignore */ }
  }

  async function loadData() {
    setError(null);
    setLoading(true);
    try {
      const response = await api.listSchedules({ limit: 50, page: 1, search: search || undefined });
      setItems(response.data);
      setTotal((response.meta as { total?: number } | undefined)?.total ?? response.data.length);
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

  function openCreate() { setEditing(null); setFormOpen(true); }

  function openEdit(item: ScheduleRecord) { setEditing(item); setFormOpen(true); }

  async function handleDelete(item: ScheduleRecord) {
    const confirmed = window.confirm(`Hapus jadwal ${item.dayOfWeek} - ${item.teachingAssignment?.subject?.name ?? ""}?`);
    if (!confirmed) return;
    setError(null);
    try {
      await api.deleteSchedule(item.id);
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
      teachingAssignmentId: formData.get("teachingAssignmentId"),
      roomId: formData.get("roomId"),
      lessonHourId: formData.get("lessonHourId"),
      dayOfWeek: formData.get("dayOfWeek")
    };
    try {
      if (editing) {
        await api.updateSchedule(editing.id, payload);
      } else {
        await api.createSchedule(payload);
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

  const dayLabel = (day: string) => DAYS.find((d) => d.value === day)?.label ?? day;

  return (
    <div className="space-y-8">
      <PageHeader
        actions={
          <>
            <Button onClick={loadData} variant="outline"><RefreshCcw className="h-4 w-4" /> Refresh</Button>
            <Button onClick={openCreate}><Plus className="h-4 w-4" /> Tambah</Button>
          </>
        }
        breadcrumb={["Admin", "Akademik", "Jadwal"]}
        description="Atur jadwal pelajaran per hari, jam, guru, dan ruangan."
        eyebrow="Phase 7 Akademik"
        title="Jadwal Pelajaran"
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
              <CardTitle>Data Jadwal</CardTitle>
              <p className="mt-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">Total: {total} data</p>
            </div>
            <form className="flex w-full flex-col gap-3 lg:w-auto lg:flex-row lg:items-center" onSubmit={handleSearch}>
              <div className="relative w-full lg:max-w-sm">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input className="pl-11" onChange={(event) => setSearch(event.target.value)} placeholder="Cari mapel, guru, kelas..." value={search} />
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
              <table className="w-full min-w-[750px] text-left text-sm">
                <thead>
                  <tr className="border-b text-xs uppercase tracking-[0.14em] text-muted-foreground">
                    <th className="px-4 py-3 font-black">Hari</th>
                    <th className="px-4 py-3 font-black">Jam</th>
                    <th className="px-4 py-3 font-black">Guru</th>
                    <th className="px-4 py-3 font-black">Mapel</th>
                    <th className="px-4 py-3 font-black">Kelas</th>
                    <th className="px-4 py-3 font-black">Ruangan</th>
                    <th className="px-4 py-3 text-right font-black">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr className="border-b last:border-0" key={item.id}>
                      <td className="px-4 py-4"><Badge variant="info">{dayLabel(item.dayOfWeek)}</Badge></td>
                      <td className="px-4 py-4 font-semibold text-slate-700">{item.lessonHour?.name ?? "-"}</td>
                      <td className="px-4 py-4 font-semibold text-slate-700">{item.teachingAssignment?.teacher?.name ?? "-"}</td>
                      <td className="px-4 py-4 font-semibold text-slate-700">{item.teachingAssignment?.subject?.name ?? "-"}</td>
                      <td className="px-4 py-4 font-semibold text-slate-700">{item.teachingAssignment?.classroom?.name ?? "-"}</td>
                      <td className="px-4 py-4 font-semibold text-slate-700">{item.room?.name ?? "-"}</td>
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
              action={<Button onClick={openCreate} variant="soft">Tambah jadwal pertama</Button>}
              description="Belum ada jadwal."
              title="Data masih kosong"
            />
          )}
        </CardContent>
      </Card>

      {formOpen ? (
        <Card className="border-primary/20">
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div><CardTitle>{editing ? "Edit" : "Tambah"} Jadwal</CardTitle></div>
              <Button onClick={() => setFormOpen(false)} size="icon" variant="ghost"><X className="h-5 w-5" /></Button>
            </div>
          </CardHeader>
          <CardContent>
            <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
              <label className="space-y-2">
                <span className="text-sm font-bold text-slate-700">Penugasan Mengajar</span>
                <select className="w-full rounded-2xl border border-input bg-white px-4 py-2 text-sm shadow-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                  defaultValue={editing?.teachingAssignmentId ?? ""} name="teachingAssignmentId" required>
                  <option value="" disabled>Pilih Guru - Mapel - Kelas</option>
                  {teachingAssignments.map((ta) => <option key={ta.id} value={ta.id}>{ta.name}</option>)}
                </select>
              </label>
              <label className="space-y-2">
                <span className="text-sm font-bold text-slate-700">Hari</span>
                <select className="w-full rounded-2xl border border-input bg-white px-4 py-2 text-sm shadow-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                  defaultValue={editing?.dayOfWeek ?? ""} name="dayOfWeek" required>
                  <option value="" disabled>Pilih Hari</option>
                  {DAYS.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
                </select>
              </label>
              <label className="space-y-2">
                <span className="text-sm font-bold text-slate-700">Jam Pelajaran</span>
                <select className="w-full rounded-2xl border border-input bg-white px-4 py-2 text-sm shadow-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                  defaultValue={editing?.lessonHourId ?? ""} name="lessonHourId" required>
                  <option value="" disabled>Pilih Jam</option>
                  {lessonHours.map((lh) => <option key={lh.id} value={lh.id}>{lh.name}</option>)}
                </select>
              </label>
              <label className="space-y-2">
                <span className="text-sm font-bold text-slate-700">Ruangan</span>
                <select className="w-full rounded-2xl border border-input bg-white px-4 py-2 text-sm shadow-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                  defaultValue={editing?.roomId ?? ""} name="roomId" required>
                  <option value="" disabled>Pilih Ruangan</option>
                  {rooms.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
                </select>
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
