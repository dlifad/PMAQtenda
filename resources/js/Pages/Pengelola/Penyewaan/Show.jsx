import React, { useState } from "react";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
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
            penyewaanDetail.jadwal?.tanggal_pemasangan ||
            penyewaanDetail.tanggal_sewa_raw,
        tanggal_pembongkaran:
            penyewaanDetail.jadwal?.tanggal_pembongkaran ||
            penyewaanDetail.tanggal_selesai_raw,
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

    const handleReject = () => {
        if (
            confirm(
                "Apakah Anda yakin ingin menolak atau membatalkan penyewaan ini?"
            )
        ) {
            router.patch(
                route(
                    "pengelola.penyewaan.updateStatus",
                    penyewaanDetail.id_penyewaan
                ),
                {
                    status: "Ditolak",
                },
                { preserveScroll: true }
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
        // Buka URL download di tab baru
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
                        /
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
                            className="w-36"
                            onClick={handleReject}
                            disabled={
                                processing ||
                                penyewaanDetail.status === "Ditolak"
                            }
                        >
                            <Ban className="w-4 h-4 mr-2" />
                            Tolak
                        </Button>
                        <Button
                            variant="success"
                            className="w-36"
                            onClick={() => setSchedulingModalOpen(true)}
                            disabled={
                                processing ||
                                penyewaanDetail.status !== "Menunggu"
                            }
                        >
                            <CalendarPlus className="w-4 h-4 mr-2" />
                            Jadwalkan
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
            <Modal
                show={schedulingModalOpen}
                onClose={() => setSchedulingModalOpen(false)}
            >
                <form onSubmit={handleScheduleSubmit} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900">
                        Buat Jadwal Pemasangan & Pembongkaran
                    </h2>
                    <div className="mt-6 space-y-4">
                        <div>
                            <InputLabel
                                htmlFor="tanggal_pemasangan"
                                value="Tanggal Pemasangan"
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
                                className="mt-2"
                            />
                        </div>
                        <div>
                            <InputLabel
                                htmlFor="tanggal_pembongkaran"
                                value="Tanggal Pembongkaran"
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
                                className="mt-2"
                            />
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end">
                        <Button
                            type="button"
                            variant="neutral"
                            onClick={() => setSchedulingModalOpen(false)}
                        >
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            className="ml-3"
                            disabled={processing}
                        >
                            {processing ? "Menyimpan..." : "Simpan Jadwal"}
                        </Button>
                    </div>
                </form>
            </Modal>
        </PengelolaLayout>
    );
}
