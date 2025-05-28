import React from 'react';
import { Head, Link } from '@inertiajs/react';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import Button from '@/Components/Button'; // Jika diperlukan
import { FileText, ArrowLeft } from 'lucide-react';

export default function Detail({ auth, penyewaanDetail }) { // Menerima penyewaanDetail sebagai prop

    // Fungsi untuk menentukan warna badge status (sama seperti sebelumnya)
    const getStatusBadgeColor = (status) => {
        switch (status?.toLowerCase()) {
            case "dipesan":
            case "menunggu":
                return "bg-yellow-100 text-yellow-800";
            case "terjadwal":
            case "dikonfirmasi":
                return "bg-blue-100 text-blue-800";
            case "berlangsung":
                return "bg-indigo-100 text-indigo-800";
            case "selesai":
                return "bg-green-100 text-green-800";
            case "dibatalkan":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    if (!penyewaanDetail) {
        // Seharusnya ini sudah ditangani controller, tapi sebagai fallback
        return (
            <div className="text-center p-10">Data penyewaan tidak ditemukan.
                <Link href={route('penyewaan.check.form')}>
                    <Button variant="primary" className="mt-4">Cari Lagi</Button>
                </Link>
            </div>
        );
    }

    return (
        <>
            <Head title={`Detail Penyewaan - ${penyewaanDetail.id_penyewaan}`} />
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
                    <Navbar auth={auth} />
                </div>

                <main className="flex-grow pt-24 pb-12">
                    <div className="container mx-auto px-4 max-w-2xl">
                        <div className="mb-6">
                            <Link href={route('penyewaan.check.form')} className="inline-flex items-center text-sm text-green-600 hover:text-green-800 font-medium">
                                <ArrowLeft className="w-4 h-4 mr-1" />
                                Kembali ke Pencarian
                            </Link>
                        </div>
                        <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg">
                            <div className="flex items-center mb-6 pb-4 border-b border-gray-200">
                                <FileText className="h-8 w-8 text-green-600 mr-3" />
                                <h1 className="text-xl md:text-2xl font-bold text-gray-800">
                                    Detail Penyewaan Anda
                                </h1>
                            </div>
                            <div className="space-y-3 text-sm">
                                {[
                                    { label: "ID Penyewaan", value: penyewaanDetail.id_penyewaan, boldValue: true },
                                    { label: "Nama Penyewa", value: penyewaanDetail.nama_penyewa },
                                    { label: "No. Telepon", value: penyewaanDetail.no_telp_penyewa },
                                    { label: "Alamat Pemasangan", value: penyewaanDetail.alamat_pemasangan, preLine: true },
                                    { type: "divider" },
                                    { label: "Tenda", value: penyewaanDetail.nama_tenda },
                                    { label: "Jumlah", value: `${penyewaanDetail.jumlah_tenda} unit` },
                                    { label: "Tanggal Sewa", value: penyewaanDetail.tanggal_sewa },
                                    { label: "Durasi", value: penyewaanDetail.durasi_penyewaan },
                                    ...(penyewaanDetail.catatan ? [{ label: "Catatan", value: penyewaanDetail.catatan, preLine: true }] : []),
                                    { type: "divider" },
                                    { label: "Total Biaya", value: penyewaanDetail.biaya, boldValue: true },
                                    { label: "Status", value: penyewaanDetail.status, isStatus: true },
                                ].map((item, index) =>
                                    item.type === "divider" ? (
                                        <hr key={`divider-${index}`} className="my-3 border-gray-200" />
                                    ) : (
                                        <div key={index} className="flex flex-col sm:flex-row sm:justify-between sm:items-start py-1.5">
                                            <span className="font-medium text-gray-500 w-full sm:w-1/3 mb-1 sm:mb-0">{item.label}</span>
                                            <span className={`text-gray-800 w-full sm:w-2/3 sm:text-right ${
                                                    item.boldValue ? "font-bold" : ""
                                                } ${
                                                    item.preLine ? "whitespace-pre-line" : ""
                                                } ${
                                                    item.isStatus
                                                        ? `px-2 py-0.5 inline-block text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(item.value)}`
                                                        : ""
                                                }`}
                                            >
                                                {item.value}
                                            </span>
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        </>
    );
}