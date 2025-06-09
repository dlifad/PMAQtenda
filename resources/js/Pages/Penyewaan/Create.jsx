import React, { useEffect } from "react";
import { Head, Link, useForm, router, usePage } from "@inertiajs/react";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import TextArea from "@/Components/TextArea";
import Button from "@/Components/Button";
import InputError from "@/Components/InputError";
import { Trash2 } from "lucide-react";

// Fungsi helper untuk format mata uang Rupiah
const formatRupiah = (price) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(price);
};

export default function Create({
    auth,
    allTendas,
    initialTenda,
    errors: pageErrors,
}) {
    const { props } = usePage();
    const { flash } = props;

    const { data, setData, processing, errors, reset } = useForm({
        nama_lengkap: "",
        nomor_telepon: "",
        alamat_pemasangan: "",
        tanggal_sewa: "", 
        durasi_penyewaan: "",
        catatan: "",
        selected_tendas: initialTenda
            ? [{
                temp_id: `item-${Date.now()}-initial`,
                tenda_id: initialTenda.id_tenda,
                jumlah: 1,
                harga: initialTenda.harga,
              }]
            : allTendas && allTendas.length > 0
            ? [{
                temp_id: `item-${Date.now()}-default`,
                tenda_id: allTendas[0].id_tenda,
                jumlah: 1,
                harga: allTendas[0].harga,
              }]
            : [],
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setData(name, value);
    };

    const handleTendaItemChange = (index, field, value) => {
        const newSelectedTendas = [...data.selected_tendas];
        if (!newSelectedTendas[index]) return;

        newSelectedTendas[index][field] = value;

        if (field === "tenda_id") {
            const selectedTendaData = allTendas.find((t) => t.id_tenda == value);
            if (selectedTendaData) {
                newSelectedTendas[index].harga = selectedTendaData.harga;
                newSelectedTendas[index].jumlah = 1;
            }
        }
        setData("selected_tendas", newSelectedTendas);
    };

    const addTendaRow = () => {
        if (allTendas.length === 0) {
            alert("Tidak ada pilihan tenda tersedia.");
            return;
        }
        setData("selected_tendas", [
            ...data.selected_tendas,
            {
                temp_id: `item-${Date.now()}`,
                tenda_id: allTendas[0].id_tenda,
                jumlah: 1,
                harga: allTendas[0].harga,
            },
        ]);
    };

    const removeTendaRow = (indexToRemove) => {
        setData(
            "selected_tendas",
            data.selected_tendas.filter((_, index) => index !== indexToRemove)
        );
    };

    const submitPenyewaan = (e) => {
        e.preventDefault();
        router.post(route("penyewaan.showConfirmation"), data, {
            preserveScroll: true,
            onError: (errors) => {
                console.error("Error saat validasi:", errors);
            },
        });
    };

    return (
        <>
            <Head title="Formulir Penyewaan Tenda" />
            <div className="min-h-screen bg-gray-100">
                <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
                    <Navbar auth={auth} />
                </div>

                <main className="pt-24 pb-12">
                    <div className="container mx-auto px-4">
                        <form onSubmit={submitPenyewaan} className="bg-white p-6 md:p-8 rounded-lg shadow-lg space-y-8 max-w-4xl mx-auto">
                            <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-800">
                                Formulir Penyewaan Tenda
                            </h1>
                            
                            {flash.error && (
                                <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-100" role="alert">
                                    <span className="font-bold">Terjadi Kesalahan:</span> {flash.error}
                                </div>
                            )}

                            {/* Data Penyewa */}
                            <section className="border border-gray-300 p-4 rounded-md">
                                <h2 className="text-xl font-semibold text-gray-700 mb-4">Data Penyewa</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <InputLabel htmlFor="nama_lengkap" value="Nama Lengkap" />
                                        <TextInput id="nama_lengkap" name="nama_lengkap" value={data.nama_lengkap} onChange={handleInputChange} className="mt-1 block w-full" required />
                                        <InputError message={errors.nama_lengkap || pageErrors?.nama_lengkap} className="mt-2" />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="nomor_telepon" value="Nomor Telepon" />
                                        <TextInput id="nomor_telepon" name="nomor_telepon" type="tel" value={data.nomor_telepon} onChange={handleInputChange} className="mt-1 block w-full" required />
                                        <InputError message={errors.nomor_telepon || pageErrors?.nomor_telepon} className="mt-2" />
                                    </div>
                                </div>
                                <div className="mt-6">
                                    <InputLabel htmlFor="alamat_pemasangan" value="Alamat Pemasangan (Sertakan link lokasi jika ada)" />
                                    <TextArea id="alamat_pemasangan" name="alamat_pemasangan" value={data.alamat_pemasangan} onChange={handleInputChange} rows="3" className="mt-1 block w-full" required />
                                    <InputError message={errors.alamat_pemasangan || pageErrors?.alamat_pemasangan} className="mt-2" />
                                </div>
                            </section>

                            {/* Data Penyewaan */}
                            <section className="border border-gray-300 p-4 rounded-md">
                                <h2 className="text-xl font-semibold text-gray-700 mb-4">Data Penyewaan</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <InputLabel htmlFor="tanggal_sewa" value="Tanggal Sewa" />
                                        <TextInput id="tanggal_sewa" name="tanggal_sewa" type="date" value={data.tanggal_sewa} onChange={handleInputChange} className="mt-1 block w-full" min={new Date().toISOString().split("T")[0]} required />
                                        <InputError message={errors.tanggal_sewa || pageErrors?.tanggal_sewa} className="mt-2" />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="durasi_penyewaan" value="Durasi (Hari)" />
                                        <TextInput id="durasi_penyewaan" name="durasi_penyewaan" type="number" value={data.durasi_penyewaan} onChange={handleInputChange} className="mt-1 block w-full" min="1" required />
                                        <InputError message={errors.durasi_penyewaan || pageErrors?.durasi_penyewaan} className="mt-2" />
                                    </div>
                                </div>
                                <div className="mt-6">
                                    <InputLabel htmlFor="catatan" value="Catatan (Opsional)" />
                                    <TextArea id="catatan" name="catatan" value={data.catatan} onChange={handleInputChange} rows="2" className="mt-1 block w-full" />
                                    <InputError message={errors.catatan || pageErrors?.catatan} className="mt-2" />
                                </div>
                            </section>

                            {/* Pilihan Tenda */}
                            <section className="border border-gray-300 p-4 rounded-md">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-semibold text-gray-700">Pilihan Tenda</h2>
                                    {/* <Button type="button" variant="success" size="small" onClick={addTendaRow} disabled={processing || allTendas.length === 0}>
                                        + Tambah Tenda
                                    </Button> */}
                                </div>
                                <div className="space-y-4">
                                    {data.selected_tendas.map((item, index) => {
                                        const subtotal = (parseFloat(item.harga) || 0) * (parseInt(item.jumlah, 10) || 0);
                                        return (
                                            <div key={item.temp_id || index} className="p-3 border rounded-md bg-gray-50 space-y-3 md:space-y-0 md:grid md:grid-cols-12 md:gap-3 md:items-end">
                                                <div className="md:col-span-4">
                                                    <InputLabel htmlFor={`tenda_id_${index}`} value="Pilihan Tenda" />
                                                    <select id={`tenda_id_${index}`} value={item.tenda_id} onChange={(e) => handleTendaItemChange(index, "tenda_id", e.target.value)} className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm" disabled={processing}>
                                                        <option value="" disabled>-- Pilih Tenda --</option>
                                                        {allTendas.map((t) => (
                                                            <option key={t.id_tenda} value={t.id_tenda}>
                                                                {t.nama_tenda}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="md:col-span-2">
                                                    <InputLabel htmlFor={`harga_${index}`} value="Harga/Unit" />
                                                    <TextInput id={`harga_${index}`} type="text" value={formatRupiah(item.harga)} className="mt-1 block w-full bg-gray-100" readOnly disabled={processing} />
                                                </div>
                                                <div className="md:col-span-2">
                                                    <InputLabel htmlFor={`jumlah_${index}`} value="Jumlah" />
                                                    <TextInput id={`jumlah_${index}`} type="number" value={item.jumlah} onChange={(e) => handleTendaItemChange(index, "jumlah", parseInt(e.target.value, 10) || "")} className="mt-1 block w-full" min="1" disabled={processing} />
                                                    <InputError message={pageErrors?.[`selected_tendas.${index}.jumlah`]} className="mt-1" />
                                                </div>
                                                <div className="md:col-span-3">
                                                    <InputLabel htmlFor={`subtotal_${index}`} value="Subtotal" />
                                                    <TextInput id={`subtotal_${index}`} type="text" value={formatRupiah(subtotal)} className="mt-1 block w-full bg-gray-100" readOnly disabled={processing} />
                                                </div>
                                                <div className="md:col-span-1 flex items-end justify-end md:justify-start">
                                                    {data.selected_tendas.length > 1 && (
                                                        <Button type="button" variant="danger" size="small" onClick={() => removeTendaRow(index)} className="p-2" disabled={processing}>
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                    {data.selected_tendas.length === 0 && (
                                        <p className="text-gray-500 text-center py-4">Silakan tambahkan pilihan tenda.</p>
                                    )}
                                </div>
                            </section>

                            {/* Tombol Aksi */}
                            <div className="flex items-center justify-end space-x-4 pt-4">
                                <Link href={route("welcome")}>
                                    <Button type="button" variant="neutral" disabled={processing}>Batal</Button>
                                </Link>
                                <Button type="submit" variant="primary" disabled={processing || data.selected_tendas.length === 0}>
                                    {processing ? "Memproses..." : "Lanjutkan"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </main>
                <Footer />
            </div>
        </>
    );
}