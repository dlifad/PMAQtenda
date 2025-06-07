import React from 'react';
import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ links }) {
    if (!links || links.length <= 3) {
        return null;
    }

    return (
        <div className="flex items-center justify-between mt-6">
            <div className="flex-1 flex justify-between sm:hidden">
                {links[0].url ? (
                    <Link href={links[0].url} className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                        Previous
                    </Link>
                ) : (
                    <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-400 bg-gray-50 cursor-not-allowed">
                        Previous
                    </span>
                )}
                {links[links.length - 1].url ? (
                    <Link href={links[links.length - 1].url} className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                        Next
                    </Link>
                ) : (
                    <span className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-400 bg-gray-50 cursor-not-allowed">
                        Next
                    </span>
                )}
            </div>

            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-center">
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    {links.map((link, index) => {
                        const isFirst = index === 0;
                        const isLast = index === links.length - 1;
                        const isPageNumber = !isFirst && !isLast;

                        return (
                            <Link
                                key={`pagination-${index}`}
                                href={link.url || '#'}
                                preserveScroll
                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium
                                    ${link.active ? 'z-10 bg-green-50 border-green-500 text-green-600' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'}
                                    ${isFirst ? 'rounded-l-md' : ''}
                                    ${isLast ? 'rounded-r-md' : ''}
                                    ${!link.url ? 'bg-gray-100 cursor-not-allowed text-gray-400' : 'hover:bg-gray-50'}
                                `}
                                disabled={!link.url}
                                as={!link.url ? 'span' : 'a'}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        );
                    })}
                </nav>
            </div>
        </div>
    );
}

