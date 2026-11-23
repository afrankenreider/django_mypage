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
    ink: '21, 34, 26',
    muted: '86, 101, 91',
    grid: '21, 34, 26',
    signal: '169, 68, 26',
    teal: '46, 106, 60',
    blue: '51, 98, 125',
    amber: '138, 100, 8',
  },
  dark: {
    ink: '238, 242, 234',
    muted: '159, 177, 164',
    grid: '238, 242, 234',
    signal: '238, 139, 85',
    teal: '134, 196, 147',
    blue: '147, 189, 214',
    amber: '226, 181, 74',
  },
}
