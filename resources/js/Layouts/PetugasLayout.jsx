import React from "react";
import { Link } from "@inertiajs/react";
import { UserCircle, LogOut } from "lucide-react";

export default function PetugasLayout({ user, children }) {
    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            {/* Navbar */}
            <nav className="bg-nav-footer fixed top-0 left-0 right-0 z-30 h-16 flex items-center">
                <div className="w-full max-w-full mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-full">
                        <div className="flex items-center">
                            <Link href={route("welcome")} className="flex items-center">
                                <img src="/images/logo.png" alt="PMAQ Tenda Logo" className="h-8" />
                            </Link>
                        </div>
                        <div className="flex items-center">
                            <span className="text-sm font-medium text-gray-700 mr-2 hidden sm:block">
                                Petugas Lapangan
                            </span>
                            <div className="p-1">
                                <UserCircle className="w-8 h-8 text-gray-600" />
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Content */}
            <main className="pt-16 flex-grow">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    {children}
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-nav-footer border-t py-4 text-center text-sm text-dark-gray">
                &copy; {new Date().getFullYear()} PMAQ Tenda. All rights reserved.
            </footer>
        </div>
    );
}

