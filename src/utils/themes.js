export const LEVEL_THEMES = [
  { name: 'Cyan/Klasik',      primary: '#00ffc8', secondary: '#00b4ff', rgb: '0,255,200' },
  { name: 'Mor/Mystik',       primary: '#c850ff', secondary: '#ff00ff', rgb: '200,80,255' },
  { name: 'Turuncu/Ateş',     primary: '#ff6020', secondary: '#ff4040', rgb: '255,96,32' },
  { name: 'Yeşil/Matrix',     primary: '#00ff00', secondary: '#00ff88', rgb: '0,255,0' },
  { name: 'Pembe/Synthwave',  primary: '#ff6090', secondary: '#ff00aa', rgb: '255,96,144' },
  { name: 'Altın/Efsane',     primary: '#ffe600', secondary: '#ffaa00', rgb: '255,230,0' },
  { name: 'Buz/Fırtına',      primary: '#00d4ff', secondary: '#0088ff', rgb: '0,212,255' },
  { name: 'Kan/Cehennem',     primary: '#ff2020', secondary: '#ff0060', rgb: '255,32,32' },
  { name: 'Plazma/Nebula',    primary: '#bf40ff', secondary: '#4040ff', rgb: '191,64,255' },
  { name: 'Rainbow/Kaos',     primary: '#00ffc8', secondary: '#c850ff', rgb: '0,255,200', rainbow: true },
]

export function getThemeForLevel(level) {
  const index = Math.min(level - 1, LEVEL_THEMES.length - 1)
  return { theme: LEVEL_THEMES[index], index }
}
