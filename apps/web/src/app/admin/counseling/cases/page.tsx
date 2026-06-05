"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { Edit3, Loader2, Plus, RefreshCcw, Trash2 } from "lucide-react";

import { Button, ConfirmDialog, DataTable, ErrorState, FormModal, Input, PageHeader, SearchFilterBar, SectionCard, StatusBadge } from "@nexsmsid/ui";

import { createBrowserApiClient } from "@/lib/api-client";

type Row = Record<string, any>;

const statusOptions = ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"].map((value) => ({ label: value, value }));
const priorityOptions = ["LOW", "MEDIUM", "HIGH", "CRITICAL"].map((value) => ({ label: value, value }));
const visibilityOptions = ["PRIVATE", "COUNSELOR_ONLY", "HOMEROOM_TEACHER", "PARENT_VISIBLE"].map((value) => ({ label: value, value }));

export default function CounselingCasesPage() {
  const api = useMemo(() => createBrowserApiClient(), []);
  const [items, setItems] = useState<Row[]>([]);
  const [notes, setNotes] = useState<Row[]>([]);
  const [selected, setSelected] = useState<Row | null>(null);
  const [editing, setEditing] = useState<Row | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Row | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [total, setTotal] = useState(0);

  async function loadData() {
    setLoading(true);
    setError(null);
    try {
      const response = await api.listCounselingCases({ limit: 50, page: 1, search: search || undefined, status: status || undefined });
      setItems(response.items as Row[]);
      setTotal(response.meta?.total ?? response.items.length);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat kasus BK");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await loadData();
  }

  async function openDetail(row: Row) {
    setError(null);
    try {
      const detail = await api.getCounselingCase(row.id as string) as Row;
      const noteRows = await api.listCounselingNotes(row.id as string) as Row[];
      setSelected(detail);
      setNotes(noteRows);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat detail kasus");
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const payload: Row = {};
    for (const key of ["studentId", "counselorId", "title", "category", "priority", "status", "description", "resolution", "followUpDate"]) {
      const value = formData.get(key);
      if (value === null || value === "") continue;
      payload[key] = value;
    }
    if (!editing) delete payload.status;
    setSubmitting(true);
    setError(null);
    try {
      if (editing) await api.updateCounselingCase(editing.id as string, payload);
      else await api.createCounselingCase(payload);
      setFormOpen(false);
      setEditing(null);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan kasus BK");
    } finally {
      setSubmitting(false);
    }
  }

  async function confirmDelete() {
    if (!pendingDelete) return;
    setError(null);
    try {
      await api.deleteCounselingCase(pendingDelete.id as string);
      if (selected?.id === pendingDelete.id) setSelected(null);
      setPendingDelete(null);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menghapus kasus BK");
    }
  }

  async function closeCase(row: Row) {
    const resolution = window.prompt("Resolusi penutupan kasus (opsional)") ?? "";
    await api.closeCounselingCase(row.id as string, resolution ? { resolution } : {});
    await loadData();
    if (selected?.id === row.id) await openDetail(row);
  }

  async function reopenCase(row: Row) {
    await api.reopenCounselingCase(row.id as string);
    await loadData();
    if (selected?.id === row.id) await openDetail(row);
  }

  async function addNote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selected) return;
    const formData = new FormData(event.currentTarget);
    const note = String(formData.get("note") ?? "").trim();
    const visibility = String(formData.get("visibility") ?? "PRIVATE");
    if (!note) return;
    setError(null);
    try {
      await api.createCounselingNote(selected.id as string, { note, visibility });
      event.currentTarget.reset();
      setNotes(await api.listCounselingNotes(selected.id as string) as Row[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menambah catatan");
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader
        actions={(
          <>
            <Button onClick={loadData} variant="outline"><RefreshCcw className="h-4 w-4" /> Refresh</Button>
            <Button onClick={() => { setEditing(null); setFormOpen(true); }}><Plus className="h-4 w-4" /> Tambah Kasus</Button>
          </>
        )}
        breadcrumb={["Admin", "BK & Kedisiplinan", "Kasus BK"]}
        description="Kelola kasus konseling siswa, tindak lanjut, dan catatan dengan visibility terbatas."
        eyebrow="Counseling"
        title="Kasus BK"
      />

      {error ? <ErrorState message={error} title="Gagal memproses data" /> : null}

      <SectionCard
        action={(
          <SearchFilterBar
            filters={[{ label: "Status", onChange: setStatus, options: statusOptions, placeholder: "Semua status", value: status }]}
            onSearchChange={setSearch}
            onSubmit={handleSearch}
            searchValue={search}
          />
        )}
        description={`Total: ${total} kasus`}
        title="Daftar Kasus"
      >
        <DataTable
          actions={(row) => (
            <>
              <Button onClick={() => void openDetail(row)} size="sm" variant="soft">Detail</Button>
              {row.status === "CLOSED" ? <Button onClick={() => void reopenCase(row)} size="sm" variant="outline">Reopen</Button> : <Button onClick={() => void closeCase(row)} size="sm" variant="outline">Close</Button>}
              <Button onClick={() => { setEditing(row); setFormOpen(true); }} size="sm" variant="outline"><Edit3 className="h-4 w-4" /> Edit</Button>
              <Button onClick={() => setPendingDelete(row)} size="sm" variant="ghost"><Trash2 className="h-4 w-4" /> Hapus</Button>
            </>
          )}
          columns={[
            { key: "title", header: "Judul" },
            { key: "student", header: "Siswa", cell: (row) => row.student?.name ?? "-" },
            { key: "category", header: "Kategori" },
            { key: "priority", header: "Prioritas", cell: (row) => <StatusBadge value={row.priority} /> },
            { key: "status", header: "Status", cell: (row) => <StatusBadge value={row.status} /> },
            { key: "followUpDate", header: "Follow Up", cell: (row) => formatDate(row.followUpDate) }
          ]}
          data={items}
          getRowId={(row) => row.id as string}
          loading={loading}
          minWidth="min-w-[980px]"
        />
      </SectionCard>

      {selected ? (
        <SectionCard description={`${selected.student?.name ?? "-"} • ${selected.category ?? "-"}`} title={selected.title as string}>
          <div className="grid gap-4 lg:grid-cols-[1fr_1.2fr]">
            <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
              <p className="font-bold text-slate-950">Deskripsi</p>
              <p className="mt-2 leading-6">{selected.description}</p>
              {selected.resolution ? <p className="mt-4 leading-6"><span className="font-bold">Resolusi:</span> {selected.resolution}</p> : null}
              <div className="mt-4 flex flex-wrap gap-2">
                <StatusBadge value={selected.priority} />
                <StatusBadge value={selected.status} />
              </div>
            </div>
            <div className="space-y-4">
              <form className="grid gap-3 rounded-2xl border border-slate-100 p-4" onSubmit={addNote}>
                <textarea className="min-h-24 rounded-xl border border-border px-4 py-3 text-sm font-semibold outline-none focus:border-primary focus:ring-4 focus:ring-primary/10" name="note" placeholder="Tambahkan catatan BK" required />
                <div className="flex flex-col gap-3 sm:flex-row">
                  <select className="h-11 rounded-xl border border-border bg-white px-4 text-sm font-semibold" defaultValue="PRIVATE" name="visibility">
                    {visibilityOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                  </select>
                  <Button type="submit">Tambah Catatan</Button>
                </div>
              </form>
              <div className="divide-y divide-slate-100 rounded-2xl border border-slate-100">
                {notes.length ? notes.map((note) => (
                  <div className="p-4" key={note.id}>
                    <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                      <StatusBadge value={note.visibility} />
                      <span className="text-xs font-semibold text-muted-foreground">{formatDate(note.createdAt)}</span>
                    </div>
                    <p className="text-sm leading-6 text-slate-700">{note.note}</p>
                  </div>
                )) : <p className="p-4 text-sm text-muted-foreground">Belum ada catatan.</p>}
              </div>
            </div>
          </div>
        </SectionCard>
      ) : null}

      <FormModal description="Gunakan Student ID dan User ID konselor dari data master/user." onClose={() => setFormOpen(false)} open={formOpen} title={editing ? "Edit Kasus BK" : "Tambah Kasus BK"}>
        <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
          <Field defaultValue={editing?.studentId} label="Student ID" name="studentId" required />
          <Field defaultValue={editing?.counselorId} label="Counselor User ID" name="counselorId" />
          <Field defaultValue={editing?.title} label="Judul" name="title" required />
          <Field defaultValue={editing?.category} label="Kategori" name="category" required />
          <label className="space-y-2">
            <span className="text-sm font-bold text-slate-700">Prioritas</span>
            <select className="h-11 w-full rounded-xl border border-border bg-white px-4 text-sm font-semibold" defaultValue={editing?.priority ?? "MEDIUM"} name="priority">
              {priorityOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
          </label>
          {editing ? (
            <label className="space-y-2">
              <span className="text-sm font-bold text-slate-700">Status</span>
              <select className="h-11 w-full rounded-xl border border-border bg-white px-4 text-sm font-semibold" defaultValue={editing.status ?? "OPEN"} name="status">
                {statusOptions.filter((option) => option.value !== "CLOSED").map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
              </select>
            </label>
          ) : null}
          <Field defaultValue={formatInputDate(editing?.followUpDate)} label="Follow Up" name="followUpDate" type="date" />
          <label className="space-y-2 md:col-span-2">
            <span className="text-sm font-bold text-slate-700">Deskripsi</span>
            <textarea className="min-h-24 w-full rounded-xl border border-border bg-white px-4 py-3 text-sm font-semibold outline-none focus:border-primary focus:ring-4 focus:ring-primary/10" defaultValue={editing?.description ?? ""} name="description" required />
          </label>
          <label className="space-y-2 md:col-span-2">
            <span className="text-sm font-bold text-slate-700">Resolusi</span>
            <textarea className="min-h-20 w-full rounded-xl border border-border bg-white px-4 py-3 text-sm font-semibold outline-none focus:border-primary focus:ring-4 focus:ring-primary/10" defaultValue={editing?.resolution ?? ""} name="resolution" />
          </label>
          <div className="flex flex-col-reverse gap-3 md:col-span-2 sm:flex-row sm:justify-end">
            <Button onClick={() => setFormOpen(false)} type="button" variant="outline">Batal</Button>
            <Button disabled={submitting} type="submit">{submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null} Simpan</Button>
          </div>
        </form>
      </FormModal>

      <ConfirmDialog
        description="Kasus akan di-soft delete. Catatan BK tetap tersimpan untuk kebutuhan audit internal."
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => void confirmDelete()}
        open={Boolean(pendingDelete)}
        title="Hapus kasus BK ini?"
      />
    </div>
  );
}

function Field({ defaultValue, label, name, required, type = "text" }: { defaultValue?: unknown; label: string; name: string; required?: boolean; type?: string }) {
  return (
    <label className="space-y-2">
      <span className="text-sm font-bold text-slate-700">{label}{required ? <span className="text-rose-500"> *</span> : null}</span>
      <Input defaultValue={String(defaultValue ?? "")} name={name} required={required} type={type} />
    </label>
  );
}

function formatDate(value: unknown) {
  if (!value) return "-";
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
}

function formatInputDate(value: unknown) {
  if (!value) return "";
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}
