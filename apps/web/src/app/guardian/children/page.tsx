"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2, Users } from "lucide-react";

import { Badge, Card, CardContent, CardHeader, CardTitle, EmptyState, ErrorState, PageHeader, SectionCard } from "@nexsmsid/ui";

import { createBrowserApiClient } from "@/lib/api-client";
import { getStoredChildId, setStoredChildId } from "@/lib/guardian-preferences";

type Child = {
  id: string;
  nis: string;
  nisn?: string | null;
  name: string;
  classroom?: { name: string; competency?: { name: string } | null } | null;
  isPrimary: boolean;
};

export default function GuardianChildrenPage() {
  const api = useMemo(() => createBrowserApiClient(), []);
  const [items, setItems] = useState<Child[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = (await api.getGuardianPortalChildren()) as Child[];
        if (!active) return;
        setItems(data);
        const stored = getStoredChildId();
        if (stored && data.some((c) => c.id === stored)) {
          setSelected(stored);
        } else if (data.length > 0) {
          const primary = data.find((c) => c.isPrimary);
          const defaultId = primary?.id ?? data[0].id;
          setSelected(defaultId);
          setStoredChildId(defaultId);
        }
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : "Gagal memuat data anak");
      } finally {
        if (active) setLoading(false);
      }
    }
    void load();
    return () => {
      active = false;
    };
  }, [api]);

  if (loading)
    return (
      <div className="grid min-h-[60vh] place-items-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  if (error) return <ErrorState message={error} title="Gagal memuat data anak" />;
  if (items.length === 0) return <EmptyState description="Belum ada anak yang terhubung." title="Belum ada anak" />;

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb={["Portal Wali", "Anak"]}
        description="Pilih anak untuk melihat detailnya. Pilihan akan dipakai di halaman Presensi, Nilai, dan Tagihan."
        eyebrow="Portal Wali"
        title="Anak Anda"
      />
      <div className="grid gap-4 md:grid-cols-2">
        {items.map((c) => {
          const isActive = selected === c.id;
          return (
            <button
              key={c.id}
              onClick={() => {
                setSelected(c.id);
                setStoredChildId(c.id);
              }}
              className="text-left"
              type="button"
            >
              <Card className={isActive ? "ring-2 ring-primary" : undefined}>
                <CardHeader>
                  <div className="flex items-center justify-between gap-2">
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-primary" /> {c.name}
                    </CardTitle>
                    {c.isPrimary ? <Badge variant="success">Wali Utama</Badge> : null}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-2 text-sm sm:grid-cols-2">
                    <div>
                      <p className="text-xs uppercase tracking-widest text-muted-foreground">NIS</p>
                      <p className="font-semibold">{c.nis}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-widest text-muted-foreground">NISN</p>
                      <p className="font-semibold">{c.nisn ?? "-"}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-widest text-muted-foreground">Kelas</p>
                      <p className="font-semibold">{c.classroom?.name ?? "-"}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-widest text-muted-foreground">Kompetensi</p>
                      <p className="font-semibold">{c.classroom?.competency?.name ?? "-"}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </button>
          );
        })}
      </div>
      <SectionCard description="Anak yang sedang dipilih dipakai di halaman lain." title="Pilihan Aktif">
        {selected ? (
          <p className="text-sm text-slate-700">
            Sedang melihat data untuk:{" "}
            <span className="font-semibold">{items.find((c) => c.id === selected)?.name ?? "-"}</span>
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">Pilih salah satu anak di atas.</p>
        )}
      </SectionCard>
    </div>
  );
}
