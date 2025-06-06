import React, { useState, useEffect, useRef } from "react";
import { Link, Head } from "@inertiajs/react";
import {
    LayoutGrid,
    File,
    ListOrdered,
    CalendarDays,
    LogOut,
    UserCircle,
    Menu,
    X,
} from "lucide-react";

const NavLink = ({ href, active, children, icon }) => (
    <Link
        href={href}
        className={`flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors duration-150 relative group
            ${
                active
                    ? "text-green-800"
                    : "text-gray-700 hover:bg-green-100 hover:text-green-800"
            }`}
    >
        {active && (
            <span className="absolute left-0 top-0 bottom-0 w-1 bg-green-700 "></span>
        )}

        {React.cloneElement(icon, {
            className: `w-5 h-5 mr-3 flex-shrink-0 ${
                active
                    ? "text-green-700"
                    : "text-gray-500 group-hover:text-green-700"
            }`,
        })}

        <span className={active ? "font-bold" : ""}>{children}</span>
    </Link>
);

// Komponen untuk link logout di sidebar
const LogoutLink = ({
    href,
    children,
    icon,
    method = "post",
    as = "button",
}) => (
    <Link
        href={href}
        method={method}
        as={as}
        className={`flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors duration-150 text-gray-700 hover:bg-red-100 hover:text-red-700 group w-full`}
    >
        {React.cloneElement(icon, {
            className:
                "w-5 h-5 mr-3 flex-shrink-0 text-gray-500 group-hover:text-red-600",
        })}
        {children}
    </Link>
);

export default function PengelolaLayout({ user, header, children }) {
    // Inisialisasi state sidebar dari localStorage, atau default berdasarkan ukuran layar
    const [sidebarOpen, setSidebarOpen] = useState(() => {
        const savedState =
            typeof window !== "undefined"
                ? localStorage.getItem("sidebarOpen")
                : null;
        if (savedState !== null) {
            return JSON.parse(savedState);
        }
        // Default jika tidak ada state tersimpan
        return typeof window !== "undefined" ? window.innerWidth >= 768 : false;
    });

    // useEffect untuk menyimpan state sidebar ke localStorage setiap kali berubah
    useEffect(() => {
        if (typeof window !== "undefined") {
            localStorage.setItem("sidebarOpen", JSON.stringify(sidebarOpen));
        }
    }, [sidebarOpen]);

    const sidebarNavItems = [
        {
            name: "Dashboard",
            href: route("pengelola.dashboard"),
            icon: <LayoutGrid />,
            current: route().current("pengelola.dashboard"),
        },
        {
            name: "Tenda",
            href: route("pengelola.tenda.index"),
            icon: <File />,
            current: route().current("pengelola.tenda.*"),
        },
        {
            name: "Penyewaan",
            href: "#",
            icon: <ListOrdered />,
            current: route().current("pengelola.penyewaan.*"),
        },
        {
            name: "Penjadwalan",
            href: "#",
            icon: <CalendarDays />,
            current: route().current("pengelola.jadwal.*"),
        },
    ];

    return (
        <div className="min-h-screen bg-gray-100">
            <Head />
            {/* Top Navbar - Selalu Visible dan Fixed */}
            <nav className="bg-nav-footer  fixed top-0 left-0 right-0 z-30 h-16 flex items-center">
                <div className="w-full max-w-full mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-full">
                        <div className="flex items-center">
                            <button
                                id="sidebar-hamburger-toggle"
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className="p-2 rounded-md text-gray-600 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500 mr-3"
                            >
                                {sidebarOpen ? (
                                    <X className="h-6 w-6" />
                                ) : (
                                    <Menu className="h-6 w-6" />
                                )}
                            </button>
                            <Link
                                href={route("welcome")}
                                className="flex items-center"
                            >
                                <img
                                    src="/images/logo.png"
                                    alt="PMAQ Tenda Logo"
                                    className="h-8"
                                />
                            </Link>
                        </div>
                        <div className="flex items-center">
                            <span className="text-sm font-medium text-gray-700 mr-2 hidden sm:block">
                                Pengelola
                            </span>
                            <div className="p-1 bg-gray-200 rounded-full">
                                <UserCircle className="w-8 h-8 text-gray-600" />
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Container untuk Sidebar dan Konten Utama */}
            <div className="flex pt-16">
                {/* Sidebar */}
                <aside
                    className={`fixed inset-y-0 left-0 z-20 w-64 bg-sidebar p-4 transform ${
                        sidebarOpen ? "translate-x-0" : "-translate-x-full"
                    } transition-transform duration-300 ease-in-out flex flex-col pt-16`}
                >
                    <nav className="flex-grow space-y-1.5 mt-4">
                        {sidebarNavItems.map((item) => (
                            <NavLink
                                key={item.name}
                                href={item.href}
                                active={item.current}
                                icon={item.icon}
                            >
                                {item.name}
                            </NavLink>
                        ))}
                    </nav>
                    <div className="mt-auto pt-4">
                        <LogoutLink href={route("logout")} icon={<LogOut />}>
                            Logout
                        </LogoutLink>
                    </div>
                </aside>

                {/* Main Content Area */}
                <div
                    className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ease-in-out ${
                        sidebarOpen ? "ml-64" : "ml-0"
                    }`}
                >
                    {header && (
                        <header className="bg-white shadow-sm border-b border-gray-200">
                            <div className="max-w-full py-4 px-4 sm:px-6 lg:px-8">
                                {header}
                            </div>
                        </header>
                    )}
                    <main className="flex-1 overflow-y-auto p-6 bg-white flex">
                        <div className="w-full my-auto">{children}</div>
                    </main>
                    <footer className="bg-nav-footer border-t py-4 text-center text-sm text-dark-gray">
                        &copy; All Rights Reserved By PMAQ Tenda{" "}
                        {new Date().getFullYear()}. All Rights Reserved By PMAQ Tenda
                    </footer>
                </div>
            </div>
        </div>
    );
}
