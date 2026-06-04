"use client";

import { FormEvent, useMemo, useState } from "react";
import { ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

import { Button, Card, Input } from "@nexsmsid/ui";

import { createBrowserApiClient } from "@/lib/api-client";

export default function JobApplyPage() {
  const params = useParams<{ id: string }>();
  const api = useMemo(() => createBrowserApiClient(), []);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    const formData = new FormData(event.currentTarget);
    try {
      await api.publicApplyJob(params.id, {
        applicantName: formData.get("applicantName"),
        applicantEmail: formData.get("applicantEmail") || undefined,
        applicantPhone: formData.get("applicantPhone") || undefined,
        cvUrl: formData.get("cvUrl") || undefined,
        note: formData.get("note") || undefined
      });
      setSubmitted(true);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Gagal mengirim lamaran");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl space-y-8">
        <Button asChild variant="ghost"><Link href={`/jobs/${params.id}`}><ArrowLeft className="h-4 w-4" /> Kembali</Link></Button>
        <Card className="p-8">
          {submitted ? (
            <div className="text-center">
              <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-600" />
              <h1 className="mt-4 text-3xl font-black text-slate-950">Lamaran Terkirim</h1>
              <p className="mt-3 text-muted-foreground">Tim BKK akan meninjau lamaran Anda.</p>
            </div>
          ) : (
            <>
              <h1 className="text-3xl font-black tracking-[-0.04em] text-slate-950">Form Lamaran</h1>
              <p className="mt-2 text-muted-foreground">Isi data pelamar. Upload CV masih berupa URL placeholder.</p>
              {error ? <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">{error}</div> : null}
              <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
                <Input name="applicantName" placeholder="Nama lengkap" required />
                <Input name="applicantEmail" placeholder="Email" type="email" />
                <Input name="applicantPhone" placeholder="Nomor HP" />
                <Input name="cvUrl" placeholder="URL CV" />
                <textarea className="min-h-24 rounded-xl border border-border px-4 py-3 text-sm font-semibold" name="note" placeholder="Catatan singkat" />
                <Button disabled={submitting} type="submit">{submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null} Kirim Lamaran</Button>
              </form>
            </>
          )}
        </Card>
      </div>
    </main>
  );
}
