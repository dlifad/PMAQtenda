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
        tanggal_pemasangan:
            penyewaanDetail.jadwal?.tanggal_pemasangan,
        waktu_pemasangan:
            penyewaanDetail.jadwal?.waktu_pemasangan,
        tanggal_pembongkaran:
            penyewaanDetail.jadwal?.tanggal_pembongkaran,
        waktu_pembongkaran:
            penyewaanDetail.jadwal?.waktu_pembongkaran,
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
        return processing || 
               (status !== "menunggu" && status !== "terjadwal");
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
                        console.log(`Status berhasil diubah menjadi ${getCancelStatus()}`);
                    },
                    onError: (errors) => {
                        console.error('Gagal mengubah status:', errors);
                    }
                }
            );
        }
    };

    const handleScheduleSubmit = (e) => {
        e.preventDefault();
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
                            className={`w-36 ${isCancelButtonDisabled() ? 'opacity-50 cursor-not-allowed' : ''}`}
                            onClick={handleCancel}
                            disabled={isCancelButtonDisabled()}
                        >
                            <Ban className="w-4 h-4 mr-2" />
                            {getCancelButtonText()}
                        </Button>
                        <Button
                            variant="secondary"
                            className={`w-36 ${isScheduleButtonDisabled() ? 'opacity-50 cursor-not-allowed' : ''}`}
                            onClick={() => setSchedulingModalOpen(true)}
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

            {/* Modal Penjadwalan dengan Waktu */}
            <Modal
                show={schedulingModalOpen}
                onClose={() => setSchedulingModalOpen(false)}
            >
                <div className="p-6">
                    {/* Header Modal */}
                    <div className="bg-green-100 -m-6 mb-6 p-4 rounded-t-lg">
                        <h2 className="text-lg font-medium text-gray-900 text-center">
                            {getScheduleButtonText()}
                        </h2>
                    </div>

                    <form onSubmit={handleScheduleSubmit} className="space-y-6">
                        {/* Info Penyewaan */}
                        <div className="space-y-2 text-sm">
                            <p>
                                <span className="font-medium">Penyewa:</span>{" "}
                                {pelanggan.nama}
                            </p>
                            <p>
                                <span className="font-medium">Tenda:</span>{" "}
                                {item_tenda.nama_tenda} - {item_tenda.jumlah}{" "}
                                unit
                            </p>
                            <p>
                                <span className="font-medium">
                                    Tanggal sewa:
                                </span>{" "}
                                {penyewaanDetail.tanggal_sewa_formatted} -{" "}
                                {penyewaanDetail.tanggal_selesai_formatted}
                            </p>
                        </div>

                        {/* Jadwal Pemasangan */}
                        <div className="space-y-4">
                            <h3 className="font-medium text-gray-900">
                                Jadwal Pemasangan
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <InputLabel
                                        htmlFor="tanggal_pemasangan"
                                        value="Tanggal:"
                                    />
                                    <TextInput
                                        id="tanggal_pemasangan"
                                        type="date"
                                        name="tanggal_pemasangan"
                                        value={data.tanggal_pemasangan}
                                        className="mt-1 block w-full"
                                        onChange={(e) =>
                                            setData(
                                                "tanggal_pemasangan",
                                                e.target.value
                                            )
                                        }
                                    />
                                    <InputError
                                        message={errors.tanggal_pemasangan}
                                        className="mt-1"
                                    />
                                </div>
                                <div>
                                    <InputLabel
                                        htmlFor="waktu_pemasangan"
                                        value="Waktu:"
                                    />
                                    <TextInput
                                        id="waktu_pemasangan"
                                        type="time"
                                        name="waktu_pemasangan"
                                        value={data.waktu_pemasangan}
                                        className="mt-1 block w-full"
                                        onChange={(e) =>
                                            setData(
                                                "waktu_pemasangan",
                                                e.target.value
                                            )
                                        }
                                    />
                                    <InputError
                                        message={errors.waktu_pemasangan}
                                        className="mt-1"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Jadwal Pembongkaran */}
                        <div className="space-y-4">
                            <h3 className="font-medium text-gray-900">
                                Jadwal Pembongkaran
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <InputLabel
                                        htmlFor="tanggal_pembongkaran"
                                        value="Tanggal:"
                                    />
                                    <TextInput
                                        id="tanggal_pembongkaran"
                                        type="date"
                                        name="tanggal_pembongkaran"
                                        value={data.tanggal_pembongkaran}
                                        className="mt-1 block w-full"
                                        onChange={(e) =>
                                            setData(
                                                "tanggal_pembongkaran",
                                                e.target.value
                                            )
                                        }
                                    />
                                    <InputError
                                        message={errors.tanggal_pembongkaran}
                                        className="mt-1"
                                    />
                                </div>
                                <div>
                                    <InputLabel
                                        htmlFor="waktu_pembongkaran"
                                        value="Waktu:"
                                    />
                                    <TextInput
                                        id="waktu_pembongkaran"
                                        type="time"
                                        name="waktu_pembongkaran"
                                        value={data.waktu_pembongkaran}
                                        className="mt-1 block w-full"
                                        onChange={(e) =>
                                            setData(
                                                "waktu_pembongkaran",
                                                e.target.value
                                            )
                                        }
                                    />
                                    <InputError
                                        message={errors.waktu_pembongkaran}
                                        className="mt-1"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Tombol Aksi */}
                        <div className="flex justify-center gap-3 pt-4">
                            <Button
                                type="button"
                                variant="danger"
                                onClick={() => setSchedulingModalOpen(false)}
                                className="px-8"
                            >
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                variant="primary"
                                disabled={processing}
                                className="px-8 bg-green-600 hover:bg-green-700"
                            >
                                {processing ? "Menyimpan..." : "Simpan"}
                            </Button>
                        </div>
                    </form>
                </div>
            </Modal>
        </PengelolaLayout>
    );
}