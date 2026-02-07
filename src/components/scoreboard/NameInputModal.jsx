import { useState, useRef, useEffect } from 'react'
import useGameStore from '../../stores/gameStore'
import { submitScore } from '../../services/scoreService'
import { formatScore, isMobile } from '../../utils/helpers'
import { MAX_NAME_LENGTH } from '../../utils/constants'
import { checkProfanity } from '../../utils/profanityFilter'

export default function NameInputModal({ visible, score, onClose, onSubmitted }) {
  const [name, setName] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [warning, setWarning] = useState('')
  const inputRef = useRef(null)

  const lines = useGameStore(s => s.lines)
  const level = useGameStore(s => s.level)
  const lives = useGameStore(s => s.lives)
  const powerUpsUsed = useGameStore(s => s.powerUpsUsed)
  const gameStartTime = useGameStore(s => s.gameStartTime)

  useEffect(() => {
    if (visible && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 100)
    }
    if (visible) setWarning('')
  }, [visible])

  if (!visible) return null

  const handleNameChange = (e) => {
    const val = e.target.value.toUpperCase()
    setName(val)
    if (warning) setWarning('')
  }

  const handleSubmit = async () => {
    if (submitting) return

    const playerName = name.trim() || 'OYUNCU'
    const { clean } = checkProfanity(playerName)

    if (!clean) {
      setWarning('Uygunsuz isim! Lütfen farklı bir isim girin.')
      return
    }

    setSubmitting(true)
    const duration = gameStartTime ? Math.floor((Date.now() - gameStartTime) / 1000) : 0
    const device = isMobile() ? 'mobile' : 'desktop'

    await submitScore({
      username: playerName,
      score,
      lines,
      level,
      lives,
      powerUpsUsed,
      duration,
      device,
    })

    setSubmitting(false)
    setName('')
    onSubmitted(playerName, score)
    onClose()
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSubmit()
  }

  return (
    <div className="name-modal">
      <div className="name-modal-box">
        <div className="sb-scanlines" />
        <span className="modal-crown">👑</span>
        <h2>YENİ REKOR!</h2>
        <div className="modal-score">{formatScore(score)}</div>
        <p>Adını gir, efsane!</p>
        <input
          ref={inputRef}
          type="text"
          className="name-input"
          maxLength={MAX_NAME_LENGTH}
          placeholder="İSİM"
          value={name}
          onChange={handleNameChange}
          onKeyDown={handleKeyDown}
        />
        {warning && <div className="name-warning">{warning}</div>}
        <br />
        <button
          className="btn"
          onClick={handleSubmit}
          disabled={submitting}
          style={{ marginTop: '14px', position: 'relative', zIndex: 3 }}
        >
          {submitting ? 'KAYDEDİLİYOR...' : 'KAYDET'}
        </button>
      </div>
    </div>
  )
}
