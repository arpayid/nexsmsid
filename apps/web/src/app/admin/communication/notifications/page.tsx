"use client";

import { Phase9ResourcePage, options, statusMap } from "@/components/phase9-resource-page";

const statuses = ["UNREAD", "READ", "ARCHIVED"];
const channels = ["IN_APP", "EMAIL", "SMS", "WHATSAPP"];

export default function AdminNotificationsPage() {
  return (
    <Phase9ResourcePage
      breadcrumb={["Admin", "Komunikasi", "Notifikasi"]}
      columns={[{ key: "title", label: "Judul" }, { key: "channel", label: "Channel" }, { key: "status", label: "Status" }, { key: "createdAt", label: "Dibuat", render: (row) => String(row.createdAt ?? "-").slice(0, 10) }]}
      create={(api, input) => api.createNotification(input)}
      description="Kelola notifikasi in-app dan fondasi channel eksternal."
      eyebrow="Phase 10 Notification"
      fields={[
        { name: "userId", label: "Recipient User ID", required: true },
        { name: "title", label: "Judul", required: true },
        { name: "channel", label: "Channel", type: "select", options: options(channels), required: true },
        { name: "body", label: "Isi Notifikasi", type: "textarea", required: true }
      ]}
      load={(api, params) => api.listNotifications(params)}
      rowActions={[
        { label: "Dibaca", run: (api, row) => api.markNotificationRead(row.id as string), show: (row) => row.status !== "READ", variant: "soft" },
        { label: "Arsip", run: (api, row) => api.archiveNotification(row.id as string), show: (row) => row.status !== "ARCHIVED", variant: "outline" }
      ]}
      statusMap={statusMap(statuses)}
      statusOptions={options(statuses)}
      title="Notifikasi"
    />
  );
}
