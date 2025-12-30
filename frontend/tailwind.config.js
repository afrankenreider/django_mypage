/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                display: ['Space Grotesk', 'system-ui', 'sans-serif'],
                mono: ['JetBrains Mono', 'Menlo', 'monospace'],
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
                // Premium accent colors
                accent: {
                    50: '#eef2ff',
                    100: '#e0e7ff',
                    200: '#c7d2fe',
                    300: '#a5b4fc',
                    400: '#818cf8',
                    500: '#6366f1',
                    600: '#4f46e5',
                    700: '#4338ca',
                    800: '#3730a3',
                    900: '#312e81',
                },
            },
            animation: {
                'fade-in': 'fadeIn 0.8s ease-out',
                'fade-in-up': 'fadeInUp 0.8s ease-out',
                'fade-in-down': 'fadeInDown 0.8s ease-out',
                'scale-in': 'scaleIn 0.5s ease-out',
                'slide-in-right': 'slideInRight 0.6s ease-out',
                'slide-in-left': 'slideInLeft 0.6s ease-out',
                'slide-up': 'slideUp 0.5s ease-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                fadeInUp: {
                    '0%': { opacity: '0', transform: 'translateY(30px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                fadeInDown: {
                    '0%': { opacity: '0', transform: 'translateY(-30px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                scaleIn: {
                    '0%': { opacity: '0', transform: 'scale(0.9)' },
                    '100%': { opacity: '1', transform: 'scale(1)' },
                },
                slideInRight: {
                    '0%': { opacity: '0', transform: 'translateX(30px)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' },
                },
                slideInLeft: {
                    '0%': { opacity: '0', transform: 'translateX(-30px)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' },
                },
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
            },
        },
    },
    plugins: [],
}
