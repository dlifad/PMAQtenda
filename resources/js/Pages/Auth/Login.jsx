import Checkbox from "@/Components/Checkbox";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import Button from "@/Components/Button";
import TextInput from "@/Components/TextInput";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { useEffect } from "react";

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset("password");
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route("login"));
    };

    return (
        <GuestLayout>
            <Head title="Log in - PMAQ Tenda" />

            <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-xl rounded-lg border border-dark-gray">
                <h2 className="text-3xl font-bold text-center text-dark-gray">
                    Login
                </h2>
                <hr className="my-4 -mx-8 border-t border-dark-gray" />
                <div className="flex justify-center">
                    <img
                        src="/images/logo.png"
                        alt="PMAQ Tenda Logo"
                        className="h-10 sm:h-12"
                    />
                </div>

                {status && (
                    <div className="mb-4 text-sm font-medium text-green-600">
                        {status}
                    </div>
                )}

                <form onSubmit={submit} className="space-y-6">
                    <div>
                        <InputLabel
                            htmlFor="email"
                            value="Email"
                            className="text-sm font-medium dark-gray"
                        />
                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-sec-color focus:border-teal-500 sm:text-sm"
                            autoComplete="username"
                            isFocused={true}
                            onChange={(e) => setData("email", e.target.value)}
                            placeholder="Masukkan alamat email Anda"
                        />
                        <InputError
                            message={errors.email}
                            className="mt-2 text-sm text-red-600"
                        />
                    </div>

                    <div>
                        <InputLabel
                            htmlFor="password"
                            value="Password"
                            className="text-sm font-medium text-dark-gray"
                        />
                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-sec-color focus:border-sec-color sm:text-sm"
                            autoComplete="current-password"
                            onChange={(e) =>
                                setData("password", e.target.value)
                            }
                            placeholder="Masukkan password Anda"
                        />
                        <InputError
                            message={errors.password}
                            className="mt-2 text-sm text-red-600"
                        />
                    </div>

                    <div>
                        <Button
                            type="submit"
                            variant="secondary"
                            className="w-full flex justify-center"
                            disabled={processing}
                        >
                            Login
                        </Button>
                    </div>
                </form>
            </div>
        </GuestLayout>
    );
}
