"use client";

import {
  Activity,
  AlertCircle,
  ArrowUpRight,
  BarChart3,
  BookOpenCheck,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  Database,
  FileText,
  GraduationCap,
  KeyRound,
  Landmark,
  Loader2,
  Newspaper,
  Plus,
  RefreshCcw,
  Server,
  ShieldCheck,
  UsersRound
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

import type {
  DashboardRecentActivity,
  DashboardRoleSummary,
  DashboardSummary,
  DashboardSystemStatus
} from "@nexsmsid/api-client";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  ChartCard,
  EmptyState,
  ModuleCard,
  PageHeader,
  StatCard
} from "@nexsmsid/ui";

import { createBrowserApiClient } from "@/lib/api-client";

type DashboardData = {
  activities: DashboardRecentActivity[];
  roleSummary: DashboardRoleSummary[];
  summary: DashboardSummary;
  systemStatus: DashboardSystemStatus;
};

const foundationTrend = [
  { month: "Jan", audit: 2, sessions: 1, users: 1 },
  { month: "Feb", audit: 4, sessions: 2, users: 1 },
  { month: "Mar", audit: 6, sessions: 3, users: 2 },
  { month: "Apr", audit: 8, sessions: 4, users: 2 },
  { month: "Mei", audit: 11, sessions: 5, users: 3 },
  { month: "Jun", audit: 14, sessions: 6, users: 4 }
];

const securityOverview = [
  { label: "Login", value: 42 },
  { label: "Refresh", value: 26 },
  { label: "Logout", value: 18 },
  { label: "Audit", value: 54 }
];

const modules = [
  { title: "Siswa", description: "Shortcut UI statis, modul belum dibuat.", icon: UsersRound, tone: "violet" as const },
  { title: "Guru & Staf", description: "Shortcut UI statis, modul belum dibuat.", icon: GraduationCap, tone: "blue" as const },
  { title: "Akademik", description: "Shortcut UI statis, modul belum dibuat.", icon: BookOpenCheck, tone: "cyan" as const },
  { title: "Keuangan", description: "Shortcut UI statis, modul belum dibuat.", icon: Landmark, tone: "emerald" as const },
  { title: "PPDB", description: "Shortcut UI statis, modul belum dibuat.", icon: Building2, tone: "amber" as const },
  { title: "Magang", description: "Shortcut UI statis, modul belum dibuat.", icon: BriefcaseBusiness, tone: "violet" as const },
  { title: "BKK", description: "Shortcut UI statis, modul belum dibuat.", icon: BarChart3, tone: "blue" as const },
  { title: "Website CMS", description: "Shortcut UI statis, modul belum dibuat.", icon: Newspaper, tone: "cyan" as const },
  { title: "Laporan", description: "Shortcut UI statis, modul belum dibuat.", icon: FileText, tone: "slate" as const }
];

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadDashboard() {
    setError(null);
    setLoading(true);

    try {
      const client = createBrowserApiClient();
      const [summary, roleSummary, activities, systemStatus] = await Promise.all([
        client.dashboardSummary(),
        client.dashboardUserRoleSummary(),
        client.dashboardRecentActivities(),
        client.dashboardSystemStatus()
      ]);

      setData({ activities, roleSummary, summary, systemStatus });
    } catch (dashboardError) {
      setError(dashboardError instanceof Error ? dashboardError.message : "Gagal memuat dashboard");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadDashboard();
  }, []);

  if (loading) {
    return <DashboardLoading />;
  }

  if (error || !data) {
    return <DashboardError message={error ?? "Data dashboard tidak tersedia"} onRetry={loadDashboard} />;
  }

  return (
    <div className="space-y-8">
      <PageHeader
        actions={
          <>
            <Button onClick={loadDashboard} variant="outline">
              <RefreshCcw className="h-4 w-4" /> Refresh API
            </Button>
            <Button>
              <Plus className="h-4 w-4" /> Quick Action
            </Button>
          </>
        }
        breadcrumb={["Admin", "Dashboard"]}
        description="Ringkasan real dari API auth/RBAC/audit. Modul domain sekolah belum dibuat pada Phase 4."
        eyebrow="Dashboard API Integration"
        title="Foundation dashboard"
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={<UsersRound className="h-5 w-5" />}
          title="Total Users"
          tone="violet"
          trend={{ label: "user non-deleted", value: `${data.summary.users.inactive} inactive`, variant: "neutral" }}
          value={formatNumber(data.summary.users.total)}
        />
        <StatCard
          icon={<CheckCircle2 className="h-5 w-5" />}
          title="Active Users"
          tone="emerald"
          trend={{ label: "akun aktif", value: `${data.summary.users.suspended} suspended`, variant: "neutral" }}
          value={formatNumber(data.summary.users.active)}
        />
        <StatCard
          icon={<ShieldCheck className="h-5 w-5" />}
          title="Roles"
          tone="blue"
          trend={{ label: "role seed RBAC", value: `${data.roleSummary.length} listed`, variant: "neutral" }}
          value={formatNumber(data.summary.roles.total)}
        />
        <StatCard
          icon={<KeyRound className="h-5 w-5" />}
          title="Permissions"
          tone="amber"
          trend={{ label: "permission aktif", value: `${data.summary.auditLogs.total} audit logs`, variant: "neutral" }}
          value={formatNumber(data.summary.permissions.total)}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <ChartCard
          action={<Badge variant="info">Static placeholder</Badge>}
          description="Overview sementara untuk menjaga bentuk chart dashboard sampai Phase 4 data chart final tersedia."
          title="Foundation Growth Overview"
        >
          <div className="h-72">
            <ResponsiveContainer height="100%" width="100%">
              <AreaChart data={foundationTrend} margin={{ bottom: 0, left: -18, right: 8, top: 10 }}>
                <defs>
                  <linearGradient id="foundationGradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.38} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#e2e8f0" strokeDasharray="4 4" vertical={false} />
                <XAxis axisLine={false} dataKey="month" tickLine={false} tickMargin={12} />
                <YAxis axisLine={false} tickLine={false} tickMargin={12} />
                <Tooltip
                  contentStyle={{ border: "1px solid #e2e8f0", borderRadius: 16, boxShadow: "0 16px 45px rgba(15, 23, 42, 0.08)" }}
                />
                <Area dataKey="users" fill="url(#foundationGradient)" name="Users" stroke="#4f46e5" strokeWidth={3} type="monotone" />
                <Area dataKey="audit" fill="transparent" name="Audit" stroke="#38bdf8" strokeWidth={3} type="monotone" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          action={<Badge variant="secondary">Static placeholder</Badge>}
          description="Data chart masih statis. Summary cards dan activity sudah memakai API nyata."
          title="Auth Activity Overview"
        >
          <div className="h-72">
            <ResponsiveContainer height="100%" width="100%">
              <BarChart data={securityOverview} margin={{ bottom: 0, left: -18, right: 8, top: 10 }}>
                <CartesianGrid stroke="#e2e8f0" strokeDasharray="4 4" vertical={false} />
                <XAxis axisLine={false} dataKey="label" tickLine={false} tickMargin={12} />
                <YAxis axisLine={false} tickLine={false} tickMargin={12} />
                <Tooltip
                  contentStyle={{ border: "1px solid #e2e8f0", borderRadius: 16, boxShadow: "0 16px 45px rgba(15, 23, 42, 0.08)" }}
                />
                <Bar dataKey="value" fill="#4f46e5" name="Static count" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <RoleSummaryCard roles={data.roleSummary} />
        <RecentActivitiesCard activities={data.activities} />
      </div>

      <SystemStatusCard status={data.systemStatus} activeRefreshTokens={data.summary.refreshTokens.active} />

      <section>
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Badge variant="outline">Shortcut UI Statis</Badge>
            <h2 className="mt-3 text-2xl font-black tracking-tight text-slate-950">Rencana akses cepat modul</h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-muted-foreground">
            Kartu ini masih UI shell dari Phase 1. Modul siswa, guru, finance, PPDB, absensi, dan nilai belum dibuat.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {modules.map((module) => (
            <ModuleCard
              description={module.description}
              href="#"
              icon={<module.icon className="h-5 w-5" />}
              key={module.title}
              meta="Static"
              title={module.title}
              tone={module.tone}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

function DashboardLoading() {
  return (
    <div className="space-y-8">
      <PageHeader
        breadcrumb={["Admin", "Dashboard"]}
        description="Mengambil data summary, activity, dan system status dari API."
        eyebrow="Dashboard API Integration"
        title="Memuat dashboard"
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card className="p-5" key={index}>
            <div className="flex items-center justify-between">
              <div className="h-4 w-28 animate-pulse rounded-full bg-slate-200" />
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
            </div>
            <div className="mt-6 h-9 w-20 animate-pulse rounded-full bg-slate-200" />
            <div className="mt-5 h-4 w-40 animate-pulse rounded-full bg-slate-100" />
          </Card>
        ))}
      </div>
    </div>
  );
}

function DashboardError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="space-y-8">
      <PageHeader
        breadcrumb={["Admin", "Dashboard"]}
        description="Data dashboard tidak bisa dimuat dari API."
        eyebrow="Dashboard API Integration"
        title="Dashboard error"
      />
      <EmptyState
        action={
          <Button onClick={onRetry} variant="soft">
            <RefreshCcw className="h-4 w-4" /> Coba lagi
          </Button>
        }
        description={message}
        icon={<AlertCircle className="h-5 w-5" />}
        title="Gagal memuat dashboard API"
      />
    </div>
  );
}

function RoleSummaryCard({ roles }: { roles: DashboardRoleSummary[] }) {
  const maxUsers = Math.max(...roles.map((role) => role.totalUsers), 1);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle>User Role Summary</CardTitle>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">Distribusi user per role dari database RBAC.</p>
          </div>
          <Badge variant="info">Real API</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        {roles.length ? (
          roles.slice(0, 7).map((role) => (
            <div key={role.id}>
              <div className="mb-2 flex items-center justify-between gap-4 text-sm">
                <span className="font-bold text-slate-700">{role.name}</span>
                <span className="font-black text-slate-950">{formatNumber(role.totalUsers)}</span>
              </div>
              <div className="h-2.5 rounded-full bg-slate-100">
                <div className="h-2.5 rounded-full bg-primary" style={{ width: `${Math.max((role.totalUsers / maxUsers) * 100, 4)}%` }} />
              </div>
              <p className="mt-1 text-xs font-semibold text-muted-foreground">
                {role.totalPermissions} permissions, {role.activeUsers} active users
              </p>
            </div>
          ))
        ) : (
          <EmptyState description="Belum ada role di database." title="Role belum tersedia" />
        )}
      </CardContent>
    </Card>
  );
}

function RecentActivitiesCard({ activities }: { activities: DashboardRecentActivity[] }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle>Recent Activity</CardTitle>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">Aktivitas terbaru dari tabel AuditLog.</p>
          </div>
          <Activity className="h-5 w-5 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        {activities.length ? (
          <div className="space-y-3">
            {activities.map((activity) => (
              <div className="flex items-center gap-4 rounded-2xl border bg-white p-4" key={activity.id}>
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-indigo-50 text-primary">
                  <Activity className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-slate-950">{formatAction(activity.action)}</p>
                  <p className="text-xs font-semibold text-muted-foreground">
                    {activity.actor?.name ?? "System"} • {activity.entity} • {formatDate(activity.createdAt)}
                  </p>
                </div>
                <ArrowUpRight className="h-4 w-4 text-slate-400" />
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            description="AuditLog belum memiliki activity untuk ditampilkan."
            icon={<Activity className="h-5 w-5" />}
            title="Belum ada recent activity"
          />
        )}
      </CardContent>
    </Card>
  );
}

function SystemStatusCard({ activeRefreshTokens, status }: { activeRefreshTokens: number; status: DashboardSystemStatus }) {
  const rows = [
    { icon: Server, label: "API", meta: `v${status.api.version} • uptime ${status.api.uptime}s`, value: status.api.status },
    { icon: Database, label: "Database", meta: status.database.provider, value: status.database.status },
    { icon: Activity, label: "Redis", meta: status.redis.configured ? `${status.redis.host ?? "configured"}:${status.redis.port ?? ""}` : "not configured", value: status.redis.status },
    { icon: KeyRound, label: "Active Refresh Tokens", meta: "non-revoked and not expired", value: formatNumber(activeRefreshTokens) }
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle>System Status</CardTitle>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">Status API, database, Redis, dan sesi aktif dari backend.</p>
          </div>
          <Badge variant="success">Real API</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {rows.map((row) => (
            <div className="rounded-2xl border bg-white p-4" key={row.label}>
              <div className="mb-4 flex items-center justify-between gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-2xl bg-indigo-50 text-primary">
                  <row.icon className="h-5 w-5" />
                </div>
                <StatusBadge value={row.value} />
              </div>
              <p className="text-sm font-black text-slate-950">{row.label}</p>
              <p className="mt-1 truncate text-xs font-semibold text-muted-foreground">{row.meta}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function StatusBadge({ value }: { value: string }) {
  if (["ok", "connected", "available"].includes(value)) {
    return <Badge variant="success">{value}</Badge>;
  }

  if (value === "0") {
    return <Badge variant="outline">0</Badge>;
  }

  return <Badge variant="warning">{value}</Badge>;
}

function formatAction(value: string) {
  return value
    .split(".")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("id-ID").format(value);
}
