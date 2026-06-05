"use client";

import { FormEvent, useEffect, useState } from "react";
import { Loader2, RefreshCcw, Save } from "lucide-react";

import type { SchoolProfile } from "@nexsmsid/api-client";
import { Button, ErrorState, Input, LoadingState, PageHeader, SectionCard } from "@nexsmsid/ui";

import { createBrowserApiClient } from "@/lib/api-client";

const fields = [
  { name: "name", label: "Nama Sekolah", required: true },
  { name: "npsn", label: "NPSN" },
  { name: "principalName", label: "Kepala Sekolah" },
  { name: "phone", label: "Telepon" },
  { name: "email", label: "Email", type: "email" },
  { name: "website", label: "Website", type: "url" },
  { name: "logoUrl", label: "Logo URL", type: "url" }
] as const;

export default function SchoolProfilePage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<SchoolProfile | null>(null);
  const [saving, setSaving] = useState(false);

  async function loadProfile() {
    setError(null);
    setLoading(true);

    try {
      setProfile(await createBrowserApiClient().schoolProfile());
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Gagal memuat profil sekolah");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadProfile();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const payload: Record<string, string | null> = {};

    for (const [key, value] of formData.entries()) {
      if (typeof value === "string") {
        const trimmed = value.trim();
        payload[key] = key === "name" ? trimmed : trimmed || null;
      }
    }

    try {
      setProfile(await createBrowserApiClient().updateSchoolProfile(payload));
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Gagal menyimpan profil sekolah");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader
        actions={<Button onClick={loadProfile} variant="outline"><RefreshCcw className="h-4 w-4" /> Refresh</Button>}
        breadcrumb={["Admin", "Profil Sekolah"]}
        description="Profil sekolah awal untuk fondasi data NexSMSID."
        eyebrow="Phase 5"
        title="Profil Sekolah"
      />

      {error ? <ErrorState message={error} onRetry={loadProfile} title="Gagal memuat profil sekolah" /> : null}

      <SectionCard description="Informasi dasar sekolah yang dipakai sebagai identitas sistem." title="Data Profil Sekolah">
          {loading ? (
            <LoadingState label="Memuat profil sekolah..." />
          ) : (
            <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
              {fields.map((field) => (
                <label className="space-y-2" key={field.name}>
                  <span className="text-sm font-bold text-slate-700">{field.label}</span>
                  <Input
                    defaultValue={String(profile?.[field.name] ?? "")}
                    name={field.name}
                    required={"required" in field ? field.required : false}
                    type={"type" in field ? field.type : "text"}
                  />
                </label>
              ))}
              <label className="space-y-2 md:col-span-2">
                <span className="text-sm font-bold text-slate-700">Alamat</span>
                <textarea className="min-h-24 w-full rounded-2xl border border-input bg-white px-4 py-3 text-sm shadow-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10" defaultValue={profile?.address ?? ""} name="address" />
              </label>
              <label className="space-y-2 md:col-span-2">
                <span className="text-sm font-bold text-slate-700">Deskripsi</span>
                <textarea className="min-h-24 w-full rounded-2xl border border-input bg-white px-4 py-3 text-sm shadow-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10" defaultValue={profile?.description ?? ""} name="description" />
              </label>
              <div className="md:col-span-2">
                <Button disabled={saving} type="submit">
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Simpan Profil
                </Button>
              </div>
            </form>
          )}
      </SectionCard>
    </div>
  );
}
