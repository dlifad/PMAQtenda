import React, { useState } from "react";
import PengelolaLayout from "@/Layouts/PengelolaLayout";
import { Head, Link, router, useForm } from "@inertiajs/react";
import Button from "@/Components/Button";
import { ChevronRight } from "lucide-react";

export default function Index({
    auth,
    perluDijadwalkan,
    sudahTerjadwal,
    flash,
}) {
    const [showModal, setShowModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        id_penyewaan: "",
        tanggal_pemasangan: "",
        waktu_pemasangan: "",
        tanggal_pembongkaran: "",
        waktu_pembongkaran: "",
    });

    const getStatusTextColor = (status) => {
        const s = status?.toLowerCase();
        if (s === "terjadwal") return "text-status-terjadwal";
        if (s === "berlangsung") return "text-status-berlangsung";
        if (s === "selesai") return "text-status-selesai";
        return "text-gray-800 bg-gray-100";
    };

    const handleJadwalkan = (item) => {
        setSelectedItem(item);
        setData({
            id_penyewaan: item.id_penyewaan,
            tanggal_pemasangan: "",
            waktu_pemasangan: "",
            tanggal_pembongkaran: "",
            waktu_pembongkaran: "",
        });
        setShowModal(true);
    };

    const handleSubmit = (e) => {
        if (e) e.preventDefault();
        post(route("pengelola.penjadwalan.store"), {
            onSuccess: () => {
                setShowModal(false);
                reset();
                setSelectedItem(null);
            },
            onError: () => {
                // Error akan ditampilkan otomatis dari Laravel
            },
        });
    };

    const handleCloseModal = () => {
        setShowModal(false);
        reset();
        setSelectedItem(null);
    };

    return (
        <PengelolaLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Penjadwalan
                </h2>
            }
        >
            <Head title="Penjadwalan" />

            {/* Flash Messages */}
            {flash?.success && (
                <div className="mb-4 p-4 text-green-700 bg-green-100 rounded-lg">
                    {flash.success}
                </div>
            )}

            {flash?.error && (
                <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-lg">
                    {flash.error}
                </div>
            )}

            <div className="space-y-8">
                {/* Bagian Perlu Dijadwalkan */}
                <h3 className="font-bold text-gray-800 mb-4">
                    Perlu Dijadwalkan
                </h3>
                <div className="bg-white shadow-md rounded-lg p-4">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Penyewa
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Tenda
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Jumlah
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {perluDijadwalkan.length > 0 ? (
                                    perluDijadwalkan.map((item) => (
                                        <tr
                                            key={item.id_penyewaan}
                                            className="hover:bg-gray-50"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {item.nama_pelanggan}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {item.nama_tenda}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {item.jumlah_tenda}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <Button
                                                    variant="success"
                                                    size="small"
                                                    onClick={() =>
                                                        handleJadwalkan(item)
                                                    }
                                                >
                                                    Jadwalkan
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="4"
                                            className="px-6 py-10 text-center text-sm text-gray-500"
                                        >
                                            Tidak ada penyewaan yang perlu
                                            dijadwalkan.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Bagian Sudah Terjadwal */}
                <h3 className="font-bold text-gray-800 mb-4">
                    Terjadwal
                </h3>
                <div className="bg-white shadow-md rounded-lg p-4">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Penyewa
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Pemasangan
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Pembongkaran
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {sudahTerjadwal.length > 0 ? (
                                    sudahTerjadwal.map((item) => (
                                        <tr
                                            key={item.id_penyewaan}
                                            className="hover:bg-gray-50 cursor-pointer"
                                            onClick={() =>
                                                router.get(
                                                    route(
                                                        "pengelola.penjadwalan.show",
                                                        item.id_penyewaan
                                                    )
                                                )
                                            }
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {item.nama_pelanggan}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {item.tanggal_pemasangan}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {item.tanggal_pembongkaran}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <span
                                                    className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusTextColor(
                                                        item.status
                                                    )}`}
                                                >
                                                    {item.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="5"
                                            className="px-6 py-10 text-center text-sm text-gray-500"
                                        >
                                            Belum ada penyewaan yang terjadwal.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal Penjadwalan */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                        <div className="mb-4">
                            <div className="bg-green-100 text-green-800 text-center py-2 rounded-lg mb-4">
                                <h3 className="font-semibold">Jadwalkan</h3>
                            </div>

                            {selectedItem && (
                                <div className="space-y-2 mb-6">
                                    <p>
                                        <span className="font-medium">
                                            Penyewa:
                                        </span>{" "}
                                        {selectedItem.nama_pelanggan}
                                    </p>
                                    <p>
                                        <span className="font-medium">
                                            Tenda:
                                        </span>{" "}
                                        {selectedItem.nama_tenda} -{" "}
                                        {selectedItem.jumlah_tenda} unit
                                    </p>
                                    <p>
                                        <span className="font-medium">
                                            Tanggal sewa:
                                        </span>{" "}
                                        {selectedItem.tanggal_sewa_mulai} -{" "}
                                        {selectedItem.tanggal_sewa_selesai}
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="space-y-4">
                            {/* Jadwal Pemasangan */}
                            <div>
                                <h4 className="font-medium mb-2">
                                    Jadwal Pemasangan
                                </h4>
                                <div className="flex gap-4">
                                    <div className="flex-1">
                                        <label className="block text-sm text-gray-600 mb-1">
                                            Tanggal:
                                        </label>
                                        <input
                                            type="date"
                                            value={data.tanggal_pemasangan}
                                            onChange={(e) =>
                                                setData(
                                                    "tanggal_pemasangan",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            required
                                        />
                                        {errors.tanggal_pemasangan && (
                                            <p className="text-red-500 text-xs mt-1">
                                                {errors.tanggal_pemasangan}
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <label className="block text-sm text-gray-600 mb-1">
                                            Waktu:
                                        </label>
                                        <input
                                            type="time"
                                            value={data.waktu_pemasangan}
                                            onChange={(e) =>
                                                setData(
                                                    "waktu_pemasangan",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            required
                                        />
                                        {errors.waktu_pemasangan && (
                                            <p className="text-red-500 text-xs mt-1">
                                                {errors.waktu_pemasangan}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Jadwal Pembongkaran */}
                            <div>
                                <h4 className="font-medium mb-2">
                                    Jadwal Pembongkaran
                                </h4>
                                <div className="flex gap-4">
                                    <div className="flex-1">
                                        <label className="block text-sm text-gray-600 mb-1">
                                            Tanggal:
                                        </label>
                                        <input
                                            type="date"
                                            value={data.tanggal_pembongkaran}
                                            onChange={(e) =>
                                                setData(
                                                    "tanggal_pembongkaran",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            required
                                        />
                                        {errors.tanggal_pembongkaran && (
                                            <p className="text-red-500 text-xs mt-1">
                                                {errors.tanggal_pembongkaran}
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <label className="block text-sm text-gray-600 mb-1">
                                            Waktu:
                                        </label>
                                        <input
                                            type="time"
                                            value={data.waktu_pembongkaran}
                                            onChange={(e) =>
                                                setData(
                                                    "waktu_pembongkaran",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            required
                                        />
                                        {errors.waktu_pembongkaran && (
                                            <p className="text-red-500 text-xs mt-1">
                                                {errors.waktu_pembongkaran}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Tombol Aksi */}
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="flex-1 px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
                                    disabled={processing}
                                >
                                    Batal
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    className="flex-1 px-4 py-2 text-white bg-green-500 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                                    disabled={processing}
                                >
                                    {processing ? "Menyimpan..." : "Simpan"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </PengelolaLayout>
    );
}
