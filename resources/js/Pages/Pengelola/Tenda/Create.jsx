import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import PengelolaLayout from '@/Layouts/PengelolaLayout';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import TextArea from '@/Components/TextArea';

export default function Create({ auth }) {
    const { data, setData, post, processing, errors, progress } = useForm({
        nama_tenda: '',
        jumlah: '',
        harga: '',
        deskripsi: '',
        isi_paket: '',
        gambar: null,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('pengelola.tenda.store'));
    };

    return (
        <PengelolaLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Tambah Tenda Baru</h2>}
        >
            <Head title="Tambah Tenda" />

            <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-8">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Formulir Tenda Baru</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <InputLabel htmlFor="nama_tenda" value="Nama Tenda" />
                        <TextInput
                            id="nama_tenda"
                            name="nama_tenda"
                            value={data.nama_tenda}
                            onChange={(e) => setData('nama_tenda', e.target.value)}
                            className="mt-1 block w-full"
                            required
                        />
                        <InputError message={errors.nama_tenda} className="mt-2" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <InputLabel htmlFor="jumlah" value="Jumlah (Unit)" />
                            <TextInput
                                id="jumlah"
                                name="jumlah"
                                type="number"
                                value={data.jumlah}
                                onChange={(e) => setData('jumlah', e.target.value)}
                                className="mt-1 block w-full"
                                required
                            />
                            <InputError message={errors.jumlah} className="mt-2" />
                        </div>
                        <div>
                            <InputLabel htmlFor="harga" value="Harga (per Unit)" />
                            <TextInput
                                id="harga"
                                name="harga"
                                type="number"
                                value={data.harga}
                                onChange={(e) => setData('harga', e.target.value)}
                                className="mt-1 block w-full"
                                required
                            />
                            <InputError message={errors.harga} className="mt-2" />
                        </div>
                    </div>
                    
                    <div>
                        <InputLabel htmlFor="deskripsi" value="Deskripsi" />
                        <TextArea
                            id="deskripsi"
                            name="deskripsi"
                            value={data.deskripsi}
                            onChange={(e) => setData('deskripsi', e.target.value)}
                            className="mt-1 block w-full"
                            rows={4}
                        />
                        <InputError message={errors.deskripsi} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="isi_paket" value="Isi Paket (pisahkan dengan koma)" />
                        <TextInput
                            id="isi_paket"
                            name="isi_paket"
                            value={data.isi_paket}
                            onChange={(e) => setData('isi_paket', e.target.value)}
                            className="mt-1 block w-full"
                            placeholder="Contoh: Kursi, Meja, Blower"
                        />
                        <InputError message={errors.isi_paket} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="gambar" value="Gambar Tenda" />
                        <input
                            type="file"
                            id="gambar"
                            name="gambar"
                            onChange={(e) => setData('gambar', e.target.files[0])}
                            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                        />
                         {progress && (
                            <div className="w-full bg-gray-200 rounded-full mt-2">
                                <div className="bg-green-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full" style={{ width: `${progress.percentage}%` }}>
                                    {progress.percentage}%
                                </div>
                            </div>
                        )}
                        <InputError message={errors.gambar} className="mt-2" />
                    </div>
                    
                    <div className="flex items-center justify-end space-x-4 mt-6">
                        <Link href={route('pengelola.tenda.index')} className="text-gray-600 hover:underline">
                            Batal
                        </Link>
                        <button type="submit" disabled={processing} className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50">
                            {processing ? 'Menyimpan...' : 'Simpan Tenda'}
                        </button>
                    </div>
                </form>
            </div>
        </PengelolaLayout>
    );
}

