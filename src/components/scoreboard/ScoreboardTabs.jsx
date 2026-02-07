const TABS = [
  { key: 'daily', label: 'GÜNLÜK' },
  { key: 'weekly', label: 'HAFTALIK' },
  { key: 'alltime', label: 'TÜM ZAMANLAR' },
]

export default function ScoreboardTabs({ active, onChange }) {
  return (
    <div className="sb-tabs">
      {TABS.map(tab => (
        <button
          key={tab.key}
          className={`sb-tab${active === tab.key ? ' active' : ''}`}
          onClick={() => onChange(tab.key)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
