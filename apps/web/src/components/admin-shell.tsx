"use client";

import {
  DoorOpen,
  Clock,
  Users,
  Award,
  Banknote,
  BookOpen,
  BarChart3,
  Bell,
  BookOpenCheck,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  ChevronRight,
  ClipboardCheck,
  ClipboardList,
  FileText,
  GraduationCap,
  HeartHandshake,
  Landmark,
  LayoutDashboard,
  Loader2,
  LogOut,
  Menu,
  Newspaper,
  PanelLeftClose,
  PanelLeftOpen,
  School,
  Search,
  Settings,
  UserCog,
  WalletCards,
  UsersRound,
  X,
  type LucideIcon
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { startTransition, type ReactNode, useEffect, useState } from "react";

import type { AuthUser } from "@nexsmsid/api-client";
import { Avatar, Badge, Button, Input, cn } from "@nexsmsid/ui";

import { createBrowserApiClient } from "@/lib/api-client";
import { clearAuthTokens, getAccessToken, getRefreshToken, getStoredUser, storeAuthTokens } from "@/lib/auth-storage";

type NavigationItem = { href: string; icon: LucideIcon; label: string; permission?: string };
type NavigationGroup = { label: string; items: NavigationItem[] };

const navigationGroups: NavigationGroup[] = [
  {
    label: "Utama",
    items: [
      { href: "/admin", icon: LayoutDashboard, label: "Dashboard", permission: "dashboard.view" },
      { href: "/admin/school-profile", icon: School, label: "Profil Sekolah", permission: "school-profile.view" }
    ]
  },
  {
    label: "People",
    items: [
      { href: "/admin/guardians", icon: HeartHandshake, label: "Wali/Orang Tua", permission: "guardians.view" },
      { href: "/admin/teachers", icon: UserCog, label: "Guru", permission: "teachers.view" },
      { href: "/admin/staffs", icon: BriefcaseBusiness, label: "Staff", permission: "staffs.view" }
    ]
  },
  {
    label: "Master Data",
    items: [
      { href: "/admin/master-data/academic-years", icon: CalendarDays, label: "Tahun Ajaran", permission: "master-data.view" },
      { href: "/admin/master-data/semesters", icon: ClipboardList, label: "Semester", permission: "master-data.view" },
      { href: "/admin/master-data/departments", icon: Building2, label: "Jurusan", permission: "master-data.view" },
      { href: "/admin/master-data/competencies", icon: GraduationCap, label: "Program Keahlian", permission: "master-data.view" },
      { href: "/admin/master-data/classrooms", icon: UsersRound, label: "Kelas", permission: "master-data.view" },
      { href: "/admin/master-data/subjects", icon: BookOpenCheck, label: "Mata Pelajaran", permission: "master-data.view" },
      { href: "/admin/master-data/payment-categories", icon: WalletCards, label: "Kategori Pembayaran", permission: "master-data.view" }
    ]
  },
  {
    label: "Akademik",
    items: [
      { href: "/admin/academic/teaching-assignments", icon: ClipboardList, label: "Mengajar", permission: "teaching-assignments.view" },
      { href: "/admin/academic/schedules", icon: CalendarDays, label: "Jadwal", permission: "schedules.view" },
      { href: "/admin/academic/attendance", icon: ClipboardCheck, label: "Presensi", permission: "attendance.view" },
      { href: "/admin/academic/grades", icon: Award, label: "Nilai", permission: "grades.view" }
    ]
  },
  {
    label: "BK & Kedisiplinan",
    items: [
      { href: "/admin/counseling/cases", icon: HeartHandshake, label: "Kasus BK", permission: "counseling.view" },
      { href: "/admin/discipline/rules", icon: ClipboardList, label: "Aturan Kedisiplinan", permission: "discipline.view" },
      { href: "/admin/discipline/violations", icon: ClipboardCheck, label: "Pelanggaran", permission: "discipline.view" },
      { href: "/admin/discipline/achievements", icon: Award, label: "Prestasi", permission: "discipline.view" },
      { href: "/admin/discipline/summary", icon: BarChart3, label: "Ringkasan Disiplin", permission: "discipline.report" }
    ]
  },
  {
    label: "Surat Menyurat",
    items: [
      { href: "/admin/letters/templates", icon: ClipboardList, label: "Template Surat", permission: "letters.manage-templates" },
      { href: "/admin/letters", icon: FileText, label: "Arsip Surat", permission: "letters.view" },
      { href: "/admin/letters/create", icon: FileText, label: "Buat Surat", permission: "letters.create" },
      { href: "/admin/letters/approvals", icon: ClipboardCheck, label: "Approval Surat", permission: "letters.approve" },
      { href: "/admin/letters/reports", icon: BarChart3, label: "Rekap Surat", permission: "letters.report" }
    ]
  },
  {
    label: "Keuangan & PPDB",
    items: [
      { href: "/admin/finance", icon: Landmark, label: "Keuangan", permission: "finance.view" },
      { href: "/admin/finance/invoices", icon: FileText, label: "Tagihan", permission: "invoices.view" },
      { href: "/admin/finance/payments", icon: WalletCards, label: "Pembayaran", permission: "payments.view" },
      { href: "/admin/finance/expenses", icon: BriefcaseBusiness, label: "Pengeluaran", permission: "expenses.view" },
      { href: "/admin/ppdb", icon: GraduationCap, label: "PPDB", permission: "ppdb.view" },
      { href: "/admin/ppdb/periods", icon: CalendarDays, label: "Periode PPDB", permission: "ppdb.view" },
    ]
  },
  {
    label: "PKL & BKK",
    items: [
      { href: "/admin/industry-partners", icon: Building2, label: "Mitra Industri", permission: "industry-partners.view" },
      { href: "/admin/internships", icon: BriefcaseBusiness, label: "Data PKL", permission: "internships.view" },
      { href: "/admin/internships/logs", icon: ClipboardList, label: "Jurnal PKL", permission: "internship-logs.view" },
      { href: "/admin/bkk", icon: BarChart3, label: "BKK", permission: "bkk.view" },
      { href: "/admin/alumni", icon: GraduationCap, label: "Alumni", permission: "alumni.view" },
      { href: "/admin/bkk/jobs", icon: Newspaper, label: "Lowongan Kerja", permission: "job-vacancies.view" },
      { href: "/admin/bkk/applications", icon: FileText, label: "Lamaran", permission: "job-applications.view" },
      { href: "/admin/bkk/tracer-studies", icon: ClipboardCheck, label: "Tracer Study", permission: "tracer-studies.view" }
    ]
  },
  {
    label: "Komunikasi",
    items: [
      { href: "/admin/communication/announcements", icon: Newspaper, label: "Pengumuman", permission: "announcements.view" },
      { href: "/admin/communication/messages", icon: FileText, label: "Pesan Internal", permission: "messages.view" },
      { href: "/admin/communication/notifications", icon: Bell, label: "Notifikasi", permission: "notifications.view" },
      { href: "/admin/communication/templates", icon: ClipboardList, label: "Template Notif", permission: "notification-templates.view" }
    ]
  },
  {
    label: "Inventaris / Sarpras",
    items: [
      { href: "/admin/inventory", icon: Building2, label: "Dashboard Inventaris", permission: "inventory.view" },
      { href: "/admin/inventory/categories", icon: ClipboardList, label: "Kategori", permission: "inventory.view" },
      { href: "/admin/inventory/items", icon: BriefcaseBusiness, label: "Data Barang", permission: "inventory.view" },
      { href: "/admin/inventory/movements", icon: ClipboardCheck, label: "Mutasi Barang", permission: "inventory.view" },
      { href: "/admin/inventory/maintenances", icon: Settings, label: "Pemeliharaan", permission: "inventory.maintenance" },
      { href: "/admin/inventory/loans", icon: HeartHandshake, label: "Peminjaman", permission: "inventory.borrow" },
      { href: "/admin/inventory/reports", icon: BarChart3, label: "Laporan Inventaris", permission: "inventory.view" }
    ]
  },
  {
    label: "Perpustakaan",
    items: [
      { href: "/admin/library", icon: BookOpen, label: "Dashboard Perpustakaan", permission: "library.view" },
      { href: "/admin/library/categories", icon: ClipboardList, label: "Kategori", permission: "library.view" },
      { href: "/admin/library/books", icon: BookOpen, label: "Data Buku", permission: "library.view" },
      { href: "/admin/library/loans", icon: HeartHandshake, label: "Peminjaman", permission: "library.borrow" },
      { href: "/admin/library/fines", icon: Banknote, label: "Denda", permission: "library.fine" },
      { href: "/admin/library/reports", icon: BarChart3, label: "Laporan", permission: "library.view" }
    ]
  },
  {
    label: "Laporan",
    items: [
      { href: "/admin/reports", icon: BarChart3, label: "Report Center", permission: "reports.view" },
      { href: "/admin/reports/jobs", icon: FileText, label: "Report Jobs", permission: "report-jobs.view" },
      { href: "/admin/reports/exports", icon: ClipboardCheck, label: "Export History", permission: "export-history.view" }
    ]
  },
  {
    label: "Pengaturan",
    items: [
      { href: "/account/security", icon: UserCog, label: "Keamanan Akun", permission: "auth.change-password" }
    ]
  }
];

const navigation = navigationGroups.flatMap((group) => group.items);

export function AdminShell({ children }: Readonly<{ children: ReactNode }>) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const sidebarWidth = collapsed ? "lg:w-24" : "lg:w-72";
  const labelVisibility = collapsed ? "lg:hidden" : "lg:block";
  const currentPage = getCurrentPageLabel(pathname);
  const visibleNavigationGroups = navigationGroups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => !item.permission || authUser?.permissions.includes(item.permission))
    }))
    .filter((group) => group.items.length > 0);

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
        if ((user as any).forceChangePassword && pathname !== "/account/change-password") {
          router.replace("/account/change-password");
          return;
        }
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
          if ((tokens.user as any).forceChangePassword && pathname !== "/account/change-password") {
            router.replace("/account/change-password");
            return;
          }
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

          <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-5">
            {visibleNavigationGroups.map((group) => (
              <div className="space-y-1" key={group.label}>
                <p className={cn("px-3 text-[0.68rem] font-black uppercase tracking-[0.18em] text-slate-400", labelVisibility)}>{group.label}</p>
                {group.items.map((item) => {
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
              </div>
            ))}
          </nav>

          <div className="border-t p-4">
            <div className={cn("rounded-3xl bg-indigo-50 p-4", collapsed && "lg:p-3")}>
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-white text-primary">
                  <Settings className="h-5 w-5" />
                </span>
                <div className={cn("min-w-0", labelVisibility)}>
                  <p className="truncate text-sm font-black text-slate-950">Phase 10.1 UI</p>
                  <p className="truncate text-xs font-semibold text-muted-foreground">Consistent admin shell</p>
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

function formatCount(value: number) {
  return value > 99 ? "99+" : String(value);
}

function getCurrentPageLabel(pathname: string) {
  const match = navigation.find((item) => item.href === pathname);

  if (match) {
    return match.label;
  }

  if (pathname.startsWith("/admin/master-data/")) {
    return "Master Data";
  }

  if (pathname.startsWith("/admin/academic/")) {
    return "Akademik";
  }

  if (pathname.startsWith("/admin/finance/")) {
    return "Keuangan";
  }

  if (pathname.startsWith("/admin/ppdb/")) {
    return "PPDB";
  }

  if (pathname.startsWith("/admin/")) {
    return "Admin";
  }

  return "Dashboard";
}
