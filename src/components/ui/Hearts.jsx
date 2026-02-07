import useGameStore from '../../stores/gameStore'

export default function Hearts() {
  const lives = useGameStore(s => s.lives)

  return (
    <div className="hearts">
      {[1, 2, 3].map(i => (
        <span
          key={i}
          className={`heart ${i > lives ? 'lost' : ''}`}
        >
          ❤️
        </span>
      ))}
    </div>
  )
}
