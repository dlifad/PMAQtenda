import React, { useState } from "react";
import {
    Head,
    Link,
    router, // Tambahkan router
} from "@inertiajs/react";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import Button from "@/Components/Button";
import Checkbox from "@/Components/Checkbox"; // Asumsi Anda punya komponen Checkbox

// Fungsi formatRupiah (bisa diimpor)
const formatRupiah = (price) => {
    // ... (implementasi sama seperti di Welcome.jsx atau Create.jsx)
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(price);
};

export default function Confirm({
    auth,
    confirmationData,
    rawDataToStore,
    errors: pageErrors,
}) {
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [processing, setProcessing] = useState(false);

    const handleFinalConfirm = () => {
        if (!agreedToTerms) {
            alert(
                "Anda harus menyetujui Syarat dan Ketentuan yang berlaku untuk melanjutkan."
            );
            return;
        }
        setProcessing(true);
        router.post(route("penyewaan.store"), rawDataToStore, {
            onFinish: () => setProcessing(false),
            onError: (errors) => {
                if (errors.error) {
                    alert(errors.error);
                } else if (Object.keys(errors).length > 0) {
                    alert(
                        "Terjadi kesalahan validasi. Silakan kembali dan periksa data Anda."
                    );
                }
                console.error("Error saat konfirmasi akhir:", errors);
            },
            onSuccess: (page) => {
                if (page.props.flash && page.props.flash.success) {
                    // Sudah ditangani global (misal di Navbar atau Layout)
                } else {
                    // alert('Penyewaan berhasil dikonfirmasi!');
                }
            },
        });
    };

    const handleGoBack = () => {
        window.history.back();
    };

    if (!confirmationData) {
        return (
            <>
                <Head title="Error Konfirmasi" />
                <div className="min-h-screen bg-gray-100">
                    <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
                        <Navbar auth={auth} />
                    </div>
                    <main className="pt-24 pb-12">
                        <div className="container mx-auto px-4 text-center">
                            <p className="text-red-500 text-lg">
                                Data konfirmasi tidak ditemukan. Silakan ulangi
                                proses penyewaan.
                            </p>
                            <Link href={route("penyewaan.create")}>
                                <Button variant="primary" className="mt-4">
                                    Kembali ke Form
                                </Button>
                            </Link>
                        </div>
                    </main>
                    <Footer />
                </div>
            </>
        );
    }

    const { penyewa, alamat_pemasangan, rincian_penyewaan, rincian_biaya } =
        confirmationData;

    return (
        <>
            <Head title="Konfirmasi Penyewaan" />
            <div className="min-h-screen bg-gray-100">
                <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
                    <Navbar auth={auth} />
                </div>

                <main className="pt-24 pb-12">
                    <div className="container mx-auto px-4 max-w-3xl">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-center text-dark-gray mb-6">
                                Konfirmasi Penyewaan
                            </h1>

                            <div
                                className="bg-[#A0D995]/20 border-l-8 border-[#A0D995] text-dark-gray px-4 py-3 rounded relative mb-6"
                                role="alert"
                            >
                                <p className="text-sm">
                                    Harap periksa kembali data penyewaan Anda
                                    sebelum konfirmasi. Pastikan informasi sudah
                                    benar agar tidak terjadi kesalahan saat
                                    pemrosesan.
                                </p>
                            </div>

                            {/* Data Penyewa */}
                            <section className="mb-6 bg-bg-card p-6 md:p-8 rounded-lg shadow-lg">
                                <h2 className="text-xl font-bold text-dark-gray mb-3 pb-2 border-b">
                                    Penyewa
                                </h2>
                                <div className="space-y-4 text-sm text-dark-gray">
                                    <div className="grid grid-cols-[150px_1fr] items-center border-b pb-2">
                                        <span className="font-semibold">
                                            Nama lengkap
                                        </span>
                                        <span>{penyewa.nama_lengkap}</span>
                                    </div>
                                    <div className="grid grid-cols-[150px_1fr] items-center border-b pb-2">
                                        <span className="font-semibold">
                                            Nomor Telepon
                                        </span>
                                        <span>{penyewa.nomor_telepon}</span>
                                    </div>
                                </div>
                            </section>

                            {/* Alamat Pemasangan */}
                            <section className="mb-6 bg-bg-card p-6 md:p-8 rounded-lg shadow-lg">
                                <h2 className="text-xl font-bold text-dark-gray mb-3 pb-2 border-b">
                                    Alamat Pemasangan
                                </h2>
                                <div className="border-b pb-2">
                                    <p className="text-dark-gray whitespace-pre-line">
                                        {alamat_pemasangan}
                                    </p>
                                </div>
                            </section>

                            {/* Rincian Penyewaan */}
                            <section className="mb-6 bg-bg-card p-6 md:p-8 rounded-lg shadow-lg">
                                <h2 className="text-xl font-bold text-dark-gray mb-3 pb-2 border-b">
                                    Rincian Penyewaan
                                </h2>
                                <div className="space-y-4 text-sm text-dark-gray">
                                    <div className="grid grid-cols-[150px_1fr] items-start border-b pb-2">
                                        <span className="font-semibold">
                                            Tanggal Sewa
                                        </span>
                                        <span>
                                            {rincian_penyewaan.tanggal_sewa_formatted}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-[150px_1fr] items-start border-b pb-2">
                                        <span className="font-semibold">
                                            Durasi
                                        </span>
                                        <span>{rincian_penyewaan.durasi}</span>
                                    </div>
                                    {rincian_penyewaan.catatan && (
                                        <div className="grid grid-cols-[150px_1fr] items-start border-b pb-2">
                                            <span className="font-semibold">
                                                Catatan
                                            </span>
                                            <span>
                                                {rincian_penyewaan.catatan}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </section>

                            {/* Rincian Biaya */}
                            <section className="mb-6 bg-bg-card p-6 md:p-8 rounded-lg shadow-lg">
                                <h2 className="text-xl font-semibold text-dark-gray mb-3 pb-2 border-b">
                                    Rincian Biaya
                                </h2>
                                <table className="w-full text-left text-dark-gray">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="py-2 font-semibold">
                                                Tenda
                                            </th>
                                            <th className="py-2 font-semibold text-center">
                                                Jumlah
                                            </th>
                                            <th className="py-2 font-semibold text-right">
                                                Subtotal
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {rincian_biaya.items.map(
                                            (item, index) => (
                                                <tr
                                                    key={index}
                                                    className="border-b"
                                                >
                                                    <td className="py-2">
                                                        {item.nama_tenda}
                                                    </td>
                                                    <td className="py-2 text-center">
                                                        {item.jumlah}
                                                    </td>
                                                    <td className="py-2 text-right">
                                                        Rp
                                                        {
                                                            item.subtotal_formatted
                                                        }
                                                    </td>
                                                </tr>
                                            )
                                        )}
                                    </tbody>
                                    <tfoot>
                                        <tr className="font-bold">
                                            <td
                                                colSpan="2"
                                                className="py-3 text-right"
                                            >
                                                Total Biaya:
                                            </td>
                                            <td className="py-3 text-right text-lg">
                                                Rp
                                                {
                                                    rincian_biaya.total_biaya_formatted
                                                }
                                            </td>
                                        </tr>
                                    </tfoot>
                                </table>

                                {/* Catatan Penting */}
                                <div
                                    className="bg-[#FFEB3B]/20 border-l-8 border-[#FFEB3B] text-dark-gray px-4 py-3 rounded relative mb-6"
                                    role="alert"
                                >
                                    <strong className="font-bold">
                                        Catatan Penting:{" "}
                                    </strong>
                                    <br />
                                    <span className="block sm:inline">
                                        Pembayaran dilakukan setelah proses
                                        pembongkaran tenda selesai.
                                    </span>
                                </div>
                            </section>

                            {/* Syarat dan Ketentuan */}
                            <section className="mb-6 bg-bg-card p-6 md:p-8 rounded-lg shadow-lg">
                                <h2 className="text-xl font-semibold text-dark-gray mb-3 pb-2 border-b">
                                    Syarat dan Ketentuan
                                </h2>
                                <ul className="list-disc pl-6 space-y-1 text-sm text-dark-gray leading-snug">
                                    <li>
                                        Pembatalan sebelum petugas lapangan
                                        datang untuk melakukan pemasangan tidak
                                        akan dikenakan biaya
                                    </li>
                                    <li>
                                        Pembatalan pada saat petugas datang
                                        untuk melakukan pemasangan dikenakan
                                        biaya 20% dari total biaya sewa
                                    </li>
                                    <li>
                                        Kerusakan tenda pada saat masa sewa akan
                                        dikenakan biaya tambahan sesuai tingkat
                                        kerusakan, kecuali kerusakan dikarenakan
                                        bencana alam.
                                    </li>
                                </ul>

                                <div className="mt-4">
                                    <label
                                        htmlFor="terms"
                                        className="flex items-center"
                                    >
                                        <Checkbox
                                            id="terms"
                                            name="terms"
                                            checked={agreedToTerms}
                                            onChange={(e) =>
                                                setAgreedToTerms(
                                                    e.target.checked
                                                )
                                            }
                                        />
                                        <span className="ml-2 text-sm text-dark-gray">
                                            Saya telah membaca dan menyetujui
                                            syarat dan ketentuan yang berlaku.
                                        </span>
                                    </label>
                                </div>
                            </section>

                            {/* Tombol Aksi */}
                            <div className="flex items-center justify-end pt-4 border-t mt-6 space-x-5">
                                <Link href={route("penyewaan.create")}>
                                    <Button
                                        type="button"
                                        variant="neutral"
                                        disabled={processing}
                                    >
                                        &larr; Kembali
                                    </Button>
                                </Link>
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={handleFinalConfirm}
                                    disabled={!agreedToTerms || processing}
                                >
                                    {processing
                                        ? "Memproses..."
                                        : "Konfirmasi \u2192"}
                                </Button>
                            </div>
                            {Object.keys(pageErrors || {}).length > 0 && (
                                <div className="mt-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded">
                                    <p className="font-semibold">
                                        Terjadi kesalahan:
                                    </p>
                                    <ul className="list-disc list-inside text-sm">
                                        {Object.values(pageErrors).map(
                                            (error, i) => (
                                                <li key={i}>{error}</li>
                                            )
                                        )}
                                    </ul>
                                    <p className="text-xs mt-2">
                                        Silakan kembali dan perbaiki data Anda
                                        atau hubungi administrator.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        </>
    );
}
