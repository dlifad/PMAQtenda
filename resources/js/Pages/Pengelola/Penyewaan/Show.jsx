import React, { useState } from "react";
import { Head, Link, useForm, usePage, router } from "@inertiajs/react";
import PengelolaLayout from "@/Layouts/PengelolaLayout";
import Button from "@/Components/Button";
import { ArrowLeft, Printer, Ban, CalendarPlus, X } from "lucide-react";
import Modal from "@/Components/Modal";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";

export default function Show({ auth, penyewaanDetail }) {
    const { props } = usePage();
    const [schedulingModalOpen, setSchedulingModalOpen] = useState(false);

    const { data, setData, post, patch, processing, errors, reset } = useForm({
        status: "",
        tanggal_pemasangan: penyewaanDetail.jadwal?.tanggal_pemasangan || "",
        waktu_pemasangan: penyewaanDetail.jadwal?.waktu_pemasangan || "",
        tanggal_pembongkaran: penyewaanDetail.jadwal?.tanggal_pembongkaran || "",
        waktu_pembongkaran: penyewaanDetail.jadwal?.waktu_pembongkaran || "",
    });

    const getStatusTextColor = (status) => {
        const s = status?.toLowerCase();
        if (s === "menunggu") return "text-status-menunggu";
        if (s === "terjadwal") return "text-status-terjadwal";
        if (s === "berlangsung") return "text-status-berlangsung";
        if (s === "selesai") return "text-status-selesai";
        if (s === "ditolak") return "text-status-ditolak";
        if (s === "dibatalkan") return "text-status-dibatalkan";
        return "text-gray-700";
    };

    // Fungsi untuk mengecek apakah button tolak/batal harus disabled
    const isCancelButtonDisabled = () => {
        const status = penyewaanDetail.status?.toLowerCase();
        return processing || (status !== "menunggu" && status !== "terjadwal");
    };

    // Fungsi untuk mengecek apakah button jadwalkan harus disabled
    const isScheduleButtonDisabled = () => {
        const status = penyewaanDetail.status?.toLowerCase();
        return processing || status !== "menunggu";
    };

    // Fungsi untuk mendapatkan teks button jadwalkan
    const getScheduleButtonText = () => {
        return "Jadwalkan";
    };

    // Fungsi untuk mendapatkan teks button tolak/batal
    const getCancelButtonText = () => {
        const status = penyewaanDetail.status?.toLowerCase();
        if (status === "menunggu") {
            return "Tolak";
        } else if (status === "terjadwal") {
            return "Batal";
        }
        return "Batal";
    };

    // Fungsi untuk mendapatkan status yang akan dikirim ke server
    const getCancelStatus = () => {
        const status = penyewaanDetail.status?.toLowerCase();
        if (status === "menunggu") {
            return "Ditolak";
        } else if (status === "terjadwal") {
            return "Dibatalkan";
        }
        return "Dibatalkan";
    };

    // Fungsi untuk mendapatkan pesan konfirmasi
    const getCancelConfirmationMessage = () => {
        const status = penyewaanDetail.status?.toLowerCase();
        if (status === "menunggu") {
            return "Apakah Anda yakin ingin menolak penyewaan ini?";
        } else if (status === "terjadwal") {
            return "Apakah Anda yakin ingin membatalkan penyewaan ini?";
        }
        return "Apakah Anda yakin ingin membatalkan penyewaan ini?";
    };

    const handleCancel = () => {
        if (confirm(getCancelConfirmationMessage())) {
            router.patch(
                route(
                    "pengelola.penyewaan.updateStatus",
                    penyewaanDetail.id_penyewaan
                ),
                {
                    status: getCancelStatus(),
                },
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        console.log(
                            `Status berhasil diubah menjadi ${getCancelStatus()}`
                        );
                    },
                    onError: (errors) => {
                        console.error("Gagal mengubah status:", errors);
                    },
                }
            );
        }
    };

    // Fungsi untuk membuka modal jadwalkan
    const handleOpenModal = () => {
        setSchedulingModalOpen(true);
    };

    // Fungsi untuk menutup modal jadwalkan
    const handleCloseModal = () => {
        setSchedulingModalOpen(false);
        reset();
    };

    // Fungsi untuk submit jadwal
    const handleSubmit = () => {
        post(
            route("pengelola.penyewaan.schedule", penyewaanDetail.id_penyewaan),
            {
                onSuccess: () => {
                    reset();
                    setSchedulingModalOpen(false);
                },
                preserveScroll: true,
            }
        );
    };

    const handlePrintInvoice = () => {
        window.open(
            route("penyewaan.invoice.download", {
                id_penyewaan: penyewaanDetail.id_penyewaan,
            }),
            "_blank"
        );
    };

    const { pelanggan, item_tenda } = penyewaanDetail;

    return (
        <PengelolaLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    <Link
                        href={route("pengelola.penyewaan.index")}
                        className="text-green-600 hover:text-green-800 hover:underline"
                    >
                        Penyewaan
                    </Link>
                    <span className="text-green-600 hover:text-green-800">
                        {" / "}
                    </span>
                    <span className="text-green-600 hover:text-green-800">
                        {pelanggan.nama}
                    </span>
                </h2>
            }
        >
            <Head
                title={`Detail Penyewaan - ${penyewaanDetail.id_penyewaan}`}
            />

            <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 space-y-8">
                <h3 className="font-bold">Detail Penyewaan</h3>

                {/* Top Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-6 border-b">
                    <div>
                        <p className="text-xs text-gray-500">ID Penyewaan</p>
                        <p className="text-lg font-mono text-gray-800">
                            {penyewaanDetail.id_penyewaan}
                        </p>

                        <p className="text-xs text-gray-500 mt-4">
                            Tanggal Sewa
                        </p>
                        <p className="font-semibold text-gray-800">
                            {penyewaanDetail.tanggal_sewa_formatted}
                        </p>

                        <p className="text-xs text-gray-500 mt-4">
                            Durasi Sewa
                        </p>
                        <p className="font-semibold text-gray-800">
                            {penyewaanDetail.durasi_sewa}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500">Catatan</p>
                        <p className="text-gray-800 italic">
                            "{penyewaanDetail.catatan || "Tidak ada catatan."}"
                        </p>

                        <p className="text-xs text-gray-500 mt-4">
                            Status Penyewaan
                        </p>
                        <p>
                            <span
                                className={`inline-flex text-sm leading-5 font-bold rounded-full ${getStatusTextColor(
                                    penyewaanDetail.status
                                )}`}
                            >
                                {penyewaanDetail.status}
                            </span>
                        </p>

                        <p className="text-xs text-gray-500 mt-4">
                            Total Biaya
                        </p>
                        <p className="text-2xl font-bold text-green-700">
                            {penyewaanDetail.total_biaya}
                        </p>
                    </div>
                </div>

                {/* Customer Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-6 border-b">
                    <div>
                        <p className="text-xs text-gray-500">Nama</p>
                        <p className="font-semibold text-gray-800">
                            {pelanggan.nama}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500">No Telp</p>
                        <p className="font-semibold text-gray-800">
                            {pelanggan.no_telp}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500">Alamat</p>
                        <p className="text-gray-800 whitespace-pre-line break-words">
                            {pelanggan.alamat}
                        </p>
                    </div>
                </div>

                {/* Items Section */}
                <div>
                    <h3 className="text-md font-semibold text-gray-800 mb-4">
                        Item yang Disewa
                    </h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                        Kode Tenda
                                    </th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                        Tenda
                                    </th>
                                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                                        Harga
                                    </th>
                                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                                        Jumlah
                                    </th>
                                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                                        Subtotal
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white">
                                <tr className="border-b">
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                        {item_tenda.kode_tenda}
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {item_tenda.nama_tenda}
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-right">
                                        {item_tenda.harga}
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-right">
                                        {item_tenda.jumlah}
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-gray-900 text-right">
                                        {item_tenda.subtotal}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Actions Section */}
                <div className="pt-6 border-t flex flex-col items-center gap-3">
                    <div className="flex flex-row gap-3" id="action-buttons">
                        <Button
                            variant="danger"
                            className={`w-36 ${
                                isCancelButtonDisabled()
                                    ? "opacity-50 cursor-not-allowed"
                                    : ""
                            }`}
                            onClick={handleCancel}
                            disabled={isCancelButtonDisabled()}
                        >
                            <Ban className="w-4 h-4 mr-2" />
                            {getCancelButtonText()}
                        </Button>
                        <Button
                            variant="secondary"
                            className={`w-36 ${
                                isScheduleButtonDisabled()
                                    ? "opacity-50 cursor-not-allowed"
                                    : ""
                            }`}
                            onClick={handleOpenModal}
                            disabled={isScheduleButtonDisabled()}
                        >
                            <CalendarPlus className="w-4 h-4 mr-2" />
                            {getScheduleButtonText()}
                        </Button>
                    </div>
                    <Button
                        variant="neutral"
                        className="w-[300px]"
                        onClick={handlePrintInvoice}
                        disabled={processing}
                    >
                        <Printer className="w-4 h-4 mr-2" />
                        Cetak
                    </Button>
                </div>
            </div>

            {/* Modal Penjadwalan */}
            {schedulingModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                        <div className="mb-4">
                            <div className="bg-green-100 text-green-800 text-center py-2 rounded-lg mb-4">
                                <h3 className="font-semibold">Jadwalkan</h3>
                            </div>

                            <div className="space-y-2 mb-6">
                                <p>
                                    <span className="font-medium">
                                        Penyewa:
                                    </span>{" "}
                                    {pelanggan.nama}
                                </p>
                                <p>
                                    <span className="font-medium">
                                        Tenda:
                                    </span>{" "}
                                    {item_tenda.nama_tenda} - {item_tenda.jumlah} unit
                                </p>
                                <p>
                                    <span className="font-medium">
                                        Tanggal sewa:
                                    </span>{" "}
                                    {penyewaanDetail.tanggal_sewa_formatted} - {penyewaanDetail.tanggal_selesai_formatted}
                                </p>
                            </div>
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