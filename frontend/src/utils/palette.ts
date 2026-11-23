/**
 * Data colors for canvas drawing, mirroring the tokens in index.css.
 * Canvas cannot resolve CSS custom properties that use light-dark(), so
 * the raw values live here too. Keep both in sync.
 */
export interface DataPalette {
  ink: string
  muted: string
  grid: string
  signal: string
  teal: string
  blue: string
  amber: string
}

export const DATA_PALETTE: Record<'light' | 'dark', DataPalette> = {
  light: {
    ink: '29, 29, 31',
    muted: '110, 110, 115',
    grid: '29, 29, 31',
    signal: '194, 64, 29',
    teal: '14, 122, 107',
    blue: '47, 86, 200',
    amber: '161, 98, 7',
  },
  dark: {
    ink: '245, 245, 247',
    muted: '161, 161, 166',
    grid: '245, 245, 247',
    signal: '255, 129, 89',
    teal: '63, 208, 185',
    blue: '142, 170, 255',
    amber: '234, 179, 8',
  },
}
