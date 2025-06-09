import React from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import Button from '@/Components/Button';
import InputError from '@/Components/InputError';
import { Search, AlertCircle, ListChecks, Phone, User, CalendarDays, Info, ExternalLink } from 'lucide-react';

export default function LupaIdForm({ auth }) {
    const { props } = usePage();
    const foundPenyewaanIds = props.foundPenyewaanIds;
    const searchError = props.errors?.nomor_telepon_lupa || props.searchError;
    const oldInput = props.flash?.oldInput || {};

    const { data, setData, post, processing, errors, clearErrors } = useForm({
        nama_penyewa: oldInput.nama_penyewa || '',
        nomor_telepon: oldInput.nomor_telepon || '',
        tanggal_sewa_lupa: oldInput.tanggal_sewa_lupa || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        clearErrors('nama_penyewa', 'nomor_telepon', 'tanggal_sewa_lupa');
        post(route('penyewaan.lupa_id.find'), {
            preserveScroll: true,
        });
    };
    
    const getStatusBadgeColor = (status) => {
        switch (status?.toLowerCase()) {
            case "dipesan": case "menunggu": return "bg-yellow-100 text-yellow-700";
            case "terjadwal": case "dikonfirmasi": return "bg-blue-100 text-blue-700";
            case "berlangsung": return "bg-indigo-100 text-indigo-700";
            case "selesai": return "bg-green-100 text-green-700";
            case "dibatalkan": return "bg-red-100 text-red-700";
            default: return "bg-gray-100 text-gray-700";
        }
    };

    return (
        <>
            <Head title="Lupa ID Penyewaan" />
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
                    <Navbar auth={auth} />
                </div>

                <main className="flex-grow pt-24 pb-12">
                    <div className="container mx-auto px-4 max-w-lg">
                        <div className="text-center mb-8">
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                                Lupa ID Penyewaan Anda?
                            </h1>
                            <p className="text-gray-600 mt-2 text-sm">
                                Masukkan detail berikut untuk membantu kami menemukan ID penyewaan Anda.
                            </p>
                        </div>
                        <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg">
                            <form onSubmit={handleSubmit} className="space-y-5 mb-6">
                                <div>
                                    <InputLabel htmlFor="nama_penyewa" value="Nama Penyewa Sesuai KTP" className="text-sm font-medium text-gray-700 mb-1"/>
                                    <div className="mt-1 relative rounded-lg shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <User className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <TextInput
                                            id="nama_penyewa"
                                            name="nama_penyewa"
                                            value={data.nama_penyewa}
                                            onChange={(e) => setData('nama_penyewa', e.target.value)}
                                            className="block w-full pl-10 pr-3 py-3 rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500 sm:text-sm"
                                            placeholder="Masukkan nama lengkap Anda"
                                            required
                                            autoFocus
                                        />
                                    </div>
                                    <InputError message={errors.nama_penyewa} className="mt-1 text-xs" />
                                </div>
                                <div>
                                    <InputLabel htmlFor="nomor_telepon" value="Nomor Telepon Terdaftar" className="text-sm font-medium text-gray-700 mb-1"/>
                                    <div className="mt-1 relative rounded-lg shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Phone className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <TextInput
                                            id="nomor_telepon"
                                            name="nomor_telepon"
                                            type="tel"
                                            value={data.nomor_telepon}
                                            onChange={(e) => setData('nomor_telepon', e.target.value)}
                                            className="block w-full pl-10 pr-3 py-3 rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500 sm:text-sm"
                                            placeholder="Contoh: 081234567890"
                                            required
                                        />
                                    </div>
                                    <InputError message={errors.nomor_telepon} className="mt-1 text-xs" />
                                </div>
                                <div>
                                    <InputLabel htmlFor="tanggal_sewa_lupa" value="Tanggal Sewa" className="text-sm font-medium text-gray-700 mb-1"/>
                                    <div className="mt-1 relative rounded-lg shadow-sm">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <CalendarDays className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <TextInput
                                            id="tanggal_sewa_lupa"
                                            name="tanggal_sewa_lupa"
                                            type="date"
                                            value={data.tanggal_sewa_lupa}
                                            onChange={(e) => setData('tanggal_sewa_lupa', e.target.value)}
                                            className="block w-full pl-10 pr-3 py-3 rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500 sm:text-sm"
                                            required
                                        />
                                    </div>
                                    <InputError message={errors.tanggal_sewa_lupa} className="mt-1 text-xs" />
                                    <div className="text-right mt-1.5">
                                        <Link href={route('penyewaan.check.form')} className="text-xs text-green-600 hover:text-green-800 hover:underline">
                                            Gunakan ID Penyewaan?
                                        </Link>
                                    </div>
                                </div>

                                <div className="pt-2 flex justify-center">
                                    <Button
                                        type="submit"
                                        className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-2.5 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition ease-in-out duration-150"
                                        disabled={processing}
                                        variant="primary"
                                    >
                                        <Search className="h-5 w-5 mr-2" />
                                        {processing ? 'Mencari...' : 'Cari ID Penyewaan'}
                                    </Button>
                                </div>
                            </form>

                            {processing && !foundPenyewaanIds && !searchError && (
                                <div className="text-center py-6 mt-6"><p className="text-gray-500">Mencari...</p></div>
                            )}

                            {searchError && !foundPenyewaanIds && !processing && (
                                <div className="mt-6 p-4 bg-red-50 border-l-4 border-red-400 text-red-700 rounded-md">
                                    {/* ... (kode error message) ... */}
                                    <div className="flex items-center">
                                        <AlertCircle className="h-5 w-5 text-red-500 mr-3 flex-shrink-0" />
                                        <span className="text-sm">{searchError}</span>
                                    </div>
                                </div>
                            )}


                            {foundPenyewaanIds && foundPenyewaanIds.length > 0 && !processing && (
                                <div className="mt-8 border border-gray-200 rounded-lg shadow-sm">
                                    <div className="bg-gray-50 px-6 py-3 border-b border-gray-200 rounded-t-lg">
                                        <div className="flex items-center">
                                            <ListChecks className="h-5 w-5 text-green-700 mr-2" />
                                            <h2 className="text-md font-semibold text-gray-700">
                                                ID Penyewaan Ditemukan ({foundPenyewaanIds.length})
                                            </h2>
                                        </div>
                                    </div>
                                    <div className="bg-white p-4 rounded-b-lg">
                                        <p className="text-xs text-gray-500 mb-3">Klik pada ID untuk melihat detail penyewaan.</p>
                                        <ul className="space-y-3">
                                            {foundPenyewaanIds.map((item) => (
                                                <li key={item.id} className="p-3 bg-gray-50 hover:bg-green-50 border border-gray-200 hover:border-green-300 rounded-md flex justify-between items-center text-sm transition-colors group">
                                                    <div>
                                                        <Link 
                                                            href={route('penyewaan.detail', { id_penyewaan: item.id })} 
                                                            className="font-mono font-semibold text-green-600 group-hover:text-green-700 group-hover:underline block"
                                                        >
                                                            {item.id}
                                                            <ExternalLink className="w-3 h-3 ml-1 inline-block opacity-50 group-hover:opacity-100"/>
                                                        </Link>
                                                        <span className="block text-xs text-gray-500">Tgl. Sewa: {item.tanggal}</span>
                                                    </div>
                                                    <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(item.status)}`}>
                                                        {item.status}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            )}
                            {foundPenyewaanIds && foundPenyewaanIds.length === 0 && !processing && !searchError && (
                                <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-400 text-blue-700 rounded-md">
                                    <div className="flex items-center">
                                        <Info className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" />
                                        <span className="text-sm">Tidak ada riwayat penyewaan yang ditemukan untuk kombinasi data yang dimasukkan.</span>
                                    </div>
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