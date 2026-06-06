"use client";

import { PageHeader } from "@nexsmsid/ui";

export default function LibraryMembersPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Anggota Perpustakaan" description="Kelola anggota perpustakaan (Siswa/Guru/Staf)" />
      <div className="p-8 text-center text-muted-foreground border rounded-lg bg-card">
        <p>Fitur pengelolaan anggota sedang dalam pengembangan.</p>
      </div>
    </div>
  );
}
