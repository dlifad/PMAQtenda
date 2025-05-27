import React from "react";
import { Head, Link, usePage } from "@inertiajs/react";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import Button from "@/Components/Button";
import { CheckCircle2, Download, Home } from "lucide-react";

export default function Success({ auth }) {
    const { props } = usePage();
    const details = props.flash?.penyewaanDetails;
    const handleUnduhInvoice = () => {
        if (details && details.idPenyewaan) {
            // Arahkan ke rute backend yang akan generate dan stream PDF
            // Anda perlu membuat rute ini di Laravel, misalnya: 'penyewaan.invoice.download'
            // dan mengirimkan ID penyewaan (atau ID transaksi jika Anda sudah refactor)
            // Contoh:
            // router.get(route('penyewaan.invoice.download', { id: details.idPenyewaan }));
            // atau buka di tab baru:
            window.open(
                route("penyewaan.invoice.download", {
                    id: details.idPenyewaan,
                }),
                "_blank"
            );
            // Untuk sekarang, kita tampilkan alert
            // alert(`Fitur unduh invoice untuk ID: ${details.idPenyewaan} belum diimplementasikan sepenuhnya di backend.`);
        } else {
            alert("ID Penyewaan tidak ditemukan untuk mengunduh invoice.");
        }
    };

    if (!details) {
        return (
            <>
                <Head title="Error Penyewaan" />
                <div className="min-h-screen bg-gray-100 flex flex-col">
                    <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
                        <Navbar auth={auth} />
                    </div>
                    <main className="flex-grow pt-24 pb-12 flex items-center justify-center">
                        <div className="container mx-auto px-4 text-center">
                            <p className="text-red-500 text-lg">
                                Data detail penyewaan tidak ditemukan.
                            </p>
                            <Link href={route("welcome")}>
                                <Button variant="primary" className="mt-4">
                                    Kembali ke Beranda
                                </Button>
                            </Link>
                        </div>
                    </main>
                    <Footer />
                </div>
            </>
        );
    }

    return (
        <>
            <Head title="Penyewaan Berhasil" />
            <div className="min-h-screen bg-gray-100 flex flex-col">
                <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
                    <Navbar auth={auth} />
                </div>

                <main className="flex-grow pt-24 pb-12 flex items-center justify-center">
                    <div className="container mx-auto px-4 max-w-md">
                        <div className="bg-bg-card p-6 md:p-10 rounded-xl shadow-xl text-center">
                            <div className="mx-auto flex items-center justify-center h-16 w-16 md:h-20 md:w-20 rounded-full bg-green-100 mb-5">
                                <CheckCircle2
                                    className="h-8 w-8 md:h-10 md:w-10 text-green-600"
                                    strokeWidth={2}
                                />
                            </div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                                {"Penyewaan Berhasil!"}
                            </h1>
                            {details.idPenyewaan && (
                                <p className="text-sm text-gray-500 mb-2">
                                    ID Penyewaan : {details.idPenyewaan}
                                </p>
                            )}

                            <div className="p-4 text-left space-y-3">
                                <h3 className="text-md font-bold text-gray-700 py-3 border-t">
                                    Ringkasan Penyewaan
                                </h3>
                                <div className="grid grid-cols-[120px_1fr] text-sm">
                                    <span className="font-medium text-gray-600">
                                        Penyewa
                                    </span>
                                    <span className="text-gray-800">
                                        {details.namaPenyewa}
                                    </span>
                                </div>
                                <div className="grid grid-cols-[120px_1fr] text-sm">
                                    <span className="font-medium text-gray-600">
                                        No Telp
                                    </span>
                                    <span className="text-gray-800">
                                        {details.noTelp}
                                    </span>
                                </div>
                                <div className="grid grid-cols-[120px_1fr] text-sm">
                                    <span className="font-medium text-gray-600">
                                        Tanggal Sewa
                                    </span>
                                    <span className="text-gray-800">
                                        {details.tanggalSewa}
                                    </span>
                                </div>
                                <div className="grid grid-cols-[120px_1fr] text-sm">
                                    <span className="font-medium text-gray-600">
                                        Total Biaya
                                    </span>
                                    <span className="text-gray-800 font-semibold">
                                        {details.totalBiaya}
                                    </span>
                                </div>
                                <div className="grid grid-cols-[120px_1fr] text-sm">
                                    <span className="font-medium text-gray-600">
                                        Status
                                    </span>
                                    <span className="text-gray-800 font-semibold text-orange-600">
                                        {details.statusPenyewaan}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row justify-center gap-3 mt-5">
                            <Button
                                variant="secondary"
                                onClick={handleUnduhInvoice}
                                className="w-full sm:w-auto flex items-center justify-center"
                            >
                                <Download className="w-4 h-4 mr-2" />
                                Unduh Invoice
                            </Button>
                            <Link
                                href={route("welcome")}
                                className="w-full sm:w-auto"
                            >
                                <Button
                                    variant="neutral"
                                    className="w-full flex items-center justify-center"
                                >
                                    <Home className="w-4 h-4 mr-2" />
                                    Beranda
                                </Button>
                            </Link>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        </>
    );
}
