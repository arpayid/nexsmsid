import { MasterDataPage } from "@/components/master-data-page";

export default function ClassroomsPage() {
  return (
    <MasterDataPage
      description="Kelola kelas dasar yang terhubung ke program keahlian."
      fields={[
        { name: "competencyId", label: "Competency ID", required: true, table: false },
        { name: "competency", label: "Program Keahlian", table: true },
        { name: "code", label: "Kode", required: true },
        { name: "name", label: "Nama", required: true },
        { name: "level", label: "Tingkat", required: true, type: "number" },
        { name: "isActive", label: "Aktif", type: "checkbox" }
      ]}
      resource="classrooms"
      title="Kelas"
    />
  );
}
