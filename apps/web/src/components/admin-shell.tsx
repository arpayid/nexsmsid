"use client";

import {
  BarChart3,
  Bell,
  BriefcaseBusiness,
  Building2,
  ChevronRight,
  ClipboardList,
  FileText,
  GraduationCap,
  Landmark,
  LayoutDashboard,
  Loader2,
  LogOut,
  Menu,
  Newspaper,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Settings,
  UsersRound,
  X
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { startTransition, type ReactNode, useEffect, useState } from "react";

import type { AuthUser } from "@nexsmsid/api-client";
import { Avatar, Badge, Button, Input, cn } from "@nexsmsid/ui";

import { createBrowserApiClient } from "@/lib/api-client";
import { clearAuthTokens, getAccessToken, getRefreshToken, getStoredUser, storeAuthTokens } from "@/lib/auth-storage";

const navigation = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard", permission: "dashboard.view" },
  { href: "#", icon: UsersRound, label: "Siswa", permission: "users.view" },
  { href: "#", icon: GraduationCap, label: "Guru & Staf", permission: "users.view" },
  { href: "#", icon: ClipboardList, label: "Akademik", permission: "master-data.view" },
  { href: "#", icon: Landmark, label: "Keuangan", permission: "master-data.view" },
  { href: "#", icon: Building2, label: "PPDB", permission: "master-data.view" },
  { href: "#", icon: BriefcaseBusiness, label: "Magang", permission: "master-data.view" },
  { href: "#", icon: BarChart3, label: "BKK", permission: "master-data.view" },
  { href: "#", icon: Newspaper, label: "Website CMS", permission: "school-profile.view" },
  { href: "#", icon: FileText, label: "Laporan", permission: "dashboard.view" }
];

export function AdminShell({ children }: Readonly<{ children: ReactNode }>) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const sidebarWidth = collapsed ? "lg:w-24" : "lg:w-72";
  const labelVisibility = collapsed ? "lg:hidden" : "lg:block";
  const currentPage = pathname === "/admin" ? "Dashboard" : "Dashboard";
  const visibleNavigation = navigation.filter((item) => !item.permission || authUser?.permissions.includes(item.permission));

  useEffect(() => {
    let active = true;

    async function loadCurrentUser() {
      const accessToken = getAccessToken();

      if (!accessToken) {
        clearAuthTokens();
        router.replace(`/login?next=${encodeURIComponent(pathname)}`);
        return;
      }

      setAuthUser(getStoredUser());

      try {
        const user = await createBrowserApiClient().me();
        if (active) setAuthUser(user);
      } catch {
        const refreshToken = getRefreshToken();

        if (!refreshToken) {
          clearAuthTokens();
          router.replace(`/login?next=${encodeURIComponent(pathname)}`);
          return;
        }

        try {
          const tokens = await createBrowserApiClient().refresh(refreshToken);
          storeAuthTokens(tokens);
          if (active) setAuthUser(tokens.user);
        } catch {
          clearAuthTokens();
          router.replace(`/login?next=${encodeURIComponent(pathname)}`);
          return;
        }
      } finally {
        if (active) setCheckingAuth(false);
      }
    }

    void loadCurrentUser();

    return () => {
      active = false;
    };
  }, [pathname, router]);

  async function handleLogout() {
    const refreshToken = getRefreshToken();

    try {
      await createBrowserApiClient().logout(refreshToken ?? undefined);
    } catch {
      // Local session cleanup still happens when the API call fails.
    }

    clearAuthTokens();
    startTransition(() => router.replace("/login"));
  }

  if (checkingAuth) {
    return (
      <div className="grid min-h-screen place-items-center bg-slate-50 px-4 text-center">
        <div>
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-soft">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
          <p className="mt-5 text-sm font-bold text-slate-700">Memeriksa sesi admin...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      {mobileOpen ? (
        <button
          aria-label="Tutup menu"
          className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden"
          onClick={() => setMobileOpen(false)}
          type="button"
        />
      ) : null}

      <div className="lg:flex">
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-50 flex w-72 -translate-x-full flex-col border-r border-border bg-white/95 shadow-soft backdrop-blur-xl transition-all duration-300 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 lg:shadow-none",
            mobileOpen && "translate-x-0",
            sidebarWidth
          )}
        >
          <div className="flex h-20 items-center justify-between gap-3 border-b px-4">
            <Link className="flex min-w-0 items-center gap-3" href="/">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-soft">
                <GraduationCap className="h-5 w-5" />
              </span>
              <span className={cn("min-w-0", labelVisibility)}>
                <span className="block truncate text-lg font-black tracking-tight">NexSMSID</span>
                <span className="block truncate text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
                  Admin Console
                </span>
              </span>
            </Link>
            <div className="flex items-center gap-1">
              <Button
                aria-label={collapsed ? "Perluas sidebar" : "Ciutkan sidebar"}
                className="hidden lg:inline-flex"
                onClick={() => setCollapsed((value) => !value)}
                size="icon"
                variant="ghost"
              >
                {collapsed ? <PanelLeftOpen className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
              </Button>
              <Button
                aria-label="Tutup sidebar"
                className="lg:hidden"
                onClick={() => setMobileOpen(false)}
                size="icon"
                variant="ghost"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-5">
            {visibleNavigation.map((item) => {
              const active = item.href === pathname;
              const Icon = item.icon;

              return (
                <Link
                  className={cn(
                    "flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-bold text-slate-600 transition hover:bg-indigo-50 hover:text-primary",
                    active && "bg-primary text-primary-foreground shadow-soft hover:bg-primary hover:text-primary-foreground",
                    collapsed && "lg:justify-center"
                  )}
                  href={item.href}
                  key={item.label}
                  onClick={() => setMobileOpen(false)}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  <span className={cn("truncate", labelVisibility)}>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="border-t p-4">
            <div className={cn("rounded-3xl bg-indigo-50 p-4", collapsed && "lg:p-3")}>
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-white text-primary">
                  <Settings className="h-5 w-5" />
                </span>
                <div className={cn("min-w-0", labelVisibility)}>
                  <p className="truncate text-sm font-black text-slate-950">Phase 1 UI</p>
                  <p className="truncate text-xs font-semibold text-muted-foreground">Permission ready</p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 border-b border-border bg-white/85 backdrop-blur-xl">
            <div className="flex min-h-20 items-center gap-3 px-4 sm:px-6 lg:px-8">
              <Button className="lg:hidden" onClick={() => setMobileOpen(true)} size="icon" variant="outline">
                <Menu className="h-5 w-5" />
              </Button>
              <div className="hidden items-center gap-2 text-sm font-semibold text-muted-foreground sm:flex">
                <Link className="hover:text-primary" href="/admin">Admin</Link>
                <ChevronRight className="h-4 w-4" />
                <span className="text-slate-950">{currentPage}</span>
              </div>
              <div className="relative ml-auto hidden w-full max-w-md sm:block">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input className="pl-11" placeholder="Cari siswa, guru, laporan..." />
              </div>
              <Button size="icon" variant="outline">
                <Bell className="h-5 w-5" />
              </Button>
              <div className="hidden items-center gap-3 sm:flex">
                <Avatar fallback={getInitials(authUser?.name ?? "Admin")} />
                <div className="hidden lg:block">
                  <p className="text-sm font-black">{authUser?.name ?? "Admin Sekolah"}</p>
                  <p className="text-xs font-semibold text-muted-foreground">{authUser?.email ?? "Operator"}</p>
                </div>
              </div>
              <Button aria-label="Logout" onClick={handleLogout} size="icon" variant="outline">
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
            <div className="border-t px-4 py-3 sm:hidden">
              <div className="relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input className="pl-11" placeholder="Cari data sekolah..." />
              </div>
            </div>
          </header>

          <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <div className="mx-auto max-w-7xl">
              <div className="mb-5 flex sm:hidden">
                <Badge variant="secondary">Admin / {currentPage}</Badge>
              </div>
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "AD";
}
