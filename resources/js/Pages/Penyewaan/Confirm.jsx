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
    const [processing, setProcessing] = useState(false); // State untuk loading tombol konfirmasi

    const handleFinalConfirm = () => {
        if (!agreedToTerms) {
            alert(
                "Anda harus menyetujui Syarat dan Ketentuan yang berlaku untuk melanjutkan."
            );
            return;
        }
        setProcessing(true);
        router.post(route("penyewaan.store"), rawDataToStore, {
            onFinish: () => setProcessing(false), // Reset processing state saat selesai (sukses atau error)
            onError: (errors) => {
                // Jika ada error dari backend saat store (misal stok habis tiba2)
                // Biasanya Inertia akan redirect back jika ada validation error.
                // Jika error umum, bisa tampilkan alert atau notifikasi.
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
                // Jika controller redirect dengan flash success, akan ditangani oleh layout utama
                // Jika tidak, Anda bisa menampilkan pesan di sini
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
                        <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg">
                            <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-6">
                                Konfirmasi Penyewaan
                            </h1>

                            <div
                                className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded relative mb-6"
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
                            <section className="mb-6">
                                <h2 className="text-xl font-semibold text-gray-700 mb-3 pb-2 border-b">
                                    Penyewa
                                </h2>
                                <div className="space-y-1 text-gray-800">
                                    <p>
                                        <strong>Nama Lengkap:</strong>{" "}
                                        {penyewa.nama_lengkap}
                                    </p>
                                    <p>
                                        <strong>Nomor Telepon:</strong>{" "}
                                        {penyewa.nomor_telepon}
                                    </p>
                                </div>
                            </section>

                            {/* Alamat Pemasangan */}
                            <section className="mb-6">
                                <h2 className="text-xl font-semibold text-gray-700 mb-3 pb-2 border-b">
                                    Alamat Pemasangan
                                </h2>
                                <p className="text-gray-800 whitespace-pre-line">
                                    {alamat_pemasangan}
                                </p>
                            </section>

                            {/* Rincian Penyewaan */}
                            <section className="mb-6">
                                <h2 className="text-xl font-semibold text-gray-700 mb-3 pb-2 border-b">
                                    Rincian Penyewaan
                                </h2>
                                <div className="space-y-1 text-gray-800">
                                    <p>
                                        <strong>Tanggal Sewa:</strong>{" "}
                                        {
                                            rincian_penyewaan.tanggal_sewa_formatted
                                        }
                                    </p>
                                    <p>
                                        <strong>Durasi:</strong>{" "}
                                        {rincian_penyewaan.durasi}
                                    </p>
                                    {rincian_penyewaan.catatan && (
                                        <p>
                                            <strong>Catatan:</strong>{" "}
                                            {rincian_penyewaan.catatan}
                                        </p>
                                    )}
                                </div>
                            </section>

                            {/* Rincian Biaya */}
                            <section className="mb-6">
                                <h2 className="text-xl font-semibold text-gray-700 mb-3 pb-2 border-b">
                                    Rincian Biaya
                                </h2>
                                <table className="w-full text-left text-gray-800">
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
                            </section>

                            {/* Catatan Penting */}
                            <div
                                className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded relative mb-6"
                                role="alert"
                            >
                                <strong className="font-bold">
                                    Catatan Penting:{" "}
                                </strong>
                                <span className="block sm:inline">
                                    Pembayaran dilakukan setelah proses
                                    pembongkaran tenda selesai.
                                </span>
                            </div>

                            {/* Syarat dan Ketentuan */}
                            <section className="mb-6">
                                <h2 className="text-xl font-semibold text-gray-700 mb-3 pb-2 border-b">
                                    Syarat dan Ketentuan
                                </h2>
                                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                                    <li>
                                        Pembatalan sebelum petugas lapangan
                                        datang untuk melakukan pemasangan tidak
                                        akan dikenakan biaya.
                                    </li>
                                    <li>
                                        Jika pembatalan saat petugas datang
                                        untuk melakukan pemasangan dikenakan
                                        biaya 20% dari total biaya sewa.
                                    </li>
                                    <li>
                                        Kerusakan tenda yang fatal saat sewa
                                        akan dikenakan biaya tambahan sesuai
                                        tingkat kerusakan, kecuali kerusakan
                                        dikarenakan bencana alam.
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
                                        <span className="ml-2 text-sm text-gray-700">
                                            Saya telah membaca dan menyetujui
                                            syarat dan ketentuan yang berlaku.
                                        </span>
                                    </label>
                                </div>
                            </section>

                            {/* Tombol Aksi */}
                            <div className="flex items-center justify-between pt-4 border-t mt-6">
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
                                    variant="primary"
                                    onClick={handleFinalConfirm}
                                    disabled={!agreedToTerms || processing}
                                >
                                    {processing
                                        ? "Memproses..."
                                        : "Konfirmasi & Ajukan Sewa \u2192"}
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
