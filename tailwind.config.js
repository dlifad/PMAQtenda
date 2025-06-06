import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Poppins', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                'pmaq-green': {
                    DEFAULT: '#146d4d',
                    light: '#1a8961',
                    dark: '#0e513a',
                },
                'sec-color' : '#2E7D32',
                'nav-footer': '#C4E0C3',
                'sidebar': '#C8E6C9',
                'bg-login': '#C4E0C3',
                'bg-card': '#F5F5F5',
                'color-line' : '#88D4AB',
                'dark-gray': '#2E2E2E',
                'dark-gray-hover': '#4A4A4A',
            },
        textColor: {
            'status-menunggu': '#FFA500',     
            'status-terjadwal': '#0D6EFD',
            'status-berlangsung': '#6F42C1', 
            'status-selesai': '#198754',
            'status-ditolak': '#DC3545',
            'status-dibatalkan': '#DC3545',
      },
        },
    },

    plugins: [forms],
};
