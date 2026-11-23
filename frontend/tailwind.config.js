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
            /*
             * Semantic colors resolve to tokens in src/index.css. The
             * color-mix wrapper keeps opacity modifiers (bg-well/50) working.
             */
            colors: Object.fromEntries(
                Object.entries({
                    ink: '--text-primary',
                    body: '--text-body',
                    muted: '--text-secondary',
                    page: '--page-bg',
                    control: '--control-border',
                    surface: '--surface-strong',
                    well: '--well',
                    line: '--line',
                    hover: '--hover',
                    signal: '--signal',
                    'signal-ink': '--signal-ink',
                    'signal-hover': '--signal-hover',
                    fairway: '--data-teal',
                    river: '--data-blue',
                    aspen: '--accent',
                    negative: '--negative',
                    spruce: '--band-bg',
                }).map(([name, token]) => [
                    name,
                    `color-mix(in oklab, var(${token}) calc(<alpha-value> * 100%), transparent)`,
                ]),
            ),
            fontFamily: {
                sans: ['system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
                display: ['"Young Serif"', 'Georgia', '"Times New Roman"', 'serif'],
                mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
            },
        },
    },
    plugins: [],
}
