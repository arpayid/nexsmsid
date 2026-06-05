"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { Download, Edit3, Loader2, Plus, RefreshCcw, Trash2, Upload } from "lucide-react";

import type { MasterDataRecord } from "@nexsmsid/api-client";
import { Button, ConfirmDialog, DataTable, ErrorState, FormModal, Input, PageHeader, SearchFilterBar, SectionCard, StatusBadge } from "@nexsmsid/ui";
import type { DataTableColumn, StatusBadgeMap } from "@nexsmsid/ui";

import { createBrowserApiClient } from "@/lib/api-client";

export type PeopleFieldType = "checkbox" | "date" | "email" | "number" | "select" | "tel" | "text" | "url";

export type PeopleField = {
  label: string;
  name: string;
  options?: string[];
  placeholder?: string;
  required?: boolean;
  table?: boolean;
  type?: PeopleFieldType;
};

export type PeopleResourceConfig = {
  delete: (id: string) => Promise<unknown>;
  list: (options: { limit: number; page: number; search?: string; status?: string }) => Promise<{
    items: MasterDataRecord[];
    meta?: { total: number; page: number; limit: number };
  }>;
  get: (id: string) => Promise<MasterDataRecord>;
  create: (input: Record<string, unknown>) => Promise<MasterDataRecord>;
  update: (id: string, input: Record<string, unknown>) => Promise<MasterDataRecord>;
};

export type PeoplePageProps = {
  description: string;
  eyebrow?: string;
  fields: PeopleField[];
  resource: PeopleResourceConfig;
  statusOptions: string[];
  title: string;
};

const statusMap: StatusBadgeMap = {
  ACTIVE: { label: "ACTIVE", variant: "success" },
  INACTIVE: { label: "INACTIVE", variant: "outline" },
  GRADUATED: { label: "GRADUATED", variant: "secondary" },
  TRANSFERRED: { label: "TRANSFERRED", variant: "warning" },
  RESIGNED: { label: "RESIGNED", variant: "warning" },
  PERMANENT: { label: "PERMANENT", variant: "success" },
  CONTRACT: { label: "CONTRACT", variant: "warning" },
  HONORARY: { label: "HONORARY", variant: "secondary" },
  PROBATION: { label: "PROBATION", variant: "outline" }
};

export function PeoplePage({ description, eyebrow, fields, resource, statusOptions, title }: PeoplePageProps) {
  const [editing, setEditing] = useState<MasterDataRecord | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [items, setItems] = useState<MasterDataRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [pendingDelete, setPendingDelete] = useState<MasterDataRecord | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [total, setTotal] = useState(0);

  const tableFields = useMemo(
    () => fields.filter((field) => field.table !== false).slice(0, 6),
    [fields]
  );

  async function loadData() {
    setError(null);
    setLoading(true);

    try {
      const response = await resource.list({
        limit: 50,
        page: 1,
        search: search || undefined,
        status: statusFilter || undefined
      });
      setItems(response.items);
      setTotal(response.meta?.total ?? response.items.length);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Gagal memuat data");
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

  function openCreate() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(item: MasterDataRecord) {
    setEditing(item);
    setFormOpen(true);
  }

  function handleDelete(item: MasterDataRecord) {
    setPendingDelete(item);
  }

  async function confirmDelete() {
    if (!pendingDelete) return;
    setError(null);

    try {
      await resource.delete(pendingDelete.id);
      setPendingDelete(null);
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
    const payload = buildPayload(fields, formData);

    try {
      if (editing) {
        await resource.update(editing.id, payload);
      } else {
        await resource.create(payload);
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

  const columns: DataTableColumn<MasterDataRecord>[] = tableFields.map((field) => ({
    cell: (item) => formatCell(item[field.name], field),
    header: field.label,
    key: field.name
  }));

  return (
    <div className="space-y-8">
      <PageHeader
        actions={
          <>
            <Button disabled title="Import akan tersedia di Phase berikutnya" variant="outline">
              <Upload className="h-4 w-4" /> Import
            </Button>
            <Button disabled title="Export akan tersedia di Phase berikutnya" variant="outline">
              <Download className="h-4 w-4" /> Export
            </Button>
            <Button onClick={loadData} variant="outline">
              <RefreshCcw className="h-4 w-4" /> Refresh
            </Button>
            <Button onClick={openCreate}>
              <Plus className="h-4 w-4" /> Tambah
            </Button>
          </>
        }
        breadcrumb={["Admin", "People Management", title]}
        description={description}
        eyebrow={eyebrow ?? "Phase 6 People Management"}
        title={title}
      />

      {error ? <ErrorState message={error} title="Gagal memproses data" /> : null}

      <SectionCard
        action={(
          <SearchFilterBar
            filters={[{ label: "Status", onChange: setStatusFilter, options: statusOptions.map((status) => ({ label: status, value: status })), placeholder: "Semua status", value: statusFilter }]}
            onSearchChange={setSearch}
            onSubmit={handleSearch}
            searchValue={search}
          />
        )}
        description={<>Search, filter, create, update, dan soft delete data. Total: <strong>{total}</strong> data.</>}
        title={`Data ${title}`}
      >
        <DataTable
          actions={(item) => (
            <>
              <Button onClick={() => openEdit(item)} size="sm" variant="outline"><Edit3 className="h-4 w-4" /> Edit</Button>
              <Button onClick={() => handleDelete(item)} size="sm" variant="ghost"><Trash2 className="h-4 w-4" /> Hapus</Button>
            </>
          )}
          columns={columns}
          data={items}
          emptyState={{ action: <Button onClick={openCreate} variant="soft">Tambah data pertama</Button>, description: "Belum ada data atau hasil pencarian kosong.", title: `Data ${title} kosong` }}
          getRowId={(item) => item.id}
          loading={loading}
          minWidth="min-w-[820px]"
        />
      </SectionCard>

      <FormModal description="Form People Management." onClose={() => setFormOpen(false)} open={formOpen} title={`${editing ? "Edit" : "Tambah"} ${title}`}>
        <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
          {fields.map((field) => <FieldInput field={field} item={editing} key={field.name} />)}
          <div className="flex flex-col-reverse gap-3 md:col-span-2 sm:flex-row sm:justify-end">
            <Button onClick={() => setFormOpen(false)} type="button" variant="outline">Batal</Button>
            <Button disabled={submitting} type="submit">{submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null} Simpan</Button>
          </div>
        </form>
      </FormModal>

      <ConfirmDialog
        description={`Hapus data ${String(pendingDelete?.name ?? pendingDelete?.nis ?? pendingDelete?.nip ?? pendingDelete?.id ?? "ini")}?`}
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => void confirmDelete()}
        open={Boolean(pendingDelete)}
        title="Konfirmasi hapus data"
      />
    </div>
  );
}

function FieldInput({ field, item }: { field: PeopleField; item: MasterDataRecord | null }) {
  const value = item?.[field.name];
  const type = field.type ?? "text";

  if (type === "checkbox") {
    return (
      <label className="flex items-center gap-3 rounded-2xl border bg-white px-4 py-3 text-sm font-bold text-slate-700">
        <input defaultChecked={value !== false} name={field.name} type="checkbox" />
        {field.label}
      </label>
    );
  }

  if (type === "select") {
    return (
      <label className="space-y-2">
        <span className="text-sm font-bold text-slate-700">{field.label}</span>
        <select
          className="w-full rounded-2xl border border-input bg-white px-4 py-2 text-sm shadow-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
          defaultValue={typeof value === "string" ? value : ""}
          name={field.name}
          required={field.required}
        >
          <option value="" disabled>
            Pilih {field.label}
          </option>
          {(field.options ?? []).map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>
    );
  }

  return (
    <label className="space-y-2">
      <span className="text-sm font-bold text-slate-700">{field.label}</span>
      <Input
        defaultValue={normalizeInputValue(value, type)}
        name={field.name}
        placeholder={field.placeholder}
        required={field.required}
        type={type}
      />
    </label>
  );
}

function buildPayload(fields: PeopleField[], formData: FormData) {
  const payload: Record<string, unknown> = {};

  for (const field of fields) {
    const type = field.type ?? "text";

    if (type === "checkbox") {
      payload[field.name] = formData.get(field.name) === "on";
      continue;
    }

    const rawValue = formData.get(field.name);

    if (typeof rawValue !== "string" || rawValue.trim() === "") {
      if (field.required) payload[field.name] = "";
      else payload[field.name] = null;
      continue;
    }

    const trimmed = rawValue.trim();

    if (type === "number") {
      payload[field.name] = Number(trimmed);
      continue;
    }

    payload[field.name] = trimmed;
  }

  return payload;
}

function formatCell(value: unknown, field: PeopleField) {
  if (value === null || value === undefined || value === "") return "-";
  if (typeof value === "boolean") return value ? "Ya" : "Tidak";
  if (typeof value === "object") {
    const record = value as Record<string, unknown>;
    return String(record.name ?? record.code ?? record.id ?? "-");
  }
  const stringValue = String(value);

  if (field.name === "status" || field.name === "employmentStatus") {
    return <StatusBadge map={statusMap} value={stringValue} />;
  }

  if (field.name === "gender") {
    return stringValue === "MALE" ? "Laki-laki" : "Perempuan";
  }

  if (field.name === "relation") {
    const map: Record<string, string> = {
      FATHER: "Ayah",
      MOTHER: "Ibu",
      GUARDIAN: "Wali",
      GRANDPARENT: "Kakek/Nenek",
      SIBLING: "Saudara",
      OTHER: "Lainnya"
    };
    return map[stringValue] ?? stringValue;
  }

  return stringValue;
}

function normalizeInputValue(value: unknown, type: PeopleFieldType) {
  if (value === null || value === undefined) return "";
  if (type === "date" && typeof value === "string") return value.slice(0, 10);
  return String(value);
}
