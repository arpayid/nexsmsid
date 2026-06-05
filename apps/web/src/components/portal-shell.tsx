"use client";

import { Bell, BookOpen, ChevronRight, ClipboardCheck, FileText, GraduationCap, LayoutDashboard, Loader2, LogOut, Menu, Newspaper, PanelLeftClose, PanelLeftOpen, School, Users, WalletCards, Wallet, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { startTransition, type ReactNode, useEffect, useState } from "react";

import type { AuthUser } from "@nexsmsid/api-client";
import { Avatar, Badge, Button, cn } from "@nexsmsid/ui";

import { createBrowserApiClient } from "@/lib/api-client";
import { clearAuthTokens, getAccessToken, getRefreshToken, getStoredUser, storeAuthTokens } from "@/lib/auth-storage";
import { resolvePortalForUser, portalHomePath, type PortalKind } from "@/lib/portal-routing";

type NavItem = { href: string; icon: LucideIcon; label: string };

const portalNavigation: Record<PortalKind, { title: string; items: NavItem[] }> = {
  teacher: {
    title: "Portal Guru",
    items: [
      { href: "/teacher", icon: LayoutDashboard, label: "Dashboard" },
      { href: "/teacher/schedules", icon: BookOpen, label: "Jadwal Mengajar" },
      { href: "/teacher/attendance", icon: ClipboardCheck, label: "Presensi" },
      { href: "/teacher/grades", icon: GraduationCap, label: "Penilaian" },
      { href: "/teacher/notifications", icon: Bell, label: "Notifikasi" }
    ]
  },
  student: {
    title: "Portal Siswa",
    items: [
      { href: "/student", icon: LayoutDashboard, label: "Dashboard" },
      { href: "/student/schedules", icon: BookOpen, label: "Jadwal Pelajaran" },
      { href: "/student/attendance", icon: ClipboardCheck, label: "Presensi" },
      { href: "/student/grades", icon: GraduationCap, label: "Nilai" },
      { href: "/student/invoices", icon: WalletCards, label: "Tagihan" },
      { href: "/student/announcements", icon: Newspaper, label: "Pengumuman" },
      { href: "/student/notifications", icon: Bell, label: "Notifikasi" }
    ]
  },
  guardian: {
    title: "Portal Wali",
    items: [
      { href: "/guardian", icon: LayoutDashboard, label: "Dashboard" },
      { href: "/guardian/children", icon: Users, label: "Anak" },
      { href: "/guardian/attendance", icon: ClipboardCheck, label: "Presensi Anak" },
      { href: "/guardian/grades", icon: GraduationCap, label: "Nilai Anak" },
      { href: "/guardian/invoices", icon: Wallet, label: "Tagihan Anak" },
      { href: "/guardian/announcements", icon: Newspaper, label: "Pengumuman" },
      { href: "/guardian/notifications", icon: Bell, label: "Notifikasi" }
    ]
  },
  admin: {
    title: "Admin",
    items: []
  }
};

const portalAccent: Record<PortalKind, string> = {
  teacher: "from-indigo-500 to-violet-600",
  student: "from-violet-500 to-fuchsia-600",
  guardian: "from-blue-500 to-indigo-600",
  admin: "from-slate-500 to-slate-700"
};

export type PortalShellProps = {
  children: ReactNode;
  expectedPortal: PortalKind;
};

export function PortalShell({ children, expectedPortal }: PortalShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [ready, setReady] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const access = getAccessToken();
    const stored = getStoredUser();
    if (!access || !stored) {
      const next = encodeURIComponent(pathname ?? portalHomePath(expectedPortal));
      router.replace(`/login?next=${next}`);
      return;
    }
    if (stored) {
      const portal = resolvePortalForUser(stored);
      if (portal !== expectedPortal) {
        router.replace(portalHomePath(portal));
        return;
      }
    }
    setUser(stored);
    setReady(true);
  }, [expectedPortal, pathname, router]);

  useEffect(() => {
    if (!ready) return;
    const api = createBrowserApiClient();
    let active = true;
    async function bootstrap() {
      try {
        const me = await api.me();
        if (!active) return;
        const fresh = me as unknown as AuthUser;
        const current = getStoredUser();
        if (current && JSON.stringify(current) !== JSON.stringify(fresh)) {
          storeAuthTokens({
            accessToken: getAccessToken() ?? "",
            refreshToken: getRefreshToken() ?? "",
            tokenType: "Bearer",
            expiresIn: 0,
            user: fresh
          });
        }
        setUser(fresh);
      } catch (error) {
        if (active) {
          clearAuthTokens();
          router.replace("/login");
        }
      }
    }
    void bootstrap();
    return () => {
      active = false;
    };
  }, [ready, router]);

  function handleLogout() {
    clearAuthTokens();
    startTransition(() => router.replace("/login"));
  }

  if (!ready || !user) {
    return (
      <div className="grid min-h-screen place-items-center bg-slate-50">
        <div className="flex flex-col items-center gap-3 text-slate-600">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <p className="text-sm font-semibold">Memuat portal...</p>
        </div>
      </div>
    );
  }

  const config = portalNavigation[expectedPortal];
  const items = config.items;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <Button onClick={() => setMobileOpen((v) => !v)} size="icon" variant="ghost" className="lg:hidden">
              {mobileOpen ? <ChevronRight className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <div className={cn("flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-soft", portalAccent[expectedPortal])}>
              <School className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">NexSMSID</p>
              <p className="text-base font-bold leading-tight text-slate-900">{config.title}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold leading-tight text-slate-900">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.roles.join(", ") || "Tanpa role"}</p>
            </div>
            <Avatar fallback={user.name?.charAt(0)?.toUpperCase() ?? "U"} />
            <Button onClick={handleLogout} size="sm" variant="outline">
              <LogOut className="h-4 w-4" /> Keluar
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6 sm:px-6">
        <aside className={cn("hidden shrink-0 lg:block", collapsed ? "w-16" : "w-64")}>
          <div className="sticky top-24 space-y-2">
            <Button className="w-full justify-start" onClick={() => setCollapsed((v) => !v)} size="sm" variant="ghost">
              {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
              {!collapsed ? "Tutup" : ""}
            </Button>
            <nav className="space-y-1">
              {items.map((item) => {
                const active = pathname === item.href || (item.href !== portalHomePath(expectedPortal) && pathname?.startsWith(item.href));
                const Icon = item.icon;
                return (
                  <Link
                    className={cn(
                      "flex items-center gap-3 rounded-2xl px-3 py-2 text-sm font-semibold transition-colors",
                      active
                        ? "bg-primary/10 text-primary"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                    )}
                    href={item.href}
                    key={item.href}
                  >
                    <Icon className="h-4 w-4" />
                    {!collapsed ? <span>{item.label}</span> : null}
                  </Link>
                );
              })}
            </nav>
            {!collapsed ? (
              <div className="mt-6 rounded-2xl border border-dashed border-slate-200 p-4 text-xs text-muted-foreground">
                <Badge variant="info" className="mb-2">Tips</Badge>
                <p className="leading-relaxed">
                  Menu disusun khusus untuk peran <span className="font-bold text-slate-700">{user.roles.join(", ")}</span>. Data yang tampil
                  hanya yang terkait dengan akun Anda.
                </p>
              </div>
            ) : null}
          </div>
        </aside>

        {mobileOpen ? (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div className="absolute inset-0 bg-slate-900/40" onClick={() => setMobileOpen(false)} />
            <aside className="absolute left-0 top-0 h-full w-72 bg-white p-4 shadow-xl">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm font-bold uppercase tracking-widest text-slate-700">{config.title}</p>
                <Button onClick={() => setMobileOpen(false)} size="icon" variant="ghost">
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
              <nav className="space-y-1">
                {items.map((item) => {
                  const active = pathname === item.href || (item.href !== portalHomePath(expectedPortal) && pathname?.startsWith(item.href));
                  const Icon = item.icon;
                  return (
                    <Link
                      className={cn(
                        "flex items-center gap-3 rounded-2xl px-3 py-2 text-sm font-semibold transition-colors",
                        active
                          ? "bg-primary/10 text-primary"
                          : "text-slate-600 hover:bg-slate-100"
                      )}
                      href={item.href}
                      key={item.href}
                      onClick={() => setMobileOpen(false)}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </aside>
          </div>
        ) : null}

        <main className="min-w-0 flex-1 space-y-6">
          {children}
        </main>
      </div>

      <footer className="mx-auto max-w-7xl px-4 pb-8 pt-2 text-center text-xs text-muted-foreground sm:px-6">
        NexSMSID Portal — Hak akses otomatis disesuaikan dengan peran {user.roles.join(", ") || "pengguna"}.
      </footer>
    </div>
  );
}
