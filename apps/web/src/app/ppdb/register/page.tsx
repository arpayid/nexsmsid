"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

import type { MasterDataRecord, PpdbPeriodRecord } from "@nexsmsid/api-client";
import { Badge, Button, Card, CardContent, CardHeader, CardTitle, Input } from "@nexsmsid/ui";

import { createBrowserApiClient } from "@/lib/api-client";

export default function PpdbRegisterPage() {
  const api = useMemo(() => createBrowserApiClient(), []);
  const [departments, setDepartments] = useState<MasterDataRecord[]>([]);
  const [competencies, setCompetencies] = useState<MasterDataRecord[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<PpdbPeriodRecord | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadReferenceData() {
      setLoading(true);
      setError(null);
      try {
        const [periodRes, deptRes, compRes] = await Promise.all([
          api.getActivePpdbPeriod(),
          api.masterDataList("departments", { limit: 100 }),
          api.masterDataList("competencies", { limit: 100 })
        ]);
        if (active) {
          setPeriod(periodRes as unknown as PpdbPeriodRecord);
          setDepartments(deptRes.data);
          setCompetencies(compRes.data);
        }
      } catch (loadError) {
        if (active) {
          setError(loadError instanceof Error ? loadError.message : "Gagal memuat data pendaftaran");
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadReferenceData();
    return () => { active = false; };
  }, [api]);

  const [selectedDept, setSelectedDept] = useState("");

  const filteredCompetencies = useMemo(
    () => competencies.filter((c) => !selectedDept || (c.departmentId as string) === selectedDept),
    [competencies, selectedDept]
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);
    const formData = new FormData(event.currentTarget);
    const payload: Record<string, unknown> = {
      periodId: formData.get("periodId"),
      name: formData.get("name"),
      gender: formData.get("gender"),
      birthPlace: formData.get("birthPlace"),
      birthDate: formData.get("birthDate"),
      address: formData.get("address"),
      phone: formData.get("phone"),
      email: formData.get("email"),
      previousSchool: formData.get("previousSchool"),
      departmentId: formData.get("departmentId"),
      competencyId: formData.get("competencyId")
    };
    try {
      const response = await api.publicPpdbRegister(payload);
      const reg = response as Record<string, unknown>;
      setSuccess(reg.registrationNumber as string ?? "Pendaftaran berhasil");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Gagal mengirim pendaftaran");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4">
        <Card className="w-full max-w-lg">
          <CardContent>
            <div className="grid min-h-32 place-items-center text-sm font-bold text-slate-600">
              <span className="inline-flex items-center gap-2"><Loader2 className="h-5 w-5 animate-spin text-primary" /> Memuat formulir pendaftaran...</span>
            </div>
          </CardContent>
        </Card>
      </main>
    );
  }

  if (error && !period) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4">
        <Card className="w-full max-w-lg">
          <CardContent>
            <div className="flex items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
              <AlertCircle className="h-5 w-5" /> {error}
            </div>
          </CardContent>
        </Card>
      </main>
    );
  }

  if (success) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4">
        <Card className="w-full max-w-lg">
          <CardHeader>
            <div className="flex justify-center">
              <CheckCircle2 className="h-16 w-16 text-emerald-500" />
            </div>
            <CardTitle className="text-center">Pendaftaran Berhasil</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-muted-foreground">Nomor registrasi Anda:</p>
            <p className="mt-2 text-2xl font-black tracking-wider text-primary">{success}</p>
            <p className="mt-4 text-sm text-muted-foreground">Simpan nomor registrasi untuk memantau status pendaftaran.</p>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-start justify-center px-4 py-16">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Formulir Pendaftaran PPDB</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">
            {period ? `Periode: ${period.name as string}` : "Tidak ada periode aktif"}
          </p>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="mb-6 flex items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
              <AlertCircle className="h-5 w-5" /> {error}
            </div>
          ) : null}

          <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
            {period ? (
              <input name="periodId" type="hidden" value={period.id as string} />
            ) : null}

            <label className="space-y-2 md:col-span-2">
              <span className="text-sm font-bold text-slate-700">Nama Lengkap <span className="text-rose-500">*</span></span>
              <Input name="name" required placeholder="Nama lengkap sesuai ijazah" />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-bold text-slate-700">Jenis Kelamin <span className="text-rose-500">*</span></span>
              <select className="w-full rounded-2xl border border-input bg-white px-4 py-2 text-sm shadow-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                name="gender" required>
                <option value="" disabled>Pilih Jenis Kelamin</option>
                <option value="MALE">Laki-laki</option>
                <option value="FEMALE">Perempuan</option>
              </select>
            </label>

            <label className="space-y-2">
              <span className="text-sm font-bold text-slate-700">Tempat Lahir</span>
              <Input name="birthPlace" placeholder="Tempat lahir" />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-bold text-slate-700">Tanggal Lahir</span>
              <Input name="birthDate" type="date" />
            </label>

            <label className="space-y-2 md:col-span-2">
              <span className="text-sm font-bold text-slate-700">Alamat</span>
              <textarea className="w-full rounded-2xl border border-input bg-white px-4 py-2 text-sm shadow-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                name="address" placeholder="Alamat lengkap" rows={3} />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-bold text-slate-700">Telepon <span className="text-rose-500">*</span></span>
              <Input name="phone" required placeholder="Nomor telepon/WA" type="tel" />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-bold text-slate-700">Email</span>
              <Input name="email" placeholder="Email aktif" type="email" />
            </label>

            <label className="space-y-2 md:col-span-2">
              <span className="text-sm font-bold text-slate-700">Asal Sekolah</span>
              <Input name="previousSchool" placeholder="Nama sekolah sebelumnya" />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-bold text-slate-700">Jurusan</span>
              <select className="w-full rounded-2xl border border-input bg-white px-4 py-2 text-sm shadow-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                name="departmentId" onChange={(e) => setSelectedDept(e.target.value)} value={selectedDept}>
                <option value="">Pilih Jurusan</option>
                {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </label>

            <label className="space-y-2">
              <span className="text-sm font-bold text-slate-700">Kompetensi</span>
              <select className="w-full rounded-2xl border border-input bg-white px-4 py-2 text-sm shadow-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                name="competencyId">
                <option value="">Pilih Kompetensi</option>
                {filteredCompetencies.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </label>

            <div className="flex gap-3 md:col-span-2">
              <Button disabled={submitting || !period} type="submit">
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null} Daftar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
