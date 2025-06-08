import React, { useState } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import PengelolaLayout from "@/Layouts/PengelolaLayout";

function convertTo24HourFormat(timeStr) {
    if (!timeStr) return '';
    if (/^\d{2}:\d{2}$/.test(timeStr)) return timeStr;

    const [time, modifier] = timeStr.split(' ');
    let [hours, minutes] = time.split(':');

    hours = parseInt(hours, 10);
    if (modifier === 'PM' && hours < 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;

    return `${hours.toString().padStart(2, '0')}:${minutes}`;
}

export default function Show({ auth, detailPenjadwalan, flash }) {
    const [showEditModal, setShowEditModal] = useState(false);

    const { data, setData, put, processing, errors, reset } = useForm({
        tanggal_pemasangan: detailPenjadwalan.jadwal_edit?.tanggal_pemasangan || '',
        waktu_pemasangan: convertTo24HourFormat(detailPenjadwalan.jadwal_edit?.waktu_pemasangan),
        tanggal_pembongkaran: detailPenjadwalan.jadwal_edit?.tanggal_pembongkaran || '',
        waktu_pembongkaran: convertTo24HourFormat(detailPenjadwalan.jadwal_edit?.waktu_pembongkaran),
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('pengelola.penjadwalan.update', detailPenjadwalan.id_penyewaan), {
            onSuccess: closeEditModal,
            onError: (errors) => console.log('Validation errors:', errors),
        });
    };

    const getStatusTextColor = (status) => {
        const s = status?.toLowerCase();
        switch (s) {
            case "terjadwal": return "text-status-terjadwal";
            case "berlangsung": return "text-status-berlangsung";
            case "selesai": return "text-status-selesai";
            default: return "text-gray-800 bg-gray-100";
        }
    };

    const openEditModal = () => setShowEditModal(true);
    const closeEditModal = () => {
        setShowEditModal(false);
        reset();
    };

    return (
        <PengelolaLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    <Link
                        href={route("pengelola.penjadwalan.index")}
                        className="text-green-600 hover:text-green-800 hover:underline"
                    >
                        Penjadwalan
                    </Link>
                    <span className="text-green-600"> / </span>
                    <span className="text-green-600">
                        {detailPenjadwalan.nama_pelanggan}
                    </span>
                </h2>
            }
        >
            <Head title="Detail Penjadwalan" />

            <div className="">
                <div className="max-w-6xl">
                    <div className="bg-white shadow-sm sm:rounded-lg p-6">
                        {flash?.success && (
                            <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                                {flash.success}
                            </div>
                        )}

                        <div className="mb-6">
                            <h1 className="text-lg font-bold text-gray-900">Detail Penjadwalan</h1>
                        </div>

                        {/* Detail Info */}
                        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <InfoItem label="ID Penyewaan" value={detailPenjadwalan.id_penyewaan} />
                                <InfoItem label="Pelanggan" value={detailPenjadwalan.nama_pelanggan} />
                                <InfoItem label="Tanggal Sewa" value={detailPenjadwalan.tanggal_sewa} />
                                <InfoItem label="Durasi Sewa" value={detailPenjadwalan.durasi_sewa} />
                            </div>
                            <div className="space-y-4">
                                <InfoItem label="Catatan" value={detailPenjadwalan.catatan || "-"} />
                                <div>
                                    <div className="text-sm text-gray-600 mb-1">Status Penjadwalan</div>
                                    <span className={`inline-flex text-xs font-medium rounded-full ${getStatusTextColor(detailPenjadwalan.status_penyewaan)}`}>
                                        {detailPenjadwalan.status_penyewaan}
                                    </span>
                                </div>
                                <InfoItem label="Tanggal Pemasangan" value={detailPenjadwalan.tanggal_pemasangan || "-"} />
                                <InfoItem label="Tanggal Pembongkaran" value={detailPenjadwalan.tanggal_pembongkaran || "-"} />
                            </div>
                        </div>

                        {/* Tabel Tenda */}
                        <div className="border border-gray-200 rounded-lg overflow-hidden mb-6 mt-16">
                            <table className="min-w-full">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <TableHeader title="Kode Tenda" />
                                        <TableHeader title="Tenda" />
                                        <TableHeader title="Jumlah" />
                                    </tr>
                                </thead>
                                <tbody className="bg-white">
                                    <tr>
                                        <TableCell value={detailPenjadwalan.detail_tenda.kode_tenda} />
                                        <TableCell value={detailPenjadwalan.detail_tenda.nama_tenda} />
                                        <TableCell value={detailPenjadwalan.detail_tenda.jumlah} />
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="flex justify-center">
                            <button
                                onClick={openEditModal}
                                className="px-6 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                                Edit Jadwal
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Edit */}
            {showEditModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                        <div className="bg-green-100 -mx-6 -mt-6 px-6 py-3 rounded-t-lg mb-4 text-center">
                            <h3 className="text-lg font-semibold text-gray-800">Edit Jadwal</h3>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="mb-4 text-sm text-gray-600 space-y-1">
                                <p><strong>Penyewa:</strong> {detailPenjadwalan.nama_pelanggan}</p>
                                <p><strong>Tenda:</strong> {detailPenjadwalan.detail_tenda.nama_tenda} - {detailPenjadwalan.detail_tenda.jumlah} unit</p>
                                <p><strong>Tanggal sewa:</strong> {detailPenjadwalan.tanggal_sewa}</p>
                            </div>

                            {/* Pemasangan */}
                            <ScheduleSection
                                title="Jadwal Pemasangan"
                                tanggal={data.tanggal_pemasangan}
                                waktu={data.waktu_pemasangan}
                                onTanggalChange={(val) => setData('tanggal_pemasangan', val)}
                                onWaktuChange={(val) => setData('waktu_pemasangan', val)}
                                errors={{
                                    tanggal: errors.tanggal_pemasangan,
                                    waktu: errors.waktu_pemasangan
                                }}
                            />

                            {/* Pembongkaran */}
                            <ScheduleSection
                                title="Jadwal Pembongkaran"
                                tanggal={data.tanggal_pembongkaran}
                                waktu={data.waktu_pembongkaran}
                                onTanggalChange={(val) => setData('tanggal_pembongkaran', val)}
                                onWaktuChange={(val) => setData('waktu_pembongkaran', val)}
                                errors={{
                                    tanggal: errors.tanggal_pembongkaran,
                                    waktu: errors.waktu_pembongkaran
                                }}
                            />

                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={closeEditModal}
                                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                                    disabled={processing}
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                                    disabled={processing}
                                >
                                    {processing ? 'Menyimpan...' : 'Simpan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </PengelolaLayout>
    );
}

// Komponen bantu
const InfoItem = ({ label, value }) => (
    <div>
        <div className="text-sm text-gray-600 mb-1">{label}</div>
        <div className="text-sm font-medium text-gray-900">{value}</div>
    </div>
);

const TableHeader = ({ title }) => (
    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">{title}</th>
);

const TableCell = ({ value }) => (
    <td className="px-6 py-4 text-sm text-gray-900">{value}</td>
);

const ScheduleSection = ({ title, tanggal, waktu, onTanggalChange, onWaktuChange, errors }) => (
    <div className="mb-6">
        <h4 className="font-semibold text-gray-800 mb-2">{title}</h4>
        <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm text-gray-600 mb-1">Tanggal:</label>
                <input
                    type="date"
                    value={tanggal}
                    onChange={(e) => onTanggalChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                />
                {errors.tanggal && <p className="text-red-500 text-xs mt-1">{errors.tanggal}</p>}
            </div>
            <div>
                <label className="block text-sm text-gray-600 mb-1">Waktu:</label>
                <input
                    type="time"
                    value={waktu}
                    onChange={(e) => onWaktuChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                />
                {errors.waktu && <p className="text-red-500 text-xs mt-1">{errors.waktu}</p>}
            </div>
        </div>
    </div>
);
