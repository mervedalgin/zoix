# 🎮 ZOIX — React + Supabase Migrasyon Planı

## 1. Proje Özeti

**Mevcut Durum:** Tek dosyalık HTML/CSS/JS (~2860 satır) Tetris oyunu
**Hedef:** React (Vite) + Supabase altyapılı, global skor tablosu olan modern web uygulaması

### Mevcut Oyun Özellikleri

| Özellik | Açıklama |
|---------|----------|
| Çekirdek Mekanik | 10×20 grid, 7 tetromino, wall-kick döndürme, ghost piece, hard/soft drop |
| Skor Sistemi | Satır puanları (100/300/500/800) × seviye, soft drop +1, hard drop +2/hücre |
| Seviye Sistemi | Her 10 satırda seviye atlama, hız: 500ms → min 50ms |
| Can Sistemi | 3 kalp, can kaybında board sıfırlama |
| Power-Up Sistemi | Her 500 puanda rastgele: Bomba, Kalkan, Satır Silici |
| Dinamik Arka Plan | 7 seviye teması, parçacık sistemi, gökkuşağı modu (lv7+) |
| Skor Tablosu | localStorage, top 5, isim girişi (max 8 karakter) |
| Görsel Efektler | Neon bloklar, scanline, grid animasyonu, glitch başlık, pixel dekorları |
| Mobil Destek | Gamepad tarzı butonlar, canvas swipe, responsive layout |

---

## 2. Teknoloji Yığını

```
React 18+ (Vite)
├── Tailwind CSS 4          → Stil ve responsive tasarım
├── Framer Motion           → UI animasyonları ve geçişler
├── @supabase/supabase-js   → Veritabanı ve realtime
├── zustand                 → Oyun state yönetimi
├── react-hot-toast         → Bildirimler
└── lucide-react            → İkonlar
```

---

## 3. Klasör Yapısı

```
zoix/
├── public/
│   └── fonts/                    # Orbitron, Share Tech Mono
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── index.css                 # Tailwind + global stiller
│   │
│   ├── config/
│   │   └── supabase.js           # Supabase client init
│   │
│   ├── stores/
│   │   └── gameStore.js          # Zustand: oyun state
│   │
│   ├── hooks/
│   │   ├── useGameLoop.js        # requestAnimationFrame döngüsü
│   │   ├── useKeyboard.js        # Klavye input handler
│   │   ├── useTouch.js           # Mobil dokunmatik kontroller
│   │   └── useResponsive.js      # Canvas boyutlandırma
│   │
│   ├── engine/
│   │   ├── board.js              # createBoard, clearLines, valid, lock
│   │   ├── pieces.js             # PIECES, randomPiece, rotate, wallKick
│   │   ├── scoring.js            # Puan hesaplama, seviye geçişi
│   │   ├── powerups.js           # Bomb, shield, cleaner mantığı
│   │   └── renderer.js           # Canvas çizim fonksiyonları
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── GameWrapper.jsx       # Ana düzen (flex, responsive)
│   │   │   ├── MainPanel.jsx         # Board + overlay'ler
│   │   │   ├── SidePanel.jsx         # Skor, sıradaki, kontroller
│   │   │   └── Footer.jsx            # Marquee kayan yazı
│   │   │
│   │   ├── game/
│   │   │   ├── GameCanvas.jsx        # Ana oyun canvas'ı
│   │   │   ├── NextPieceCanvas.jsx   # Sıradaki parça
│   │   │   ├── MobileControls.jsx    # Mobil gamepad butonları
│   │   │   └── PowerIndicator.jsx    # Kalkan göstergesi
│   │   │
│   │   ├── overlays/
│   │   │   ├── StartScreen.jsx       # Başlangıç (pixel burst efekti)
│   │   │   ├── PauseScreen.jsx       # Duraklat overlay
│   │   │   └── GameOverScreen.jsx    # Oyun sonu
│   │   │
│   │   ├── scoreboard/
│   │   │   ├── Scoreboard.jsx        # Ana skor tablosu container
│   │   │   ├── ScoreEntry.jsx        # Tek skor satırı
│   │   │   ├── ScoreboardTabs.jsx    # Günlük / Haftalık / Tüm Zamanlar
│   │   │   ├── LiveFeed.jsx          # Realtime yeni skor bildirimleri
│   │   │   └── NameInputModal.jsx    # İsim giriş modalı
│   │   │
│   │   ├── ui/
│   │   │   ├── Hearts.jsx            # Can kalpleri
│   │   │   ├── StatRow.jsx           # Bilgi satırı
│   │   │   ├── NeonButton.jsx        # Ortak buton
│   │   │   └── GlitchTitle.jsx       # ZOIX başlık
│   │   │
│   │   └── effects/
│   │       ├── ParticleBackground.jsx
│   │       ├── PulseOverlay.jsx
│   │       ├── AnimatedGrid.jsx
│   │       └── ScanlineOverlay.jsx
│   │
│   ├── services/
│   │   ├── scoreService.js     # Supabase skor CRUD
│   │   └── playerService.js    # Anonim oyuncu yönetimi
│   │
│   ├── utils/
│   │   ├── themes.js           # LEVEL_THEMES + renk yardımcıları
│   │   ├── constants.js        # COLS, ROWS, BLOCK, hız formülleri
│   │   └── helpers.js          # hslToRgb, formatScore vb.
│   │
│   └── styles/
│       ├── animations.css      # Keyframe animasyonları
│       └── neon.css            # Neon glow, glitch efektleri
│
├── supabase/
│   └── migrations/
│       ├── 001_create_scores.sql
│       └── 002_create_rls_and_functions.sql
│
├── .env.local
├── tailwind.config.js
├── vite.config.js
└── package.json
```

---

## 4. Oyuncu Kimlik Stratejisi (Sadeleştirilmiş)

Tam auth sistemi yok. İki basit mod:

### Mod 1 — Misafir (Varsayılan)

Oyuncu hiçbir giriş yapmadan oynar. Skor `localStorage`'a kaydedilir. Scoreboard'da sadece yerel veriler görünür.

### Mod 2 — Anonim Kayıt (Skor Kaydetme Anında)

Oyuncu yüksek skor yaptığında isim giriş modalı açılır. "KAYDET" butonuna bastığında:

1. Arka planda `supabase.auth.signInAnonymously()` çağrılır
2. Kullanıcıya bir `anon_id` atanır ve `localStorage`'a saklanır
3. Skor, bu `anon_id` ile DB'ye yazılır
4. Sonraki oyunlarda aynı `anon_id` tekrar kullanılır (cihaz bazlı süreklilik)

```javascript
// services/playerService.js
async function getOrCreatePlayer() {
  const { data } = await supabase.auth.getSession();
  if (data.session) return data.session.user.id;

  const { data: anonData, error } = await supabase.auth.signInAnonymously();
  if (error) return null;
  return anonData.user.id;
}
```

### Akış Diyagramı

```
Oyun Başla → Oyna (giriş gerekmez)
     │
     ▼
Oyun Bitti → Skor yüksek mi?
     │               │
    Hayır            Evet
     │               │
     ▼               ▼
  localStorage    İsim Giriş Modalı
  kaydet          ┌─────────────────┐
                  │  👑 YENİ REKOR! │
                  │    12,450       │
                  │  [__İSİM___]    │
                  │  [KAYDET]       │
                  └─────────────────┘
                         │
                         ▼
                  signInAnonymously()
                  → Supabase'e skor yaz
                  → Global scoreboard'da görün
```

---

## 5. Supabase Veritabanı Tasarımı

### 5.1 Tablo: `scores` (Tek Tablo)

```sql
CREATE TABLE scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID NOT NULL,               -- anonim auth user id
  username TEXT NOT NULL,                 -- max 8 karakter, büyük harf
  score BIGINT NOT NULL,
  lines_cleared INTEGER NOT NULL,
  level_reached INTEGER NOT NULL,
  lives_remaining INTEGER DEFAULT 0,
  power_ups_used INTEGER DEFAULT 0,
  game_duration_seconds INTEGER,
  device TEXT DEFAULT 'desktop',          -- desktop | mobile
  played_at TIMESTAMPTZ DEFAULT now()
);

-- İndeksler
CREATE INDEX idx_scores_score ON scores(score DESC);
CREATE INDEX idx_scores_played_at ON scores(played_at DESC);
CREATE INDEX idx_scores_player ON scores(player_id);
CREATE INDEX idx_scores_daily ON scores(played_at, score DESC);
```

### 5.2 Görünümler (Scoreboard Sekmeleri)

```sql
-- Tüm zamanlar — top 50
CREATE VIEW leaderboard_alltime AS
  SELECT username, score, level_reached, lines_cleared, played_at
  FROM scores
  ORDER BY score DESC
  LIMIT 50;

-- Günlük — son 24 saat
CREATE VIEW leaderboard_daily AS
  SELECT username, score, level_reached, lines_cleared, played_at
  FROM scores
  WHERE played_at > now() - INTERVAL '24 hours'
  ORDER BY score DESC
  LIMIT 50;

-- Haftalık — son 7 gün
CREATE VIEW leaderboard_weekly AS
  SELECT username, score, level_reached, lines_cleared, played_at
  FROM scores
  WHERE played_at > now() - INTERVAL '7 days'
  ORDER BY score DESC
  LIMIT 50;
```

### 5.3 RPC: Skor Gönderme

```sql
CREATE OR REPLACE FUNCTION submit_score(
  p_player_id UUID,
  p_username TEXT,
  p_score BIGINT,
  p_lines INTEGER,
  p_level INTEGER,
  p_lives INTEGER,
  p_powerups INTEGER,
  p_duration INTEGER,
  p_device TEXT
) RETURNS JSON AS $$
DECLARE
  new_id UUID;
  player_rank BIGINT;
  player_best BIGINT;
BEGIN
  INSERT INTO scores (player_id, username, score, lines_cleared, level_reached,
                      lives_remaining, power_ups_used, game_duration_seconds, device)
  VALUES (p_player_id, p_username, p_score, p_lines, p_level,
          p_lives, p_powerups, p_duration, p_device)
  RETURNING id INTO new_id;

  SELECT MAX(s.score) INTO player_best
  FROM scores s WHERE s.player_id = p_player_id;

  SELECT COUNT(*) + 1 INTO player_rank
  FROM (
    SELECT DISTINCT ON (player_id) score
    FROM scores ORDER BY player_id, score DESC
  ) best WHERE best.score > p_score;

  RETURN json_build_object(
    'score_id', new_id,
    'rank', player_rank,
    'best_score', player_best
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### 5.4 Row Level Security

```sql
ALTER TABLE scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Skorlar herkese açık"
  ON scores FOR SELECT USING (true);

CREATE POLICY "Anonim kullanıcı skor ekler"
  ON scores FOR INSERT
  WITH CHECK (auth.uid() = player_id);
```

---

## 6. Gelişmiş Scoreboard Tasarımı

### 6.1 Arayüz

```
┌─────────────────────────────────────────┐
│          ★ HALL OF FAME ★               │
│      En iyi oyuncular · Canlı          │
│─────────────────────────────────────────│
│  [GÜNLÜK]  [HAFTALIK]  [TÜM ZAMANLAR]  │
│─────────────────────────────────────────│
│  🥇  MEHMET    ··········   12,450      │
│  🥈  ZEYNEP    ··········    9,800      │
│  🥉  AHMET     ··········    7,320      │
│  4   ALI       ··········    5,100      │
│  5   AYŞE      ··········    3,750      │
│  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─  │
│  📍 SEN: #12 · En iyi: 2,340           │
│─────────────────────────────────────────│
│  🔴 ALI az önce 4,200 puan yaptı!      │
└─────────────────────────────────────────┘
```

### 6.2 Özellikler

| Özellik | Açıklama |
|---------|----------|
| **3 Sekme** | Günlük / Haftalık / Tüm Zamanlar sıralaması |
| **Top 50** | Her sekmede en iyi 50 skor |
| **Madalyalar** | 🥇🥈🥉 ilk 3 sıra, özel renk ve glow |
| **Kişisel Sıra** | Oyuncunun sırası altta gösterilir |
| **Canlı Besleme** | Realtime: yeni skorlar anlık bildirim olarak akar |
| **Yeni Rekor Flash** | Kendi skorun tabloda vurgulanır (yeşil flash) |
| **Responsive** | Desktop: yan panel · Mobil: oyun altında tam genişlik |

### 6.3 Realtime Canlı Besleme

```javascript
// services/scoreService.js
function subscribeToNewScores(callback) {
  return supabase
    .channel('live-scores')
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'scores',
    }, (payload) => {
      callback({
        username: payload.new.username,
        score: payload.new.score,
        level: payload.new.level_reached,
      });
    })
    .subscribe();
}
```

Alt kısımda kayan bildirimler: `🔴 ALI az önce 4,200 puan yaptı!`
Son 5 bildirim tutulur, 5 saniye sonra otomatik kaybolur.

---

## 7. Zustand State Yapısı

```javascript
const useGameStore = create((set, get) => ({
  // Board
  board: null,
  current: null,
  next: null,

  // İstatistikler
  score: 0,
  lines: 0,
  level: 1,
  lives: 3,

  // Durum
  gameState: 'idle',  // 'idle' | 'playing' | 'paused' | 'gameover'

  // Power-up
  shielded: false,
  lastPowerUpScore: 0,
  powerUpNotification: null,

  // Tema
  currentThemeIndex: 0,

  // Oyun meta (skor gönderimi için)
  gameStartTime: null,
  powerUpsUsed: 0,

  // Aksiyonlar
  startGame: () => { /* ... */ },
  pauseGame: () => set({ gameState: 'paused' }),
  resumeGame: () => set({ gameState: 'playing' }),
  moveLeft: () => { /* ... */ },
  moveRight: () => { /* ... */ },
  moveDown: () => { /* ... */ },
  hardDrop: () => { /* ... */ },
  rotatePiece: () => { /* ... */ },
  tick: (time) => { /* her frame çağrılır */ },
  endGame: () => { /* ... */ },
}));
```

---

## 8. Uygulama Adımları

### Faz 1: Proje Altyapısı ⏱ 0.5 gün
- Vite + React projesi, bağımlılıklar, font, klasör yapısı, `.env.local`

### Faz 2: Oyun Motoru ⏱ 2 gün
- `engine/` modülleri: pieces, board, scoring, powerups, renderer

### Faz 3: Zustand Store ⏱ 1 gün
- `gameStore.js` — state + aksiyonlar + tema geçişleri

### Faz 4: React Bileşenleri — Oyun ⏱ 2 gün
- GameCanvas, NextPiece, keyboard/touch hooks, MobileControls
- Overlay ekranları, SidePanel

### Faz 5: Görsel Efektler ⏱ 1.5 gün
- Particle, Grid, Scanline, Pulse, GlitchTitle, Footer, tema renkleri

### Faz 6: Supabase + Scoreboard ⏱ 2 gün
- SQL migration, RLS, RPC
- playerService (anonim auth), scoreService (CRUD + realtime)
- Scoreboard bileşenleri (sekmeler, canlı besleme, kişisel sıra)
- NameInputModal entegrasyonu

### Faz 7: Test & Deploy ⏱ 1 gün
- Mobil test, edge case'ler, Vercel deploy

**Toplam: ~10 gün**

---

## 9. Kritik Teknik Notlar

### Canvas Performansı
`requestAnimationFrame` döngüsü zustand'dan `getState()` ile doğrudan okur, React re-render tetiklemez:

```javascript
useEffect(() => {
  let rafId;
  const loop = (time) => {
    const state = useGameStore.getState();
    if (state.gameState === 'playing') {
      state.tick(time);
      renderer.draw(ctx, state);
    }
    rafId = requestAnimationFrame(loop);
  };
  rafId = requestAnimationFrame(loop);
  return () => cancelAnimationFrame(rafId);
}, []);
```

### Mobil Performans
- Parçacık sayısını mobilde yarıya indir
- `passive: false` touch event'ler
- Canvas boyutunu viewport'a göre dinamik ayarla

### Anonim Auth Detayları
- `signInAnonymously()` sadece ilk skor kaydında çağrılır
- Session otomatik devam eder, aynı cihazdan aynı oyuncu
- Session kaybolursa yeni anonim ID oluşur (sorun değil)

### Supabase Ücretsiz Plan
| Kaynak | Limit | Yeterli? |
|--------|-------|----------|
| DB | 500 MB | ✅ |
| Auth | 50K MAU | ✅ |
| Realtime | 200 bağlantı | ✅ |

---

## 10. Gelecek Geliştirmeler (v2+)

- 🏆 Haftalık turnuva modu
- 👥 Sınıf modu (öğretmen sınıf kodu oluşturur)
- 🎨 Tema seçici
- 📊 Son 10 oyun performans grafiği
