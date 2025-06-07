import React, { useState, useEffect, useRef } from "react";
import PengelolaLayout from "@/Layouts/PengelolaLayout";
import { Head, Link, useForm } from "@inertiajs/react"; 
import Pagination from "@/Components/Pagination";
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import { Search } from "lucide-react";

export default function Index({
    auth,
    penyewaan,
    filters,
    tendaOptions,
    statusOptions,
}) {
    const { data, setData, get, processing } = useForm({
        search: filters.search || "",
        status: filters.status || "Semua status",
        tenda: filters.tenda || "Semua tenda",
        start_date: filters.start_date || "",
        end_date: filters.end_date || "",
    });

    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const debounce = setTimeout(() => {
            get(route("pengelola.penyewaan.index"), {
                preserveState: true,
                replace: true,
            });
        }, 500);

        return () => clearTimeout(debounce);
    }, [data.search, data.status, data.tenda, data.start_date, data.end_date]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setData(name, value);
    };


    const getStatusBadgeColor = (status) => {
        const s = status?.toLowerCase();
        if (s === "dipesan" || s === "menunggu")
            return "text-yellow-800 bg-yellow-100";
        if (s === "terjadwal" || s === "dikonfirmasi")
            return "text-blue-800 bg-blue-100";
        if (s === "berlangsung") return "text-indigo-800 bg-indigo-100";
        if (s === "selesai") return "text-green-800 bg-green-100";
        if (s === "dibatalkan" || s === "ditolak")
            return "text-red-800 bg-red-100";
        return "text-gray-800 bg-gray-100";
    };

    return (
        <PengelolaLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Data Penyewaan
                </h2>
            }
        >
            <Head title="Data Penyewaan" />

            <div className="">
                {/* Filter Section */}
                <div className="mb-6 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="relative">
                            <InputLabel
                                htmlFor="start_date"
                                value="Dari Tanggal"
                                className="text-xs text-gray-600 absolute -top-2 left-2 bg-white px-1"
                            />
                            <TextInput
                                type="date"
                                name="start_date"
                                id="start_date"
                                value={data.start_date}
                                onChange={handleFilterChange}
                                className="w-full"
                            />
                        </div>
                        <div className="relative">
                            <InputLabel
                                htmlFor="end_date"
                                value="Sampai Tanggal"
                                className="text-xs text-gray-600 absolute -top-2 left-2 bg-white px-1"
                            />
                            <TextInput
                                type="date"
                                name="end_date"
                                id="end_date"
                                value={data.end_date}
                                onChange={handleFilterChange}
                                className="w-full"
                            />
                        </div>
                        <div>
                            <select
                                name="status"
                                id="status"
                                value={data.status}
                                onChange={handleFilterChange}
                                className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                            >
                                <option>Semua status</option>
                                {statusOptions.map((status) => (
                                    <option key={status} value={status}>
                                        {status}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <select
                                name="tenda"
                                id="tenda"
                                value={data.tenda}
                                onChange={handleFilterChange}
                                className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                            >
                                <option value="Semua tenda">Semua tenda</option>
                                {tendaOptions.map((tenda) => (
                                    <option
                                        key={tenda.id_tenda}
                                        value={tenda.id_tenda}
                                    >
                                        {tenda.nama_tenda}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            get(route("pengelola.penyewaan.index"), {
                                preserveState: true,
                                replace: true,
                            });
                        }}
                        className="flex items-center gap-2"
                    >
                        <div className="relative w-full">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-gray-400" />
                            </div>
                            <TextInput
                                id="search"
                                name="search"
                                type="text"
                                value={data.search}
                                onChange={handleFilterChange}
                                className="w-full pl-10"
                                placeholder="Cari berdasarkan nama penyewa..."
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition"
                        >
                            Cari
                        </button>
                    </form>
                </div>

                {/* Tabel Data Penyewaan */}
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Penyewa
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Tenda
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Tanggal
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Durasi
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Status
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {penyewaan.data.map((item) => (
                                <tr
                                    key={item.id_penyewaan}
                                    className="hover:bg-gray-50"
                                >
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {item.nama_pelanggan}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {item.nama_tenda}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {item.tanggal_penyewaan}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {item.durasi_penyewaan}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span
                                            className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(
                                                item.status
                                            )}`}
                                        >
                                            {item.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {penyewaan.data.length === 0 && (
                                <tr>
                                    <td
                                        colSpan="5"
                                        className="px-6 py-12 text-center text-sm text-gray-500"
                                    >
                                        Tidak ada data penyewaan yang cocok
                                        dengan filter.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                {penyewaan.links.length > 3 && (
                    <div className="mt-6">
                        <Pagination links={penyewaan.links} />
                    </div>
                )}
            </div>
        </PengelolaLayout>
    );
}
