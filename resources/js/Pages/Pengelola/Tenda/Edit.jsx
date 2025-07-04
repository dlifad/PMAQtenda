import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import PengelolaLayout from '@/Layouts/PengelolaLayout';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import TextArea from '@/Components/TextArea';
import Button from '@/Components/Button'; 

export default function Edit({ auth, tenda }) {
    const { data, setData, post, processing, errors, progress } = useForm({
        nama_tenda: tenda.nama_tenda || '',
        jumlah: tenda.jumlah || '',
        harga: tenda.harga || '',
        deskripsi: tenda.deskripsi || '',
        isi_paket: tenda.isi_paket || '',
        gambar: null,
        _method: 'PUT'
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('pengelola.tenda.update', tenda.id_tenda));
    };

    return (
        <PengelolaLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Edit Data Tenda</h2>}
        >
            <Head title={`Edit Tenda - ${tenda.nama_tenda}`} />

            <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-8">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Formulir Edit Tenda</h1>
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
                        <InputLabel htmlFor="gambar" value="Ganti Gambar Tenda (Opsional)" />
                        {tenda.gambar_url && (
                            <div className="mt-2 mb-4">
                                <p className="text-xs text-gray-500 mb-1">Gambar Saat Ini:</p>
                                <img src={tenda.gambar_url} alt="Gambar tenda saat ini" className="w-40 h-auto rounded-md border" />
                            </div>
                        )}
                        <input
                            type="file"
                            id="gambar"
                            name="gambar"
                            onChange={(e) => setData('gambar', e.target.files[0])}
                            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                        />
                         {progress && (
                            <div className="w-full bg-gray-200 rounded-full mt-2">
                                <div className="bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full" style={{ width: `${progress.percentage}%` }}>
                                    {progress.percentage}%
                                </div>
                            </div>
                        )}
                        <InputError message={errors.gambar} className="mt-2" />
                    </div>
                    
                    <div className="flex items-center justify-end space-x-4 mt-6">
                        <Link href={route('pengelola.tenda.index')}>
                            <Button type="button" variant="neutral">
                                Batal
                            </Button>
                        </Link>

                        <Button type="submit" variant="success" disabled={processing}>
                            {processing ? 'Memperbarui...' : 'Update'}
                        </Button>
                    </div>
                </form>
            </div>
        </PengelolaLayout>
    );
}
