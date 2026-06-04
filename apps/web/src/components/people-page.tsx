"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { AlertCircle, Download, Edit3, Loader2, Plus, RefreshCcw, Search, Trash2, Upload, X } from "lucide-react";

import type { MasterDataRecord } from "@nexsmsid/api-client";
import { Badge, Button, Card, CardContent, CardHeader, CardTitle, EmptyState, Input, PageHeader } from "@nexsmsid/ui";

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

const statusVariant: Record<string, "default" | "info" | "outline" | "secondary" | "success" | "warning"> = {
  ACTIVE: "success",
  INACTIVE: "outline",
  GRADUATED: "secondary",
  TRANSFERRED: "warning",
  RESIGNED: "warning",
  PERMANENT: "success",
  CONTRACT: "warning",
  HONORARY: "secondary",
  PROBATION: "outline"
};

export function PeoplePage({ description, eyebrow, fields, resource, statusOptions, title }: PeoplePageProps) {
  const [editing, setEditing] = useState<MasterDataRecord | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [items, setItems] = useState<MasterDataRecord[]>([]);
  const [loading, setLoading] = useState(true);
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

  async function handleDelete(item: MasterDataRecord) {
    const confirmed = window.confirm(
      `Hapus data ${String(item.name ?? item.nis ?? item.nip ?? item.id)}?`
    );

    if (!confirmed) return;

    setError(null);

    try {
      await resource.delete(item.id);
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

      {error ? (
        <div className="flex items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
          <AlertCircle className="h-5 w-5" /> {error}
        </div>
      ) : null}

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <CardTitle>Data {title}</CardTitle>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Search, filter, create, update, dan soft delete data People Management.
              </p>
              <p className="mt-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Total: {total} data
              </p>
            </div>
            <form
              className="flex w-full flex-col gap-3 lg:flex-row lg:items-center lg:justify-end"
              onSubmit={handleSearch}
            >
              <select
                className="rounded-2xl border border-input bg-white px-4 py-2 text-sm font-semibold shadow-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                onChange={(event) => setStatusFilter(event.target.value)}
                value={statusFilter}
              >
                <option value="">Semua status</option>
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              <div className="relative w-full lg:max-w-sm">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  className="pl-11"
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Cari data..."
                  value={search}
                />
              </div>
              <Button type="submit" variant="soft">
                Cari
              </Button>
            </form>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="grid min-h-48 place-items-center rounded-3xl border border-dashed bg-slate-50 text-sm font-bold text-slate-600">
              <span className="inline-flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin text-primary" /> Memuat data...
              </span>
            </div>
          ) : items.length ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[820px] text-left text-sm">
                <thead>
                  <tr className="border-b text-xs uppercase tracking-[0.14em] text-muted-foreground">
                    {tableFields.map((field) => (
                      <th className="px-4 py-3 font-black" key={field.name}>
                        {field.label}
                      </th>
                    ))}
                    <th className="px-4 py-3 text-right font-black">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr className="border-b last:border-0" key={item.id}>
                      {tableFields.map((field) => (
                        <td className="px-4 py-4 font-semibold text-slate-700" key={field.name}>
                          {formatCell(item[field.name], field)}
                        </td>
                      ))}
                      <td className="px-4 py-4">
                        <div className="flex justify-end gap-2">
                          <Button onClick={() => openEdit(item)} size="sm" variant="outline">
                            <Edit3 className="h-4 w-4" /> Edit
                          </Button>
                          <Button onClick={() => handleDelete(item)} size="sm" variant="ghost">
                            <Trash2 className="h-4 w-4" /> Hapus
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState
              action={
                <Button onClick={openCreate} variant="soft">
                  Tambah data pertama
                </Button>
              }
              description="Belum ada data atau hasil pencarian kosong."
              title={`Data ${title} kosong`}
            />
          )}
        </CardContent>
      </Card>

      {formOpen ? (
        <Card className="border-primary/20">
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardTitle>
                  {editing ? "Edit" : "Tambah"} {title}
                </CardTitle>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Form People Management untuk Phase 6.
                </p>
              </div>
              <Button onClick={() => setFormOpen(false)} size="icon" variant="ghost">
                <X className="h-5 w-5" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
              {fields.map((field) => (
                <FieldInput field={field} item={editing} key={field.name} />
              ))}
              <div className="flex gap-3 md:col-span-2">
                <Button disabled={submitting} type="submit">
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  Simpan
                </Button>
                <Button onClick={() => setFormOpen(false)} type="button" variant="outline">
                  Batal
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : null}
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
    const variant = statusVariant[stringValue] ?? "secondary";
    return <Badge variant={variant}>{stringValue}</Badge>;
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
