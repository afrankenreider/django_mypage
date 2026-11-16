/*
 * The dark variant follows the computed color scheme instead of a
 * JS-applied class: the OS preference, unless the header toggle has pinned
 * a scheme through <meta name="color-scheme"> (see src/index.css).
 */
const pinned = (scheme) =>
    `:root:has(> head > meta[name="color-scheme"][content="${scheme}"])`

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: [
        'variant',
        [
            `@media (prefers-color-scheme: dark) { &:not(${pinned('light')} *) }`,
            `&:is(${pinned('dark')} *)`,
        ],
    ],
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                ink: 'var(--text-primary)',
                body: 'var(--text-body)',
                muted: 'var(--text-secondary)',
                page: 'var(--page-bg)',
                control: 'var(--control-border)',
            },
            fontFamily: {
                sans: ['system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
                display: ['system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
                mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
            },
        },
    },
    plugins: [],
}
