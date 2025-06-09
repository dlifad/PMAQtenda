import React from 'react';
import PengelolaLayout from '@/Layouts/PengelolaLayout';
import { Head, Link } from '@inertiajs/react';
import { File, UserCheck, Clock, CalendarX, ExternalLink } from 'lucide-react';

// Komponen untuk Card Statistik
const StatCard = ({ title, value, unit, icon, colorClass }) => (
    <div className="bg-white px-6 py-4 rounded-xl shadow-sm border flex items-center space-x-4 hover:shadow-md transition">
        <div className={`p-3 rounded-md ${colorClass} flex items-center justify-center`}>
            {React.cloneElement(icon, { className: "w-6 h-6 text-white" })}
        </div>
        <div className="flex flex-col justify-center">
            <p className="text-sm font-semibold text-gray-800">{title}</p>
            <p className="text-sm text-gray-600">
                {value} <span className="text-gray-500">{unit}</span>
            </p>
        </div>
    </div>
);

const getStatusTextColor = (status) => {
    const s = status?.toLowerCase();
    if (s === "dipesan" || s === "menunggu") return "text-status-menunggu";
    if (s === "terjadwal" || s === "dikonfirmasi") return "text-terjadwal";
    if (s === "berlangsung") return "text-berlangsung";
    if (s === "selesai") return "text-selesai";
    if (s === "dibatalkan") return "text-ditolak";
    return "text-gray-700";
}; 


export default function Dashboard({ auth, stats, penyewaanTerbaru }) {
    return (
        <PengelolaLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard Pengelola</h2>}
        >
            <Head title="Dashboard Pengelola" />

            <div className="space-y-8">
                {/* Bagian Card Statistik */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <StatCard
                        title="Total Tenda"
                        value={stats.totalUnitTenda}
                        unit="Unit"
                        icon={<File />}
                        colorClass="bg-[#198754]"
                    />
                    <StatCard
                        title="Penyewa Aktif"
                        value={stats.penyewaAktifCount}
                        unit="Penyewa"
                        icon={<UserCheck />}
                        colorClass="bg-[#6F42C1]"
                    />
                    <StatCard
                        title="Antrean Sewa"
                        value={stats.antreanSewaCount}
                        unit="Penyewa"
                        icon={<Clock />}
                        colorClass="bg-[#0D6EFD]"
                    />
                    <StatCard
                        title="Belum Terjadwal"
                        value={stats.belumTerjadwalCount}
                        unit="Penyewa"
                        icon={<CalendarX />}
                        colorClass="bg-[#FFA500]"
                    />
                </div>

                {/* Bagian Penyewaan Terbaru */}
                <div className="bg-white shadow-md rounded-lg">
                    <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-gray-800">Penyewaan Terbaru</h3>
                        <Link href={route("pengelola.penyewaan.index")} className="text-sm text-green-600 hover:text-green-800 font-medium flex items-center">
                            Lihat semua
                        </Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Penyewa</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tenda</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durasi</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {penyewaanTerbaru && penyewaanTerbaru.length > 0 ? (
                                    penyewaanTerbaru.map((sewa) => (
                                        <tr key={sewa.id_penyewaan} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{sewa.nama_pelanggan}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sewa.nama_tenda}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sewa.tanggal_penyewaan}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sewa.durasi_penyewaan}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <span className={`font-semibold ${getStatusTextColor(sewa.status)}`}>
                                                    {sewa.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center text-sm text-gray-500">
                                            Belum ada data penyewaan.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </PengelolaLayout>
    );
}
