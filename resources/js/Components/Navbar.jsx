import React, { useState, useEffect, useRef } from 'react';
import { Link } from '@inertiajs/react';

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };

        if (isMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isMenuOpen]);

    return (
        <nav className="bg-nav-footer py-4 shadow-md relative z-50">
            <div className="container mx-auto px-4 max-w-7xl flex justify-between items-center">
                <div className="flex items-center">
                    <img src="/images/logo.png" alt="PMAQ Tenda Logo" className="h-12" />
                </div>

                <div className="flex items-center space-x-8">
                    <Link href={route("welcome")} className="text-dark-gray hover:text-dark-gray-hover font-bold hidden md:block">Beranda</Link>
                    <Link href="/" className="text-dark-gray hover:text-dark-gray-hover font-bold hidden md:block">Cek Penyewaan</Link>
                    <div className="relative" ref={menuRef}>
                        <button 
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-gray-800 focus:outline-none"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>

                        {isMenuOpen && (
                            <div className="absolute top-full right-0 w-48 bg-white rounded-md shadow-lg py-2 z-50 mt-2">
                                <div className="md:hidden">
                                    <Link href={route("welcome")} className="block px-4 py-2 text-dark-gray hover:text-dark-gray-hover">Beranda</Link>
                                    <Link href="/" className="block px-4 py-2 text-dark-gray hover:text-dark-gray-hover">Cek Penyewaan</Link>
                                </div>
                                <Link href={route("login")} className="block px-4 py-2 text-dark-gray hover:text-dark-gray-hover">Login</Link>
                                <Link href="/" className="block px-4 py-2 text-dark-gray hover:text-dark-gray-hover">Hubungi Kami</Link>
                                <Link href="/" className="block px-4 py-2 text-dark-gray hover:text-dark-gray-hover">FAQ</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}