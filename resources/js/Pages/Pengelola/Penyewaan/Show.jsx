import React, { useState } from "react";
import { Head, Link, useForm, router } from "@inertiajs/react";
import PengelolaLayout from "@/Layouts/PengelolaLayout";
import Button from "@/Components/Button";
import { ArrowLeft, Printer, Ban, CalendarPlus, X, Send } from "lucide-react";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";
import TextareaInput from "@/Components/TextArea";

// Komponen Modal diletakkan di sini karena Anda belum memilikinya sebagai file terpisah
const Modal = ({ children, show, onClose }) => {
    if (!show) {
        return null;
    }
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
                {children}
            </div>
        </div>
    );
};

export default function Show({ auth, penyewaanDetail }) {
    const [schedulingModalOpen, setSchedulingModalOpen] = useState(false);
    const [rejectionModalOpen, setRejectionModalOpen] = useState(false);

    const { data, setData, post, patch, processing, errors, reset } = useForm({
        status: "",
        alasan_penolakan: "",
        tanggal_pemasangan: penyewaanDetail.jadwal?.tanggal_pemasangan || "",
        waktu_pemasangan: penyewaanDetail.jadwal?.waktu_pemasangan || "",
        tanggal_pembongkaran: penyewaanDetail.jadwal?.tanggal_pembongkaran || "",
        waktu_pembongkaran: penyewaanDetail.jadwal?.waktu_pembongkaran || "",
    });

    // --- Helper Functions ---
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

    const isCancelButtonDisabled = () => {
        const status = penyewaanDetail.status?.toLowerCase();
        return processing || (status !== "menunggu" && status !== "terjadwal");
    };

    const isScheduleButtonDisabled = () => {
        const status = penyewaanDetail.status?.toLowerCase();
        return processing || status !== "menunggu";
    };

    const getCancelButtonText = () => {
        const status = penyewaanDetail.status?.toLowerCase();
        if (status === "menunggu") return "Tolak";
        if (status === "terjadwal") return "Batalkan";
        return "Batalkan";
    };

    // Handler untuk Modal Penolakan
    const handleOpenRejectionModal = () => {
        reset('alasan_penolakan');
        setRejectionModalOpen(true);
    };

    const handleCloseRejectionModal = () => {
        setRejectionModalOpen(false);
        reset('alasan_penolakan');
    };

    // Handler untuk Modal Penjadwalan
    const handleOpenSchedulingModal = () => {
        setSchedulingModalOpen(true);
    };

    const handleCloseSchedulingModal = () => {
        setSchedulingModalOpen(false);
        reset();
    };

    // Handler untuk tombol utama "Tolak" atau "Batal"
    const handleCancelClick = () => {
        const status = penyewaanDetail.status?.toLowerCase();
        if (status === "menunggu") {
            handleOpenRejectionModal();
        } else if (status === "terjadwal") {
            if (confirm("Apakah Anda yakin ingin membatalkan penyewaan ini?")) {
                router.post(route("pengelola.penyewaan.updateStatus", penyewaanDetail.id_penyewaan), {
                    _method: 'patch',
                    status: "Dibatalkan",
                }, { preserveScroll: true });
            }
        }
    };

    // Handler untuk submit form penolakan
    const handleSubmitRejection = (e) => {
        e.preventDefault();
        const rejectionData = {
            status: "Ditolak",
            alasan_penolakan: data.alasan_penolakan,
        };

        router.post(route("pengelola.penyewaan.updateStatus", penyewaanDetail.id_penyewaan), {
            _method: 'patch',
            ...rejectionData
        }, {
            onSuccess: () => handleCloseRejectionModal(),
            preserveScroll: true,
        });
    };
    
    // Handler untuk submit form penjadwalan
    const handleScheduleSubmit = (e) => {
        e.preventDefault();
        post(route("pengelola.penyewaan.schedule", penyewaanDetail.id_penyewaan), {
            onSuccess: () => {
                reset();
                setSchedulingModalOpen(false);
            },
            preserveScroll: true,
        });
    };

    // Handler untuk tombol cetak
    const handlePrintInvoice = () => {
        window.open(
            route("penyewaan.invoice.download", { id_penyewaan: penyewaanDetail.id_penyewaan }),
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
                    <span className="text-green-600 hover:text-green-800"> / </span>
                    <span className="text-green-600 hover:text-green-800">
                        {pelanggan.nama}
                    </span>
                </h2>
            }
        >
            <Head title={`Detail Penyewaan - ${penyewaanDetail.id_penyewaan}`} />

            <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 space-y-8">
                <h3 className="font-bold">Detail Penyewaan</h3>

                {/* Top Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-6 border-b">
                    <div>
                        <p className="text-xs text-gray-500">ID Penyewaan</p>
                        <p className="text-lg font-mono text-gray-800">
                            {penyewaanDetail.id_penyewaan}
                        </p>

                        <p className="text-xs text-gray-500 mt-4">Tanggal Sewa</p>
                        <p className="font-semibold text-gray-800">
                            {penyewaanDetail.tanggal_sewa_formatted}
                        </p>

                        <p className="text-xs text-gray-500 mt-4">Durasi Sewa</p>
                        <p className="font-semibold text-gray-800">
                            {penyewaanDetail.durasi_sewa}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500">Catatan</p>
                        <p className="text-gray-800 italic">
                            "{penyewaanDetail.catatan || "Tidak ada catatan."}"
                        </p>

                        <p className="text-xs text-gray-500 mt-4">Status Penyewaan</p>
                        <p>
                            <span
                                className={`inline-flex text-sm leading-5 font-bold rounded-full ${getStatusTextColor(
                                    penyewaanDetail.status
                                )}`}
                            >
                                {penyewaanDetail.status}
                            </span>
                        </p>

                        <p className="text-xs text-gray-500 mt-4">Total Biaya</p>
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
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Kode Tenda</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Tenda</th>
                                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Harga</th>
                                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Jumlah</th>
                                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Subtotal</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white">
                                <tr className="border-b">
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{item_tenda.kode_tenda}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{item_tenda.nama_tenda}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-right">{item_tenda.harga}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-right">{item_tenda.jumlah}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-gray-900 text-right">{item_tenda.subtotal}</td>
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
                            className={`w-36 ${isCancelButtonDisabled() ? "opacity-50 cursor-not-allowed" : ""}`}
                            onClick={handleCancelClick}
                            disabled={isCancelButtonDisabled()}
                        >
                            <Ban className="w-4 h-4 mr-2" />
                            {getCancelButtonText()}
                        </Button>
                        <Button
                            variant="secondary"
                            className={`w-36 ${isScheduleButtonDisabled() ? "opacity-50 cursor-not-allowed" : ""}`}
                            onClick={handleOpenSchedulingModal}
                            disabled={isScheduleButtonDisabled()}
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

            {/* Modal Penolakan */}
            <Modal show={rejectionModalOpen} onClose={handleCloseRejectionModal}>
                <form onSubmit={handleSubmitRejection} className="p-6">
                    <div className="flex justify-between items-center pb-3 border-b">
                        <h2 className="text-lg font-bold text-gray-800">Alasan Penolakan</h2>
                        <button type="button" onClick={handleCloseRejectionModal} className="text-gray-500 hover:text-gray-800">
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                    <div className="mt-4">
                        <InputLabel htmlFor="alasan_penolakan" value="Tuliskan alasan mengapa penyewaan ini ditolak" />
                        <TextareaInput
                            id="alasan_penolakan"
                            value={data.alasan_penolakan}
                            className="mt-1 block w-full h-24"
                            isFocused={true}
                            onChange={(e) => setData("alasan_penolakan", e.target.value)}
                            required
                        />
                        <InputError message={errors.alasan_penolakan} className="mt-2" />
                    </div>
                    <div className="mt-6 flex gap-3">
                        <Button type="button" variant="secondary" onClick={handleCloseRejectionModal} className="w-full" disabled={processing}>
                            Batal
                        </Button>
                        <Button type="submit" variant="danger" className="w-full" disabled={processing}>
                            <Send className="w-4 h-4 mr-2" />
                            {processing ? "Mengirim..." : "Kirim Penolakan"}
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Modal Penjadwalan */}
            <Modal show={schedulingModalOpen} onClose={handleCloseSchedulingModal}>
                <form onSubmit={handleScheduleSubmit} className="p-6">
                    <div className="flex justify-between items-center mb-4 pb-3 border-b">
                        <h3 className="text-lg font-bold text-green-800">Jadwalkan Pemasangan & Pembongkaran</h3>
                        <button type="button" onClick={handleCloseSchedulingModal} className="text-gray-500 hover:text-gray-800">
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                    <div className="space-y-2 mb-6 text-sm text-gray-600">
                        <p><span className="font-medium text-gray-800">Penyewa:</span> {pelanggan.nama}</p>
                        <p><span className="font-medium text-gray-800">Tenda:</span> {item_tenda.nama_tenda} - {item_tenda.jumlah} unit</p>
                        <p><span className="font-medium text-gray-800">Tanggal sewa:</span> {penyewaanDetail.tanggal_sewa_formatted} - {penyewaanDetail.tanggal_selesai_formatted}</p>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <h4 className="font-semibold text-gray-800 mb-2">Jadwal Pemasangan</h4>
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <InputLabel htmlFor="tanggal_pemasangan" value="Tanggal" />
                                    <TextInput
                                        id="tanggal_pemasangan"
                                        type="date"
                                        value={data.tanggal_pemasangan}
                                        onChange={(e) => setData("tanggal_pemasangan", e.target.value)}
                                        className="mt-1 block w-full"
                                        required
                                    />
                                    <InputError message={errors.tanggal_pemasangan} className="mt-2" />
                                </div>
                                <div className="flex-1">
                                    <InputLabel htmlFor="waktu_pemasangan" value="Waktu" />
                                    <TextInput
                                        id="waktu_pemasangan"
                                        type="time"
                                        value={data.waktu_pemasangan}
                                        onChange={(e) => setData("waktu_pemasangan", e.target.value)}
                                        className="mt-1 block w-full"
                                        required
                                    />
                                    <InputError message={errors.waktu_pemasangan} className="mt-2" />
                                </div>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-800 mb-2">Jadwal Pembongkaran</h4>
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <InputLabel htmlFor="tanggal_pembongkaran" value="Tanggal" />
                                    <TextInput
                                        id="tanggal_pembongkaran"
                                        type="date"
                                        value={data.tanggal_pembongkaran}
                                        onChange={(e) => setData("tanggal_pembongkaran", e.target.value)}
                                        className="mt-1 block w-full"
                                        required
                                    />
                                    <InputError message={errors.tanggal_pembongkaran} className="mt-2" />
                                </div>
                                <div className="flex-1">
                                    <InputLabel htmlFor="waktu_pembongkaran" value="Waktu" />
                                    <TextInput
                                        id="waktu_pembongkaran"
                                        type="time"
                                        value={data.waktu_pembongkaran}
                                        onChange={(e) => setData("waktu_pembongkaran", e.target.value)}
                                        className="mt-1 block w-full"
                                        required
                                    />
                                    <InputError message={errors.waktu_pembongkaran} className="mt-2" />
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-3 pt-4 border-t">
                            <Button type="button" variant="secondary" onClick={handleCloseSchedulingModal} className="w-full" disabled={processing}>
                                Batal
                            </Button>
                            <Button type="submit" variant="primary" className="w-full" disabled={processing}>
                                {processing ? "Menyimpan..." : "Simpan Jadwal"}
                            </Button>
                        </div>
                    </div>
                </form>
            </Modal>
        </PengelolaLayout>
    );
}