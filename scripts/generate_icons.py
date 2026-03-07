#!/usr/bin/env python3
"""Generate 18 SVG icons in digital outline style for the disinfection service site.
Colors: dark navy #1a3a6b (stroke), red #CC0000 (accent), white #ffffff (bg)
Style: semi-flat outline, digital/tech look
"""
import os

OUT = "/home/ubuntu/san-service-site/scripts/icons"
os.makedirs(OUT, exist_ok=True)

NAVY = "#1a3a6b"
RED = "#CC0000"
NAVY_LIGHT = "#2952a3"

def svg(viewBox, content, size=64):
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {size} {size}" width="{size}" height="{size}" fill="none">
{content}
</svg>'''

icons = {}

# 1. Cold fog / Холодный туман
icons["cold-fog"] = svg(64, f'''
  <circle cx="32" cy="32" r="28" stroke="{NAVY}" stroke-width="2" fill="none"/>
  <!-- Nozzle -->
  <rect x="20" y="26" width="18" height="10" rx="2" stroke="{NAVY}" stroke-width="2" fill="{NAVY_LIGHT}" fill-opacity="0.15"/>
  <rect x="38" y="29" width="8" height="4" rx="1" stroke="{NAVY}" stroke-width="1.5" fill="none"/>
  <!-- Cold droplets -->
  <circle cx="50" cy="24" r="2" fill="{NAVY}" opacity="0.6"/>
  <circle cx="53" cy="30" r="1.5" fill="{NAVY}" opacity="0.5"/>
  <circle cx="50" cy="36" r="2" fill="{NAVY}" opacity="0.6"/>
  <circle cx="54" cy="42" r="1.5" fill="{NAVY}" opacity="0.4"/>
  <!-- Snowflake accent -->
  <line x1="29" y1="31" x2="29" y2="35" stroke="{RED}" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="27" y1="33" x2="31" y2="33" stroke="{RED}" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="27.5" y1="31.5" x2="30.5" y2="34.5" stroke="{RED}" stroke-width="1" stroke-linecap="round"/>
  <line x1="30.5" y1="31.5" x2="27.5" y2="34.5" stroke="{RED}" stroke-width="1" stroke-linecap="round"/>
''')

# 2. Hot fog / Горячий туман
icons["hot-fog"] = svg(64, f'''
  <circle cx="32" cy="32" r="28" stroke="{NAVY}" stroke-width="2" fill="none"/>
  <!-- Nozzle -->
  <rect x="18" y="26" width="20" height="11" rx="2" stroke="{NAVY}" stroke-width="2" fill="{NAVY_LIGHT}" fill-opacity="0.15"/>
  <rect x="38" y="29" width="8" height="5" rx="1" stroke="{NAVY}" stroke-width="1.5" fill="none"/>
  <!-- Hot wavy lines -->
  <path d="M48 22 Q51 19 54 22 Q57 25 54 28" stroke="{RED}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
  <path d="M48 28 Q51 25 54 28 Q57 31 54 34" stroke="{RED}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
  <path d="M48 34 Q51 31 54 34 Q57 37 54 40" stroke="{RED}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
  <!-- Flame accent -->
  <path d="M27 35 Q25 31 28 28 Q27 32 30 30 Q28 33 31 35 Q29 35 27 35Z" fill="{RED}" opacity="0.7"/>
''')

# 3. Spraying / Опрыскивание
icons["spray"] = svg(64, f'''
  <circle cx="32" cy="32" r="28" stroke="{NAVY}" stroke-width="2" fill="none"/>
  <!-- Spray bottle -->
  <rect x="22" y="28" width="12" height="18" rx="2" stroke="{NAVY}" stroke-width="2" fill="{NAVY_LIGHT}" fill-opacity="0.15"/>
  <path d="M28 28 L28 22 L34 22 L34 26 L36 26 L36 28" stroke="{NAVY}" stroke-width="1.5" fill="none" stroke-linejoin="round"/>
  <rect x="34" y="24" width="4" height="3" rx="1" stroke="{NAVY}" stroke-width="1.5" fill="none"/>
  <!-- Spray dots -->
  <circle cx="42" cy="22" r="1.5" fill="{NAVY}" opacity="0.7"/>
  <circle cx="45" cy="26" r="1.5" fill="{NAVY}" opacity="0.6"/>
  <circle cx="42" cy="30" r="1.5" fill="{NAVY}" opacity="0.5"/>
  <circle cx="46" cy="33" r="1" fill="{NAVY}" opacity="0.4"/>
  <circle cx="44" cy="19" r="1" fill="{NAVY}" opacity="0.4"/>
  <!-- Nozzle line -->
  <line x1="36" y1="25.5" x2="41" y2="22" stroke="{RED}" stroke-width="1.5" stroke-linecap="round"/>
''')

# 4. Ozonation / Озонация
icons["ozonation"] = svg(64, f'''
  <circle cx="32" cy="32" r="28" stroke="{NAVY}" stroke-width="2" fill="none"/>
  <!-- O3 molecule -->
  <circle cx="32" cy="28" r="7" stroke="{NAVY}" stroke-width="2" fill="{NAVY_LIGHT}" fill-opacity="0.15"/>
  <text x="32" y="32" text-anchor="middle" font-family="monospace" font-size="8" font-weight="bold" fill="{NAVY}">O₃</text>
  <!-- Rays -->
  <line x1="32" y1="14" x2="32" y2="18" stroke="{RED}" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="42" y1="17" x2="40" y2="20" stroke="{RED}" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="22" y1="17" x2="24" y2="20" stroke="{RED}" stroke-width="1.5" stroke-linecap="round"/>
  <!-- Device box -->
  <rect x="20" y="38" width="24" height="12" rx="2" stroke="{NAVY}" stroke-width="2" fill="{NAVY_LIGHT}" fill-opacity="0.1"/>
  <circle cx="28" cy="44" r="2" fill="{RED}" opacity="0.8"/>
  <line x1="33" y1="41" x2="33" y2="47" stroke="{NAVY}" stroke-width="1" opacity="0.5"/>
  <line x1="36" y1="41" x2="36" y2="47" stroke="{NAVY}" stroke-width="1" opacity="0.5"/>
  <line x1="39" y1="41" x2="39" y2="47" stroke="{NAVY}" stroke-width="1" opacity="0.5"/>
''')

# 5. Deodorization / Дезодорация
icons["deodorization"] = svg(64, f'''
  <circle cx="32" cy="32" r="28" stroke="{NAVY}" stroke-width="2" fill="none"/>
  <!-- Bottle -->
  <rect x="26" y="30" width="12" height="18" rx="3" stroke="{NAVY}" stroke-width="2" fill="{NAVY_LIGHT}" fill-opacity="0.15"/>
  <rect x="29" y="26" width="6" height="5" rx="1" stroke="{NAVY}" stroke-width="1.5" fill="none"/>
  <rect x="27" y="24" width="10" height="3" rx="1" stroke="{NAVY}" stroke-width="1.5" fill="none"/>
  <!-- Scent waves -->
  <path d="M22 20 Q24 17 26 20" stroke="{RED}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
  <path d="M30 18 Q32 15 34 18" stroke="{RED}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
  <path d="M38 20 Q40 17 42 20" stroke="{RED}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
  <!-- Star accent -->
  <path d="M32 35 L33 37.5 L35.5 37.5 L33.5 39 L34.3 41.5 L32 40 L29.7 41.5 L30.5 39 L28.5 37.5 L31 37.5 Z" fill="{RED}" opacity="0.6"/>
''')

# 6. Mold removal / Удаление плесени
icons["mold"] = svg(64, f'''
  <circle cx="32" cy="32" r="28" stroke="{NAVY}" stroke-width="2" fill="none"/>
  <!-- Wall surface -->
  <rect x="16" y="36" width="32" height="12" rx="1" stroke="{NAVY}" stroke-width="2" fill="{NAVY_LIGHT}" fill-opacity="0.1"/>
  <!-- Mold spots (crossed out) -->
  <circle cx="24" cy="30" r="5" stroke="{NAVY}" stroke-width="1.5" fill="{NAVY_LIGHT}" fill-opacity="0.2" stroke-dasharray="3 2"/>
  <circle cx="36" cy="28" r="4" stroke="{NAVY}" stroke-width="1.5" fill="{NAVY_LIGHT}" fill-opacity="0.2" stroke-dasharray="3 2"/>
  <circle cx="30" cy="34" r="3" stroke="{NAVY}" stroke-width="1.5" fill="{NAVY_LIGHT}" fill-opacity="0.2" stroke-dasharray="3 2"/>
  <!-- Red X cross -->
  <line x1="20" y1="20" x2="44" y2="44" stroke="{RED}" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="44" y1="20" x2="20" y2="44" stroke="{RED}" stroke-width="2.5" stroke-linecap="round"/>
''')

# 7. Bed bugs / Клопы
icons["bedbugs"] = svg(64, f'''
  <circle cx="32" cy="32" r="28" stroke="{NAVY}" stroke-width="2" fill="none"/>
  <!-- Bug body (oval) -->
  <ellipse cx="32" cy="34" rx="9" ry="6" stroke="{NAVY}" stroke-width="2" fill="{NAVY_LIGHT}" fill-opacity="0.2"/>
  <!-- Head -->
  <circle cx="32" cy="26" r="4" stroke="{NAVY}" stroke-width="2" fill="{NAVY_LIGHT}" fill-opacity="0.2"/>
  <!-- Antennae -->
  <path d="M30 23 L26 18" stroke="{NAVY}" stroke-width="1.5" stroke-linecap="round"/>
  <path d="M34 23 L38 18" stroke="{NAVY}" stroke-width="1.5" stroke-linecap="round"/>
  <!-- Legs -->
  <line x1="23" y1="31" x2="17" y2="28" stroke="{NAVY}" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="23" y1="34" x2="17" y2="34" stroke="{NAVY}" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="23" y1="37" x2="17" y2="40" stroke="{NAVY}" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="41" y1="31" x2="47" y2="28" stroke="{NAVY}" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="41" y1="34" x2="47" y2="34" stroke="{NAVY}" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="41" y1="37" x2="47" y2="40" stroke="{NAVY}" stroke-width="1.5" stroke-linecap="round"/>
  <!-- Red dot accent -->
  <circle cx="32" cy="34" r="2" fill="{RED}" opacity="0.7"/>
''')

# 8. Cockroaches / Тараканы
icons["cockroaches"] = svg(64, f'''
  <circle cx="32" cy="32" r="28" stroke="{NAVY}" stroke-width="2" fill="none"/>
  <!-- Body -->
  <ellipse cx="32" cy="33" rx="7" ry="10" stroke="{NAVY}" stroke-width="2" fill="{NAVY_LIGHT}" fill-opacity="0.2"/>
  <!-- Head -->
  <ellipse cx="32" cy="22" rx="4" ry="3" stroke="{NAVY}" stroke-width="2" fill="{NAVY_LIGHT}" fill-opacity="0.2"/>
  <!-- Antennae -->
  <path d="M30 20 Q26 14 22 12" stroke="{NAVY}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
  <path d="M34 20 Q38 14 42 12" stroke="{NAVY}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
  <!-- Legs -->
  <line x1="25" y1="28" x2="18" y2="24" stroke="{NAVY}" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="25" y1="33" x2="18" y2="33" stroke="{NAVY}" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="25" y1="38" x2="18" y2="42" stroke="{NAVY}" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="39" y1="28" x2="46" y2="24" stroke="{NAVY}" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="39" y1="33" x2="46" y2="33" stroke="{NAVY}" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="39" y1="38" x2="46" y2="42" stroke="{NAVY}" stroke-width="1.5" stroke-linecap="round"/>
  <!-- Wing lines -->
  <line x1="28" y1="26" x2="36" y2="26" stroke="{RED}" stroke-width="1" opacity="0.6"/>
  <line x1="27" y1="30" x2="37" y2="30" stroke="{RED}" stroke-width="1" opacity="0.6"/>
''')

# 9. Rodents / Грызуны
icons["rodents"] = svg(64, f'''
  <circle cx="32" cy="32" r="28" stroke="{NAVY}" stroke-width="2" fill="none"/>
  <!-- Mouse body -->
  <ellipse cx="30" cy="36" rx="10" ry="8" stroke="{NAVY}" stroke-width="2" fill="{NAVY_LIGHT}" fill-opacity="0.2"/>
  <!-- Head -->
  <circle cx="42" cy="32" r="7" stroke="{NAVY}" stroke-width="2" fill="{NAVY_LIGHT}" fill-opacity="0.2"/>
  <!-- Ear -->
  <circle cx="46" cy="26" r="3.5" stroke="{NAVY}" stroke-width="1.5" fill="{NAVY_LIGHT}" fill-opacity="0.1"/>
  <!-- Eye -->
  <circle cx="44" cy="31" r="1.5" fill="{NAVY}"/>
  <!-- Nose -->
  <circle cx="48" cy="33" r="1" fill="{RED}"/>
  <!-- Tail -->
  <path d="M20 38 Q14 42 12 48" stroke="{NAVY}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
  <!-- Whiskers -->
  <line x1="48" y1="32" x2="54" y2="30" stroke="{NAVY}" stroke-width="1" stroke-linecap="round"/>
  <line x1="48" y1="34" x2="54" y2="34" stroke="{NAVY}" stroke-width="1" stroke-linecap="round"/>
''')

# 10. Ticks / Клещи
icons["ticks"] = svg(64, f'''
  <circle cx="32" cy="32" r="28" stroke="{NAVY}" stroke-width="2" fill="none"/>
  <!-- Tick body (teardrop) -->
  <ellipse cx="32" cy="34" rx="8" ry="10" stroke="{NAVY}" stroke-width="2" fill="{NAVY_LIGHT}" fill-opacity="0.2"/>
  <!-- Head (small) -->
  <ellipse cx="32" cy="24" rx="3" ry="2.5" stroke="{NAVY}" stroke-width="1.5" fill="{NAVY_LIGHT}" fill-opacity="0.2"/>
  <!-- Mouthpart -->
  <line x1="32" y1="22" x2="32" y2="18" stroke="{NAVY}" stroke-width="1.5" stroke-linecap="round"/>
  <!-- 8 legs -->
  <line x1="24" y1="28" x2="18" y2="24" stroke="{NAVY}" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="24" y1="32" x2="17" y2="31" stroke="{NAVY}" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="24" y1="36" x2="18" y2="38" stroke="{NAVY}" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="24" y1="40" x2="19" y2="44" stroke="{NAVY}" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="40" y1="28" x2="46" y2="24" stroke="{NAVY}" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="40" y1="32" x2="47" y2="31" stroke="{NAVY}" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="40" y1="36" x2="46" y2="38" stroke="{NAVY}" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="40" y1="40" x2="45" y2="44" stroke="{NAVY}" stroke-width="1.5" stroke-linecap="round"/>
  <!-- Red dot -->
  <circle cx="32" cy="32" r="3" fill="{RED}" opacity="0.6"/>
''')

# 11. Cost calculation / Расчёт стоимости
icons["calculator"] = svg(64, f'''
  <circle cx="32" cy="32" r="28" stroke="{NAVY}" stroke-width="2" fill="none"/>
  <!-- Calculator body -->
  <rect x="18" y="16" width="28" height="34" rx="3" stroke="{NAVY}" stroke-width="2" fill="{NAVY_LIGHT}" fill-opacity="0.1"/>
  <!-- Display -->
  <rect x="22" y="20" width="20" height="8" rx="1" stroke="{NAVY}" stroke-width="1.5" fill="{NAVY_LIGHT}" fill-opacity="0.2"/>
  <text x="38" y="27" text-anchor="end" font-family="monospace" font-size="6" fill="{NAVY}" font-weight="bold">1500</text>
  <!-- Buttons grid -->
  <rect x="22" y="32" width="5" height="4" rx="1" fill="{NAVY}" opacity="0.3"/>
  <rect x="29.5" y="32" width="5" height="4" rx="1" fill="{NAVY}" opacity="0.3"/>
  <rect x="37" y="32" width="5" height="4" rx="1" fill="{RED}" opacity="0.7"/>
  <rect x="22" y="38" width="5" height="4" rx="1" fill="{NAVY}" opacity="0.3"/>
  <rect x="29.5" y="38" width="5" height="4" rx="1" fill="{NAVY}" opacity="0.3"/>
  <rect x="37" y="38" width="5" height="4" rx="1" fill="{NAVY}" opacity="0.3"/>
  <rect x="22" y="44" width="12.5" height="4" rx="1" fill="{NAVY}" opacity="0.3"/>
  <rect x="37" y="44" width="5" height="4" rx="1" fill="{RED}" opacity="0.7"/>
''')

# 12. Specialist visit / Выезд специалиста
icons["specialist"] = svg(64, f'''
  <circle cx="32" cy="32" r="28" stroke="{NAVY}" stroke-width="2" fill="none"/>
  <!-- Person -->
  <circle cx="32" cy="20" r="6" stroke="{NAVY}" stroke-width="2" fill="{NAVY_LIGHT}" fill-opacity="0.2"/>
  <!-- Body with protective suit -->
  <path d="M22 38 L22 30 Q22 26 32 26 Q42 26 42 30 L42 38 Z" stroke="{NAVY}" stroke-width="2" fill="{NAVY_LIGHT}" fill-opacity="0.15"/>
  <!-- Mask on face -->
  <rect x="28" y="22" width="8" height="5" rx="2" stroke="{RED}" stroke-width="1.5" fill="{RED}" fill-opacity="0.2"/>
  <!-- Spray tool -->
  <line x1="42" y1="32" x2="50" y2="28" stroke="{NAVY}" stroke-width="2" stroke-linecap="round"/>
  <circle cx="51" cy="27" r="2" stroke="{RED}" stroke-width="1.5" fill="none"/>
  <!-- Legs -->
  <line x1="27" y1="38" x2="25" y2="48" stroke="{NAVY}" stroke-width="2" stroke-linecap="round"/>
  <line x1="37" y1="38" x2="39" y2="48" stroke="{NAVY}" stroke-width="2" stroke-linecap="round"/>
''')

# 13. Guarantee / Гарантия
icons["guarantee"] = svg(64, f'''
  <circle cx="32" cy="32" r="28" stroke="{NAVY}" stroke-width="2" fill="none"/>
  <!-- Shield -->
  <path d="M32 14 L46 20 L46 34 Q46 44 32 50 Q18 44 18 34 L18 20 Z" stroke="{NAVY}" stroke-width="2" fill="{NAVY_LIGHT}" fill-opacity="0.15"/>
  <!-- Shield inner -->
  <path d="M32 18 L43 23 L43 34 Q43 41 32 46 Q21 41 21 34 L21 23 Z" stroke="{NAVY}" stroke-width="1" fill="{NAVY_LIGHT}" fill-opacity="0.1"/>
  <!-- Checkmark -->
  <path d="M24 32 L29 38 L40 26" stroke="{RED}" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
''')

# 14. Apartment / Квартира
icons["apartment"] = svg(64, f'''
  <circle cx="32" cy="32" r="28" stroke="{NAVY}" stroke-width="2" fill="none"/>
  <!-- Building -->
  <rect x="18" y="24" width="28" height="28" rx="1" stroke="{NAVY}" stroke-width="2" fill="{NAVY_LIGHT}" fill-opacity="0.1"/>
  <!-- Roof -->
  <path d="M15 24 L32 12 L49 24" stroke="{NAVY}" stroke-width="2" fill="{NAVY_LIGHT}" fill-opacity="0.15" stroke-linejoin="round"/>
  <!-- Windows -->
  <rect x="22" y="28" width="7" height="6" rx="1" stroke="{NAVY}" stroke-width="1.5" fill="{NAVY_LIGHT}" fill-opacity="0.3"/>
  <rect x="35" y="28" width="7" height="6" rx="1" stroke="{NAVY}" stroke-width="1.5" fill="{NAVY_LIGHT}" fill-opacity="0.3"/>
  <!-- Door -->
  <rect x="27" y="38" width="10" height="14" rx="1" stroke="{NAVY}" stroke-width="1.5" fill="none"/>
  <circle cx="35" cy="45" r="1" fill="{RED}"/>
''')

# 15. House / Дом
icons["house"] = svg(64, f'''
  <circle cx="32" cy="32" r="28" stroke="{NAVY}" stroke-width="2" fill="none"/>
  <!-- House body -->
  <rect x="14" y="30" width="36" height="22" rx="1" stroke="{NAVY}" stroke-width="2" fill="{NAVY_LIGHT}" fill-opacity="0.1"/>
  <!-- Roof -->
  <path d="M10 30 L32 12 L54 30" stroke="{NAVY}" stroke-width="2" fill="{NAVY_LIGHT}" fill-opacity="0.15" stroke-linejoin="round"/>
  <!-- Chimney -->
  <rect x="40" y="14" width="5" height="10" rx="1" stroke="{NAVY}" stroke-width="1.5" fill="{NAVY_LIGHT}" fill-opacity="0.2"/>
  <!-- Window -->
  <rect x="20" y="34" width="9" height="8" rx="1" stroke="{NAVY}" stroke-width="1.5" fill="{NAVY_LIGHT}" fill-opacity="0.3"/>
  <line x1="24.5" y1="34" x2="24.5" y2="42" stroke="{NAVY}" stroke-width="1" opacity="0.5"/>
  <line x1="20" y1="38" x2="29" y2="38" stroke="{NAVY}" stroke-width="1" opacity="0.5"/>
  <!-- Door -->
  <rect x="33" y="38" width="10" height="14" rx="1" stroke="{NAVY}" stroke-width="1.5" fill="none"/>
  <circle cx="41" cy="45" r="1" fill="{RED}"/>
''')

# 16. Commercial / Коммерческие помещения
icons["commercial"] = svg(64, f'''
  <circle cx="32" cy="32" r="28" stroke="{NAVY}" stroke-width="2" fill="none"/>
  <!-- Office building -->
  <rect x="16" y="18" width="32" height="36" rx="1" stroke="{NAVY}" stroke-width="2" fill="{NAVY_LIGHT}" fill-opacity="0.1"/>
  <!-- Top bar -->
  <rect x="16" y="18" width="32" height="6" rx="1" fill="{NAVY}" fill-opacity="0.3"/>
  <!-- Windows grid 3x3 -->
  <rect x="20" y="28" width="6" height="5" rx="0.5" fill="{NAVY_LIGHT}" fill-opacity="0.4" stroke="{NAVY}" stroke-width="1"/>
  <rect x="29" y="28" width="6" height="5" rx="0.5" fill="{NAVY_LIGHT}" fill-opacity="0.4" stroke="{NAVY}" stroke-width="1"/>
  <rect x="38" y="28" width="6" height="5" rx="0.5" fill="{NAVY_LIGHT}" fill-opacity="0.4" stroke="{NAVY}" stroke-width="1"/>
  <rect x="20" y="36" width="6" height="5" rx="0.5" fill="{NAVY_LIGHT}" fill-opacity="0.4" stroke="{NAVY}" stroke-width="1"/>
  <rect x="29" y="36" width="6" height="5" rx="0.5" fill="{RED}" fill-opacity="0.3" stroke="{RED}" stroke-width="1"/>
  <rect x="38" y="36" width="6" height="5" rx="0.5" fill="{NAVY_LIGHT}" fill-opacity="0.4" stroke="{NAVY}" stroke-width="1"/>
  <!-- Entrance -->
  <rect x="27" y="44" width="10" height="10" rx="1" stroke="{NAVY}" stroke-width="1.5" fill="none"/>
''')

# 17. Ventilation / Вентиляция
icons["ventilation"] = svg(64, f'''
  <circle cx="32" cy="32" r="28" stroke="{NAVY}" stroke-width="2" fill="none"/>
  <!-- Vent grille -->
  <rect x="16" y="20" width="32" height="24" rx="2" stroke="{NAVY}" stroke-width="2" fill="{NAVY_LIGHT}" fill-opacity="0.1"/>
  <!-- Horizontal slats -->
  <line x1="18" y1="26" x2="46" y2="26" stroke="{NAVY}" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="18" y1="30" x2="46" y2="30" stroke="{NAVY}" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="18" y1="34" x2="46" y2="34" stroke="{NAVY}" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="18" y1="38" x2="46" y2="38" stroke="{NAVY}" stroke-width="1.5" stroke-linecap="round"/>
  <!-- Fan/propeller -->
  <circle cx="32" cy="32" r="6" stroke="{RED}" stroke-width="1.5" fill="{RED}" fill-opacity="0.1"/>
  <path d="M32 26 Q35 28 35 32 Q33 29 32 26Z" fill="{RED}" opacity="0.7"/>
  <path d="M38 32 Q36 35 32 35 Q35 33 38 32Z" fill="{RED}" opacity="0.7"/>
  <path d="M32 38 Q29 36 29 32 Q31 35 32 38Z" fill="{RED}" opacity="0.7"/>
  <path d="M26 32 Q28 29 32 29 Q29 31 26 32Z" fill="{RED}" opacity="0.7"/>
  <!-- Air arrows -->
  <path d="M20 48 Q26 44 32 46 Q38 48 44 44" stroke="{NAVY}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
  <path d="M42 42 L44 44 L42 46" stroke="{NAVY}" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
''')

# 18. Demercurization / Демеркуризация
icons["demercurization"] = svg(64, f'''
  <circle cx="32" cy="32" r="28" stroke="{NAVY}" stroke-width="2" fill="none"/>
  <!-- Hazard diamond -->
  <path d="M32 14 L50 32 L32 50 L14 32 Z" stroke="{NAVY}" stroke-width="2" fill="{NAVY_LIGHT}" fill-opacity="0.1"/>
  <!-- Hg symbol (Mercury) -->
  <text x="32" y="37" text-anchor="middle" font-family="serif" font-size="14" font-weight="bold" fill="{NAVY}">Hg</text>
  <!-- Warning exclamation -->
  <circle cx="50" cy="16" r="7" fill="{RED}" opacity="0.9"/>
  <line x1="50" y1="12" x2="50" y2="18" stroke="white" stroke-width="2" stroke-linecap="round"/>
  <circle cx="50" cy="21" r="1.2" fill="white"/>
  <!-- Droplets (mercury) -->
  <circle cx="18" cy="46" r="2.5" stroke="{NAVY}" stroke-width="1.5" fill="{NAVY_LIGHT}" fill-opacity="0.3"/>
  <circle cx="24" cy="50" r="2" stroke="{NAVY}" stroke-width="1.5" fill="{NAVY_LIGHT}" fill-opacity="0.3"/>
  <circle cx="14" cy="50" r="1.5" stroke="{NAVY}" stroke-width="1.5" fill="{NAVY_LIGHT}" fill-opacity="0.3"/>
''')

# Write all icons
for name, content in icons.items():
    path = os.path.join(OUT, f"{name}.svg")
    with open(path, "w") as f:
        f.write(content)
    print(f"✓ {name}.svg")

print(f"\nTotal: {len(icons)} icons written to {OUT}")
