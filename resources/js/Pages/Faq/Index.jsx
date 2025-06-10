import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import { ChevronDown, Phone, MapPin } from 'lucide-react';

const FaqItem = ({ faq }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-gray-200 py-4">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center text-left text-gray-800 focus:outline-none"
            >
                <span className="font-semibold text-md">{faq.question}</span>
                <ChevronDown
                    className={`h-5 w-5 text-gray-500 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>
            <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-screen mt-3' : 'max-h-0'}`}
            >
                <p className="text-gray-600 leading-relaxed">
                    {faq.answer}
                </p>
            </div>
        </div>
    );
};


export default function FaqPage({ auth, faqs }) {
    return (
        <>
            <Head title="FAQ - Pertanyaan Umum" />
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
                    <Navbar auth={auth} />
                </div>

                <main className="flex-grow pt-24 pb-12">
                    <div className="container mx-auto px-4 max-w-3xl">
                        
                        <div className="text-center mb-12">
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                                Pertanyaan yang Sering Diajukan (FAQ)
                            </h1>
                            <p className="text-gray-600 mt-3 max-w-xl mx-auto">
                                Temukan jawaban untuk pertanyaan umum seputar layanan penyewaan tenda kami. Jika Anda tidak menemukan jawaban di sini, jangan ragu untuk menghubungi kami.
                            </p>
                        </div>
                        
                        <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg">
                            {faqs.map((faq, index) => (
                                <FaqItem key={index} faq={faq} />
                            ))}
                        </div>

                        <div className="mt-12 text-center border-t pt-10">
                            <h2 className="text-xl font-semibold text-gray-800">Masih Punya Pertanyaan?</h2>
                            <p className="mt-3 text-gray-600 max-w-xl mx-auto">
                                Untuk pertanyaan lainnya, silakan hubungi kami di nomor telepon atau kunjungi kami langsung di alamat berikut:
                            </p>
                            <div className="mt-6 flex flex-col md:flex-row justify-center items-center gap-6 md:gap-10 text-gray-700">
                                <div className="flex items-center">
                                    <Phone className="h-5 w-5 mr-2 text-green-600" />
                                    <a href="tel:081234567890" className="font-medium hover:underline hover:text-green-700">
                                        0812-3456-7890
                                    </a>
                                </div>
                                <div className="flex items-center text-left">
                                    <MapPin className="h-5 w-5 mr-2 text-green-600 flex-shrink-0" />
                                    <p>
                                        Kotesan Kidul, Kotesan, Kec. Prambanan,
                                        <br className="hidden sm:block" />
                                        Kab. Klaten, Jawa Tengah 57454
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
                
                <Footer />
            </div>
        </>
    );
}