"use client";

import { PageHeader } from "@nexsmsid/ui";

export default function Page() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Kehadiran Pegawai" description="Manajemen kehadiran pegawai." />
      <div className="bg-white p-6 rounded-lg border">
        <p className="text-gray-500">Halaman Kehadiran Pegawai sedang dalam pengembangan. Fitur CRUD API telah tersedia di backend.</p>
      </div>
    </div>
  );
}
