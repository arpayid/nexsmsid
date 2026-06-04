"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { AlertCircle, Edit3, Loader2, Plus, RefreshCcw, Search, Trash2, X } from "lucide-react";

import type { MasterDataRecord, TeachingAssignmentRecord } from "@nexsmsid/api-client";
import { Badge, Button, Card, CardContent, CardHeader, CardTitle, EmptyState, Input, PageHeader } from "@nexsmsid/ui";

import { createBrowserApiClient } from "@/lib/api-client";

export default function TeachingAssignmentsPage() {
  const api = useMemo(() => createBrowserApiClient(), []);
  const [editing, setEditing] = useState<TeachingAssignmentRecord | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [items, setItems] = useState<TeachingAssignmentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [total, setTotal] = useState(0);
  const [teachers, setTeachers] = useState<MasterDataRecord[]>([]);
  const [subjects, setSubjects] = useState<MasterDataRecord[]>([]);
  const [classrooms, setClassrooms] = useState<MasterDataRecord[]>([]);
  const [semesters, setSemesters] = useState<MasterDataRecord[]>([]);
  const [academicYears, setAcademicYears] = useState<MasterDataRecord[]>([]);

  async function loadReferenceData() {
    try {
      const [teachersRes, subjectsRes, classroomsRes, semestersRes, yearsRes] = await Promise.all([
        api.masterDataList("teachers", { limit: 500 }),
        api.masterDataList("subjects", { limit: 500 }),
        api.masterDataList("classrooms", { limit: 500 }),
        api.masterDataList("semesters", { limit: 500 }),
        api.masterDataList("academic-years", { limit: 500 })
      ]);
      setTeachers(teachersRes.data);
      setSubjects(subjectsRes.data);
      setClassrooms(classroomsRes.data);
      setSemesters(semestersRes.data);
      setAcademicYears(yearsRes.data);
    } catch { /* ignore reference load errors */ }
  }

  async function loadData() {
    setError(null);
    setLoading(true);
    try {
      const response = await api.listTeachingAssignments({ limit: 50, page: 1, search: search || undefined });
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

  function openCreate() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(item: TeachingAssignmentRecord) {
    setEditing(item);
    setFormOpen(true);
  }

  async function handleDelete(item: TeachingAssignmentRecord) {
    const confirmed = window.confirm(`Hapus penugasan mengajar ${item.teacher?.name ?? ""} - ${item.subject?.name ?? ""}?`);
    if (!confirmed) return;
    setError(null);
    try {
      await api.deleteTeachingAssignment(item.id);
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
      teacherId: formData.get("teacherId"),
      subjectId: formData.get("subjectId"),
      classroomId: formData.get("classroomId"),
      academicYearId: formData.get("academicYearId"),
      semesterId: formData.get("semesterId"),
      isActive: formData.get("isActive") === "on"
    };
    try {
      if (editing) {
        await api.updateTeachingAssignment(editing.id, payload);
      } else {
        await api.createTeachingAssignment(payload);
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

  return (
    <div className="space-y-8">
      <PageHeader
        actions={
          <>
            <Button onClick={loadData} variant="outline"><RefreshCcw className="h-4 w-4" /> Refresh</Button>
            <Button onClick={openCreate}><Plus className="h-4 w-4" /> Tambah</Button>
          </>
        }
        breadcrumb={["Admin", "Akademik", "Mengajar"]}
        description="Atur penempatan guru untuk mata pelajaran di kelas tertentu."
        eyebrow="Phase 7 Akademik"
        title="Penugasan Mengajar"
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
              <CardTitle>Data Penugasan Mengajar</CardTitle>
              <p className="mt-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">Total: {total} data</p>
            </div>
            <form className="flex w-full flex-col gap-3 lg:w-auto lg:flex-row lg:items-center" onSubmit={handleSearch}>
              <div className="relative w-full lg:max-w-sm">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input className="pl-11" onChange={(event) => setSearch(event.target.value)} placeholder="Cari guru, mapel, kelas..." value={search} />
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
                    <th className="px-4 py-3 font-black">Guru</th>
                    <th className="px-4 py-3 font-black">Mata Pelajaran</th>
                    <th className="px-4 py-3 font-black">Kelas</th>
                    <th className="px-4 py-3 font-black">Semester</th>
                    <th className="px-4 py-3 font-black">Status</th>
                    <th className="px-4 py-3 text-right font-black">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr className="border-b last:border-0" key={item.id}>
                      <td className="px-4 py-4 font-semibold text-slate-700">{item.teacher?.name ?? "-"}</td>
                      <td className="px-4 py-4 font-semibold text-slate-700">{item.subject?.name ?? "-"}</td>
                      <td className="px-4 py-4 font-semibold text-slate-700">{item.classroom?.name ?? "-"}</td>
                      <td className="px-4 py-4 font-semibold text-slate-700">{item.semester?.name ?? "-"}</td>
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
              action={<Button onClick={openCreate} variant="soft">Tambah data pertama</Button>}
              description="Belum ada penugasan mengajar."
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
                <CardTitle>{editing ? "Edit" : "Tambah"} Penugasan Mengajar</CardTitle>
              </div>
              <Button onClick={() => setFormOpen(false)} size="icon" variant="ghost"><X className="h-5 w-5" /></Button>
            </div>
          </CardHeader>
          <CardContent>
            <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
              <label className="space-y-2">
                <span className="text-sm font-bold text-slate-700">Guru</span>
                <select className="w-full rounded-2xl border border-input bg-white px-4 py-2 text-sm shadow-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                  defaultValue={editing?.teacherId ?? ""} name="teacherId" required>
                  <option value="" disabled>Pilih Guru</option>
                  {teachers.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </label>
              <label className="space-y-2">
                <span className="text-sm font-bold text-slate-700">Mata Pelajaran</span>
                <select className="w-full rounded-2xl border border-input bg-white px-4 py-2 text-sm shadow-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                  defaultValue={editing?.subjectId ?? ""} name="subjectId" required>
                  <option value="" disabled>Pilih Mata Pelajaran</option>
                  {subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </label>
              <label className="space-y-2">
                <span className="text-sm font-bold text-slate-700">Kelas</span>
                <select className="w-full rounded-2xl border border-input bg-white px-4 py-2 text-sm shadow-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                  defaultValue={editing?.classroomId ?? ""} name="classroomId" required>
                  <option value="" disabled>Pilih Kelas</option>
                  {classrooms.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </label>
              <label className="space-y-2">
                <span className="text-sm font-bold text-slate-700">Semester</span>
                <select className="w-full rounded-2xl border border-input bg-white px-4 py-2 text-sm shadow-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                  defaultValue={editing?.semesterId ?? ""} name="semesterId" required>
                  <option value="" disabled>Pilih Semester</option>
                  {semesters.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </label>
              <label className="space-y-2">
                <span className="text-sm font-bold text-slate-700">Tahun Ajaran</span>
                <select className="w-full rounded-2xl border border-input bg-white px-4 py-2 text-sm shadow-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                  defaultValue={editing?.academicYearId ?? (academicYears[0]?.id ?? "")} name="academicYearId" required>
                  <option value="" disabled>Pilih Tahun Ajaran</option>
                  {academicYears.map((y) => <option key={y.id} value={y.id}>{y.name}</option>)}
                </select>
              </label>
              <label className="flex items-center gap-3 rounded-2xl border bg-white px-4 py-3 text-sm font-bold text-slate-700">
                <input defaultChecked={editing?.isActive ?? true} name="isActive" type="checkbox" /> Aktif
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
