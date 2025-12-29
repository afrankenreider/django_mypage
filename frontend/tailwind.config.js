/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                display: ['Poppins', 'system-ui', 'sans-serif'],
            },
            colors: {
                // Fall/Lake Tahoe inspired palette
                primary: {
                    50: '#fdf8f3',
                    100: '#faeee1',
                    200: '#f5d9be',
                    300: '#eec092',
                    400: '#e5a05f',
                    500: '#dc8239',
                    600: '#c96a2e',
                    700: '#a75228',
                    800: '#864327',
                    900: '#6d3923',
                },
                forest: {
                    50: '#f3f6f4',
                    100: '#e1eae3',
                    200: '#c5d6c9',
                    300: '#9db9a4',
                    400: '#71967b',
                    500: '#517a5c',
                    600: '#3e6148',
                    700: '#334e3b',
                    800: '#2b4032',
                    900: '#24352a',
                },
                lake: {
                    50: '#f0f7fa',
                    100: '#d9edf4',
                    200: '#b8dce9',
                    300: '#87c4d9',
                    400: '#4fa3c1',
                    500: '#3488a6',
                    600: '#2d6d8c',
                    700: '#2a5a73',
                    800: '#294c60',
                    900: '#264051',
                },
                earth: {
                    50: '#f9f7f5',
                    100: '#f0ebe5',
                    200: '#e0d5c9',
                    300: '#cdb9a6',
                    400: '#b79880',
                    500: '#a78066',
                    600: '#9a6f59',
                    700: '#805a4b',
                    800: '#694b41',
                    900: '#564037',
                },
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-in-out',
                'slide-up': 'slideUp 0.5s ease-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
            },
        },
    },
    plugins: [],
}
