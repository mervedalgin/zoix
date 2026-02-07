export default function StatRow({ label, value, children, className = '' }) {
  return (
    <div className={`stat-row ${className}`}>
      <span className="stat-label">{label}</span>
      {children || <span className="stat-val">{value}</span>}
    </div>
  )
}
