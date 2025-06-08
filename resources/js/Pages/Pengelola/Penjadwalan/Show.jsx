import React from "react";
import { Head, Link } from "@inertiajs/react";
import PengelolaLayout from "@/Layouts/PengelolaLayout";

export default function Show({ auth, detailPenjadwalan }) {
    // Fungsi untuk mendapatkan warna badge status
    const getStatusTextColor = (status) => {
        const s = status?.toLowerCase();
        if (s === "terjadwal") return "text-status-terjadwal";
        if (s === "berlangsung") return "text-status-berlangsung";
        if (s === "selesai") return "text-status-selesai";
        return "text-gray-800 bg-gray-100";
    };

    return (
        <PengelolaLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    <Link
                        href={route("pengelola.penjadwalan.index")}
                        className="text-green-600 hover:text-green-800 hover:underline"
                    >
                        Penjadwalan
                    </Link>
                    <span className="text-green-600 hover:text-green-800">
                        {" / "}
                    </span>
                    <span className="text-green-600 hover:text-green-800">
                        {detailPenjadwalan.nama_pelanggan}
                    </span>
                </h2>
            }
        >
            <Head title="Detail Penjadwalan" />

            <div className="py-6">
                <div className="max-w-6xl">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <div className="bg-white">
                            {/* Header */}
                            <div className="mb-6">
                                <h1 className="text-lg font-bold text-gray-900">
                                    Detail Penjadwalan
                                </h1>
                            </div>
                            {/* Detail Information - Dua Kolom dengan Border */}
                            <div className="mb-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Kolom Kiri */}
                                    <div className="space-y-4">
                                        <div>
                                            <div className="text-sm text-gray-600 mb-1">
                                                ID Penyewaan
                                            </div>
                                            <div className="text-sm font-medium text-gray-900">
                                                {detailPenjadwalan.id_penyewaan}
                                            </div>
                                        </div>

                                        <div>
                                            <div className="text-sm text-gray-600 mb-1">
                                                Pelanggan
                                            </div>
                                            <div className="text-sm font-medium text-gray-900">
                                                {
                                                    detailPenjadwalan.nama_pelanggan
                                                }
                                            </div>
                                        </div>

                                        <div>
                                            <div className="text-sm text-gray-600 mb-1">
                                                Status Penjadwalan
                                            </div>
                                            <div className="text-sm font-medium text-gray-900">
                                                {detailPenjadwalan.id_penyewaan}
                                            </div>
                                        </div>

                                        <div>
                                            <div className="text-sm text-gray-600 mb-1">
                                                Tanggal Sewa
                                            </div>
                                            <div className="text-sm font-medium text-gray-900">
                                                {detailPenjadwalan.tanggal_sewa}
                                            </div>
                                        </div>

                                        <div>
                                            <div className="text-sm text-gray-600 mb-1">
                                                Durasi Sewa
                                            </div>
                                            <div className="text-sm font-medium text-gray-900">
                                                {detailPenjadwalan.durasi_sewa}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Kolom Kanan */}
                                    <div className="space-y-4">
                                        <div>
                                            <div className="text-sm text-gray-600 mb-1">
                                                Catatan
                                            </div>
                                            <div className="text-sm font-medium text-gray-900">
                                                {detailPenjadwalan.catatan ||
                                                    "-"}
                                            </div>
                                        </div>

                                        <div>
                                            <div className="text-sm text-gray-600 mb-1">
                                                Status Penjadwalan
                                            </div>
                                            <span
                                                className={`inline-flex text-xs font-medium rounded-full ${getStatusTextColor(
                                                    detailPenjadwalan.status_penyewaan
                                                )}`}
                                            >
                                                {
                                                    detailPenjadwalan.status_penyewaan
                                                }
                                            </span>
                                        </div>

                                        <div>
                                            <div className="text-sm text-gray-600 mb-1">
                                                Tanggal Pemasangan
                                            </div>
                                            <div className="text-sm font-medium text-gray-900">
                                                {detailPenjadwalan.tanggal_pemasangan ||
                                                    "-"}
                                            </div>
                                        </div>

                                        <div>
                                            <div className="text-sm text-gray-600 mb-1">
                                                Tanggal Pembongkaran
                                            </div>
                                            <div className="text-sm font-medium text-gray-900">
                                                {detailPenjadwalan.tanggal_pembongkaran ||
                                                    "-"}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Tabel Detail Tenda dengan Border */}
                            <div className="border border-gray-200 rounded-lg overflow-hidden mb-6">
                                <table className="min-w-full">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                                                Kode Tenda
                                            </th>
                                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                                                Tenda
                                            </th>
                                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                                                Jumlah
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white">
                                        <tr>
                                            <td className="px-6 py-4 text-sm text-gray-900">
                                                {
                                                    detailPenjadwalan
                                                        .detail_tenda.kode_tenda
                                                }
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900">
                                                {
                                                    detailPenjadwalan
                                                        .detail_tenda.nama_tenda
                                                }
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900">
                                                {
                                                    detailPenjadwalan
                                                        .detail_tenda.jumlah
                                                }
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            {/* Tombol Edit Jadwal */}
                            <div className="flex justify-center">
                                <button
                                    type="button"
                                    className="px-6 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150 ease-in-out"
                                >
                                    Edit Jadwal
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PengelolaLayout>
    );
}
