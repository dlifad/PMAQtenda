import React from "react";

export default function Footer() {
    return (
        <footer id="footer" className="bg-nav-footer text-dark-grey py-8 mt-12">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between">
                    <div className="ml-8 mb-6 md:mb-0">
                        <img
                            src="/images/logo.png"
                            alt="PMAQ Tenda Logo"
                            className="h-16  mb-4"
                        />
                        <p className="">
                            Paguyuban Mushola <br />
                            Al Qomariah Kotesan
                        </p>
                    </div>

                    <div className="mb-6 md:mb-0">
                        <h3 className="font-bold mb-4">Lokasi:</h3>
                        <div className="w-full h-40 rounded-lg overflow-hidden">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d492.9088087290404!2d110.51007031791279!3d-7.760746225019841!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a5acf797229db%3A0xdca2968db3ae9075!2sMushola%20Al%20Qomariyah!5e1!3m2!1sid!2sid!4v1747842878030!5m2!1sid!2sid"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            />
                        </div>
                    </div>
                    <div className="mr-8">
                        <h3 className="font-bold mb-4">Kontak:</h3>
                        <p className="mb-2">
                            0812-3456-7890
                        </p>
                        <p className="mb-2">
                            Kotesan Kidul, Kotesan, <br />
                            Kec. Prambanan, Kab. Klaten <br />
                            Prov. Jawa Tengah 57454
                        </p>
                    </div>
                </div>
            </div>
            <div className="mt-8 text-center">
                <p className="font-bold">
                    &copy; Copyright {new Date().getFullYear()}. All Rights
                    Reserved By PMAQ Tenda
                </p>
            </div>
        </footer>
    );
}
