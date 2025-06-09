import React from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import Button from '@/Components/Button';
import InputError from '@/Components/InputError';


export default function CekForm({ auth }) {
    const { props } = usePage();
    const penyewaanError =
        props.errors?.id_penyewaan_cek || props.flash?.penyewaan_check_error;
    const initialSearchedId = props.flash?.searched_penyewaan_id || "";

    const { data, setData, post, processing, errors, clearErrors } = useForm({
        id_penyewaan_cek: initialSearchedId,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        clearErrors();
        post(route("penyewaan.check.process"));
    };

    return (
        <>
            <Head title="Cek Penyewaan" />
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
                    <Navbar auth={auth} />
                </div>

                <main className="flex-grow pt-24 pb-12">
                    <div className="container mx-auto px-4 max-w-lg">
                        <div className="text-center mb-8">
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                                Cek Penyewaan Tenda
                            </h1>
                            <p className="text-gray-600 mt-2 text-sm">
                                Masukkan ID Penyewaan untuk melihat penyewaan
                                anda
                            </p>
                        </div>
                        <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg">
                            <form
                                onSubmit={handleSubmit}
                                className="space-y-4 mb-6"
                            >
                                <div>
                                    <InputLabel
                                        htmlFor="id_penyewaan_cek"
                                        value="ID Penyewaan"
                                        className="text-sm font-medium text-gray-700 mb-1"
                                    />
                                    <TextInput
                                        id="id_penyewaan_cek"
                                        name="id_penyewaan_cek"
                                        value={data.id_penyewaan_cek}
                                        onChange={(e) =>
                                            setData(
                                                "id_penyewaan_cek",
                                                e.target.value.toUpperCase()
                                            )
                                        }
                                        className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 py-3 px-4"
                                        placeholder="Masukkan ID Penyewaan Anda"
                                        required
                                        autoFocus
                                    />
                                    <InputError
                                        message={
                                            errors.id_penyewaan_cek ||
                                            penyewaanError
                                        }
                                        className="mt-1 text-xs"
                                    />
                                    <div className="text-right mt-1.5">
                                        <Link
                                            href={route(
                                                "penyewaan.lupa_id.form"
                                            )}
                                            className="text-xs text-green-600 hover:text-green-800 hover:underline"
                                        >
                                            Lupa ID Penyewaan?
                                        </Link>
                                    </div>
                                </div>
                                <div className="pt-2 flex justify-center">
                                    <Button
                                        type="submit"
                                        className=""
                                        disabled={processing}
                                        variant="secondary"
                                    >
                                        {processing ? "Mencari..." : "Cari"}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        </>
    );
}
