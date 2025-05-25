// resources/js/Layouts/GuestLayout.jsx (Contoh)
export default function Guest({ children }) {
    return (
        <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-bg-login">
            <div className="w-full sm:max-w-md mt-6 mb-6">
                {children}
            </div>
        </div>
    );
}