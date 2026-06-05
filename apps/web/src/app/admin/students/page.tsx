"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertCircle, Loader2 } from "lucide-react";

import type { ClassroomReference, MasterDataRecord } from "@nexsmsid/api-client";
import { Card, CardContent, CardHeader, CardTitle } from "@nexsmsid/ui";

import { PeoplePage, type PeopleField } from "@/components/people-page";
import { createBrowserApiClient } from "@/lib/api-client";

export default function StudentsPage() {
  const api = useMemo(() => createBrowserApiClient(), []);
  const [classrooms, setClassrooms] = useState<ClassroomReference[]>([]);
  const [loadingClassrooms, setLoadingClassrooms] = useState(true);
  const [classroomError, setClassroomError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadClassrooms() {
      setLoadingClassrooms(true);
      setClassroomError(null);

      try {
        const response = await api.masterDataList("classrooms", { limit: 100 });
        const items = (response.data as unknown as Array<Record<string, unknown>>).map((item) => ({
          id: String(item.id),
          code: String(item.code ?? ""),
          name: String(item.name ?? ""),
          level: Number(item.level ?? 0)
        }));
        if (active) setClassrooms(items);
      } catch (loadError) {
        if (active) {
          setClassroomError(loadError instanceof Error ? loadError.message : "Gagal memuat classroom");
        }
      } finally {
        if (active) setLoadingClassrooms(false);
      }
    }

    void loadClassrooms();

    return () => {
      active = false;
    };
  }, [api]);

  const fields: PeopleField[] = useMemo(
    () => [
      { name: "nis", label: "NIS", required: true, table: true },
      { name: "nisn", label: "NISN", table: true },
      { name: "name", label: "Nama Lengkap", required: true, table: true },
      {
        label: "Jenis Kelamin",
        name: "gender",
        options: ["MALE", "FEMALE"],
        required: true,
        table: true,
        type: "select"
      },
      { name: "birthPlace", label: "Tempat Lahir" },
      { name: "birthDate", label: "Tanggal Lahir", type: "date" },
      { name: "address", label: "Alamat" },
      { name: "phone", label: "Telepon", type: "tel" },
      { name: "email", label: "Email", type: "email" },
      {
        label: "Kelas",
        name: "classroomId",
        options: classrooms.map((classroom) => classroom.id),
        table: false,
        type: "select"
      },
      {
        label: "Status",
        name: "status",
        options: ["ACTIVE", "INACTIVE", "GRADUATED", "TRANSFERRED"],
        required: true,
        table: true,
        type: "select"
      },
      { name: "photoUrl", label: "Photo URL", type: "url", table: false },
      { name: "enrolledAt", label: "Tanggal Masuk", type: "date", table: false }
    ],
    [classrooms]
  );

  const resource = useMemo(
    () => ({
      create: (input: Record<string, unknown>) => api.createStudent(input),
      delete: (id: string) => api.deleteStudent(id),
      get: (id: string) => api.getStudent(id),
      list: async (options: { limit: number; page: number; search?: string; status?: string }) => {
        const response = await api.listStudents(options);
        return {
          items: response.items as unknown as MasterDataRecord[],
          meta: response.meta
        };
      },
      update: (id: string, input: Record<string, unknown>) => api.updateStudent(id, input)
    }),
    [api]
  );

  const excel = useMemo(
    () => ({
      downloadTemplate: () => api.downloadStudentsTemplate(),
      exportData: () => api.exportStudents(),
      importData: (file: File) => api.importStudents(file),
      saveBlob: (blob: Blob, filename: string) => api.saveExcelBlob(blob, filename),
      templateFilename: "students-template.xlsx",
      exportFilename: "students-export.xlsx"
    }),
    [api]
  );

  return (
    <div className="space-y-6">
      {classroomError ? (
        <div className="flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-700">
          <AlertCircle className="h-5 w-5" /> {classroomError}
        </div>
      ) : null}

      {loadingClassrooms ? (
        <Card>
          <CardHeader>
            <CardTitle>Memuat daftar kelas...</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid min-h-24 place-items-center text-sm font-bold text-slate-600">
              <span className="inline-flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin text-primary" /> Mengambil data kelas untuk referensi.
              </span>
            </div>
          </CardContent>
        </Card>
      ) : (
        <ClassroomSummary classrooms={classrooms} />
      )}

      <PeoplePage
        description="Kelola data siswa, wali kelas, dan histori akademik dasar."
        excel={excel}
        fields={fields}
        resource={resource}
        statusOptions={["ACTIVE", "INACTIVE", "GRADUATED", "TRANSFERRED"]}
        title="Siswa"
      />
    </div>
  );
}

function ClassroomSummary({ classrooms }: { classrooms: ClassroomReference[] }) {
  if (classrooms.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Belum ada kelas</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-6 text-muted-foreground">
            Tambahkan kelas terlebih dahulu di menu Master Data Kelas agar siswa dapat ditempatkan.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Referensi Kelas</CardTitle>
        <p className="mt-1 text-xs font-semibold text-muted-foreground">
          {classrooms.length} kelas aktif. Pilih ID di form siswa untuk menetapkan kelas.
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
          {classrooms.slice(0, 6).map((classroom) => (
            <div
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs"
              key={classroom.id}
            >
              <p className="font-black uppercase tracking-widest text-primary">
                Tingkat {classroom.level} • {classroom.code}
              </p>
              <p className="text-sm font-bold text-slate-900">{classroom.name}</p>
              <p className="font-mono text-[10px] text-slate-500">id: {classroom.id}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
