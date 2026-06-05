"use client";

import { FormEvent, useEffect, useState } from "react";
import { Edit3, Loader2, Plus, RefreshCcw, Trash2 } from "lucide-react";

import type { MasterDataRecord } from "@nexsmsid/api-client";
import { Button, ConfirmDialog, DataTable, ErrorState, FormModal, Input, PageHeader, SearchFilterBar, SectionCard, StatusBadge } from "@nexsmsid/ui";
import type { DataTableColumn } from "@nexsmsid/ui";

import { createBrowserApiClient } from "@/lib/api-client";

export type MasterDataField = {
  label: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  table?: boolean;
  type?: "checkbox" | "date" | "number" | "text" | "textarea" | "time";
};

export type MasterDataPageProps = {
  description: string;
  fields: MasterDataField[];
  resource: string;
  title: string;
};

export function MasterDataPage({ description, fields, resource, title }: MasterDataPageProps) {
  const [editing, setEditing] = useState<MasterDataRecord | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [items, setItems] = useState<MasterDataRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [pendingDelete, setPendingDelete] = useState<MasterDataRecord | null>(null);
  const [search, setSearch] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const tableFields = fields.filter((field) => field.table !== false).slice(0, 5);

  async function loadData() {
    setError(null);
    setLoading(true);

    try {
      const response = await createBrowserApiClient().masterDataList(resource, {
        limit: 50,
        search: search || undefined
      });
      setItems(response.data);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Gagal memuat data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadData();
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
      await createBrowserApiClient().masterDataDelete(resource, pendingDelete.id);
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
        await createBrowserApiClient().masterDataUpdate(resource, editing.id, payload);
      } else {
        await createBrowserApiClient().masterDataCreate(resource, payload);
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

  const columns: DataTableColumn<MasterDataRecord>[] = [
    ...tableFields.map<DataTableColumn<MasterDataRecord>>((field) => ({
      cell: (item) => formatCell(item[field.name]),
      header: field.label,
      key: field.name
    })),
    {
      cell: (item) => <StatusBadge map={{ Active: { label: "Active", variant: "success" }, Inactive: { label: "Inactive", variant: "outline" } }} value={item.isActive === false ? "Inactive" : "Active"} />,
      header: "Status",
      key: "status"
    }
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        actions={
          <>
            <Button onClick={loadData} variant="outline">
              <RefreshCcw className="h-4 w-4" /> Refresh
            </Button>
            <Button onClick={openCreate}>
              <Plus className="h-4 w-4" /> Tambah
            </Button>
          </>
        }
        breadcrumb={["Admin", "Master Data", title]}
        description={description}
        eyebrow="Phase 5 Master Data"
        title={title}
      />

      {error ? <ErrorState message={error} title="Gagal memproses master data" /> : null}

      <SectionCard
        action={<SearchFilterBar onSearchChange={setSearch} onSubmit={handleSearch} searchValue={search} />}
        description="Search, create, update, dan soft delete data master."
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
          minWidth="min-w-[720px]"
        />
      </SectionCard>

      <FormModal description="Form sederhana untuk master data." onClose={() => setFormOpen(false)} open={formOpen} title={`${editing ? "Edit" : "Tambah"} ${title}`}>
        <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
          {fields.map((field) => <FieldInput field={field} item={editing} key={field.name} />)}
          <div className="flex flex-col-reverse gap-3 md:col-span-2 sm:flex-row sm:justify-end">
            <Button onClick={() => setFormOpen(false)} type="button" variant="outline">Batal</Button>
            <Button disabled={submitting} type="submit">{submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null} Simpan</Button>
          </div>
        </form>
      </FormModal>

      <ConfirmDialog
        description={`Hapus ${String(pendingDelete?.name ?? pendingDelete?.code ?? pendingDelete?.id ?? "data ini")}?`}
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => void confirmDelete()}
        open={Boolean(pendingDelete)}
        title="Konfirmasi hapus data"
      />
    </div>
  );
}

function FieldInput({ field, item }: { field: MasterDataField; item: MasterDataRecord | null }) {
  const value = item?.[field.name];
  const type = field.type ?? "text";
  const defaultValue = normalizeInputValue(value, type);

  if (type === "checkbox") {
    return (
      <label className="flex items-center gap-3 rounded-2xl border bg-white px-4 py-3 text-sm font-bold text-slate-700">
        <input defaultChecked={value !== false} name={field.name} type="checkbox" />
        {field.label}
      </label>
    );
  }

  if (type === "textarea") {
    return (
      <label className="space-y-2 md:col-span-2">
        <span className="text-sm font-bold text-slate-700">{field.label}</span>
        <textarea
          className="min-h-28 w-full rounded-2xl border border-input bg-white px-4 py-3 text-sm shadow-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
          defaultValue={defaultValue}
          name={field.name}
          placeholder={field.placeholder}
          required={field.required}
        />
      </label>
    );
  }

  return (
    <label className="space-y-2">
      <span className="text-sm font-bold text-slate-700">{field.label}</span>
      <Input
        defaultValue={defaultValue}
        name={field.name}
        placeholder={field.placeholder}
        required={field.required}
        type={type}
      />
    </label>
  );
}

function buildPayload(fields: MasterDataField[], formData: FormData) {
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
      continue;
    }

    payload[field.name] = type === "number" ? Number(rawValue) : rawValue.trim();
  }

  return payload;
}

function formatCell(value: unknown) {
  if (value === null || value === undefined || value === "") return "-";
  if (typeof value === "boolean") return value ? "Ya" : "Tidak";
  if (typeof value === "object") {
    const record = value as Record<string, unknown>;
    return String(record.name ?? record.code ?? record.id ?? "-");
  }
  return String(value);
}

function normalizeInputValue(value: unknown, type: MasterDataField["type"]) {
  if (value === null || value === undefined) return "";
  if (type === "date" && typeof value === "string") return value.slice(0, 10);
  return String(value);
}
