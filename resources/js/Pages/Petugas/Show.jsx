import React, { useState } from "react";
import PetugasLayout from "@/Layouts/PetugasLayout";
import { Head, router } from "@inertiajs/react";
import Modal from "@/Components/Modal";
import Button from "@/Components/Button";

export default function Show({ auth, jadwal }) {
    const [selectedStatus, setSelectedStatus] = useState(jadwal.status);
    const [isUpdating, setIsUpdating] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case "terpasang":
                return "text-green-600";
            case "terbongkar":
                return "text-red-600";
            case "terjadwal":
                return "text-blue-600";
            default:
                return "text-gray-600";
        }
    };

    // Tentukan opsi status yang tersedia berdasarkan status saat ini dan jenis tugas
    const getAvailableStatuses = () => {
        const current = jadwal.status;
        const jenis = jadwal.jenis_tugas;

        if (jenis === "pemasangan" && current === "terjadwal") {
            return [
                { value: "terjadwal", label: "Terjadwal" },
                { value: "terpasang", label: "Terpasang" },
            ];
        } else if (jenis === "pembongkaran" && current === "terpasang") {
            return [
                { value: "terpasang", label: "Terpasang" },
                { value: "terbongkar", label: "Terbongkar" },
            ];
        } else {
            // Jika tidak ada perubahan yang bisa dilakukan, tetap tampilkan semua opsi
            return [
                {
                    value: current,
                    label: current.charAt(0).toUpperCase() + current.slice(1),
                },
            ];
        }
    };

    // Fungsi untuk membuka modal
    const handleOpenModal = () => {
        setSelectedStatus(jadwal.status); // Reset ke status saat ini
        setShowModal(true);
    };

    // Fungsi untuk menutup modal
    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedStatus(jadwal.status); // Reset ke status saat ini
    };

    // Fungsi untuk menyimpan perubahan status
    const handleSaveStatus = () => {
        if (selectedStatus === jadwal.status) {
            setShowModal(false);
            return;
        }

        setIsUpdating(true);

        router.patch(
            route("petugas.jadwal.updateStatus", jadwal.id_jadwal),
            {
                status: selectedStatus,
            },
            {
                onSuccess: () => {
                    setIsUpdating(false);
                    setShowModal(false);
                },
                onError: () => {
                    setIsUpdating(false);
                    setSelectedStatus(jadwal.status);
                },
                preserveScroll: true,
            }
        );
    };

    // Tentukan judul berdasarkan jenis tugas
    const getJudulTugas = () => {
        return jadwal.jenis_tugas === "pemasangan"
            ? "Lokasi Pemasangan"
            : "Lokasi Pembongkaran";
    };

    const availableStatuses = getAvailableStatuses();

    const handleStatusChange = (newStatus) => {
        setSelectedStatus(newStatus);
    };

    const handleCancel = () => {
        handleCloseModal();
    };

    const handleStatusUpdate = () => {
        handleSaveStatus();
    };

    return (
        <PetugasLayout user={auth.user}>
            <Head title={`Detail Jadwal ${jadwal.jenis_tugas}`} />
            <div className="px-6 py-8 max-w-6xl mx-auto min-h-screen">
                {/* Breadcrumb */}
                <div className="text-green-700 mb-4 font-medium">
                    Jadwal / {jadwal.penyewa.nama} / {jadwal.jenis_tugas}
                </div>

                {/* Box utama */}
                <div className="bg-white shadow rounded-lg border p-6 mb-8">
                    <h2 className="font-bold text-gray-800 mb-4">Tenda</h2>
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-gray-500 border-b">
                                <th className="text-left py-2">Tenda</th>
                                <th className="text-left py-2">Jumlah</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="py-2">{jadwal.tenda.nama}</td>
                                <td className="py-2">
                                    {jadwal.tenda.jumlah} Unit
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Lokasi dengan judul dinamis */}
                <div className="bg-white shadow rounded-lg border p-6">
                    <h2 className="font-bold text-gray-800 mb-4">
                        {getJudulTugas()}
                    </h2>
                    <div className="grid grid-cols-2 gap-6 text-sm">
                        <div className="space-y-2">
                            <div>
                                <div className="text-gray-600">Tanggal</div>
                                <div className="font-semibold">
                                    {jadwal.tanggal_tugas}
                                </div>
                            </div>
                            <div>
                                <div className="text-gray-600">Waktu</div>
                                <div className="font-semibold">
                                    {jadwal.waktu_tugas}
                                </div>
                            </div>
                            <div>
                                <div className="text-gray-600">Status</div>
                                <div
                                    className={`font-semibold ${getStatusColor(
                                        jadwal.status
                                    )}`}
                                >
                                    {jadwal.status.charAt(0).toUpperCase() +
                                        jadwal.status.slice(1)}
                                </div>
                            </div>
                            <div>
                                <div className="text-gray-600">
                                    Catatan penyewa
                                </div>
                                <div className="font-semibold">
                                    {jadwal.catatan_penyewa || "-"}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div>
                                <div className="text-gray-600">Penyewa</div>
                                <div className="font-semibold">
                                    {jadwal.penyewa.nama}
                                </div>
                            </div>
                            <div>
                                <div className="text-gray-600">Nomor Telp</div>
                                <div className="font-semibold">
                                    {jadwal.penyewa.nomor_telp}
                                </div>
                            </div>
                            <div>
                                <div className="text-gray-600">Alamat</div>
                                <div className="font-semibold">
                                    {jadwal.penyewa.alamat}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tombol Ubah Status - Selalu aktif */}
                    <div className="mt-8 text-center">
                        <button
                            onClick={handleOpenModal}
                            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded transition"
                        >
                            Ubah Status
                        </button>
                    </div>
                </div>

                {/* Modal untuk Ubah Status - Design sesuai Dashboard */}
                <Modal show={showModal} onClose={handleCloseModal} maxWidth="md">
                    <div className="bg-white rounded-lg">
                        {/* Header Modal dengan background hijau */}
                        <div className="bg-green-100 px-6 py-4 text-center rounded-t-lg">
                            <h2 className="text-lg font-semibold text-gray-800">
                                Status
                            </h2>
                        </div>

                        {/* Content Modal */}
                        <div className="px-6 py-4 space-y-4">
                            {/* Informasi Detail Jadwal */}
                            <div className="space-y-2 text-sm">
                                <div>
                                    <span className="font-medium">
                                        Tanggal{" "}
                                        {jadwal.jenis_tugas === "pembongkaran"
                                            ? "Pembongkaran"
                                            : "Pemasangan"}{" "}
                                        :
                                    </span>
                                    <span className="ml-2">
                                        {jadwal.tanggal_tugas}, {jadwal.waktu_tugas}
                                    </span>
                                </div>
                                <div>
                                    <span className="font-medium">Tenda :</span>
                                    <span className="ml-2">
                                        {jadwal.tenda.nama} -{" "}
                                        {jadwal.tenda.jumlah} unit
                                    </span>
                                </div>
                                <div>
                                    <span className="font-medium">Penyewa :</span>
                                    <span className="ml-2">
                                        {jadwal.penyewa.nama}
                                    </span>
                                </div>
                            </div>

                            {/* Pilihan Status */}
                            <div className="space-y-3">
                                <h3 className="font-medium text-gray-800">
                                    Pilih Status
                                </h3>
                                <div className="space-y-2">
                                    {/* Option Terjadwal */}
                                    <label className="flex items-center space-x-3 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="status"
                                            value="terjadwal"
                                            checked={selectedStatus === "terjadwal"}
                                            onChange={() =>
                                                handleStatusChange("terjadwal")
                                            }
                                            className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                                            disabled={jadwal.status === "terbongkar"}
                                        />
                                        <span className="text-sm text-gray-700">
                                            Terjadwal
                                        </span>
                                    </label>

                                    {/* Option Terpasang */}
                                    <label className="flex items-center space-x-3 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="status"
                                            value="terpasang"
                                            checked={selectedStatus === "terpasang"}
                                            onChange={() =>
                                                handleStatusChange("terpasang")
                                            }
                                            className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                                            disabled={jadwal.status === "terbongkar"}
                                        />
                                        <span className="text-sm text-gray-700">
                                            Terpasang
                                        </span>
                                    </label>

                                    {/* Option Terbongkar */}
                                    <label className="flex items-center space-x-3 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="status"
                                            value="terbongkar"
                                            checked={selectedStatus === "terbongkar"}
                                            onChange={() =>
                                                handleStatusChange("terbongkar")
                                            }
                                            className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                                        />
                                        <span className="text-sm text-gray-700">
                                            Terbongkar
                                        </span>
                                    </label>
                                </div>
                            </div>

                            {/* Tombol Aksi */}
                            <div className="flex justify-center space-x-4 pt-4">
                                <button
                                    onClick={handleCancel}
                                    className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-md transition-colors duration-200"
                                    disabled={isUpdating}
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={handleStatusUpdate}
                                    disabled={
                                        selectedStatus === jadwal.status || isUpdating
                                    }
                                    className="px-6 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-sm font-medium rounded-md transition-colors duration-200"
                                >
                                    {isUpdating ? "Menyimpan..." : "Simpan"}
                                </button>
                            </div>
                        </div>
                    </div>
                </Modal>
            </div>
        </PetugasLayout>
    );
}