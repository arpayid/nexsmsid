"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { AlertCircle, BarChart3, Download, FileText, Loader2, Filter, CheckCircle2, XCircle, Clock } from "lucide-react";

import { Button, Card, CardContent, CardHeader, CardTitle, Input, PageHeader, StatCard, Badge } from "@nexsmsid/ui";

import { createBrowserApiClient } from "@/lib/api-client";

interface ReportType {
  code: string;
  name: string;
  category: string;
  supportedFormats: string[];
  requiredFilters: string[];
  optionalFilters: string[];
}

export default function AdminReportsPage() {
  const api = useMemo(() => createBrowserApiClient(), []);
  const [summary, setSummary] = useState<any>(null);
  const [reportTypes, setReportTypes] = useState<ReportType[]>([]);
  const [selectedReport, setSelectedReport] = useState<ReportType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Filter Data
  const [academicYears, setAcademicYears] = useState<any[]>([]);
  const [semesters, setSemesters] = useState<any[]>([]);
  const [classrooms, setClassrooms] = useState<any[]>([]);

  async function loadInitialData() {
    setError(null);
    try {
      const [summaryData, types] = await Promise.all([
        api.getReportSummary(),
        api.listReportTypes()
      ]);
      setSummary(summaryData);
      setReportTypes(types);

      // Load basic filter data
      const [ay, sem, cls] = await Promise.all([
        api.masterDataList('academic-years'),
        api.masterDataList('semesters'),
        api.masterDataList('classrooms')
      ]);
      setAcademicYears(ay.data || []);
      setSemesters(sem.data || []);
      setClassrooms(cls.data || []);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Gagal memuat report center");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadInitialData();
  }, []);

  async function handleGenerate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedReport) return;

    const formData = new FormData(event.currentTarget);
    const filters: Record<string, any> = {};
    
    // Extract filters based on report definition
    const allFilters = [...selectedReport.requiredFilters, ...selectedReport.optionalFilters];
    allFilters.forEach(f => {
      const val = formData.get(f);
      if (val) filters[f] = val;
    });

    setSubmitting(true);
    setError(null);
    try {
      await api.generateReport({ 
        type: selectedReport.code, 
        format: formData.get("format"), 
        title: formData.get("title"),
        parameters: filters
      });
      // Optionally redirect to jobs page or show success
      await loadInitialData();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Gagal generate laporan");
    } finally {
      setSubmitting(false);
    }
  }

  const jobs = summary?.jobs;
  const exportsData = summary?.exports;

  const categories = Array.from(new Set(reportTypes.map(r => r.category)));

  return (
    <div className="space-y-8 pb-20">
      <PageHeader 
        breadcrumb={["Admin", "Laporan"]} 
        description="Pusat pelaporan sistem NexSMSID. Generate laporan akademik, keuangan, dan lainnya." 
        eyebrow="Phase 10.7 Advanced Reporting" 
        title="Report Center" 
      />
      
      {error ? (
        <div className="flex items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
          <AlertCircle className="h-5 w-5" /> {error}
        </div>
      ) : null}

      {loading ? (
        <Card><CardContent><div className="grid min-h-48 place-items-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div></CardContent></Card>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <StatCard title="Total Job" value={String(jobs?.total ?? 0)} description="Semua report job" icon={<BarChart3 className="h-5 w-5" />} tone="violet" />
            <StatCard title="Completed" value={String(jobs?.completed ?? 0)} description="Job berhasil" icon={<CheckCircle2 className="h-5 w-5" />} tone="emerald" />
            <StatCard title="Pending" value={String(jobs?.pending ?? 0)} description="Dalam antrian" icon={<Clock className="h-5 w-5" />} tone="blue" />
            <StatCard title="Export" value={String(exportsData?.total ?? 0)} description="Riwayat export" icon={<Download className="h-5 w-5" />} tone="violet" />
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader><CardTitle>Pilih Laporan</CardTitle></CardHeader>
                <CardContent>
                  <div className="grid gap-6 sm:grid-cols-2">
                    {categories.map(cat => (
                      <div key={cat} className="space-y-3">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">{cat}</h3>
                        <div className="flex flex-col gap-2">
                          {reportTypes.filter(r => r.category === cat).map(report => (
                            <button
                              key={report.code}
                              onClick={() => setSelectedReport(report)}
                              className={`flex flex-col items-start rounded-xl border p-4 text-left transition-all ${
                                selectedReport?.code === report.code 
                                  ? "border-primary bg-primary/5 ring-1 ring-primary" 
                                  : "border-border bg-white hover:border-primary/50 hover:bg-slate-50"
                              }`}
                            >
                              <span className={`text-sm font-bold ${selectedReport?.code === report.code ? "text-primary" : "text-slate-700"}`}>
                                {report.name}
                              </span>
                              <div className="mt-2 flex gap-1">
                                {report.supportedFormats.map(f => (
                                  <Badge key={f} variant="outline" className="text-[10px] py-0 px-1">{f}</Badge>
                                ))}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              {selectedReport ? (
                <Card className="border-primary/20 bg-primary/5">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Filter Laporan</CardTitle>
                      <Filter className="h-5 w-5 text-primary" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleGenerate} className="space-y-4">
                      <div className="rounded-xl bg-white p-4 border border-primary/10 space-y-4">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Konfigurasi Laporan</p>
                        
                        <label className="block space-y-1.5">
                          <span className="text-xs font-bold text-slate-700">Nama Laporan</span>
                          <Input name="title" defaultValue={`${selectedReport.name} - ${new Date().toLocaleDateString('id-ID')}`} placeholder="Judul custom" />
                        </label>

                        <label className="block space-y-1.5">
                          <span className="text-xs font-bold text-slate-700">Format Output</span>
                          <select className="h-10 w-full rounded-xl border border-border bg-white px-3 text-sm font-semibold text-slate-700" name="format" required>
                            {selectedReport.supportedFormats.map(f => (
                              <option key={f} value={f}>{f}</option>
                            ))}
                          </select>
                        </label>
                      </div>

                      <div className="rounded-xl bg-white p-4 border border-primary/10 space-y-4">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Filter Data</p>
                        
                        {(selectedReport.requiredFilters.includes('academicYearId') || selectedReport.optionalFilters.includes('academicYearId')) && (
                          <label className="block space-y-1.5">
                            <span className="text-xs font-bold text-slate-700">Tahun Akademik</span>
                            <select className="h-10 w-full rounded-xl border border-border bg-white px-3 text-sm font-semibold text-slate-700" name="academicYearId" required={selectedReport.requiredFilters.includes('academicYearId')}>
                              <option value="">Pilih Tahun...</option>
                              {academicYears.map(ay => <option key={ay.id} value={ay.id}>{ay.name}</option>)}
                            </select>
                          </label>
                        )}

                        {(selectedReport.requiredFilters.includes('semesterId') || selectedReport.optionalFilters.includes('semesterId')) && (
                          <label className="block space-y-1.5">
                            <span className="text-xs font-bold text-slate-700">Semester</span>
                            <select className="h-10 w-full rounded-xl border border-border bg-white px-3 text-sm font-semibold text-slate-700" name="semesterId" required={selectedReport.requiredFilters.includes('semesterId')}>
                              <option value="">Pilih Semester...</option>
                              {semesters.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                          </label>
                        )}

                        {(selectedReport.requiredFilters.includes('classroomId') || selectedReport.optionalFilters.includes('classroomId')) && (
                          <label className="block space-y-1.5">
                            <span className="text-xs font-bold text-slate-700">Kelas</span>
                            <select className="h-10 w-full rounded-xl border border-border bg-white px-3 text-sm font-semibold text-slate-700" name="classroomId" required={selectedReport.requiredFilters.includes('classroomId')}>
                              <option value="">Semua Kelas</option>
                              {classrooms.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                          </label>
                        )}

                        {(selectedReport.requiredFilters.includes('startDate') || selectedReport.optionalFilters.includes('startDate')) && (
                          <div className="grid grid-cols-2 gap-3">
                            <label className="block space-y-1.5">
                              <span className="text-xs font-bold text-slate-700">Mulai</span>
                              <Input type="date" name="startDate" required={selectedReport.requiredFilters.includes('startDate')} />
                            </label>
                            <label className="block space-y-1.5">
                              <span className="text-xs font-bold text-slate-700">Selesai</span>
                              <Input type="date" name="endDate" required={selectedReport.requiredFilters.includes('endDate')} />
                            </label>
                          </div>
                        )}

                        {(selectedReport.requiredFilters.includes('status') || selectedReport.optionalFilters.includes('status')) && (
                          <label className="block space-y-1.5">
                            <span className="text-xs font-bold text-slate-700">Status</span>
                            <select className="h-10 w-full rounded-xl border border-border bg-white px-3 text-sm font-semibold text-slate-700" name="status">
                              <option value="">Semua Status</option>
                              <option value="ACTIVE">Aktif</option>
                              <option value="INACTIVE">Tidak Aktif</option>
                              <option value="PAID">Lunas</option>
                              <option value="PENDING">Pending</option>
                            </select>
                          </label>
                        )}
                      </div>

                      <Button className="w-full" disabled={submitting} type="submit" size="lg">
                        {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileText className="mr-2 h-4 w-4" />}
                        Generate Laporan
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              ) : (
                <div className="flex h-64 flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50 p-8 text-center">
                  <div className="rounded-full bg-slate-100 p-4 mb-4">
                    <Filter className="h-8 w-8 text-slate-400" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-700">Belum Ada Laporan Terpilih</h3>
                  <p className="mt-1 text-xs text-slate-500">Pilih salah satu laporan di sebelah kiri untuk mengatur filter dan generate.</p>
                </div>
              )}

              <Card>
                <CardHeader>
                  <CardTitle>Recent Jobs</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-slate-100">
                    {summary?.recentJobs?.map((job: any) => (
                      <div key={job.id} className="flex items-center justify-between p-4">
                        <div className="space-y-1">
                          <p className="text-xs font-bold text-slate-700 truncate max-w-[150px]">{job.title || job.type}</p>
                          <p className="text-[10px] text-slate-400">{new Date(job.createdAt).toLocaleString('id-ID')}</p>
                        </div>
                        <Badge variant={job.status === 'COMPLETED' ? 'success' : job.status === 'FAILED' ? 'warning' : 'secondary'}>
                          {job.status}
                        </Badge>
                      </div>
                    ))}
                    {!summary?.recentJobs?.length && (
                      <div className="p-8 text-center text-xs text-slate-400">Belum ada riwayat job terbaru.</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
