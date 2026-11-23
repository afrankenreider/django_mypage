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
    ink: '25, 27, 26',
    muted: '95, 101, 97',
    grid: '25, 27, 26',
    signal: '168, 81, 44',
    teal: '79, 107, 88',
    blue: '76, 99, 144',
    amber: '138, 95, 12',
  },
  dark: {
    ink: '242, 240, 234',
    muted: '163, 162, 154',
    grid: '242, 240, 234',
    signal: '226, 147, 106',
    teal: '163, 191, 168',
    blue: '174, 189, 227',
    amber: '238, 192, 122',
  },
}
