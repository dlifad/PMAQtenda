import React from "react";
import { Link, Head } from "@inertiajs/react";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import Button from "@/Components/Button";
import {
    Check,
    CircleDollarSign,
    ReceiptText,
    Ruler,
    XCircle,
} from "lucide-react";

const formatRupiah = (price) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",

        currency: "IDR",

        minimumFractionDigits: 0,

        maximumFractionDigits: 0,
    }).format(price);
};

const getImagePath = (gambar) => {
    if (!gambar) {
        return "/images/tenda-preview.jpg";
    }

    if (gambar.startsWith("/images/")) {
        return gambar;
    }

    return `/images/${gambar}`;
};

export default function Welcome({ tendas }) {
    return (
        <>
            <Head title="PMAQ Tenda" />
            <div className="min-h-screen">
                <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
                    <Navbar />
                </div>
                <div className="pt-20">
                    {/* Hero Section */}
                    <section className="relative overflow-hidden min-h-screen pt-12 md:px-20 md:pt-12 pb-40 md:pb-60">
                        <div
                            className="absolute inset-0 -z-10 bg-[length:100%_100%] bg-no-repeat"
                            style={{
                                backgroundImage:
                                    "url('/images/background-waves.png')",
                            }}
                        ></div>
                        <div className="container mx-auto px-4 py-12 md:py-20">
                            <div className="flex flex-col md:flex-row items-center justify-center text-center md:text-left">
                                <div className="w-full md:w-1/2 order-1 md:order-2 mb-8 md:mb-0">
                                    <img
                                        src="/images/tenda-preview.jpg"
                                        alt="Tenda Preview"
                                        className="rounded-lg shadow-lg h-80 mx-auto"
                                    />
                                </div>

                                <div className="w-full md:w-1/2 order-2 md:order-1 mb-8 md:mb-0">
                                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                                        PMAQ Tenda
                                    </h1>
                                    <p className="text-gray-700 mb-6 text-justify">
                                        PMAQ Tenda adalah layanan penyewaan
                                        tenda yang dikelola oleh Paguyuban
                                        Mushola Al Qomariah Kotesan. Kami
                                        menyediakan tenda untuk mendukung
                                        kebutuhan acara masyarakat, mulai dari
                                        hajatan, pengajian, dll. Dengan
                                        pelayanan terbaik, PMAQ Tenda hadir
                                        untuk mempermudah Anda dalam menyiapkan
                                        tempat yang nyaman dan representatif
                                        untuk setiap momen penting.
                                    </p>
                                    <a href="#katalog">
                                        <Button variant="primary">
                                            Sewa Sekarang
                                        </Button>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Katalog Section */}
                    <section className="container mx-auto px-4 py-12">
                        <div className="border-b border-color-line mx-auto max-w-3xl">
                            <h2
                                className="text-2xl md:text-3xl font-bold text-center mb-12"
                                id="katalog"
                            >
                                Katalog Tenda
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 gap-8 pt-12">
                            {tendas && tendas.length > 0 ? (
                                tendas.map((tenda) => {
                                    return (
                                        <div
                                            key={tenda.id_tenda}
                                            className="flex flex-col md:flex-row bg-white rounded-lg shadow-md overflow-hidden"
                                        >
                                            <div className="md:w-2/5">
                                                <img
                                                    src={getImagePath(
                                                        tenda.gambar
                                                    )}
                                                    alt={tenda.nama_tenda}
                                                    className="w-[600px] h-[350px] object-cover"
                                                    onError={(e) => {
                                                        e.target.src =
                                                            "/images/tenda-preview.jpg";
                                                    }}
                                                />
                                            </div>
                                            <div className="md:w-3/5 p-4 pl-12">
                                                <h3 className="font-bold text-lg mb-2">
                                                    {tenda.nama_tenda}
                                                </h3>
                                                <p className="text-gray-700 mb-4">
                                                    {tenda.deskripsi}
                                                </p>
                                                <div className="border-l-4 border-dark-gray pl-3 mb-4">
                                                    <ul className="space-y-1">
                                                        {tenda.isi_paket &&
                                                            tenda.isi_paket
                                                                .length > 0 &&
                                                            tenda.isi_paket.map(
                                                                (
                                                                    item,
                                                                    index
                                                                ) => (
                                                                    <li
                                                                        key={`paket-item-${tenda.id_tenda}-${index}`}
                                                                        className="flex items-center"
                                                                    >
                                                                        <Check className="w-4 h-4 text-dark-gray mr-1" />
                                                                        {item}
                                                                    </li>
                                                                )
                                                            )}
                                                        <li className="flex items-center">
                                                            <Check className="w-4 h-4 text-dark-gray mr-1" />
                                                            Stok tersedia:{" "}
                                                            {tenda.jumlah} unit
                                                        </li>
                                                    </ul>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <div className="text-dark-gray font-bold">
                                                        {formatRupiah(
                                                            tenda.harga
                                                        )}{" "}
                                                        / unit
                                                    </div>
                                                </div>
                                                <div className="pt-4">
                                                    <Button variant="primary">
                                                        Sewa
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="text-center py-12">
                                    <p className="text-gray-500 text-lg">
                                        Belum ada data tenda tersedia.
                                    </p>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Why Choose Us */}
                    <section className="container mx-auto px-4 py-12">
                        <div className="border-b border-color-line mx-auto max-w-3xl">
                            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
                                Mengapa pilih kami?
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12 pt-12 max-w-4xl mx-auto">
                            <div className="flex items-center">
                                <div className="bg-green-100 p-3 rounded-full mr-4">
                                    <CircleDollarSign className="w-6 h-6 text-dark-gray" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-800 mb-1">
                                        Sewa tenda dengan harga yang masih di
                                        kantong.
                                    </h3>
                                </div>
                            </div>

                            <div className="flex items-center">
                                <div className="bg-green-100 p-3 rounded-full mr-4">
                                    <ReceiptText className="w-6 h-6 text-dark-gray" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-800 mb-1">
                                        Pembayaran dilakukan setelah acara
                                        selesai.
                                    </h3>
                                </div>
                            </div>

                            <div className="flex items-center">
                                <div className="bg-green-100 p-3 rounded-full mr-4">
                                    <Ruler className="w-6 h-6 text-dark-gray" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-800 mb-1">
                                        pemasangan tenda dengan hasil rapi &
                                        cepat.
                                    </h3>
                                </div>
                            </div>

                            <div className="flex items-center">
                                <div className="bg-green-100 p-3 rounded-full mr-4">
                                    <XCircle className="w-6 h-6 text-dark-gray" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-800 mb-1">
                                        pembatalan tidak dikenakan biaya apapun.
                                    </h3>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Footer */}
                <Footer />
            </div>
        </>
    );
}
