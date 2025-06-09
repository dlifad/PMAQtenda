import React from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import Button from "@/Components/Button";
import { ArrowLeft, Download } from "lucide-react";
import Swal from "sweetalert2";

const parseCurrency = (value) => {
    if (typeof value === "number") return value;
    if (typeof value === "string") {
        const numericString = value.replace(/Rp\s*|\./g, "").replace(",", ".");
        const number = parseFloat(numericString);
        return isNaN(number) ? 0 : number;
    }
    return 0;
};

const formatCurrency = (numberValue) => {
    if (typeof numberValue !== "number" || isNaN(numberValue)) return "Rp0";
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(numberValue);
};

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

export default function Detail({ auth, penyewaanDetail, flash }) {
    const { processing, post, errors: formErrors } = useForm({});

    const handleUnduhInvoice = () => {
        if (penyewaanDetail && penyewaanDetail.id_penyewaan) {
            window.open(
                route("penyewaan.invoice.download", {
                    id_penyewaan: penyewaanDetail.id_penyewaan,
                }),
                "_blank"
            );
        } else {
            alert("ID Penyewaan tidak ditemukan untuk mengunduh invoice.");
        }
    };

    const handleBatalkanPenyewaan = () => {
        if (!penyewaanDetail || !penyewaanDetail.id_penyewaan) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Detail penyewaan tidak ditemukan.",
            });
            return;
        }

        Swal.fire({
            text: "Apakah Anda yakin ingin membatalkan penyewaan anda?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DC3545",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Ya",
            cancelButtonText: "Tidak",
        }).then((result) => {
            if (result.isConfirmed) {
                post(
                    route("penyewaan.batalkan", {
                        id: penyewaanDetail.id_penyewaan,
                    }),
                    {
                        preserveScroll: true,
                    }
                );
            }
        });
    };

    if (!penyewaanDetail) {
        return (
            <>
                <Head title="Detail Penyewaan Tidak Ditemukan" />
                <div className="min-h-screen bg-gray-50 flex flex-col">
                    <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
                        <Navbar auth={auth} />
                    </div>
                    <main className="flex-grow pt-24 pb-12 flex items-center justify-center">
                        <div className="text-center p-10 bg-white shadow-lg rounded-xl">
                            <h1 className="text-xl font-semibold mb-4">
                                Data penyewaan tidak ditemukan.
                            </h1>
                            <p className="text-gray-600 mb-6">
                                Silakan coba cari lagi dengan ID penyewaan yang
                                benar.
                            </p>
                            <Link href={route("penyewaan.check.form")}>
                                <Button variant="primary" className="mt-4">
                                    Kembali ke Pencarian
                                </Button>
                            </Link>
                        </div>
                    </main>
                    <Footer />
                </div>
            </>
        );
    }

    const numericBiaya = parseCurrency(penyewaanDetail.biaya);
    const numericJumlahTenda =
        parseInt(String(penyewaanDetail.jumlah_tenda), 10) || 0;
    const hargaSatuan = numericJumlahTenda
        ? numericBiaya / numericJumlahTenda
        : 0;

    const canBeCancelled =
        penyewaanDetail.status &&
        !["selesai", "ditolak", "dibatalkan"].includes(
            penyewaanDetail.status.toLowerCase()
        );

    return (
        <>
            <Head
                title={`Detail Penyewaan - ${penyewaanDetail.id_penyewaan}`}
            />
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
                    <Navbar auth={auth} />
                </div>

                <main className="flex-grow pt-24 pb-12">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
                        {flash?.success && (
                            <div className="mb-4 p-3 bg-green-100 text-green-700 border border-green-200 rounded-md shadow-sm">
                                {flash.success}
                            </div>
                        )}
                        {flash?.error && (
                            <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-200 rounded-md shadow-sm">
                                {flash.error}
                            </div>
                        )}
                        {Object.keys(formErrors).length > 0 && (
                            <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-200 rounded-md shadow-sm">
                                <p className="font-semibold">
                                    Oops! Terjadi kesalahan:
                                </p>
                                <ul className="list-disc list-inside">
                                    {Object.values(formErrors).map(
                                        (error, index) => (
                                            <li key={index}>{error}</li>
                                        )
                                    )}
                                </ul>
                            </div>
                        )}

                        <div className="mb-6">
                            <Link
                                href={route("penyewaan.check.form")}
                                className="inline-flex items-center text-lg text-green-600 hover:text-green-800 font-semibold transition-colors duration-150"
                            >
                                <ArrowLeft className="w-5 h-5 mr-1.5" />
                                Kembali ke Pencarian
                            </Link>
                        </div>

                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-8">
                            Penyewaan Anda
                        </h1>

                        <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-6 pb-6 border-b border-gray-200">
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-xs font-medium text-gray-500">
                                            ID Penyewaan
                                        </p>
                                        <p className="text-sm font-semibold text-gray-900 mt-0.5">
                                            {penyewaanDetail.id_penyewaan}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-gray-500">
                                            Tanggal Sewa
                                        </p>
                                        <p className="text-sm text-gray-700 mt-0.5">
                                            {penyewaanDetail.tanggal_sewa}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-gray-500">
                                            Durasi Sewa
                                        </p>
                                        <p className="text-sm text-gray-700 mt-0.5">
                                            {penyewaanDetail.durasi_penyewaan}
                                        </p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    {penyewaanDetail.catatan && (
                                        <div>
                                            <p className="text-xs font-medium text-gray-500">
                                                Catatan
                                            </p>
                                            <p className="text-sm text-gray-700 mt-0.5 whitespace-pre-line">
                                                {penyewaanDetail.catatan}
                                            </p>
                                        </div>
                                    )}
                                    <div>
                                        <p className="text-xs font-medium text-gray-500">
                                            Status Penyewaan
                                        </p>
                                        <div className="mt-1">
                                            <span
                                                className={getStatusTextColor(
                                                    penyewaanDetail.status
                                                )}
                                            >
                                                {penyewaanDetail.status}
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-gray-500">
                                            Total Biaya
                                        </p>
                                        <p className="text-xl font-bold text-green-600 mt-0.5">
                                            {penyewaanDetail.biaya}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-6 pb-6 border-b border-gray-200 grid grid-cols-12 gap-x-6">
                                <div className="col-span-12 sm:col-span-3">
                                    <p className="text-xs font-medium text-gray-500">
                                        Nama
                                    </p>
                                    <p className="text-sm text-gray-700 mt-0.5">
                                        {penyewaanDetail.nama_penyewa}
                                    </p>
                                </div>
                                <div className="col-span-12 sm:col-span-3 mt-4 sm:mt-0">
                                    <p className="text-xs font-medium text-gray-500">
                                        No telp
                                    </p>
                                    <p className="text-sm text-gray-700 mt-0.5">
                                        {penyewaanDetail.no_telp_penyewa}
                                    </p>
                                </div>
                                <div className="col-span-12 sm:col-span-6 mt-4 sm:mt-0">
                                    <p className="text-xs font-medium text-gray-500">
                                        Alamat
                                    </p>
                                    <p className="text-sm text-gray-700 mt-0.5 whitespace-pre-line">
                                        {penyewaanDetail.alamat_pemasangan}
                                    </p>
                                </div>
                            </div>

                            <div className="mb-8">
                                <h2 className="text-md font-semibold text-gray-700 mb-3">
                                    Rincian Tenda
                                </h2>
                                <div className="overflow-x-auto rounded-lg border border-gray-200">
                                    <table className="min-w-full text-sm divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-4 py-3 text-left font-semibold text-gray-600 uppercase tracking-wider">
                                                    Tenda
                                                </th>
                                                <th className="px-4 py-3 text-right font-semibold text-gray-600 uppercase tracking-wider">
                                                    Harga Satuan
                                                </th>
                                                <th className="px-4 py-3 text-center font-semibold text-gray-600 uppercase tracking-wider">
                                                    Jumlah
                                                </th>
                                                <th className="px-4 py-3 text-right font-semibold text-gray-600 uppercase tracking-wider">
                                                    Subtotal
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            <tr>
                                                <td className="px-4 py-3 text-gray-700">
                                                    {penyewaanDetail.nama_tenda ||
                                                        "N/A"}
                                                </td>
                                                <td className="px-4 py-3 text-right text-gray-700">
                                                    {formatCurrency(
                                                        hargaSatuan
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 text-center text-gray-700">
                                                    {numericJumlahTenda ||
                                                        "N/A"}
                                                </td>
                                                <td className="px-4 py-3 text-right text-gray-700">
                                                    {penyewaanDetail.biaya}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4 flex-wrap">
                                {canBeCancelled && (
                                    <Button
                                        variant="danger"
                                        size="small"
                                        onClick={handleBatalkanPenyewaan}
                                        disabled={processing}
                                        className="w-full sm:w-auto"
                                    >
                                        {processing
                                            ? "Memproses..."
                                            : "Batalkan Penyewaan"}
                                    </Button>
                                )}
                                <Button
                                    variant="secondary"
                                    size="small"
                                    onClick={handleUnduhInvoice}
                                    className="flex items-center justify-center w-full sm:w-auto"
                                >
                                    Unduh Invoice
                                </Button>
                            </div>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        </>
    );
}
