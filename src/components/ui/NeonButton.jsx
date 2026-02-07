export default function NeonButton({ onClick, children, className = '' }) {
  return (
    <button className={`btn ${className}`} onClick={onClick}>
      {children}
    </button>
  )
}
