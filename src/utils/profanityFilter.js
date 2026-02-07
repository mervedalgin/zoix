// Turkish profanity & slang filter
// Words are base64 encoded to keep source code clean
// Each entry is checked as a substring match (case-insensitive, Turkish char normalized)

const BLOCKED_B64 = [
  'YW1r', 'YW1jaw5h', 'YXZyYWQ=', 'Ym9r', 'YnVkYWxh', 'ZGFseWFr',
  'ZGFseWFyYWs=', 'ZMO2bA==', 'ZG9tYWxhbg==', 'ZG9tdXo=',
  'ZWJl', 'ZWJlbg==', 'ZWJsZWs=', 'ZW5heQ==', 'ZXJraWVr',
  'ZXNoZWs=', 'ZXNoZWs=', 'ZXNobw==',
  'Z2VyaXplZGFs', 'Z2VyaXplYQ==', 'Z290', 'Z8O2dA==',
  'aGFieWFy', 'aGl5YXI=', 'aWJuZQ==',
  'a2FoYmU=', 'a2FocGU=', 'a2FsdGFr', 'a2F2YXQ=', 'a2VyaGFuZQ==',
  'a29kdW0=', 'a8O2cGVr', 'a8O2dMO8',
  'bGF3dWs=', 'bGVibGViaQ==',
  'bWFs', 'bWVtZQ==', 'bWVyZXQ=', 'bXVub2Q=',
  'b3Jvc3B1', 'b3NiaXI=', 'w7Z0w7xl',
  'cGVaZXZlbms=', 'cGlj', 'cGlzdGxpaw==', 'cHVzdA==',
  'c2Fr', 'c2Frc28=', 'c2VyZWZzaXo=', 'c2lrZXJpbQ==', 'c2lrdGly',
  'c2lraXlvcg==', 'c2tydW0=', 'c8O8cnRlaw==', 'c8O8cnTDvGs=',
  'dGFzc2Fr', 'dG9w', 'dMO8cnN1eg==',
  'dmVsZWQ=', 'dm9saQ==',
  'eWFycmFr', 'emVuY2k=', 'esO8cHBl', 'emluYQ==',
]

// Common leet-speak / evasion character mappings
const LEET_MAP = {
  '0': 'o', '1': 'i', '3': 'e', '4': 'a', '5': 's',
  '7': 't', '@': 'a', '$': 's', '!': 'i',
}

// Turkish character normalization
const TR_MAP = {
  'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u',
  'â': 'a', 'î': 'i', 'û': 'u',
}

let blockedWords = null

function getBlockedWords() {
  if (blockedWords) return blockedWords
  blockedWords = BLOCKED_B64.map(b => {
    try { return atob(b).toLowerCase() } catch { return '' }
  }).filter(Boolean)
  return blockedWords
}

function normalize(str) {
  let s = str.toLowerCase()
  // Turkish chars
  for (const [from, to] of Object.entries(TR_MAP)) {
    s = s.replaceAll(from, to)
  }
  // Leet speak
  for (const [from, to] of Object.entries(LEET_MAP)) {
    s = s.replaceAll(from, to)
  }
  // Remove non-alphanumeric (dots, dashes, underscores used to bypass)
  s = s.replace(/[^a-z0-9]/g, '')
  return s
}

/**
 * Check if a name contains profanity
 * @param {string} name - Player name to check
 * @returns {{ clean: boolean, filtered: string }} - Whether name is clean, and filtered version
 */
export function checkProfanity(name) {
  const normalized = normalize(name)
  const words = getBlockedWords()

  for (const word of words) {
    const normalizedWord = normalize(word)
    if (normalizedWord && normalized.includes(normalizedWord)) {
      return { clean: false, filtered: name.replace(/./g, '*') }
    }
  }

  return { clean: true, filtered: name }
}
