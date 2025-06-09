import React, { useState } from "react";
import PetugasLayout from "@/Layouts/PetugasLayout";
import { Head, router, usePage, Link } from "@inertiajs/react";
import {
    ClipboardList,
    Clock,
    ArrowDownCircle,
    ArrowUpCircle,
} from "lucide-react";
import Modal from "@/Components/Modal";
import Button from "@/Components/Button";
import Pagination from "@/Components/Pagination";
import { LogOut } from "lucide-react";

const StatCard = ({ title, value, icon, colorClass }) => (
    <div className="bg-white p-5 rounded-lg shadow flex items-center space-x-4">
        <div className={`p-3 rounded-full ${colorClass}`}>
            {React.cloneElement(icon, { className: "w-6 h-6 text-white" })}
        </div>
        <div>
            <p className="text-sm text-gray-500">{title}</p>
            <p className="text-2xl font-semibold text-gray-800">{value}</p>
        </div>
    </div>
);

export default function Dashboard({ auth, stats, daftarJadwal }) {
    const { flash } = usePage().props;
    const [showModal, setShowModal] = useState(false);
    const [selectedJadwal, setSelectedJadwal] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState("");

    /**
     * Fungsi untuk menentukan warna badge status berdasarkan status jadwal
     * Status yang digunakan: terjadwal, terpasang, terbongkar
     */
    const getStatusBadgeColor = (status) => {
        const s = status?.toLowerCase();
        if (s === 'terjadwal') return "text-blue-800 bg-blue-100";
        if (s === 'terpasang') return "text-indigo-800 bg-indigo-100";
        if (s === 'terbongkar') return "text-green-800 bg-green-100";
        return "text-gray-800 bg-gray-100";
    };

    /**
     * Fungsi untuk menampilkan teks status yang user-friendly
     */
    const getStatusDisplayText = (status) => {
        const statusMap = {
            'terjadwal': 'Terjadwal',
            'terpasang': 'Terpasang',
            'terbongkar': 'Terbongkar'
        };
        return statusMap[status?.toLowerCase()] || status;
    };

    /**
     * Fungsi untuk menentukan URL detail berdasarkan jenis jadwal
     * @param {Object} jadwal 
     * @returns {string} URL dengan parameter jenis
     */
    const getDetailUrl = (jadwal) => {
        const jenisParam = jadwal.jenis_jadwal.toLowerCase() === 'pembongkaran' ? 'pembongkaran' : 'pemasangan';
        return route("petugas.jadwal.show", {
            id_jadwal: jadwal.id_jadwal,
            jenis: jenisParam
        });
    };

    const handleOpenModal = (jadwal) => {
        setSelectedJadwal(jadwal);
        setSelectedStatus(jadwal.status);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setSelectedJadwal(null);
        setSelectedStatus("");
        setShowModal(false);
    };

    const handleStatusChange = (status) => {
        setSelectedStatus(status);
    };

    const handleStatusUpdate = () => {
        if (!selectedJadwal || !selectedStatus) return;

        router.patch(
            route("petugas.jadwal.updateStatus", selectedJadwal.id_jadwal),
            {
                status: selectedStatus,
            },
            {
                onSuccess: () => handleCloseModal(),
                preserveScroll: true,
            }
        );
    };

    const handleCancel = () => {
        handleCloseModal();
    };
    console.log("DAFTAR JADWAL:", daftarJadwal.data);

    return (
        <PetugasLayout user={auth.user}>
            <Head title="Dashboard Petugas" />

            {/* Notifikasi Flash Messages */}
            {flash.success && (
                <div
                    className="mb-4 p-4 text-sm text-green-700 bg-green-100 rounded-lg"
                    role="alert"
                >
                    {flash.success}
                </div>
            )}
            {flash.error && (
                <div
                    className="mb-4 p-4 text-sm text-red-700 bg-red-100 rounded-lg"
                    role="alert"
                >
                    {flash.error}
                </div>
            )}
            <div className="flex justify-end mb-4">
                <Link
                    href={route("logout")}
                    method="post"
                    as="button"
                    className="inline-flex items-center px-3 py-2 border border-red-300 text-sm leading-4 font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition"
                >
                    <LogOut className="w-4 h-4 mr-1" />
                    Log Out
                </Link>
            </div>
            <div className="space-y-8">
                {/* Bagian Card Statistik */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        title="Total Jadwal"
                        value={stats.totalJadwal}
                        icon={<ClipboardList />}
                        colorClass="bg-gray-500"
                    />
                    <StatCard 
                        title="Menunggu Penugasan" 
                        value={stats.menunggu} 
                        icon={<Clock />} 
                        colorClass="bg-yellow-500" 
                    />
                    <StatCard 
                        title="Pemasangan Hari Ini" 
                        value={stats.pemasanganHariIni} 
                        icon={<ArrowDownCircle />} 
                        colorClass="bg-blue-500" 
                    />
                    <StatCard 
                        title="Pembongkaran Hari Ini" 
                        value={stats.pembongkaranHariIni} 
                        icon={<ArrowUpCircle />} 
                        colorClass="bg-green-500" 
                    />
                </div>

                {/* Bagian Daftar Jadwal */}
                <div className="bg-white shadow-lg rounded-lg">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-800">
                            Daftar Jadwal
                        </h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Tanggal
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Penyewa
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Lokasi
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Jenis Jadwal
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {daftarJadwal.data.length > 0 ? (
                                    daftarJadwal.data.map((jadwal) => (
                                        <tr
                                            key={jadwal.id_tugas}
                                            className="hover:bg-gray-50"
                                        >
                                            {/* Buat seluruh baris bisa diklik dengan URL yang tepat */}
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <Link
                                                    href={getDetailUrl(jadwal)}
                                                    className="block cursor-pointer"
                                                >
                                                    {jadwal.tanggal} <br />
                                                    <span className="text-xs text-gray-400">
                                                        {jadwal.waktu}
                                                    </span>
                                                </Link>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                <Link
                                                    href={getDetailUrl(jadwal)}
                                                    className="block cursor-pointer"
                                                >
                                                    {jadwal.penyewa}
                                                </Link>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                                                <Link
                                                    href={getDetailUrl(jadwal)}
                                                    className="block cursor-pointer"
                                                >
                                                    {jadwal.lokasi}
                                                </Link>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <Link
                                                    href={getDetailUrl(jadwal)}
                                                    className="block cursor-pointer"
                                                >
                                                    {jadwal.jenis_jadwal}
                                                </Link>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(jadwal.status)}`}>
                                                    {getStatusDisplayText(jadwal.status)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <Button
                                                    variant="success"
                                                    size="small"
                                                    onClick={() =>
                                                        handleOpenModal(jadwal)
                                                    }
                                                >
                                                    Ubah Status
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="6"
                                            className="px-6 py-12 text-center text-sm text-gray-500"
                                        >
                                            Tidak ada jadwal yang perlu
                                            dikerjakan.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Komponen Pagination */}
                    {daftarJadwal.links && daftarJadwal.links.length > 3 && (
                        <div className="p-6 border-t border-gray-200">
                            <Pagination links={daftarJadwal.links} />
                        </div>
                    )}
                </div>
            </div>

            {/* Modal untuk Ubah Status - Design sesuai gambar */}
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
                                    {selectedJadwal?.jenis_jadwal ===
                                    "Pembongkaran"
                                        ? "Pembongkaran"
                                        : "Pemasangan"}{" "}
                                    :
                                </span>
                                <span className="ml-2">
                                    {selectedJadwal?.jenis_jadwal ===
                                    "Pembongkaran"
                                        ? `${
                                              selectedJadwal?.tanggal_pembongkaran ||
                                              selectedJadwal?.tanggal
                                          }, ${
                                              selectedJadwal?.waktu_pembongkaran ||
                                              selectedJadwal?.waktu
                                          }`
                                        : `${selectedJadwal?.tanggal}, ${selectedJadwal?.waktu}`}
                                </span>
                            </div>
                            <div>
                                <span className="font-medium">Tenda :</span>
                                <span className="ml-2">
                                    {selectedJadwal?.nama_tenda} -{" "}
                                    {selectedJadwal?.jumlah_tenda} unit
                                </span>
                            </div>
                            <div>
                                <span className="font-medium">Penyewa :</span>
                                <span className="ml-2">
                                    {selectedJadwal?.penyewa}
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
                                        disabled={
                                            selectedJadwal?.status ===
                                            "terbongkar"
                                        }
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
                                        disabled={
                                            selectedJadwal?.status ===
                                            "terbongkar"
                                        }
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
                                        checked={
                                            selectedStatus === "terbongkar"
                                        }
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
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleStatusUpdate}
                                disabled={
                                    selectedStatus === selectedJadwal?.status
                                }
                                className="px-6 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-sm font-medium rounded-md transition-colors duration-200"
                            >
                                Simpan
                            </button>
                        </div>
                    </div>
                </div>
            </Modal>
        </PetugasLayout>
    );
}