import { MasterDataPage } from "@/components/master-data-page";

export default function InventoryLocationsPage() {
  return (
    <MasterDataPage
      description="Kelola lokasi penyimpanan atau penempatan barang inventaris."
      fields={[
        { name: "code", label: "Kode Lokasi", required: true },
        { name: "name", label: "Nama Lokasi", required: true },
        { name: "description", label: "Deskripsi", type: "textarea" },
        { name: "roomId", label: "ID Ruangan (Opsional)", required: false },
        { name: "responsibleUserId", label: "ID Penanggung Jawab (Opsional)", required: false },
        { name: "isActive", label: "Aktif", type: "checkbox" }
      ]}
      resource="inventory/locations"
      title="Lokasi Inventaris"
    />
  );
}
