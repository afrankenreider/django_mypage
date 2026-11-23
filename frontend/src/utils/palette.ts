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
    ink: '46, 64, 66',
    muted: '92, 106, 104',
    grid: '46, 64, 66',
    signal: '173, 85, 36',
    teal: '79, 107, 88',
    blue: '76, 99, 144',
    amber: '138, 95, 12',
  },
  dark: {
    ink: '246, 242, 228',
    muted: '169, 176, 168',
    grid: '246, 242, 228',
    signal: '232, 150, 95',
    teal: '163, 191, 168',
    blue: '174, 189, 227',
    amber: '238, 192, 122',
  },
}
