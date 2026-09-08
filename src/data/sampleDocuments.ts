import type { PresetSample } from '../types';

// Helper to generate SVG Data URI
export function svgToDataUri(svg: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

// Crisp portrait SVG 1 - Sarah Connor
export const PORTRAIT_SARAH = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 240" width="200" height="240">
  <defs>
    <linearGradient id="bgSarah" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#4a5568"/>
      <stop offset="100%" stop-color="#2d3748"/>
    </linearGradient>
    <linearGradient id="hairSarah" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#78350f"/>
      <stop offset="100%" stop-color="#451a03"/>
    </linearGradient>
    <linearGradient id="skinSarah" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#fed7aa"/>
      <stop offset="100%" stop-color="#fbd38d"/>
    </linearGradient>
  </defs>
  <rect width="200" height="240" fill="url(#bgSarah)"/>
  <!-- Hair back -->
  <ellipse cx="100" cy="115" rx="55" ry="65" fill="url(#hairSarah)"/>
  <!-- Shoulders / Jacket -->
  <path d="M40 240 C45 185 70 170 100 170 C130 170 155 185 160 240 Z" fill="#1e293b"/>
  <path d="M80 185 L100 215 L120 185 Z" fill="#f8fafc"/>
  <!-- Neck -->
  <rect x="86" y="140" width="28" height="35" fill="#f6ad55" rx="4"/>
  <!-- Face -->
  <ellipse cx="100" cy="115" rx="38" ry="46" fill="url(#skinSarah)"/>
  <!-- Hair top -->
  <path d="M60 105 C60 65 140 65 140 105 C140 90 125 75 100 75 C75 75 60 90 60 105 Z" fill="url(#hairSarah)"/>
  <!-- Eyes -->
  <ellipse cx="85" cy="112" rx="5" ry="3.5" fill="#0f172a"/>
  <ellipse cx="115" cy="112" rx="5" ry="3.5" fill="#0f172a"/>
  <circle cx="86" cy="111" r="1.5" fill="#ffffff"/>
  <circle cx="116" cy="111" r="1.5" fill="#ffffff"/>
  <!-- Eyebrows -->
  <path d="M78 103 Q85 100 92 103" stroke="#451a03" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <path d="M108 103 Q115 100 122 103" stroke="#451a03" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <!-- Nose -->
  <path d="M100 115 L98 126 L104 126" stroke="#ea580c" stroke-width="1.5" fill="none" stroke-linecap="round"/>
  <!-- Mouth -->
  <path d="M92 138 Q100 142 108 138" stroke="#be123c" stroke-width="2" fill="none" stroke-linecap="round"/>
  <!-- Ear -->
  <ellipse cx="62" cy="118" rx="4" ry="9" fill="#fbd38d"/>
  <ellipse cx="138" cy="118" rx="4" ry="9" fill="#fbd38d"/>
</svg>`;

// Live Webcam match for Sarah (same person, slight angle/lighting difference)
export const LIVE_SARAH = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 240" width="200" height="240">
  <defs>
    <linearGradient id="bgLiveSarah" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1e293b"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>
    <linearGradient id="skinSarah2" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#fed7aa"/>
      <stop offset="100%" stop-color="#fbd38d"/>
    </linearGradient>
  </defs>
  <rect width="200" height="240" fill="url(#bgLiveSarah)"/>
  <ellipse cx="102" cy="114" rx="55" ry="65" fill="#582a0b"/>
  <path d="M42 240 C47 186 72 171 102 171 C132 171 157 186 162 240 Z" fill="#334155"/>
  <rect x="88" y="139" width="28" height="35" fill="#f6ad55" rx="4"/>
  <ellipse cx="102" cy="114" rx="38" ry="46" fill="url(#skinSarah2)"/>
  <path d="M62 104 C62 64 142 64 142 104 C142 89 127 74 102 74 C77 74 62 89 62 104 Z" fill="#582a0b"/>
  <ellipse cx="87" cy="111" rx="5" ry="3.5" fill="#0f172a"/>
  <ellipse cx="117" cy="111" rx="5" ry="3.5" fill="#0f172a"/>
  <circle cx="88" cy="110" r="1.5" fill="#ffffff"/>
  <circle cx="118" cy="110" r="1.5" fill="#ffffff"/>
  <path d="M80 102 Q87 99 94 102" stroke="#451a03" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <path d="M110 102 Q117 99 124 102" stroke="#451a03" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <path d="M102 114 L100 125 L106 125" stroke="#ea580c" stroke-width="1.5" fill="none" stroke-linecap="round"/>
  <path d="M94 137 Q102 142 110 137" stroke="#be123c" stroke-width="2" fill="none" stroke-linecap="round"/>
  <!-- Subtle webcam camera scan grid overlay -->
  <path d="M15 15 L25 15 M15 15 L15 25" stroke="#00f2fe" stroke-width="1.5"/>
  <path d="M185 15 L175 15 M185 15 L185 25" stroke="#00f2fe" stroke-width="1.5"/>
  <path d="M15 225 L25 225 M15 225 L15 215" stroke="#00f2fe" stroke-width="1.5"/>
  <path d="M185 225 L175 225 M185 225 L185 215" stroke="#00f2fe" stroke-width="1.5"/>
</svg>`;

// Portrait 2 - David Miller (Tampered ID)
export const PORTRAIT_DAVID = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 240" width="200" height="240">
  <defs>
    <linearGradient id="bgDavid" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#3b82f6"/>
      <stop offset="100%" stop-color="#1e3a8a"/>
    </linearGradient>
  </defs>
  <rect width="200" height="240" fill="url(#bgDavid)"/>
  <path d="M35 240 C40 180 70 165 100 165 C130 165 160 180 165 240 Z" fill="#0f172a"/>
  <rect x="87" y="135" width="26" height="35" fill="#e2e8f0" rx="3"/>
  <ellipse cx="100" cy="110" rx="36" ry="44" fill="#fcd34d"/>
  <!-- Short dark hair -->
  <path d="M64 100 C64 60 136 60 136 100 Q100 70 64 100 Z" fill="#18181b"/>
  <!-- Eyes -->
  <circle cx="86" cy="108" r="4" fill="#1e293b"/>
  <circle cx="114" cy="108" r="4" fill="#1e293b"/>
  <!-- Eyebrows -->
  <path d="M80 100 L92 100" stroke="#18181b" stroke-width="2.5" stroke-linecap="round"/>
  <path d="M108 100 L120 100" stroke="#18181b" stroke-width="2.5" stroke-linecap="round"/>
  <!-- Glasses -->
  <rect x="76" y="102" width="20" height="13" rx="2" fill="none" stroke="#475569" stroke-width="2"/>
  <rect x="104" y="102" width="20" height="13" rx="2" fill="none" stroke="#475569" stroke-width="2"/>
  <path d="M96 108 L104 108" stroke="#475569" stroke-width="2"/>
  <!-- Nose & Mouth -->
  <path d="M100 112 L98 122 L103 122" stroke="#b45309" stroke-width="1.5" fill="none"/>
  <path d="M93 133 Q100 137 107 133" stroke="#991b1b" stroke-width="2" fill="none"/>
</svg>`;

// Portrait 3 - Elena Rostova (Stolen Passport)
export const PORTRAIT_ELENA = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 240" width="200" height="240">
  <defs>
    <linearGradient id="bgElena" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0284c7"/>
      <stop offset="100%" stop-color="#0369a1"/>
    </linearGradient>
  </defs>
  <rect width="200" height="240" fill="url(#bgElena)"/>
  <!-- Blonde hair behind -->
  <ellipse cx="100" cy="120" rx="58" ry="70" fill="#fef08a"/>
  <path d="M38 240 C44 185 70 170 100 170 C130 170 156 185 162 240 Z" fill="#831843"/>
  <rect x="88" y="140" width="24" height="35" fill="#ffedd5" rx="3"/>
  <ellipse cx="100" cy="115" rx="36" ry="43" fill="#fed7aa"/>
  <!-- Blonde hair front -->
  <path d="M62 105 C62 60 138 60 138 105 C130 80 70 80 62 105 Z" fill="#fde047"/>
  <ellipse cx="85" cy="112" rx="4.5" ry="3.5" fill="#0284c7"/>
  <ellipse cx="115" cy="112" rx="4.5" ry="3.5" fill="#0284c7"/>
  <path d="M80 104 Q86 102 91 104" stroke="#a16207" stroke-width="2" fill="none"/>
  <path d="M109 104 Q114 102 120 104" stroke="#a16207" stroke-width="2" fill="none"/>
  <path d="M100 114 L98 123 L103 123" stroke="#ea580c" stroke-width="1.5" fill="none"/>
  <path d="M92 135 Q100 140 108 135" stroke="#e11d48" stroke-width="2.2" fill="none"/>
</svg>`;

// Portrait 4 - Marcus Vance (Impersonator / Face Mismatch)
export const PORTRAIT_MARCUS = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 240" width="200" height="240">
  <defs>
    <linearGradient id="bgMarcus" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#047857"/>
      <stop offset="100%" stop-color="#064e3b"/>
    </linearGradient>
  </defs>
  <rect width="200" height="240" fill="url(#bgMarcus)"/>
  <path d="M30 240 C35 180 65 160 100 160 C135 160 165 180 170 240 Z" fill="#1e293b"/>
  <rect x="85" y="132" width="30" height="35" fill="#d97706" rx="3"/>
  <ellipse cx="100" cy="108" rx="40" ry="46" fill="#f59e0b"/>
  <!-- Bald / Buzz cut -->
  <path d="M60 100 C60 62 140 62 140 100 Q100 75 60 100 Z" fill="#78350f" opacity="0.4"/>
  <!-- Eyes -->
  <ellipse cx="84" cy="106" rx="5" ry="3" fill="#1c1917"/>
  <ellipse cx="116" cy="106" rx="5" ry="3" fill="#1c1917"/>
  <!-- Eyebrows -->
  <path d="M76 98 L92 101" stroke="#451a03" stroke-width="3" stroke-linecap="round"/>
  <path d="M108 101 L124 98" stroke="#451a03" stroke-width="3" stroke-linecap="round"/>
  <!-- Beard -->
  <path d="M70 115 C70 145 130 145 130 115 C130 135 120 150 100 150 C80 150 70 135 70 115 Z" fill="#451a03" opacity="0.8"/>
  <path d="M94 134 Q100 136 106 134" stroke="#1c1917" stroke-width="2" fill="none"/>
</svg>`;

// Presenter for Marcus test case: totally different individual (impersonator)
export const LIVE_IMPERSONATOR = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 240" width="200" height="240">
  <defs>
    <linearGradient id="bgImp" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#3f3f46"/>
      <stop offset="100%" stop-color="#18181b"/>
    </linearGradient>
  </defs>
  <rect width="200" height="240" fill="url(#bgImp)"/>
  <!-- Completely different facial structure: long dark wavy hair, clean shaven, younger -->
  <ellipse cx="100" cy="120" rx="60" ry="70" fill="#111827"/>
  <path d="M40 240 C45 185 70 172 100 172 C130 172 155 185 160 240 Z" fill="#dc2626"/>
  <rect x="88" y="142" width="24" height="35" fill="#fed7aa" rx="3"/>
  <ellipse cx="100" cy="115" rx="35" ry="45" fill="#fcd34d"/>
  <path d="M65 105 C65 65 135 65 135 105 Z" fill="#111827"/>
  <ellipse cx="86" cy="112" rx="4" ry="4" fill="#0f172a"/>
  <ellipse cx="114" cy="112" rx="4" ry="4" fill="#0f172a"/>
  <path d="M93 136 Q100 138 107 136" stroke="#991b1b" stroke-width="2" fill="none"/>
  <!-- Scanner HUD in alert mode -->
  <path d="M15 15 L25 15 M15 15 L15 25" stroke="#ef4444" stroke-width="2"/>
  <path d="M185 15 L175 15 M185 15 L185 25" stroke="#ef4444" stroke-width="2"/>
  <path d="M15 225 L25 225 M15 225 L15 215" stroke="#ef4444" stroke-width="2"/>
  <path d="M185 225 L175 225 M185 225 L185 215" stroke="#ef4444" stroke-width="2"/>
  <text x="100" y="210" fill="#ef4444" font-size="11" font-family="monospace" text-anchor="middle" font-weight="bold">BIOMETRIC MISMATCH</text>
</svg>`;

// Complete Passport SVG for Sarah Connor
export const DOC_SVG_SARAH = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 650 420" width="650" height="420">
  <defs>
    <linearGradient id="passportBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f2b48"/>
      <stop offset="50%" stop-color="#13385e"/>
      <stop offset="100%" stop-color="#0a1c30"/>
    </linearGradient>
    <pattern id="guilloche" width="30" height="30" patternUnits="userSpaceOnUse">
      <path d="M 0 15 Q 7.5 0 15 15 T 30 15" fill="none" stroke="#2563eb" stroke-width="0.35" opacity="0.3"/>
      <path d="M 15 0 Q 30 7.5 15 15 T 15 30" fill="none" stroke="#38bdf8" stroke-width="0.35" opacity="0.2"/>
    </pattern>
  </defs>
  
  <!-- Outer Card Frame -->
  <rect width="650" height="420" rx="16" fill="url(#passportBg)"/>
  <rect x="8" y="8" width="634" height="404" rx="12" fill="url(#guilloche)" stroke="#38bdf8" stroke-width="1.5" stroke-opacity="0.6"/>

  <!-- Header -->
  <rect x="20" y="20" width="610" height="48" rx="6" fill="#1e3a5f" opacity="0.8"/>
  <text x="35" y="44" fill="#38bdf8" font-size="11" font-weight="700" font-family="sans-serif" letter-spacing="2">PASSPORT / PASSEPORT</text>
  <text x="35" y="58" fill="#94a3b8" font-size="9" font-family="sans-serif">UNITED STATES OF AMERICA / ÉTATS-UNIS D'AMÉRIQUE</text>
  
  <!-- Hologram Seal / Emblem -->
  <circle cx="580" cy="44" r="18" fill="none" stroke="#38bdf8" stroke-width="1.5" opacity="0.8"/>
  <path d="M580 32 L583 40 L591 40 L585 45 L587 53 L580 48 L573 53 L575 45 L569 40 L577 40 Z" fill="#38bdf8" opacity="0.7"/>

  <!-- Photo Box Frame -->
  <rect x="35" y="85" width="160" height="195" rx="8" fill="#1e293b" stroke="#38bdf8" stroke-width="1.5"/>
  <!-- Embedded Portrait -->
  <g transform="translate(35, 85) scale(0.8, 0.8125)">
    ${PORTRAIT_SARAH}
  </g>
  <!-- Ghost photo watermark -->
  <g transform="translate(520, 160) scale(0.42, 0.42)" opacity="0.25">
    ${PORTRAIT_SARAH}
  </g>

  <!-- Extracted Fields (Visual Inspection Zone) -->
  <!-- Field: Type & Code -->
  <text x="220" y="98" fill="#64748b" font-size="9" font-family="sans-serif">TYPE / TYPE</text>
  <text x="220" y="112" fill="#f8fafc" font-size="13" font-family="'JetBrains Mono', monospace" font-weight="600">P</text>

  <text x="320" y="98" fill="#64748b" font-size="9" font-family="sans-serif">CODE / CODE</text>
  <text x="320" y="112" fill="#f8fafc" font-size="13" font-family="'JetBrains Mono', monospace" font-weight="600">USA</text>

  <text x="430" y="98" fill="#64748b" font-size="9" font-family="sans-serif">PASSPORT NO. / N° DU PASSEPORT</text>
  <text x="430" y="112" fill="#38bdf8" font-size="14" font-family="'JetBrains Mono', monospace" font-weight="700">A94827103</text>

  <!-- Field: Surname -->
  <text x="220" y="136" fill="#64748b" font-size="9" font-family="sans-serif">SURNAME / NOM</text>
  <text x="220" y="152" fill="#f8fafc" font-size="15" font-family="'JetBrains Mono', monospace" font-weight="700">CONNOR</text>

  <!-- Field: Given Names -->
  <text x="220" y="174" fill="#64748b" font-size="9" font-family="sans-serif">GIVEN NAMES / PRÉNOMS</text>
  <text x="220" y="190" fill="#f8fafc" font-size="15" font-family="'JetBrains Mono', monospace" font-weight="600">SARAH JEAN</text>

  <!-- Field: Nationality & Sex -->
  <text x="220" y="212" fill="#64748b" font-size="9" font-family="sans-serif">NATIONALITY / NATIONALITÉ</text>
  <text x="220" y="226" fill="#f8fafc" font-size="13" font-family="'JetBrains Mono', monospace">UNITED STATES OF AMERICA</text>

  <text x="430" y="212" fill="#64748b" font-size="9" font-family="sans-serif">SEX / SEXE</text>
  <text x="430" y="226" fill="#f8fafc" font-size="13" font-family="'JetBrains Mono', monospace">F</text>

  <!-- Field: DOB -->
  <text x="220" y="248" fill="#64748b" font-size="9" font-family="sans-serif">DATE OF BIRTH / DATE DE NAISSANCE</text>
  <text x="220" y="262" fill="#f8fafc" font-size="13" font-family="'JetBrains Mono', monospace">18 NOV 1989</text>

  <text x="430" y="248" fill="#64748b" font-size="9" font-family="sans-serif">EXPIRY DATE / DATE D'EXPIRATION</text>
  <text x="430" y="262" fill="#10b981" font-size="13" font-family="'JetBrains Mono', monospace" font-weight="700">22 OCT 2029</text>

  <!-- Microprint Security Strip -->
  <line x1="35" y1="300" x2="615" y2="300" stroke="#38bdf8" stroke-width="1.2" stroke-dasharray="3 2" opacity="0.6"/>
  <text x="35" y="312" fill="#38bdf8" font-size="7" font-family="'JetBrains Mono', monospace" opacity="0.5">UNITED STATES DEPARTMENT OF STATE • AUTHENTIC TRAVEL DOCUMENT • VERIFAI VERIFIED</text>

  <!-- Machine Readable Zone (MRZ - ICAO Doc 9303 standard) -->
  <rect x="25" y="325" width="600" height="75" rx="6" fill="#06121f" stroke="#1e293b" stroke-width="1"/>
  <text x="40" y="352" fill="#cbd5e1" font-size="14.5" font-family="'JetBrains Mono', 'Courier New', monospace" font-weight="600" letter-spacing="3.2">P&lt;USACONNOR&lt;&lt;SARAH&lt;JEAN&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;</text>
  <text x="40" y="380" fill="#cbd5e1" font-size="14.5" font-family="'JetBrains Mono', 'Courier New', monospace" font-weight="600" letter-spacing="3.2">A948271034USA8911183F2910228&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;02</text>
</svg>`;

// Tampered ID SVG for David Miller (Edited Birth Year & Expiry)
export const DOC_SVG_DAVID_TAMPERED = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 650 420" width="650" height="420">
  <defs>
    <linearGradient id="idCardBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1e1b4b"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>
  </defs>
  
  <rect width="650" height="420" rx="16" fill="url(#idCardBg)"/>
  <rect x="8" y="8" width="634" height="404" rx="12" fill="none" stroke="#6366f1" stroke-width="1.5" stroke-opacity="0.4"/>

  <!-- Header -->
  <rect x="20" y="20" width="610" height="48" rx="6" fill="#312e81" opacity="0.6"/>
  <text x="35" y="44" fill="#a5b4fc" font-size="11" font-weight="700" font-family="sans-serif" letter-spacing="2">NATIONAL IDENTITY CARD</text>
  <text x="35" y="58" fill="#c7d2fe" font-size="9" font-family="sans-serif">COMMONWEALTH OF AUSTRALIA</text>

  <!-- Photo Box -->
  <rect x="35" y="85" width="160" height="195" rx="8" fill="#1e293b" stroke="#6366f1" stroke-width="1.5"/>
  <g transform="translate(35, 85) scale(0.8, 0.8125)">
    ${PORTRAIT_DAVID}
  </g>

  <!-- Extracted Fields -->
  <text x="220" y="100" fill="#94a3b8" font-size="9" font-family="sans-serif">DOCUMENT NO.</text>
  <text x="220" y="116" fill="#818cf8" font-size="14" font-family="'JetBrains Mono', monospace" font-weight="700">AUS-8829410-X</text>

  <text x="220" y="142" fill="#94a3b8" font-size="9" font-family="sans-serif">FULL NAME</text>
  <text x="220" y="160" fill="#f8fafc" font-size="16" font-family="'JetBrains Mono', monospace" font-weight="700">MILLER, DAVID ALEXANDER</text>

  <!-- TAMPERED FIELD 1: Date of Birth (Pasted over 2004 with 1994) -->
  <text x="220" y="190" fill="#94a3b8" font-size="9" font-family="sans-serif">DATE OF BIRTH</text>
  <!-- Background artifact box indicating digital splice -->
  <rect x="216" y="196" width="140" height="26" fill="#3730a3" opacity="0.4" rx="3" stroke="#f43f5e" stroke-width="1" stroke-dasharray="2 2"/>
  <text x="220" y="214" fill="#ffffff" font-size="14" font-family="'Arial', sans-serif" font-weight="bold">14 JUN 1994</text>

  <text x="420" y="190" fill="#94a3b8" font-size="9" font-family="sans-serif">SEX</text>
  <text x="420" y="214" fill="#f8fafc" font-size="14" font-family="'JetBrains Mono', monospace">M</text>

  <!-- TAMPERED FIELD 2: Expiry Date altered to 2030 -->
  <text x="220" y="248" fill="#94a3b8" font-size="9" font-family="sans-serif">DATE OF EXPIRY</text>
  <rect x="216" y="254" width="140" height="26" fill="#3730a3" opacity="0.4" rx="3" stroke="#f43f5e" stroke-width="1" stroke-dasharray="2 2"/>
  <text x="220" y="272" fill="#ffffff" font-size="14" font-family="'Arial', sans-serif" font-weight="bold">30 DEC 2030</text>

  <!-- MRZ that does NOT match the visually altered text! (Shows original 2004 birthdate) -->
  <rect x="25" y="325" width="600" height="75" rx="6" fill="#090d16" stroke="#312e81" stroke-width="1"/>
  <text x="40" y="352" fill="#cbd5e1" font-size="14.5" font-family="'JetBrains Mono', monospace" font-weight="600" letter-spacing="3">I&lt;AUS8829410X4&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;</text>
  <text x="40" y="380" fill="#cbd5e1" font-size="14.5" font-family="'JetBrains Mono', monospace" font-weight="600" letter-spacing="3">0406148M2112301AUS&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;8</text>
</svg>`;

// Stolen Passport SVG for Elena Rostova
export const DOC_SVG_ELENA_STOLEN = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 650 420" width="650" height="420">
  <defs>
    <linearGradient id="bgDocElena" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0c2340"/>
      <stop offset="100%" stop-color="#06121e"/>
    </linearGradient>
  </defs>
  <rect width="650" height="420" rx="16" fill="url(#bgDocElena)"/>
  <rect x="8" y="8" width="634" height="404" rx="12" fill="none" stroke="#0ea5e9" stroke-width="1.5" stroke-opacity="0.5"/>

  <rect x="20" y="20" width="610" height="48" rx="6" fill="#075985" opacity="0.6"/>
  <text x="35" y="44" fill="#7dd3fc" font-size="11" font-weight="700" font-family="sans-serif" letter-spacing="2">PASSPORT / PASSEPORT</text>
  <text x="35" y="58" fill="#bae6fd" font-size="9" font-family="sans-serif">UNITED KINGDOM OF GREAT BRITAIN AND NORTHERN IRELAND</text>

  <rect x="35" y="85" width="160" height="195" rx="8" fill="#1e293b" stroke="#0ea5e9" stroke-width="1.5"/>
  <g transform="translate(35, 85) scale(0.8, 0.8125)">
    ${PORTRAIT_ELENA}
  </g>

  <text x="220" y="98" fill="#64748b" font-size="9" font-family="sans-serif">PASSPORT NO.</text>
  <text x="220" y="114" fill="#38bdf8" font-size="14" font-family="'JetBrains Mono', monospace" font-weight="700">GBR55910472</text>

  <text x="220" y="140" fill="#64748b" font-size="9" font-family="sans-serif">SURNAME</text>
  <text x="220" y="156" fill="#f8fafc" font-size="15" font-family="'JetBrains Mono', monospace" font-weight="700">ROSTOVA</text>

  <text x="220" y="180" fill="#64748b" font-size="9" font-family="sans-serif">GIVEN NAMES</text>
  <text x="220" y="196" fill="#f8fafc" font-size="15" font-family="'JetBrains Mono', monospace" font-weight="600">ELENA SOFIA</text>

  <text x="220" y="220" fill="#64748b" font-size="9" font-family="sans-serif">DATE OF BIRTH</text>
  <text x="220" y="234" fill="#f8fafc" font-size="13" font-family="'JetBrains Mono', monospace">05 MAY 1996</text>

  <text x="420" y="220" fill="#64748b" font-size="9" font-family="sans-serif">EXPIRY DATE</text>
  <text x="420" y="234" fill="#38bdf8" font-size="13" font-family="'JetBrains Mono', monospace">12 AUG 2031</text>

  <!-- MRZ -->
  <rect x="25" y="325" width="600" height="75" rx="6" fill="#040c14" stroke="#075985" stroke-width="1"/>
  <text x="40" y="352" fill="#cbd5e1" font-size="14.5" font-family="'JetBrains Mono', monospace" font-weight="600" letter-spacing="3.2">P&lt;GBRROSTOVA&lt;&lt;ELENA&lt;SOFIA&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;</text>
  <text x="40" y="380" fill="#cbd5e1" font-size="14.5" font-family="'JetBrains Mono', monospace" font-weight="600" letter-spacing="3.2">5591047201GBR9605052F3108124&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;44</text>
</svg>`;

// Driver's License SVG for Marcus Vance
export const DOC_SVG_MARCUS_MISMATCH = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 650 420" width="650" height="420">
  <defs>
    <linearGradient id="dlBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#064e3b"/>
      <stop offset="100%" stop-color="#022c22"/>
    </linearGradient>
  </defs>
  <rect width="650" height="420" rx="16" fill="url(#dlBg)"/>
  <rect x="8" y="8" width="634" height="404" rx="12" fill="none" stroke="#10b981" stroke-width="1.5" stroke-opacity="0.5"/>

  <rect x="20" y="20" width="610" height="48" rx="6" fill="#065f46" opacity="0.7"/>
  <text x="35" y="44" fill="#a7f3d0" font-size="11" font-weight="700" font-family="sans-serif" letter-spacing="2">COMMERCIAL DRIVER LICENSE</text>
  <text x="35" y="58" fill="#d1fae5" font-size="9" font-family="sans-serif">STATE OF CALIFORNIA • USA</text>

  <rect x="35" y="85" width="160" height="195" rx="8" fill="#1e293b" stroke="#10b981" stroke-width="1.5"/>
  <g transform="translate(35, 85) scale(0.8, 0.8125)">
    ${PORTRAIT_MARCUS}
  </g>

  <text x="220" y="98" fill="#6ee7b7" font-size="9" font-family="sans-serif">DL NUMBER</text>
  <text x="220" y="114" fill="#ecfdf5" font-size="14" font-family="'JetBrains Mono', monospace" font-weight="700">D7839210</text>

  <text x="220" y="140" fill="#6ee7b7" font-size="9" font-family="sans-serif">NAME</text>
  <text x="220" y="156" fill="#f8fafc" font-size="15" font-family="'JetBrains Mono', monospace" font-weight="700">VANCE, MARCUS T.</text>

  <text x="220" y="180" fill="#6ee7b7" font-size="9" font-family="sans-serif">DOB</text>
  <text x="220" y="196" fill="#f8fafc" font-size="13" font-family="'JetBrains Mono', monospace">21 SEP 1983</text>

  <text x="420" y="180" fill="#6ee7b7" font-size="9" font-family="sans-serif">EXP</text>
  <text x="420" y="196" fill="#f8fafc" font-size="13" font-family="'JetBrains Mono', monospace">21 SEP 2028</text>

  <text x="220" y="220" fill="#6ee7b7" font-size="9" font-family="sans-serif">CLASS</text>
  <text x="220" y="234" fill="#f8fafc" font-size="13" font-family="'JetBrains Mono', monospace">C - COMMERCIAL</text>

  <text x="420" y="220" fill="#6ee7b7" font-size="9" font-family="sans-serif">STATUS</text>
  <text x="420" y="234" fill="#34d399" font-size="13" font-family="'JetBrains Mono', monospace" font-weight="700">VALID / REAL ID</text>

  <rect x="25" y="325" width="600" height="75" rx="6" fill="#011e15" stroke="#047857" stroke-width="1"/>
  <text x="40" y="365" fill="#a7f3d0" font-size="13" font-family="'JetBrains Mono', monospace" letter-spacing="2">AAMVA 2D BARCODE ENCODED • REAL ID FEDERALLY COMPLIANT</text>
</svg>`;

// The 4 Presets
export const SAMPLE_DOCUMENTS: PresetSample[] = [
  {
    id: 'sample-sarah-valid',
    name: 'Sarah Connor',
    subtitle: 'Standard US Travel Passport',
    expectedResult: 'VERIFIED',
    badgeText: 'Legitimate & Verified',
    badgeType: 'verified',
    docImageSvg: DOC_SVG_SARAH,
    portraitSvg: PORTRAIT_SARAH,
    liveCapturedSvg: LIVE_SARAH,
    extractedFields: {
      fullName: 'SARAH JEAN CONNOR',
      documentNumber: 'A94827103',
      dateOfBirth: '1989-11-18',
      age: 36,
      nationality: 'United States',
      issuingCountry: 'USA',
      issueDate: '2019-10-23',
      expiryDate: '2029-10-22',
      gender: 'F',
      documentType: 'PASSPORT',
      mrzLine1: 'P<USACONNOR<<SARAH<JEAN<<<<<<<<<<<<<<<<<<<<<',
      mrzLine2: 'A948271034USA8911183F2910228<<<<<<<<<<<<<<02',
      confidenceScores: {
        fullName: 98.6,
        documentNumber: 99.4,
        dateOfBirth: 99.1,
        expiryDate: 98.9,
        mrz: 99.8
      }
    },
    forensicsPreset: {
      tampered: false,
      tamperRegions: [],
      anomalyDescription: 'Document is authentic. Compression artifacts are uniform across all layers (Error Level Analysis delta < 4%). Zero edge discontinuities or font splicing detected.',
      elaModifier: 0.05
    },
    authorityPreset: {
      status: 'ACTIVE',
      interpolStolen: false,
      notes: 'State Department PKD Registry match confirmed. Cryptographic signature valid. No theft or revocation logs.'
    },
    biometricsPreset: {
      matchScore: 96.4,
      notes: 'High confidence biometric match. Facial landmark geometry matches document portrait within 98th percentile.'
    }
  },
  {
    id: 'sample-david-tampered',
    name: 'David Miller',
    subtitle: 'Digitally Altered National ID',
    expectedResult: 'HIGH_RISK',
    badgeText: 'Digital Tampering Detected',
    badgeType: 'danger',
    docImageSvg: DOC_SVG_DAVID_TAMPERED,
    portraitSvg: PORTRAIT_DAVID,
    liveCapturedSvg: PORTRAIT_DAVID,
    extractedFields: {
      fullName: 'DAVID ALEXANDER MILLER',
      documentNumber: 'AUS-8829410-X',
      dateOfBirth: '1994-06-14', // Visually forged
      age: 32,
      nationality: 'Australia',
      issuingCountry: 'AUS',
      issueDate: '2020-01-10',
      expiryDate: '2030-12-30', // Altered
      gender: 'M',
      documentType: 'NATIONAL_ID',
      mrzLine1: 'I<AUS8829410X4<<<<<<<<<<<<<<<<<',
      mrzLine2: '0406148M2112301AUS<<<<<<<<<<<8', // MRZ contains real 2004 birthdate!
      confidenceScores: {
        fullName: 94.2,
        documentNumber: 92.8,
        dateOfBirth: 78.4, // OCR notices font anomaly
        expiryDate: 76.1,
        mrz: 98.2
      }
    },
    forensicsPreset: {
      tampered: true,
      tamperRegions: [
        {
          id: 't-1',
          label: 'Altered Birth Year',
          x: 216,
          y: 196,
          width: 140,
          height: 28,
          severity: 'high',
          description: 'High JPEG Error Level disparity (ELA delta +42%). Pixel grid misaligned with host card substrate. Typeface stroke weight diverges from system font.'
        },
        {
          id: 't-2',
          label: 'Spliced Expiry Date',
          x: 216,
          y: 254,
          width: 140,
          height: 28,
          severity: 'high',
          description: 'Resaved block detected. Compression rate mismatch. Edge boundary filter reveals rectangular copy-paste gradient boundary.'
        }
      ],
      anomalyDescription: 'CRITICAL FORENSIC ALERT: Multi-point image tampering detected. ELA indicates localized recompression in DOB and Expiry fields. Font typography inconsistent with government template.',
      elaModifier: 0.85
    },
    authorityPreset: {
      status: 'EXPIRED',
      interpolStolen: false,
      notes: 'Registry records show ID AUS-8829410-X expired on 2021-12-30 with holder born in 2004. Visual text does not match government database.'
    },
    biometricsPreset: {
      matchScore: 88.2,
      notes: 'Presenter matches photo, but underlying identity document was heavily manipulated.'
    }
  },
  {
    id: 'sample-elena-stolen',
    name: 'Elena Rostova',
    subtitle: 'Revoked / Stolen Travel Passport',
    expectedResult: 'HIGH_RISK',
    badgeText: 'INTERPOL Stolen Hit',
    badgeType: 'danger',
    docImageSvg: DOC_SVG_ELENA_STOLEN,
    portraitSvg: PORTRAIT_ELENA,
    liveCapturedSvg: PORTRAIT_ELENA,
    extractedFields: {
      fullName: 'ELENA SOFIA ROSTOVA',
      documentNumber: 'GBR55910472',
      dateOfBirth: '1996-05-05',
      age: 30,
      nationality: 'United Kingdom',
      issuingCountry: 'GBR',
      issueDate: '2021-08-12',
      expiryDate: '2031-08-12',
      gender: 'F',
      documentType: 'PASSPORT',
      mrzLine1: 'P<GBRROSTOVA<<ELENA<SOFIA<<<<<<<<<<<<<<<<',
      mrzLine2: '5591047201GBR9605052F3108124<<<<<<<<<<<<<<44',
      confidenceScores: {
        fullName: 99.1,
        documentNumber: 99.5,
        dateOfBirth: 99.0,
        expiryDate: 98.7,
        mrz: 99.9
      }
    },
    forensicsPreset: {
      tampered: false,
      tamperRegions: [],
      anomalyDescription: 'Physical/digital document substrate is structurally intact and clean. No local image tampering detected.',
      elaModifier: 0.08
    },
    authorityPreset: {
      status: 'STOLEN',
      interpolStolen: true,
      notes: 'ALERT: Document number GBR55910472 is listed on INTERPOL Stolen and Lost Travel Documents (SLTD) registry. Document was reported stolen in transit. Status: REVOKED.'
    },
    biometricsPreset: {
      matchScore: 94.1,
      notes: 'Biometric match passes, but document authority revoked credentials due to global stolen vehicle/travel alert.'
    }
  },
  {
    id: 'sample-marcus-mismatch',
    name: 'Marcus Vance',
    subtitle: 'Driver License (Face Mismatch)',
    expectedResult: 'HIGH_RISK',
    badgeText: 'Biometric Impersonation',
    badgeType: 'warning',
    docImageSvg: DOC_SVG_MARCUS_MISMATCH,
    portraitSvg: PORTRAIT_MARCUS,
    liveCapturedSvg: LIVE_IMPERSONATOR,
    extractedFields: {
      fullName: 'MARCUS T. VANCE',
      documentNumber: 'D7839210',
      dateOfBirth: '1983-09-21',
      age: 43,
      nationality: 'United States',
      issuingCountry: 'USA',
      issueDate: '2020-09-21',
      expiryDate: '2028-09-21',
      gender: 'M',
      documentType: 'DRIVERS_LICENSE',
      confidenceScores: {
        fullName: 97.4,
        documentNumber: 98.1,
        dateOfBirth: 96.9,
        expiryDate: 97.5
      }
    },
    forensicsPreset: {
      tampered: false,
      tamperRegions: [],
      anomalyDescription: 'Driver license graphics, barcodes, and typography comply with AAMVA standards. Substrate integrity intact.',
      elaModifier: 0.06
    },
    authorityPreset: {
      status: 'ACTIVE',
      interpolStolen: false,
      notes: 'DMV Driver License database record valid and active. No suspension or revocation orders.'
    },
    biometricsPreset: {
      matchScore: 32.5,
      faceDiscrepancy: 'Severe biometric divergence. Facial contour, inter-pupillary distance, and jawline geometry fail cosine similarity threshold (<0.40).',
      notes: 'CRITICAL BIOMETRIC FAILURE: Live person presenting document does not match the portrait of Marcus Vance.'
    }
  }
];
