import React from 'react';
import PengelolaLayout from '@/Layouts/PengelolaLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import Pagination from '@/Components/Pagination';
export default function Index({ auth, tendas, flash }) {
    const handleDelete = (tenda) => {
        if (confirm(`Apakah Anda yakin ingin menghapus tenda "${tenda.nama_tenda}"?`)) {
            router.delete(route('pengelola.tenda.destroy', tenda.id_tenda));
        }
    };

    return (
        <PengelolaLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Data Tenda</h2>}
        >
            <Head title="Data Tenda" />

            {flash.success && (
                <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
                    <span className="block sm:inline">{flash.success}</span>
                </div>
            )}

            <div className="">
                <div className="flex justify-between items-center mb-6">
                    <Link href={route('pengelola.tenda.create')}>
                        <button className="inline-flex items-center px-4 py-2 bg-green-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-green-700 active:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition ease-in-out duration-150">
                            <Plus className="w-4 h-4 mr-2" />
                            Tambah Tenda
                        </button>
                    </Link>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gambar</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tenda</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Harga</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {tendas.data.map((tenda) => (
                                <tr key={tenda.id_tenda} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">TND-{tenda.id_tenda}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <img 
                                            src={tenda.gambar_url || 'https://placehold.co/100x60/e2e8f0/e2e8f0?text=.'} 
                                            alt={tenda.nama_tenda} 
                                            className="w-24 h-16 object-cover rounded-md" 
                                        />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{tenda.nama_tenda}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tenda.harga}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tenda.jumlah}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                        <Link href={route('pengelola.tenda.edit', tenda.id_tenda)} className="inline-flex items-center px-3 py-1.5 bg-blue-500 text-white text-xs rounded-md hover:bg-blue-600">
                                            <Edit className="w-3 h-3 mr-1" />
                                            Edit
                                        </Link>
                                        <button onClick={() => handleDelete(tenda)} className="inline-flex items-center px-3 py-1.5 bg-red-600 text-white text-xs rounded-md hover:bg-red-700">
                                            <Trash2 className="w-3 h-3 mr-1" />
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {tendas.data.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-sm text-gray-500">Tidak ada data tenda yang ditemukan.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {tendas.links.length > 3 && (
                     <div className="mt-6">
                        <Pagination links={tendas.links} />
                    </div>
                )}
            </div>
        </PengelolaLayout>
    );
}
