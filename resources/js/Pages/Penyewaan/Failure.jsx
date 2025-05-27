import React from "react";
import { Head, Link, usePage } from "@inertiajs/react";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import Button from "@/Components/Button";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";

export default function Failure({ auth }) {
    const { props } = usePage();
    const failureMessage = props.flash?.failureMessage || "Terjadi kesalahan yang tidak diketahui. Proses penyewaan tidak dapat dilanjutkan.";

    return (
        <>
            <Head title="Penyewaan Gagal" />
            <div className="min-h-screen bg-gray-100 flex flex-col">
                <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
                    <Navbar auth={auth} />
                </div>

                <main className="flex-grow pt-24 pb-12 flex items-center justify-center">
                    <div className="container mx-auto px-4 max-w-lg text-center">
                        <div className="bg-white p-8 md:p-12 rounded-xl shadow-2xl">
                            <div className="mx-auto flex items-center justify-center h-16 w-16 md:h-20 md:w-20 rounded-full bg-red-100 mb-6">
                                <AlertTriangle className="h-10 w-10 text-red-600" strokeWidth={2} />
                            </div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                                Penyewaan Gagal Diproses
                            </h1>
                            {failureMessage && (
                                <p className="text-md text-red-700 bg-red-50 p-3 rounded-md mb-6">
                                    {failureMessage}
                                </p>
                            )}
                            <p className="text-sm text-gray-500 mb-8">
                                Mohon maaf atas ketidaknyamanannya. Anda dapat mencoba lagi atau kembali ke beranda. Jika masalah terus berlanjut, silakan hubungi tim dukungan kami.
                            </p>
                            <div className="flex flex-col sm:flex-row justify-center gap-3">
                                <Link href={route("penyewaan.create")}>
                                    <Button variant="warning" className="w-full sm:w-auto flex items-center justify-center">
                                        <RefreshCw className="w-4 h-4 mr-2" />
                                        Coba Isi Form Lagi
                                    </Button>
                                </Link>
                                <Link href={route("welcome")}>
                                    <Button variant="neutral" className="w-full sm:w-auto flex items-center justify-center">
                                        <Home className="w-4 h-4 mr-2" />
                                        Kembali ke Beranda
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