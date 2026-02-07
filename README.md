# ZOIX - Neon Tetris

**ZOIX**, klasik Tetris oyununu neon/synthwave estetigiyle yeniden yorumlayan, tamamen web tabanli bir oyundur.

Fikir, uygulama ve tasarim **Dumlupinar Ilkokulu 4A sinifi ogrencileri** tarafindan gelistirilmistir.

---

## Ozellikler

- **10 Seviye Tema Sistemi** - Her 1000 puanda seviye atla, her seviyede farkli neon renk temasi
- **Retro Ses Efektleri** - Web Audio API ile uretilen 16 farkli 8-bit synth ses efekti (harici dosya yok)
- **Canli Skor Tablosu** - Supabase tabanli gercek zamanli liderlik tablosu
- **Guc Bonuslari** - Bomba, kalkan ve temizleyici guc-uplari
- **Can Sistemi** - 3 canla baslayip, hata yaptiginda tekrar sans
- **Oyun Sonu Meme'leri** - Her oyun sonunda rastgele meme gosterimi (otomatik klasor taramasi)
- **Kufur Filtresi** - Turkce argo ve kufur tespiti (leet-speak korumasili)
- **Animasyonlu Oynanma Sayaci** - Kac kez oynandigi canli takip
- **Tam Responsive** - Masaustu ve mobil cihazlarda sorunsuz calisir
- **Typewriter Baslangic Ekrani** - "Tetris Evreninin Kapilarini Arala" efekti

## Teknolojiler

| Teknoloji | Kullanim |
|-----------|----------|
| React 18 | UI bilesenleri |
| Vite 7 | Build ve gelistirme sunucusu |
| Zustand | State yonetimi |
| Supabase | Veritabani, skor tablosu, oynanma sayaci |
| Web Audio API | Programatik retro ses uretimi |
| Canvas API | Oyun tahtasi ve parca cizimi |

## Kurulum

```bash
# Bagimlilikları yukle
npm install

# Gelistirme sunucusunu baslat
npm run dev

# Production build
npm run build
```

## Supabase Kurulumu

Oyun Supabase olmadan da calisir (skorlar localStorage'da tutulur). Supabase entegrasyonu icin:

1. [supabase.com](https://supabase.com) uzerinde yeni proje olustur
2. `supabase/migrations/` klasorundeki SQL dosyalarini sirasiyla calistir
3. `.env` dosyasi olustur:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Oyun Kontrolleri

| Tus | Aksiyon |
|-----|---------|
| `<- ->` | Sola / Saga hareket |
| `Yukari` | Parcayi dondu |
| `Asagi` | Hizlandir |
| `SPACE` | Sert dusur |
| `ESC` | Durdur / Devam |

Mobil cihazlarda ekran uzerindeki butonlar kullanilir.

## Seviye Temalari

| Seviye | Tema | Renk |
|--------|------|------|
| 1 | Cyan/Klasik | #00ffc8 |
| 2 | Mor/Mystik | #c850ff |
| 3 | Turuncu/Ates | #ff6020 |
| 4 | Yesil/Matrix | #00ff00 |
| 5 | Pembe/Synthwave | #ff6090 |
| 6 | Altin/Efsane | #ffe600 |
| 7 | Buz/Firtina | #00d4ff |
| 8 | Kan/Cehennem | #ff2020 |
| 9 | Plazma/Nebula | #bf40ff |
| 10 | Rainbow/Kaos | Gokkusagi |

## Meme Ekleme

`src/assets/memes/` klasorune herhangi bir resim dosyasi (jpg, png, gif, webp) birakmaniz yeterli. Kod degisikligi gerekmez - dosyalar otomatik algilanir.

---

**Dumlupinar Ilkokulu 4A Sinifi** tarafindan gelistirilmistir.
