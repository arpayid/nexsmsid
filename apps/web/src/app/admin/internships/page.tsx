"use client";

import { Phase9ResourcePage, options, statusMap } from "@/components/phase9-resource-page";

const statuses = ["PLANNED", "ONGOING", "COMPLETED", "CANCELLED"];

export default function InternshipsPage() {
  return (
    <Phase9ResourcePage
      breadcrumb={["Admin", "PKL", "Data PKL"]}
      columns={[{ key: "title", label: "Judul" }, { key: "student.name", label: "Siswa" }, { key: "industryPartner.name", label: "Mitra" }, { key: "startDate", label: "Mulai", render: (row) => String(row.startDate ?? "-").slice(0, 10) }, { key: "endDate", label: "Selesai", render: (row) => String(row.endDate ?? "-").slice(0, 10) }, { key: "status", label: "Status" }, { key: "finalScore", label: "Nilai" }]}
      create={(api, input) => api.createInternship(input)}
      delete={(api, id) => api.deleteInternship(id)}
      description="Kelola penempatan dan workflow PKL siswa."
      eyebrow="Phase 9 PKL"
      fields={[
        { name: "studentId", label: "ID Siswa", required: true },
        { name: "industryPartnerId", label: "ID Mitra Industri", required: true },
        { name: "supervisorTeacherId", label: "ID Guru Pembimbing" },
        { name: "title", label: "Judul PKL", required: true },
        { name: "startDate", label: "Tanggal Mulai", type: "date", required: true },
        { name: "endDate", label: "Tanggal Selesai", type: "date", required: true },
        { name: "status", label: "Status", type: "select", options: options(statuses) },
        { name: "note", label: "Catatan", type: "textarea" }
      ]}
      load={(api, params) => api.listInternships(params)}
      rowActions={[
        { label: "Start", run: (api, row) => api.startInternship(row.id as string), show: (row) => row.status === "PLANNED" },
        { label: "Score", run: (api, row) => api.scoreInternship(row.id as string, { disciplineScore: 86, skillScore: 86, attitudeScore: 86, reportScore: 86, note: "Nilai cepat dari UI" }), show: (row) => row.status !== "CANCELLED" },
        { label: "Complete", run: (api, row) => api.completeInternship(row.id as string), show: (row) => row.status === "ONGOING" },
        { label: "Cancel", run: (api, row) => api.cancelInternship(row.id as string), show: (row) => row.status === "PLANNED" || row.status === "ONGOING", variant: "ghost" }
      ]}
      statusMap={statusMap(statuses)}
      statusOptions={options(statuses)}
      title="Data PKL"
      update={(api, id, input) => api.updateInternship(id, input)}
    />
  );
}
