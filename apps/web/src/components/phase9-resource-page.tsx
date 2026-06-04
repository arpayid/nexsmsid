"use client";

import { FormEvent, ReactNode, useEffect, useMemo, useState } from "react";
import { AlertCircle, Edit3, Loader2, Plus, RefreshCcw, Search, Trash2, X } from "lucide-react";

import { Badge, Button, Card, CardContent, CardHeader, CardTitle, EmptyState, Input, PageHeader } from "@nexsmsid/ui";

import { createBrowserApiClient } from "@/lib/api-client";

type Api = ReturnType<typeof createBrowserApiClient>;
type Row = Record<string, unknown>;
type ListResult = { items: Row[]; meta?: { total?: number } };
type BadgeVariant = "outline" | "info" | "warning" | "success" | "secondary";

export type Phase9Field = {
  label: string;
  name: string;
  options?: Array<{ label: string; value: string }>;
  placeholder?: string;
  required?: boolean;
  type?: "text" | "number" | "date" | "textarea" | "select";
};

export type Phase9Column = {
  key: string;
  label: string;
  render?: (row: Row) => ReactNode;
};

export type Phase9Action = {
  label: string;
  run: (api: Api, row: Row) => Promise<unknown>;
  show?: (row: Row) => boolean;
  variant?: "primary" | "secondary" | "soft" | "outline" | "ghost";
};

type Props = {
  breadcrumb: string[];
  columns: Phase9Column[];
  create?: (api: Api, input: Row) => Promise<unknown>;
  delete?: (api: Api, id: string) => Promise<unknown>;
  description: string;
  eyebrow: string;
  fields?: Phase9Field[];
  load: (api: Api, options: { limit: number; page: number; search?: string; status?: string }) => Promise<ListResult>;
  rowActions?: Phase9Action[];
  statusOptions?: Array<{ label: string; value: string }>;
  statusMap?: Record<string, { label: string; variant: BadgeVariant }>;
  title: string;
  update?: (api: Api, id: string, input: Row) => Promise<unknown>;
};

export function Phase9ResourcePage(props: Props) {
  const api = useMemo(() => createBrowserApiClient(), []);
  const [editing, setEditing] = useState<Row | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [items, setItems] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [total, setTotal] = useState(0);

  async function loadData() {
    setError(null);
    setLoading(true);
    try {
      const response = await props.load(api, { limit: 50, page: 1, search: search || undefined, status: status || undefined });
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

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!props.create && !props.update) return;
    setSubmitting(true);
    setError(null);
    const formData = new FormData(event.currentTarget);
    const payload: Row = {};

    for (const field of props.fields ?? []) {
      const value = formData.get(field.name);
      if (value === null || value === "") continue;
      payload[field.name] = field.type === "number" ? Number(value) : value;
    }

    try {
      if (editing && props.update) await props.update(api, editing.id as string, payload);
      else if (props.create) await props.create(api, payload);
      setEditing(null);
      setFormOpen(false);
      await loadData();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Gagal menyimpan data");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(row: Row) {
    if (!props.delete) return;
    const confirmed = window.confirm("Hapus data ini?");
    if (!confirmed) return;
    setError(null);
    try {
      await props.delete(api, row.id as string);
      await loadData();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Gagal menghapus data");
    }
  }

  async function runAction(action: Phase9Action, row: Row) {
    setError(null);
    try {
      await action.run(api, row);
      await loadData();
    } catch (actionError) {
      setError(actionError instanceof Error ? actionError.message : "Aksi gagal dijalankan");
    }
  }

  function statusBadge(value: unknown) {
    const key = String(value ?? "-");
    const info = props.statusMap?.[key] ?? { label: key, variant: "outline" as const };
    return <Badge variant={info.variant}>{info.label}</Badge>;
  }

  return (
    <div className="space-y-8">
      <PageHeader
        actions={(
          <>
            <Button onClick={loadData} variant="outline"><RefreshCcw className="h-4 w-4" /> Refresh</Button>
            {props.create ? <Button onClick={() => { setEditing(null); setFormOpen(true); }}><Plus className="h-4 w-4" /> Tambah</Button> : null}
          </>
        )}
        breadcrumb={props.breadcrumb}
        description={props.description}
        eyebrow={props.eyebrow}
        title={props.title}
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
              <CardTitle>{props.title}</CardTitle>
              <p className="mt-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">Total: {total} data</p>
            </div>
            <form className="flex w-full flex-col gap-3 lg:w-auto lg:flex-row lg:items-center" onSubmit={handleSearch}>
              <div className="relative w-full lg:max-w-sm">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input className="pl-11" onChange={(event) => setSearch(event.target.value)} placeholder="Cari data..." value={search} />
              </div>
              {props.statusOptions ? (
                <select className="h-11 rounded-xl border border-border bg-white px-4 text-sm font-semibold text-slate-700" onChange={(event) => setStatus(event.target.value)} value={status}>
                  <option value="">Semua status</option>
                  {props.statusOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                </select>
              ) : null}
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
                    {props.columns.map((column) => <th className="px-4 py-3 font-black" key={column.key}>{column.label}</th>)}
                    <th className="px-4 py-3 text-right font-black">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((row) => (
                    <tr className="border-b last:border-0" key={row.id as string}>
                      {props.columns.map((column) => (
                        <td className="px-4 py-4 font-semibold text-slate-700" key={column.key}>
                          {column.render ? column.render(row) : column.key === "status" ? statusBadge(row.status) : String(getPath(row, column.key) ?? "-")}
                        </td>
                      ))}
                      <td className="px-4 py-4">
                        <div className="flex flex-wrap justify-end gap-2">
                          {(props.rowActions ?? []).filter((action) => action.show?.(row) ?? true).map((action) => (
                            <Button key={action.label} onClick={() => void runAction(action, row)} size="sm" variant={action.variant ?? "soft"}>{action.label}</Button>
                          ))}
                          {props.update ? <Button onClick={() => { setEditing(row); setFormOpen(true); }} size="sm" variant="outline"><Edit3 className="h-4 w-4" /> Edit</Button> : null}
                          {props.delete ? <Button onClick={() => void handleDelete(row)} size="sm" variant="ghost"><Trash2 className="h-4 w-4" /> Hapus</Button> : null}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState title="Data masih kosong" description="Belum ada data untuk filter saat ini." />
          )}
        </CardContent>
      </Card>

      {formOpen ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4">
          <Card className="max-h-[90vh] w-full max-w-3xl overflow-y-auto border-primary/20">
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardTitle>{editing ? "Edit Data" : "Tambah Data"}</CardTitle>
                  <p className="mt-1 text-sm text-muted-foreground">Lengkapi field yang tersedia.</p>
                </div>
                <Button onClick={() => setFormOpen(false)} size="icon" variant="ghost"><X className="h-4 w-4" /></Button>
              </div>
            </CardHeader>
            <CardContent>
              <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
                {(props.fields ?? []).map((field) => (
                  <label className={field.type === "textarea" ? "space-y-2 md:col-span-2" : "space-y-2"} key={field.name}>
                    <span className="text-sm font-bold text-slate-700">{field.label}{field.required ? <span className="text-rose-500"> *</span> : null}</span>
                    {field.type === "select" ? (
                      <select className="h-11 w-full rounded-xl border border-border bg-white px-4 text-sm font-semibold text-slate-700" defaultValue={String(editing?.[field.name] ?? "")} name={field.name} required={field.required}>
                        <option value="">Pilih...</option>
                        {(field.options ?? []).map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                      </select>
                    ) : field.type === "textarea" ? (
                      <textarea className="min-h-24 w-full rounded-xl border border-border bg-white px-4 py-3 text-sm font-semibold text-slate-700" defaultValue={String(editing?.[field.name] ?? "")} name={field.name} placeholder={field.placeholder} required={field.required} />
                    ) : (
                      <Input defaultValue={formatDefault(editing?.[field.name], field.type)} name={field.name} placeholder={field.placeholder} required={field.required} type={field.type ?? "text"} />
                    )}
                  </label>
                ))}
                <div className="flex justify-end gap-3 md:col-span-2">
                  <Button onClick={() => setFormOpen(false)} type="button" variant="outline">Batal</Button>
                  <Button disabled={submitting} type="submit">{submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null} Simpan</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      ) : null}
    </div>
  );
}

export function statusMap(values: string[]): Record<string, { label: string; variant: BadgeVariant }> {
  return Object.fromEntries(values.map((value) => [value, { label: value, variant: value.includes("APPROVED") || value.includes("ACCEPTED") || value.includes("PUBLISHED") || value.includes("COMPLETED") || value.includes("ACTIVE") || value.includes("WORKING") ? "success" : value.includes("REJECTED") || value.includes("CANCELLED") || value.includes("CLOSED") || value.includes("UNEMPLOYED") ? "warning" : value.includes("ONGOING") || value.includes("REVIEW") ? "info" : "outline" }])) as Record<string, { label: string; variant: BadgeVariant }>;
}

export function options(values: string[]) {
  return values.map((value) => ({ label: value, value }));
}

function getPath(row: Row, path: string) {
  return path.split(".").reduce<unknown>((value, key) => (value as Record<string, unknown> | null | undefined)?.[key], row);
}

function formatDefault(value: unknown, type?: string) {
  if (!value) return "";
  if (type === "date") return String(value).slice(0, 10);
  return String(value);
}
