// Hex mirrors of the design tokens in index.css, for places that need raw
// colour values (Recharts, SVG fills, inline styles). Keep in sync.

export const palette = {
  void950: '#03050a',
  void900: '#060a14',
  void850: '#0a1120',
  void800: '#0f192e',
  void700: '#16233d',
  edge: '#1a3a63',
  edgeStrong: '#2b5a92',

  frost50: '#f0f7ff',
  frost200: '#c3d8f0',
  frost400: '#7e95b4',
  frost500: '#5b6f8c',
  frost600: '#42526b',

  system: '#4aaeff',
  systemDeep: '#1e90ff',
  systemSoft: '#7cc4ff',
  shadow: '#9b6bff',
  penalty: '#ff4d5e',
  clear: '#34d99c',
  gold: '#ffc233',
  ember: '#ff8a3d',
}

// Ordered categorical series for multi-series charts.
export const seriesColors = [
  palette.system,
  palette.shadow,
  palette.clear,
  palette.gold,
  palette.penalty,
  palette.ember,
  palette.systemSoft,
]

// Hunter rank colours (E → S).
export const rankColors = {
  E: palette.frost400,
  D: palette.clear,
  C: palette.system,
  B: palette.shadow,
  A: palette.ember,
  S: palette.gold,
}

// Shared Recharts styling so every chart reads like a System readout.
export const chartTheme = {
  grid: { stroke: palette.edge, strokeOpacity: 0.5, strokeDasharray: '2 4', vertical: false },
  axis: {
    tick: { fill: palette.frost500, fontSize: 11, fontFamily: 'JetBrains Mono, monospace' },
    tickLine: false,
    axisLine: { stroke: palette.edge },
  },
  tooltip: {
    contentStyle: {
      background: 'rgba(6, 10, 20, 0.95)',
      border: `1px solid ${palette.system}`,
      borderRadius: 2,
      color: palette.frost200,
      fontSize: 12,
      fontFamily: 'JetBrains Mono, monospace',
      boxShadow: '0 0 20px rgba(30,144,255,0.25)',
    },
    labelStyle: { color: palette.frost50, fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' },
    itemStyle: { color: palette.frost200 },
    cursor: { fill: 'rgba(74,174,255,0.06)', stroke: palette.edgeStrong },
  },
}
