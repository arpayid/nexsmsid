"use client";

import { Phase9ResourcePage, options } from "@/components/phase9-resource-page";

const channels = ["IN_APP", "EMAIL", "SMS", "WHATSAPP"];

export default function AdminNotificationTemplatesPage() {
  return (
    <Phase9ResourcePage
      breadcrumb={["Admin", "Komunikasi", "Template"]}
      columns={[{ key: "code", label: "Kode" }, { key: "name", label: "Nama" }, { key: "channel", label: "Channel" }, { key: "isActive", label: "Aktif", render: (row) => (row.isActive ? "Ya" : "Tidak") }]}
      create={(api, input) => api.createNotificationTemplate(input)}
      delete={(api, id) => api.deleteNotificationTemplate(id)}
      description="Template notifikasi untuk channel in-app, email, SMS, dan WhatsApp dummy."
      eyebrow="Phase 10 Notification"
      fields={[
        { name: "code", label: "Kode", required: true },
        { name: "name", label: "Nama", required: true },
        { name: "channel", label: "Channel", type: "select", options: options(channels), required: true },
        { name: "subject", label: "Subjek" },
        { name: "body", label: "Isi Template", type: "textarea", required: true }
      ]}
      load={(api, params) => api.listNotificationTemplates(params)}
      title="Template Notifikasi"
      update={(api, id, input) => api.updateNotificationTemplate(id, input)}
    />
  );
}
