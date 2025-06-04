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
            window.open(
                route("penyewaan.invoice.download", {
                    id_penyewaan: details.idPenyewaan,
                }),
                "_blank"
            );
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
                        <div className="container mx-auto px-4 text-center bg-white p-10 rounded-xl shadow-lg max-w-md">
                            <h1 className="text-xl font-semibold text-red-600 mb-4">
                                Terjadi Kesalahan
                            </h1>
                            <p className="text-gray-600 mb-6">
                                Data detail penyewaan tidak ditemukan. Mohon coba lagi atau hubungi administrator.
                            </p>
                            <Link href={route("welcome")}>
                                <Button variant="primary" className="mt-4 inline-flex items-center">
                                    <Home className="w-4 h-4 mr-2" />
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
                    <div className="container mx-auto px-4 max-w-lg">
                        <div className="bg-white p-6 md:p-10 rounded-xl shadow-xl text-center">
                            <div className="mx-auto flex items-center justify-center h-16 w-16 md:h-20 md:w-20 rounded-full bg-green-100 mb-5">
                                <CheckCircle2
                                    className="h-8 w-8 md:h-10 md:w-10 text-green-600"
                                    strokeWidth={2}
                                />
                            </div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                                Penyewaan Berhasil!
                            </h1>
                            {details.idPenyewaan && (
                                <p className="text-sm text-gray-500 mb-6">
                                    ID Penyewaan Anda: <span className="font-semibold text-gray-700">{details.idPenyewaan}</span>
                                </p>
                            )}

                            <div className="p-4 my-4 border-t border-b border-gray-200 text-left space-y-3">
                                <h3 className="text-md font-semibold text-gray-700 mb-3 text-center">
                                    Ringkasan Penyewaan
                                </h3>
                                <div className="grid grid-cols-[auto_1fr] gap-x-3 text-sm items-center">
                                    <span className="font-medium text-gray-600">Penyewa:</span>
                                    <span className="text-gray-800">{details.namaPenyewa}</span>
                                </div>
                                <div className="grid grid-cols-[auto_1fr] gap-x-3 text-sm items-center">
                                    <span className="font-medium text-gray-600">No Telp:</span>
                                    <span className="text-gray-800">{details.noTelp}</span>
                                </div>
                                <div className="grid grid-cols-[auto_1fr] gap-x-3 text-sm items-center">
                                    <span className="font-medium text-gray-600">Tanggal Sewa:</span>
                                    <span className="text-gray-800">{details.tanggalSewa}</span>
                                </div>
                                <div className="grid grid-cols-[auto_1fr] gap-x-3 text-sm items-center">
                                    <span className="font-medium text-gray-600">Total Biaya:</span>
                                    <span className="text-gray-800 font-semibold">{details.totalBiaya}</span>
                                </div>
                                <div className="grid grid-cols-[auto_1fr] gap-x-3 text-sm items-center">
                                    <span className="font-medium text-gray-600">Status:</span>
                                    <span className="font-semibold text-orange-500">{details.statusPenyewaan}</span>
                                </div>
                            </div>
                            
                            <div className="flex flex-col sm:flex-row justify-center gap-3 mt-8">
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
                    </div>
                </main>
                <Footer />
            </div>
        </>
    );
}