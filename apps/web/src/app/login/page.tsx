"use client";

import { ArrowRight, Loader2, LockKeyhole, School } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useEffect, useState, startTransition } from "react";

import { Badge, Button, Card, CardContent, CardHeader, CardTitle, Input } from "@nexsmsid/ui";

import { createBrowserApiClient } from "@/lib/api-client";
import { getAccessToken, storeAuthTokens } from "@/lib/auth-storage";

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginLoading />}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") || "/admin";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (getAccessToken()) {
      router.replace(nextPath);
    }
  }, [nextPath, router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const tokens = await createBrowserApiClient().login({ email, password });
      storeAuthTokens(tokens);
      startTransition(() => router.replace(nextPath));
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "Login gagal");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center px-4 py-10 sm:px-6 lg:px-8">
      <div className="absolute inset-0 -z-10 bg-grid-soft opacity-60" />
      <div className="w-full max-w-md">
        <Link className="mx-auto mb-8 flex w-max items-center gap-3" href="/">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-soft">
            <School className="h-6 w-6" />
          </span>
          <span>
            <span className="block text-xl font-black tracking-tight text-slate-950">NexSMSID</span>
            <span className="block text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">Admin Login</span>
          </span>
        </Link>

        <Card className="border-white/80 bg-white/95 shadow-soft">
          <CardHeader>
            <Badge className="mb-3 w-max" variant="secondary">
              <LockKeyhole className="mr-2 h-3.5 w-3.5" /> Phase 3 Auth
            </Badge>
            <CardTitle className="text-2xl">Masuk ke dashboard</CardTitle>
            <p className="text-sm leading-6 text-muted-foreground">
              Gunakan credential seed development dari README atau `.env.example`.
            </p>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700" htmlFor="email">Email</label>
                <Input
                  autoComplete="email"
                  id="email"
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="superadmin@nexsmsid.dev"
                  required
                  type="email"
                  value={email}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700" htmlFor="password">Password</label>
                <Input
                  autoComplete="current-password"
                  id="password"
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Masukkan password"
                  required
                  type="password"
                  value={password}
                />
              </div>
              {error ? (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
                  {error}
                </div>
              ) : null}
              <Button className="w-full" disabled={submitting} size="lg" type="submit">
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Masuk <ArrowRight className="h-4 w-4" />
              </Button>
            </form>
            <p className="mt-5 text-center text-xs leading-5 text-muted-foreground">
              Token disimpan di `localStorage` hanya untuk development Phase 3. Fase production perlu pola cookie httpOnly/secure.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

function LoginLoading() {
  return (
    <main className="grid min-h-screen place-items-center px-4 py-10 text-sm font-bold text-slate-600">
      Memuat halaman login...
    </main>
  );
}
