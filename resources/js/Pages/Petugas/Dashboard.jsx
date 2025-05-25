import PetugasLayout from '@/Layouts/PetugasLayout'; 
import { Head } from '@inertiajs/react';

export default function Dashboard({ auth }) {
    return (
        <PetugasLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Dashboard Petugas Lapangan</h2>}
        >
            <Head title="Dashboard Petugas Lapangan" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <h1>Ini adalah Dashboard Petugas Lapangan</h1>
                            <p>Selamat datang, {auth.user.name}!</p>
                            <p>Role Anda: {auth.user.role}</p>
                        </div>
                    </div>
                </div>
            </div>
        </PetugasLayout>
    );
}