"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { AlertCircle, CheckCircle2, Eye, Loader2, Plus, Printer, RefreshCcw, Save, Search, X } from "lucide-react";

import type { AssessmentDetail, AssessmentRecord, MasterDataRecord } from "@nexsmsid/api-client";
import { Badge, Button, Card, CardContent, CardHeader, CardTitle, EmptyState, Input, PageHeader } from "@nexsmsid/ui";

import { createBrowserApiClient } from "@/lib/api-client";

const ASSESSMENT_TYPES = [
  { value: "DAILY", label: "Harian" },
  { value: "ASSIGNMENT", label: "Tugas" },
  { value: "QUIZ", label: "Kuis" },
  { value: "MIDTERM", label: "UTS" },
  { value: "FINAL", label: "UAS" },
  { value: "PRACTICAL", label: "Praktik" },
  { value: "PROJECT", label: "Proyek" }
];

const statusBadge: Record<string, "success" | "warning" | "info" | "outline" | "secondary"> = {
  DRAFT: "outline",
  SUBMITTED: "info",
  APPROVED: "success",
  PUBLISHED: "secondary"
};

export default function GradesPage() {
  const api = useMemo(() => createBrowserApiClient(), []);
  const [error, setError] = useState<string | null>(null);
  const [assessments, setAssessments] = useState<AssessmentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [total, setTotal] = useState(0);
  const [formOpen, setFormOpen] = useState(false);
  const [editingAssessment, setEditingAssessment] = useState<AssessmentRecord | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [selectedAssessment, setSelectedAssessment] = useState<AssessmentDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [savingScores, setSavingScores] = useState(false);

  const [teachingAssignments, setTeachingAssignments] = useState<MasterDataRecord[]>([]);
  const [classrooms, setClassrooms] = useState<MasterDataRecord[]>([]);
  const [semesters, setSemesters] = useState<MasterDataRecord[]>([]);
  const [recapOpen, setRecapOpen] = useState(false);
  const [recapClassroomId, setRecapClassroomId] = useState<string>("");
  const [recapSemesterId, setRecapSemesterId] = useState<string>("");
  const [recapBusy, setRecapBusy] = useState(false);

  async function loadReferences() {
    try {
      const [taRes, clsRes, semRes] = await Promise.all([
        api.masterDataList("teaching-assignments", { limit: 500 }),
        api.masterDataList("classrooms", { limit: 500 }),
        api.masterDataList("semesters", { limit: 100 })
      ]);
      setTeachingAssignments(taRes.data);
      setClassrooms(clsRes.data);
      setSemesters(semRes.data);
      const active = semRes.data.find((s) => s.isActive);
      if (active) setRecapSemesterId(active.id);
    } catch { /* ignore */ }
  }

  async function loadData() {
    setError(null);
    setLoading(true);
    try {
      const response = await api.listAssessments({ limit: 50, page: 1, search: search || undefined });
      setAssessments(response.items);
      setTotal(response.meta?.total ?? response.items.length);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Gagal memuat data");
    } finally {
      setLoading(false);
    }
  }

  async function handleDownloadRecap() {
    if (!recapClassroomId) {
      setError("Pilih kelas terlebih dahulu");
      return;
    }
    setError(null);
    setRecapBusy(true);
    try {
      const blob = await api.downloadGradeRecapPdf(recapClassroomId, { semesterId: recapSemesterId || undefined });
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank", "noopener,noreferrer");
      setTimeout(() => URL.revokeObjectURL(url), 60_000);
      setRecapOpen(false);
    } catch (recapError) {
      setError(recapError instanceof Error ? recapError.message : "Gagal membuat rekap nilai");
    } finally {
      setRecapBusy(false);
    }
  }

  useEffect(() => {
    void loadReferences();
    void loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await loadData();
  }

  function openCreate() { setEditingAssessment(null); setFormOpen(true); }

  function openEdit(item: AssessmentRecord) { setEditingAssessment(item); setFormOpen(true); }

  async function openDetail(id: string) {
    setDetailLoading(true);
    setError(null);
    try {
      const assessment = await api.getAssessmentDetail(id);
      setSelectedAssessment(assessment);
      const scoreMap: Record<string, number> = {};
      for (const grade of assessment.grades) {
        scoreMap[grade.studentId] = grade.score;
      }
      setScores(scoreMap);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat detail nilai");
    } finally {
      setDetailLoading(false);
    }
  }

  async function handleSaveScores() {
    if (!selectedAssessment) return;
    setSavingScores(true);
    setError(null);
    try {
      const scoresArray = Object.entries(scores).map(([studentId, score]) => ({ studentId, score }));
      await api.inputScores(selectedAssessment.id, { scores: scoresArray });
      await openDetail(selectedAssessment.id);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan nilai");
    } finally {
      setSavingScores(false);
    }
  }

  async function handleApprove() {
    if (!selectedAssessment) return;
    setSubmitting(true);
    setError(null);
    try {
      await api.approveScores(selectedAssessment.id);
      await openDetail(selectedAssessment.id);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal approve nilai");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    const formData = new FormData(event.currentTarget);
    const payload: Record<string, unknown> = {
      teachingAssignmentId: formData.get("teachingAssignmentId"),
      name: formData.get("name"),
      type: formData.get("type"),
      maxScore: Number(formData.get("maxScore")),
      weight: Number(formData.get("weight")),
      description: formData.get("description") || ""
    };
    const dueDate = formData.get("dueDate");
    if (dueDate) payload.dueDate = dueDate;
    try {
      if (editingAssessment) {
        await api.updateAssessment(editingAssessment.id, payload);
      } else {
        await api.createAssessment(payload);
      }
      setFormOpen(false);
      setEditingAssessment(null);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan assessment");
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
            <Button onClick={() => setRecapOpen(true)} variant="soft"><Printer className="h-4 w-4" /> Cetak Rekap</Button>
            <Button onClick={openCreate}><Plus className="h-4 w-4" /> Assessment Baru</Button>
          </>
        }
        breadcrumb={["Admin", "Akademik", "Nilai"]}
        description="Kelola assessment, input nilai, approve, dan publish."
        eyebrow="Phase 7 Akademik"
        title="Nilai Siswa"
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
              <CardTitle>Daftar Assessment</CardTitle>
              <p className="mt-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">Total: {total} assessment</p>
            </div>
            <form className="flex w-full flex-col gap-3 lg:w-auto lg:flex-row lg:items-center" onSubmit={handleSearch}>
              <div className="relative w-full lg:max-w-sm">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input className="pl-11" onChange={(event) => setSearch(event.target.value)} placeholder="Cari assessment, mapel..." value={search} />
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
          ) : assessments.length ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-left text-sm">
                <thead>
                  <tr className="border-b text-xs uppercase tracking-[0.14em] text-muted-foreground">
                    <th className="px-4 py-3 font-black">Nama</th>
                    <th className="px-4 py-3 font-black">Tipe</th>
                    <th className="px-4 py-3 font-black">Mapel</th>
                    <th className="px-4 py-3 font-black">Kelas</th>
                    <th className="px-4 py-3 font-black">Skor Maks</th>
                    <th className="px-4 py-3 font-black">Bobot</th>
                    <th className="px-4 py-3 font-black">Nilai</th>
                    <th className="px-4 py-3 text-right font-black">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {assessments.map((a) => (
                    <tr className="border-b last:border-0" key={a.id}>
                      <td className="px-4 py-4 font-semibold text-slate-700">{a.name}</td>
                      <td className="px-4 py-4">
                        <Badge variant="secondary">{ASSESSMENT_TYPES.find((t) => t.value === a.type)?.label ?? a.type}</Badge>
                      </td>
                      <td className="px-4 py-4 font-semibold text-slate-700">{a.teachingAssignment?.subject?.name ?? "-"}</td>
                      <td className="px-4 py-4 font-semibold text-slate-700">{a.teachingAssignment?.classroom?.name ?? "-"}</td>
                      <td className="px-4 py-4 font-semibold text-slate-700">{a.maxScore}</td>
                      <td className="px-4 py-4 font-semibold text-slate-700">{a.weight}%</td>
                      <td className="px-4 py-4 font-semibold text-slate-700">{a._count?.grades ?? 0}</td>
                      <td className="px-4 py-4">
                        <div className="flex justify-end gap-2">
                          <Button onClick={() => openEdit(a)} size="sm" variant="outline">Edit</Button>
                          <Button onClick={() => openDetail(a.id)} size="sm" variant="soft"><Eye className="h-4 w-4" /> Nilai</Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState
              action={<Button onClick={openCreate} variant="soft">Buat assessment pertama</Button>}
              description="Belum ada assessment."
              title="Data masih kosong"
            />
          )}
        </CardContent>
      </Card>

      {recapOpen ? (
        <Card className="border-primary/20">
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div><CardTitle>Cetak Rekap Nilai</CardTitle></div>
              <Button onClick={() => setRecapOpen(false)} size="icon" variant="ghost"><X className="h-5 w-5" /></Button>
            </div>
          </CardHeader>
          <CardContent>
            <form className="grid gap-4 md:grid-cols-2" onSubmit={(e) => { e.preventDefault(); void handleDownloadRecap(); }}>
              <label className="space-y-2">
                <span className="text-sm font-bold text-slate-700">Kelas</span>
                <select
                  className="w-full rounded-2xl border border-input bg-white px-4 py-2 text-sm shadow-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                  name="classroomId"
                  onChange={(e) => setRecapClassroomId(e.target.value)}
                  required
                  value={recapClassroomId}
                >
                  <option value="" disabled>Pilih Kelas</option>
                  {classrooms.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </label>
              <label className="space-y-2">
                <span className="text-sm font-bold text-slate-700">Semester (opsional)</span>
                <select
                  className="w-full rounded-2xl border border-input bg-white px-4 py-2 text-sm shadow-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                  name="semesterId"
                  onChange={(e) => setRecapSemesterId(e.target.value)}
                  value={recapSemesterId}
                >
                  <option value="">— Semester Aktif —</option>
                  {semesters.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </label>
              <div className="md:col-span-2 flex justify-end gap-2">
                <Button onClick={() => setRecapOpen(false)} type="button" variant="outline">Batal</Button>
                <Button disabled={recapBusy} type="submit">
                  {recapBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Printer className="h-4 w-4" />}
                  Cetak PDF
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : null}

      {formOpen ? (
        <Card className="border-primary/20">
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div><CardTitle>{editingAssessment ? "Edit" : "Buat"} Assessment</CardTitle></div>
              <Button onClick={() => { setFormOpen(false); setEditingAssessment(null); }} size="icon" variant="ghost"><X className="h-5 w-5" /></Button>
            </div>
          </CardHeader>
          <CardContent>
            <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
              <label className="space-y-2">
                <span className="text-sm font-bold text-slate-700">Nama Assessment</span>
                <Input defaultValue={editingAssessment?.name ?? ""} name="name" required />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-bold text-slate-700">Tipe</span>
                <select className="w-full rounded-2xl border border-input bg-white px-4 py-2 text-sm shadow-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                  defaultValue={editingAssessment?.type ?? "DAILY"} name="type" required>
                  {ASSESSMENT_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </label>
              <label className="space-y-2">
                <span className="text-sm font-bold text-slate-700">Penugasan Mengajar</span>
                <select className="w-full rounded-2xl border border-input bg-white px-4 py-2 text-sm shadow-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                  defaultValue={(editingAssessment as Record<string, unknown>)?.teachingAssignmentId as string ?? ""} name="teachingAssignmentId" required>
                  <option value="" disabled>Pilih Guru - Mapel - Kelas</option>
                  {teachingAssignments.map((ta) => <option key={ta.id} value={ta.id}>{ta.name}</option>)}
                </select>
              </label>
              <label className="space-y-2">
                <span className="text-sm font-bold text-slate-700">Tanggal Deadline</span>
                <Input defaultValue={editingAssessment?.dueDate?.slice(0, 10) ?? ""} name="dueDate" type="date" />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-bold text-slate-700">Skor Maksimal</span>
                <Input defaultValue={editingAssessment?.maxScore ?? 100} name="maxScore" required type="number" />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-bold text-slate-700">Bobot (%)</span>
                <Input defaultValue={editingAssessment?.weight ?? 1} name="weight" required type="number" />
              </label>
              <label className="space-y-2 md:col-span-2">
                <span className="text-sm font-bold text-slate-700">Deskripsi</span>
                <Input defaultValue={editingAssessment?.description ?? ""} name="description" />
              </label>
              <div className="flex gap-3 md:col-span-2">
                <Button disabled={submitting} type="submit">
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null} Simpan
                </Button>
                <Button onClick={() => { setFormOpen(false); setEditingAssessment(null); }} type="button" variant="outline">Batal</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : null}

      {detailLoading ? (
        <Card><CardContent><div className="grid min-h-32 place-items-center"><Loader2 className="h-5 w-5 animate-spin text-primary" /></div></CardContent></Card>
      ) : selectedAssessment ? (
        <Card className="border-emerald-200">
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardTitle>{selectedAssessment.name}</CardTitle>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {ASSESSMENT_TYPES.find((t) => t.value === selectedAssessment.type)?.label ?? selectedAssessment.type} &middot;
                  Skor Maks: {selectedAssessment.maxScore} &middot; Bobot: {selectedAssessment.weight}% &middot;
                  {selectedAssessment.teachingAssignment?.subject?.name ?? ""} - {selectedAssessment.teachingAssignment?.classroom?.name ?? ""}
                </p>
                <p className="mt-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Total: {selectedAssessment.grades.length} siswa
                </p>
              </div>
              <div className="flex gap-2">
                {selectedAssessment.grades.every((g) => g.status !== "APPROVED" && g.status !== "PUBLISHED") ? (
                  <Button onClick={handleApprove} disabled={submitting} variant="soft">
                    <CheckCircle2 className="h-4 w-4" /> Approve
                  </Button>
                ) : null}
                <Button onClick={() => setSelectedAssessment(null)} variant="outline">Tutup</Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[500px] text-left text-sm">
                <thead>
                  <tr className="border-b text-xs uppercase tracking-[0.14em] text-muted-foreground">
                    <th className="px-4 py-3 font-black">NIS</th>
                    <th className="px-4 py-3 font-black">Nama</th>
                    <th className="px-4 py-3 font-black">Nilai</th>
                    <th className="px-4 py-3 font-black">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedAssessment.grades.map((grade) => (
                    <tr className="border-b last:border-0" key={grade.studentId}>
                      <td className="px-4 py-4 font-mono text-xs font-semibold text-slate-700">{grade.student.nis}</td>
                      <td className="px-4 py-4 font-semibold text-slate-700">{grade.student.name}</td>
                      <td className="px-4 py-4">
                        {grade.status === "APPROVED" || grade.status === "PUBLISHED" ? (
                          <span className="font-bold text-slate-700">{grade.score}</span>
                        ) : (
                          <Input
                            className="w-24"
                            defaultValue={scores[grade.studentId] ?? grade.score}
                            max={selectedAssessment.maxScore}
                            min={0}
                            name={`score-${grade.studentId}`}
                            onChange={(e) => setScores((prev) => ({ ...prev, [grade.studentId]: Number(e.target.value) }))}
                            type="number"
                          />
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <Badge variant={statusBadge[grade.status] ?? "outline"}>{grade.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex gap-2">
              {selectedAssessment.grades.some((g) => g.status !== "APPROVED" && g.status !== "PUBLISHED") ? (
                <Button onClick={handleSaveScores} disabled={savingScores}>
                  {savingScores ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Simpan Nilai
                </Button>
              ) : null}
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
