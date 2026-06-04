"use client";

import { Phase9ResourcePage } from "@/components/phase9-resource-page";

export default function AdminExportHistoryPage() {
  return (
    <Phase9ResourcePage
      breadcrumb={["Admin", "Laporan", "Export History"]}
      columns={[{ key: "fileName", label: "File" }, { key: "entity", label: "Entity" }, { key: "format", label: "Format" }, { key: "rowCount", label: "Rows" }, { key: "createdAt", label: "Dibuat", render: (row) => String(row.createdAt ?? "-").slice(0, 10) }]}
      description="Riwayat export yang dibuat oleh report queue dummy."
      eyebrow="Phase 10 Export"
      load={(api, params) => api.listExportHistory(params)}
      title="Export History"
    />
  );
}
