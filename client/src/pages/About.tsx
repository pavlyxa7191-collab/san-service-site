import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";

const RED = "#D0021B";
const NAVY = "#0A0F1E";
const NAVY2 = "#111827";
const LIGHT_BG = "#F8F9FC";
const WHITE = "#FFFFFF";
const GRAY = "#6B7280";
const BORDER = "#E5E7EB";

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { ref, inView } = useInView();
  return (
    <div ref={ref} style={{
      opacity: inView ? 1 : 0,
      transform: inView ? "translateY(0)" : "translateY(28px)",
      transition: `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms`,
    }}>
      {children}
    </div>
  );
}

function AnimatedNumber({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const { ref, inView } = useInView(0.3);
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1600;
    const step = 16;
    const increment = target / (duration / step);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, step);
    return () => clearInterval(timer);
  }, [inView, target]);
  return <span ref={ref}>{count.toLocaleString("ru-RU")}{suffix}</span>;
}

export default function About() {
  const [hoveredStat, setHoveredStat] = useState<number | null>(null);
  const [hoveredTrust, setHoveredTrust] = useState<number | null>(null);
  const [hoveredCred, setHoveredCred] = useState<number | null>(null);

  const stats = [
    {
      icon: (
        <svg width="32" height="32" viewBox="0 0 48 48" fill="none">
          <rect x="8" y="12" width="32" height="28" rx="4" stroke={RED} strokeWidth="2.2" fill="none"/>
          <line x1="8" y1="20" x2="40" y2="20" stroke={RED} strokeWidth="2"/>
          <line x1="16" y1="8" x2="16" y2="16" stroke={RED} strokeWidth="2.5" strokeLinecap="round"/>
          <line x1="32" y1="8" x2="32" y2="16" stroke={RED} strokeWidth="2.5" strokeLinecap="round"/>
          <rect x="15" y="25" width="5" height="5" rx="1" fill={RED} opacity="0.7"/>
          <rect x="22" y="25" width="5" height="5" rx="1" fill={RED} opacity="0.7"/>
          <rect x="29" y="25" width="5" height="5" rx="1" fill={RED} opacity="0.4"/>
        </svg>
      ),
      value: 15, suffix: "+", label: "лет на рынке", desc: "Работаем с 2008 года",
    },
    {
      icon: (
        <svg width="32" height="32" viewBox="0 0 48 48" fill="none">
          <rect x="10" y="8" width="28" height="34" rx="4" stroke={RED} strokeWidth="2.2" fill="none"/>
          <line x1="16" y1="18" x2="32" y2="18" stroke={RED} strokeWidth="2" strokeLinecap="round"/>
          <line x1="16" y1="24" x2="32" y2="24" stroke={RED} strokeWidth="2" strokeLinecap="round"/>
          <line x1="16" y1="30" x2="26" y2="30" stroke={RED} strokeWidth="2" strokeLinecap="round"/>
          <circle cx="34" cy="34" r="7" fill={RED}/>
          <path d="M31 34 L33 36 L37 32" stroke={WHITE} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      value: 12000, suffix: "+", label: "выполненных заказов", desc: "Квартиры, дома, офисы",
    },
    {
      icon: (
        <svg width="32" height="32" viewBox="0 0 48 48" fill="none">
          <circle cx="24" cy="24" r="16" stroke={RED} strokeWidth="2.2" fill="none"/>
          <circle cx="18" cy="20" r="2" fill={RED}/>
          <circle cx="30" cy="20" r="2" fill={RED}/>
          <path d="M16 28 Q24 36 32 28" stroke={RED} strokeWidth="2.2" fill="none" strokeLinecap="round"/>
        </svg>
      ),
      value: 98, suffix: "%", label: "довольных клиентов", desc: "По данным опросов",
    },
    {
      icon: (
        <svg width="32" height="32" viewBox="0 0 48 48" fill="none">
          <circle cx="24" cy="24" r="16" stroke={RED} strokeWidth="2.2" fill="none"/>
          <line x1="24" y1="24" x2="24" y2="14" stroke={RED} strokeWidth="2.5" strokeLinecap="round"/>
          <line x1="24" y1="24" x2="32" y2="24" stroke={RED} strokeWidth="2.5" strokeLinecap="round"/>
          <circle cx="24" cy="24" r="2" fill={RED}/>
        </svg>
      ),
      value: 24, suffix: "/7", label: "работаем без выходных", desc: "Выезд в день обращения",
    },
  ];

  const trusts = [
    {
      icon: (
        <svg width="30" height="30" viewBox="0 0 48 48" fill="none">
          <path d="M24 8 L27.5 18.5 H38.5 L29.5 25 L33 35.5 L24 29 L15 35.5 L18.5 25 L9.5 18.5 H20.5 Z" stroke={RED} strokeWidth="2" fill="none" strokeLinejoin="round"/>
          <path d="M24 12 L26.5 19.5 H34.5 L28 24 L30.5 31.5 L24 27 L17.5 31.5 L20 24 L13.5 19.5 H21.5 Z" fill={RED} opacity="0.15"/>
        </svg>
      ),
      title: "Опыт более 15 лет",
      desc: "С 2008 года проводим профессиональную дезинфекцию, дезинсекцию и дератизацию в Москве и области.",
    },
    {
      icon: (
        <svg width="30" height="30" viewBox="0 0 48 48" fill="none">
          <rect x="6" y="8" width="28" height="22" rx="3" stroke={RED} strokeWidth="2" fill="none"/>
          <line x1="12" y1="16" x2="28" y2="16" stroke={RED} strokeWidth="1.8" strokeLinecap="round"/>
          <line x1="12" y1="21" x2="24" y2="21" stroke={RED} strokeWidth="1.8" strokeLinecap="round"/>
          <circle cx="34" cy="34" r="8" stroke={RED} strokeWidth="2" fill="none"/>
          <path d="M30 34 L33 37 L38 31" stroke={RED} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: "Сертифицированные препараты",
      desc: "Используем только сертифицированные средства, прошедшие государственную регистрацию в России.",
    },
    {
      icon: (
        <svg width="30" height="30" viewBox="0 0 48 48" fill="none">
          <path d="M24 6 L38 12 L38 26 Q38 36 24 44 Q10 36 10 26 L10 12 Z" stroke={RED} strokeWidth="2.2" fill="none"/>
          <path d="M18 24 L22 28 L30 20" stroke={RED} strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: "Гарантия результата",
      desc: "Даём письменную гарантию до 3 лет. Повторная обработка бесплатно при необходимости.",
    },
    {
      icon: (
        <svg width="30" height="30" viewBox="0 0 48 48" fill="none">
          <path d="M12 36 Q12 18 32 12 Q36 24 28 32 Q22 38 12 36 Z" stroke={RED} strokeWidth="2.2" fill="none"/>
          <path d="M12 36 L24 24" stroke={RED} strokeWidth="2" strokeLinecap="round"/>
          <circle cx="30" cy="14" r="2" fill={RED} opacity="0.5"/>
        </svg>
      ),
      title: "Работаем по СанПиН",
      desc: "Все работы проводятся в соответствии с санитарными нормами. Безопасно для детей и животных.",
    },
  ];

  const steps = [
    {
      num: "01",
      title: "Заявка клиента",
      desc: "Оставьте заявку на сайте или позвоните. Ответим в течение 5 минут.",
    },
    {
      num: "02",
      title: "Консультация специалиста",
      desc: "Специалист уточнит детали, подберёт метод и рассчитает стоимость.",
    },
    {
      num: "03",
      title: "Выезд мастера",
      desc: "Приедем в удобное время. Проведём обработку профессиональным оборудованием.",
    },
    {
      num: "04",
      title: "Гарантия результата",
      desc: "Выдаём гарантийный талон. Бесплатно устраним проблему при повторном появлении.",
    },
  ];

  const credentials = [
    {
      icon: (
        <svg width="30" height="30" viewBox="0 0 48 48" fill="none">
          <rect x="8" y="6" width="32" height="36" rx="4" stroke={RED} strokeWidth="2.2" fill="none"/>
          <line x1="14" y1="16" x2="34" y2="16" stroke={RED} strokeWidth="2" strokeLinecap="round"/>
          <line x1="14" y1="22" x2="34" y2="22" stroke={RED} strokeWidth="2" strokeLinecap="round"/>
          <line x1="14" y1="28" x2="26" y2="28" stroke={RED} strokeWidth="2" strokeLinecap="round"/>
          <circle cx="30" cy="34" r="5" fill={RED} opacity="0.15" stroke={RED} strokeWidth="1.5"/>
          <path d="M28 34 L29.5 35.5 L32 33" stroke={RED} strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: "Лицензия СЭС",
      desc: "Лицензия на проведение дезинфекционных работ",
    },
    {
      icon: (
        <svg width="30" height="30" viewBox="0 0 48 48" fill="none">
          <rect x="6" y="8" width="28" height="22" rx="3" stroke={RED} strokeWidth="2" fill="none"/>
          <line x1="12" y1="16" x2="28" y2="16" stroke={RED} strokeWidth="1.8" strokeLinecap="round"/>
          <line x1="12" y1="21" x2="24" y2="21" stroke={RED} strokeWidth="1.8" strokeLinecap="round"/>
          <circle cx="34" cy="34" r="8" stroke={RED} strokeWidth="2" fill="none"/>
          <path d="M30 34 L33 37 L38 31" stroke={RED} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: "Сертификаты",
      desc: "Сертификаты соответствия на все применяемые препараты",
    },
    {
      icon: (
        <svg width="30" height="30" viewBox="0 0 48 48" fill="none">
          <path d="M24 6 L38 12 L38 26 Q38 36 24 44 Q10 36 10 26 L10 12 Z" stroke={RED} strokeWidth="2.2" fill="none"/>
          <path d="M18 24 L22 28 L30 20" stroke={RED} strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: "Гарантия",
      desc: "Письменная гарантия на все виды работ до 3 лет",
    },
    {
      icon: (
        <svg width="30" height="30" viewBox="0 0 48 48" fill="none">
          <path d="M12 36 Q12 18 32 12 Q36 24 28 32 Q22 38 12 36 Z" stroke={RED} strokeWidth="2.2" fill="none"/>
          <path d="M12 36 L24 24" stroke={RED} strokeWidth="2" strokeLinecap="round"/>
          <circle cx="30" cy="14" r="2" fill={RED} opacity="0.5"/>
        </svg>
      ),
      title: "Безопасные препараты",
      desc: "Препараты безопасны для людей, детей и домашних животных",
    },
  ];

  return (
    <div style={{ background: WHITE, minHeight: "100vh" }}>

      {/* BLOCK 1: HERO */}
      <section style={{
        background: `linear-gradient(135deg, ${NAVY} 0%, #1a2340 60%, #0d1526 100%)`,
        position: "relative", overflow: "hidden", padding: "80px 0 60px",
      }}>
        <div style={{
          position: "absolute", inset: 0, opacity: 0.04,
          backgroundImage: `linear-gradient(${WHITE} 1px, transparent 1px), linear-gradient(90deg, ${WHITE} 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }} />
        <div style={{
          position: "absolute", top: -80, right: "20%", width: 400, height: 400,
          background: `radial-gradient(circle, ${RED}22 0%, transparent 70%)`,
          pointerEvents: "none",
        }} />
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", position: "relative" }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 32, opacity: 0.6 }}>
            <Link href="/" style={{ color: WHITE, fontSize: 13, textDecoration: "none" }}>Главная</Link>
            <span style={{ color: WHITE, fontSize: 13 }}>›</span>
            <span style={{ color: WHITE, fontSize: 13 }}>О компании</span>
          </div>
          <div className="about-hero-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
            <div>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: `${RED}22`, border: `1px solid ${RED}44`,
                borderRadius: 100, padding: "6px 16px", marginBottom: 24,
              }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: RED }} />
                <span style={{ color: RED, fontSize: 13, fontWeight: 600, letterSpacing: "0.05em" }}>С 2008 ГОДА</span>
              </div>
              <h1 style={{
                color: WHITE, fontSize: "clamp(30px, 4vw, 52px)", fontWeight: 800,
                lineHeight: 1.15, margin: "0 0 20px", letterSpacing: "-0.02em",
              }}>
                Профессиональная<br /><span style={{ color: RED }}>санитарная</span> служба
              </h1>
              <p style={{ color: "rgba(255,255,255,0.72)", fontSize: 18, lineHeight: 1.7, margin: "0 0 36px", maxWidth: 480 }}>
                Работаем в Москве и Московской области с 2008 года.
                Проводим профессиональную дезинфекцию, дезинсекцию и дератизацию.
              </p>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <Link href="/contacts" style={{
                  display: "inline-block", background: RED, color: WHITE,
                  padding: "14px 28px", borderRadius: 8, fontWeight: 700, fontSize: 15,
                  textDecoration: "none", letterSpacing: "0.02em",
                  boxShadow: `0 4px 20px ${RED}55`,
                }}>
                  Получить консультацию
                </Link>
                <Link href="/prices" style={{
                  display: "inline-block", background: "transparent", color: WHITE,
                  padding: "14px 28px", borderRadius: 8, fontWeight: 600, fontSize: 15,
                  textDecoration: "none", border: "1.5px solid rgba(255,255,255,0.3)",
                }}>
                  Рассчитать стоимость
                </Link>
              </div>
            </div>
            {/* Right: decorative illustration */}
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
              <svg viewBox="0 0 420 360" fill="none" style={{ width: "100%", maxWidth: 420, height: "auto" }}>
                <circle cx="210" cy="180" r="155" fill={RED} opacity="0.06"/>
                <circle cx="210" cy="180" r="110" fill={RED} opacity="0.05"/>
                <rect x="80" y="175" width="260" height="155" rx="6" fill={NAVY} opacity="0.08" stroke={WHITE} strokeWidth="1" strokeOpacity="0.1"/>
                <rect x="100" y="195" width="50" height="55" rx="3" fill={WHITE} opacity="0.12" stroke={WHITE} strokeWidth="1" strokeOpacity="0.2"/>
                <rect x="170" y="195" width="50" height="55" rx="3" fill={WHITE} opacity="0.12" stroke={WHITE} strokeWidth="1" strokeOpacity="0.2"/>
                <rect x="240" y="195" width="50" height="55" rx="3" fill={WHITE} opacity="0.12" stroke={WHITE} strokeWidth="1" strokeOpacity="0.2"/>
                <rect x="158" y="262" width="78" height="68" rx="3" fill={WHITE} opacity="0.1" stroke={WHITE} strokeWidth="1" strokeOpacity="0.15"/>
                <path d="M60 180 L210 75 L360 180" stroke={WHITE} strokeWidth="1.5" fill="none" strokeOpacity="0.2"/>
                <circle cx="210" cy="135" r="22" fill={WHITE} opacity="0.95" stroke={RED} strokeWidth="2"/>
                <ellipse cx="210" cy="140" rx="11" ry="7" fill={RED} opacity="0.2" stroke={RED} strokeWidth="1.5"/>
                <rect x="205" y="136" width="10" height="7" rx="2.5" fill={RED} opacity="0.3"/>
                <ellipse cx="205" cy="130" rx="2.5" ry="3" fill={NAVY} opacity="0.6"/>
                <ellipse cx="215" cy="130" rx="2.5" ry="3" fill={NAVY} opacity="0.6"/>
                <rect x="192" y="157" width="36" height="50" rx="6" fill={WHITE} opacity="0.9" stroke={RED} strokeWidth="1.8"/>
                <rect x="170" y="159" width="22" height="11" rx="5.5" fill={WHITE} opacity="0.9" stroke={RED} strokeWidth="1.6"/>
                <rect x="228" y="159" width="22" height="11" rx="5.5" fill={WHITE} opacity="0.9" stroke={RED} strokeWidth="1.6"/>
                <ellipse cx="164" cy="164" rx="7" ry="5.5" fill={RED} opacity="0.5"/>
                <ellipse cx="256" cy="164" rx="7" ry="5.5" fill={RED} opacity="0.5"/>
                <rect x="196" y="205" width="13" height="38" rx="4" fill={WHITE} opacity="0.9" stroke={RED} strokeWidth="1.6"/>
                <rect x="211" y="205" width="13" height="38" rx="4" fill={WHITE} opacity="0.9" stroke={RED} strokeWidth="1.6"/>
                <ellipse cx="202" cy="243" rx="9" ry="5" fill={NAVY} opacity="0.45"/>
                <ellipse cx="218" cy="243" rx="9" ry="5" fill={NAVY} opacity="0.45"/>
                <rect x="240" y="168" width="26" height="38" rx="7" fill={RED} opacity="0.22" stroke={RED} strokeWidth="1.6"/>
                <rect x="246" y="163" width="14" height="7" rx="3" fill={RED} opacity="0.3"/>
                <path d="M252 172 Q268 162 266 152 Q264 143 256 153" stroke={RED} strokeWidth="2" fill="none" strokeLinecap="round"/>
                <circle cx="263" cy="149" r="2.5" fill={RED} opacity="0.4"/>
                <circle cx="272" cy="142" r="2" fill={RED} opacity="0.3"/>
                <circle cx="281" cy="137" r="1.5" fill={RED} opacity="0.2"/>
                <rect x="28" y="88" width="86" height="34" rx="9" fill={WHITE} opacity="0.1" stroke={WHITE} strokeWidth="1" strokeOpacity="0.2"/>
                <circle cx="47" cy="105" r="9" fill={RED} opacity="0.2"/>
                <path d="M44 105 L46.5 107.5 L51 102" stroke={RED} strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                <rect x="60" y="98" width="46" height="6" rx="3" fill={WHITE} opacity="0.2"/>
                <rect x="60" y="108" width="34" height="4" rx="2" fill={WHITE} opacity="0.12"/>
                <rect x="306" y="78" width="86" height="34" rx="9" fill={WHITE} opacity="0.1" stroke={WHITE} strokeWidth="1" strokeOpacity="0.2"/>
                <text x="316" y="101" fontSize="13" fontWeight="800" fill={RED} fontFamily="sans-serif">15+</text>
                <rect x="334" y="88" width="46" height="6" rx="3" fill={WHITE} opacity="0.2"/>
                <rect x="334" y="98" width="34" height="4" rx="2" fill={WHITE} opacity="0.12"/>
                <rect x="306" y="258" width="86" height="34" rx="9" fill={WHITE} opacity="0.1" stroke={WHITE} strokeWidth="1" strokeOpacity="0.2"/>
                <text x="312" y="281" fontSize="13" fontWeight="800" fill={RED} fontFamily="sans-serif">24/7</text>
                <rect x="334" y="268" width="46" height="6" rx="3" fill={WHITE} opacity="0.2"/>
                <rect x="334" y="278" width="34" height="4" rx="2" fill={WHITE} opacity="0.12"/>
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* BLOCK 2: STATISTICS */}
      <section style={{ padding: "80px 0", background: LIGHT_BG }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <FadeIn>
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <h2 style={{ fontSize: "clamp(24px, 3vw, 40px)", fontWeight: 800, color: NAVY2, margin: "0 0 12px", letterSpacing: "-0.02em" }}>
                Экоцентр в цифрах
              </h2>
              <p style={{ color: GRAY, fontSize: 17, margin: 0 }}>Результаты, которые говорят сами за себя</p>
            </div>
          </FadeIn>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 24 }}>
            {stats.map((s, i) => (
              <FadeIn key={i} delay={i * 80}>
                <div
                  onMouseEnter={() => setHoveredStat(i)}
                  onMouseLeave={() => setHoveredStat(null)}
                  style={{
                    background: WHITE, borderRadius: 16, padding: "36px 28px",
                    border: `1.5px solid ${hoveredStat === i ? RED + "44" : BORDER}`,
                    boxShadow: hoveredStat === i ? `0 12px 40px ${RED}18, 0 2px 8px rgba(0,0,0,0.06)` : "0 2px 12px rgba(0,9,25,0.06)",
                    transition: "all 0.3s ease",
                    transform: hoveredStat === i ? "translateY(-4px)" : "none",
                    cursor: "default", textAlign: "center",
                  }}
                >
                  <div style={{
                    width: 64, height: 64, borderRadius: 16,
                    background: hoveredStat === i ? `${RED}18` : `${RED}0f`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    margin: "0 auto 20px", transition: "background 0.3s",
                  }}>
                    {s.icon}
                  </div>
                  <div style={{ fontSize: "clamp(36px, 4vw, 48px)", fontWeight: 900, color: NAVY2, lineHeight: 1, marginBottom: 8, letterSpacing: "-0.03em" }}>
                    <AnimatedNumber target={s.value} suffix={s.suffix} />
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: NAVY2, marginBottom: 6 }}>{s.label}</div>
                  <div style={{ fontSize: 13, color: GRAY }}>{s.desc}</div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* BLOCK 3: WHY TRUST US */}
      <section style={{ padding: "80px 0", background: WHITE }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <FadeIn>
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <div style={{
                display: "inline-block", background: `${RED}0f`, color: RED,
                borderRadius: 100, padding: "6px 18px", fontSize: 13, fontWeight: 700,
                letterSpacing: "0.06em", marginBottom: 16, textTransform: "uppercase" as const,
              }}>Наши преимущества</div>
              <h2 style={{ fontSize: "clamp(24px, 3vw, 40px)", fontWeight: 800, color: NAVY2, margin: "0 0 12px", letterSpacing: "-0.02em" }}>
                Почему нам доверяют
              </h2>
              <p style={{ color: GRAY, fontSize: 17, margin: 0 }}>Более 12 000 клиентов выбрали нас — вот почему</p>
            </div>
          </FadeIn>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24, alignItems: "stretch" }}>
            {trusts.map((t, i) => (
              <FadeIn key={i} delay={i * 80}>
                <div
                  onMouseEnter={() => setHoveredTrust(i)}
                  onMouseLeave={() => setHoveredTrust(null)}
                  style={{
                    background: hoveredTrust === i ? `linear-gradient(135deg, ${NAVY} 0%, #1a2340 100%)` : LIGHT_BG,
                    borderRadius: 16, padding: "36px 28px",
                    border: `1.5px solid ${hoveredTrust === i ? "transparent" : BORDER}`,
                    boxShadow: hoveredTrust === i ? `0 16px 48px ${NAVY}33` : "0 2px 8px rgba(0,9,25,0.04)",
                    transition: "all 0.35s ease",
                    transform: hoveredTrust === i ? "translateY(-4px)" : "none",
                    cursor: "default",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column" as const,
                  }}
                >
                  <div style={{
                    width: 60, height: 60, borderRadius: 14,
                    background: hoveredTrust === i ? `${RED}22` : `${RED}0f`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    marginBottom: 20, transition: "background 0.3s",
                  }}>
                    {t.icon}
                  </div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 10px", color: hoveredTrust === i ? WHITE : NAVY2, transition: "color 0.3s" }}>
                    {t.title}
                  </h3>
                  <p style={{ fontSize: 14, lineHeight: 1.65, margin: 0, color: hoveredTrust === i ? "rgba(255,255,255,0.72)" : GRAY, transition: "color 0.3s", flex: 1 }}>
                    {t.desc}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* BLOCK 4: HOW WE WORK */}
      <section style={{ padding: "80px 0", background: LIGHT_BG }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <FadeIn>
            <div style={{ textAlign: "center", marginBottom: 64 }}>
              <div style={{
                display: "inline-block", background: `${RED}0f`, color: RED,
                borderRadius: 100, padding: "6px 18px", fontSize: 13, fontWeight: 700,
                letterSpacing: "0.06em", marginBottom: 16, textTransform: "uppercase" as const,
              }}>Процесс работы</div>
              <h2 style={{ fontSize: "clamp(24px, 3vw, 40px)", fontWeight: 800, color: NAVY2, margin: "0 0 12px", letterSpacing: "-0.02em" }}>
                Как мы работаем
              </h2>
              <p style={{ color: GRAY, fontSize: 17, margin: 0 }}>4 простых шага от заявки до гарантии</p>
            </div>
          </FadeIn>
          <div className="about-steps-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24, position: "relative" }}>
            {steps.map((step, i) => (
              <FadeIn key={i} delay={i * 100}>
                <div style={{ textAlign: "center" }}>
                  <div style={{
                    width: 72, height: 72, borderRadius: "50%",
                    background: i === 0 ? RED : WHITE,
                    border: `2.5px solid ${i === 0 ? RED : BORDER}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    margin: "0 auto 24px",
                    boxShadow: i === 0 ? `0 8px 24px ${RED}44` : "0 4px 16px rgba(0,9,25,0.08)",
                  }}>
                    <span style={{ fontSize: 20, fontWeight: 900, color: i === 0 ? WHITE : RED, letterSpacing: "-0.02em" }}>
                      {step.num}
                    </span>
                  </div>
                  <div style={{ background: WHITE, borderRadius: 14, padding: "24px 20px", border: `1.5px solid ${BORDER}`, boxShadow: "0 2px 12px rgba(0,9,25,0.05)" }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: NAVY2, margin: "0 0 8px" }}>{step.title}</h3>
                    <p style={{ fontSize: 13, color: GRAY, lineHeight: 1.6, margin: 0 }}>{step.desc}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* BLOCK 5: CREDENTIALS */}
      <section style={{
        padding: "80px 0",
        background: `linear-gradient(135deg, ${NAVY} 0%, #1a2340 100%)`,
        position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", bottom: -100, left: "30%", width: 500, height: 500,
          background: `radial-gradient(circle, ${RED}15 0%, transparent 70%)`,
          pointerEvents: "none",
        }} />
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", position: "relative" }}>
          <FadeIn>
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <div style={{
                display: "inline-block", background: `${RED}22`, color: RED,
                borderRadius: 100, padding: "6px 18px", fontSize: 13, fontWeight: 700,
                letterSpacing: "0.06em", marginBottom: 16, textTransform: "uppercase" as const,
                border: `1px solid ${RED}33`,
              }}>Документы и гарантии</div>
              <h2 style={{ fontSize: "clamp(24px, 3vw, 40px)", fontWeight: 800, color: WHITE, margin: "0 0 12px", letterSpacing: "-0.02em" }}>
                Работаем официально
              </h2>
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 17, margin: 0 }}>
                Все документы в порядке — можем предоставить по запросу
              </p>
            </div>
          </FadeIn>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
            {credentials.map((c, i) => (
              <FadeIn key={i} delay={i * 80}>
                <div
                  onMouseEnter={() => setHoveredCred(i)}
                  onMouseLeave={() => setHoveredCred(null)}
                  style={{
                    background: hoveredCred === i ? `${RED}18` : "rgba(255,255,255,0.05)",
                    borderRadius: 16, padding: "32px 24px",
                    border: `1.5px solid ${hoveredCred === i ? RED + "55" : "rgba(255,255,255,0.1)"}`,
                    transition: "all 0.3s ease",
                    transform: hoveredCred === i ? "translateY(-4px)" : "none",
                    cursor: "default", textAlign: "center",
                  }}
                >
                  <div style={{
                    width: 60, height: 60, borderRadius: 14, background: `${RED}22`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    margin: "0 auto 18px",
                  }}>
                    {c.icon}
                  </div>
                  <h3 style={{ fontSize: 17, fontWeight: 700, color: WHITE, margin: "0 0 10px" }}>{c.title}</h3>
                  <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.6, margin: 0 }}>{c.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
          <FadeIn delay={200}>
            <div style={{ textAlign: "center", marginTop: 56 }}>
              <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 16, marginBottom: 24 }}>
                Готовы решить вашу проблему сегодня
              </p>
              <Link href="/contacts" style={{
                display: "inline-block", background: RED, color: WHITE,
                padding: "16px 40px", borderRadius: 8, fontWeight: 700, fontSize: 16,
                textDecoration: "none", boxShadow: `0 8px 28px ${RED}55`,
                letterSpacing: "0.02em",
              }}>
                Получить бесплатную консультацию →
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      <style>{`
        @media (max-width: 900px) {
          .about-hero-grid { grid-template-columns: 1fr !important; }
          .about-hero-grid > div:last-child { display: none !important; }
          .about-steps-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 480px) {
          .about-steps-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
