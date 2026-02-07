export default function Footer() {
  const text = 'DUMLUPINAR İLKOKULU 4A SINIFI TARAFINDAN GELİŞTİRİLMİŞTİR'

  return (
    <footer className="footer-marquee">
      <div className="marquee-track">
        {[0, 1].map(i => (
          <div className="marquee-content" key={i}>
            <span className="pixel-star" />
            <span>{text}</span>
            <span className="pixel-star" />
            <span>{text}</span>
            <span className="pixel-star" />
            <span>{text}</span>
            <span className="pixel-star" />
            <span>{text}</span>
            <span className="pixel-star" />
          </div>
        ))}
      </div>
    </footer>
  )
}
