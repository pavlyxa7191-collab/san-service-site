/**
 * DS.tsx — Единая дизайн-система Экоцентр
 * Все страницы используют эти токены и компоненты
 */
import { useRef, useState, useEffect } from "react";

/* ── DESIGN TOKENS ── */
export const DS = {
  navy:    "#0A0F1E",
  navy2:   "#111827",
  navyMid: "#1A2340",
  red:     "#D0021B",
  redHex:  "#D0021B",
  white:   "#FFFFFF",
  lightBg: "#F8F9FC",
  gray:    "#6B7280",
  border:  "#E5E7EB",
} as const;

/* ── FADE-IN ON SCROLL ── */
export function FadeIn({ children, delay = 0, className = "" }: {
  children: React.ReactNode; delay?: number; className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className={className} style={{
      opacity: inView ? 1 : 0,
      transform: inView ? "translateY(0)" : "translateY(28px)",
      transition: `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms`,
    }}>
      {children}
    </div>
  );
}

/* ── SECTION HEADER ── */
export function SectionHeader({
  label, title, subtitle, dark = false, center = true,
}: {
  label?: string; title: string; subtitle?: string; dark?: boolean; center?: boolean;
}) {
  const textColor = dark ? DS.white : DS.navy2;
  const subColor  = dark ? "rgba(255,255,255,0.55)" : DS.gray;
  return (
    <FadeIn>
      <div style={{ textAlign: center ? "center" : "left", marginBottom: 56 }}>
        {label && (
          <div style={{
            display: "inline-block",
            background: dark ? "rgba(208,2,27,0.18)" : `${DS.red}0f`,
            color: DS.red,
            borderRadius: 100, padding: "6px 18px",
            fontSize: 12, fontWeight: 700,
            letterSpacing: "0.08em", marginBottom: 16,
            textTransform: "uppercase" as const,
          }}>{label}</div>
        )}
        <h2 style={{
          fontSize: "clamp(24px, 3vw, 40px)", fontWeight: 800,
          color: textColor, margin: "0 0 12px", letterSpacing: "-0.02em",
        }}>{title}</h2>
        {subtitle && <p style={{ color: subColor, fontSize: 17, margin: 0 }}>{subtitle}</p>}
      </div>
    </FadeIn>
  );
}

/* ── ANIMATED NUMBER ── */
export function AnimatedNumber({ target, suffix = "" }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setStarted(true); obs.disconnect(); } },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  useEffect(() => {
    if (!started) return;
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
  }, [started, target]);
  return <span ref={ref}>{count.toLocaleString("ru-RU")}{suffix}</span>;
}

/* ── STAT CARD ── */
export function StatCard({ icon, value, suffix, label, desc }: {
  icon: React.ReactNode; value: number; suffix?: string; label: string; desc: string;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: DS.white, borderRadius: 16, padding: "36px 28px",
        border: `1.5px solid ${hovered ? DS.red + "44" : DS.border}`,
        boxShadow: hovered ? `0 12px 40px ${DS.red}18, 0 2px 8px rgba(0,0,0,0.06)` : "0 2px 12px rgba(0,9,25,0.06)",
        transition: "all 0.3s ease",
        transform: hovered ? "translateY(-4px)" : "none",
        cursor: "default", textAlign: "center" as const,
        height: "100%", boxSizing: "border-box" as const,
      }}
    >
      <div style={{
        width: 64, height: 64, borderRadius: 16,
        background: hovered ? `${DS.red}18` : `${DS.red}0f`,
        display: "flex", alignItems: "center", justifyContent: "center",
        margin: "0 auto 20px", transition: "background 0.3s",
      }}>{icon}</div>
      <div style={{ fontSize: "clamp(36px, 4vw, 48px)", fontWeight: 900, color: DS.navy2, lineHeight: 1, marginBottom: 8, letterSpacing: "-0.03em" }}>
        <AnimatedNumber target={value} suffix={suffix} />
      </div>
      <div style={{ fontSize: 15, fontWeight: 600, color: DS.navy2, marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 13, color: DS.gray }}>{desc}</div>
    </div>
  );
}

/* ── TRUST CARD (flip on hover) ── */
export function TrustCard({ icon, title, desc }: {
  icon: React.ReactNode; title: string; desc: string;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? `linear-gradient(135deg, ${DS.navy} 0%, ${DS.navyMid} 100%)` : DS.lightBg,
        borderRadius: 16, padding: "36px 28px",
        border: `1.5px solid ${hovered ? "rgba(255,255,255,0.12)" : DS.border}`,
        boxShadow: hovered ? `0 16px 48px rgba(0,0,0,0.25)` : "0 2px 12px rgba(0,9,25,0.06)",
        transition: "all 0.35s ease",
        transform: hovered ? "translateY(-4px)" : "none",
        cursor: "default", height: "100%", boxSizing: "border-box" as const,
      }}
    >
      <div style={{
        width: 56, height: 56, borderRadius: 14,
        background: hovered ? "rgba(208,2,27,0.2)" : `${DS.red}0f`,
        display: "flex", alignItems: "center", justifyContent: "center",
        marginBottom: 20, transition: "background 0.3s",
      }}>{icon}</div>
      <h3 style={{ fontSize: 18, fontWeight: 700, color: hovered ? DS.white : DS.navy2, marginBottom: 10, transition: "color 0.3s" }}>
        {title}
      </h3>
      <p style={{ fontSize: 14, lineHeight: 1.65, color: hovered ? "rgba(255,255,255,0.65)" : DS.gray, margin: 0, transition: "color 0.3s" }}>
        {desc}
      </p>
    </div>
  );
}

/* ── SERVICE HERO ── */
export function ServiceHero({ title, subtitle, trustBar, onCta }: {
  title: string; subtitle: string;
  trustBar: string[];
  onCta?: () => void;
}) {
  return (
    <section style={{
      background: `linear-gradient(160deg, ${DS.navy} 0%, ${DS.navyMid} 100%)`,
      position: "relative", overflow: "hidden", paddingTop: 80, paddingBottom: 0,
    }}>
      {/* dot grid */}
      <div style={{
        position: "absolute", inset: 0, opacity: 0.4,
        backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)",
        backgroundSize: "28px 28px", pointerEvents: "none",
      }} />
      {/* red glow */}
      <div style={{
        position: "absolute", top: "-20%", left: "-10%",
        width: "60%", height: "80%",
        background: `radial-gradient(ellipse, ${DS.red}14 0%, transparent 70%)`,
        pointerEvents: "none",
      }} />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px 64px" }}>
        {/* breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 32, fontSize: 13, color: "rgba(255,255,255,0.4)" }}>
          <a href="/" style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>Главная</a>
          <span>›</span>
          <a href="/services" style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>Услуги</a>
          <span>›</span>
          <span style={{ color: "rgba(255,255,255,0.7)" }}>{title}</span>
        </div>

        <div style={{ maxWidth: 680 }}>
          <div style={{
            display: "inline-block", background: `${DS.red}22`, color: DS.red,
            borderRadius: 100, padding: "5px 16px", fontSize: 12, fontWeight: 700,
            letterSpacing: "0.08em", marginBottom: 20, textTransform: "uppercase" as const,
            border: `1px solid ${DS.red}33`,
          }}>Профессиональная обработка</div>

          <h1 style={{
            fontSize: "clamp(32px, 5vw, 58px)", fontWeight: 900,
            color: DS.white, lineHeight: 1.1, letterSpacing: "-0.03em",
            margin: "0 0 20px",
          }}>{title}</h1>

          <p style={{
            fontSize: "clamp(15px, 1.8vw, 21px)", color: "rgba(255,255,255,0.72)",
            lineHeight: 1.6, margin: "0 0 36px", fontWeight: 400,
          }}>{subtitle}</p>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" as const }}>
            <a href="#form" onClick={onCta} className="btn-red btn-pulse" style={{ borderRadius: 8, textTransform: "none" as const, fontSize: 15, padding: "14px 28px" }}>
              Рассчитать цену
            </a>
            <span className="phoneAllostat"><a href="tel:+74951452169" className="btn-outline-white" style={{ borderRadius: 8, textTransform: "none" as const, fontSize: 15, padding: "14px 28px" }}>
              ☎ Позвонить
            </a></span>
          </div>
        </div>
      </div>

      {/* trust bar */}
      <div style={{
        background: DS.red, padding: "14px 0",
        position: "relative", zIndex: 1,
      }}>
        <div style={{
          maxWidth: 1200, margin: "0 auto", padding: "0 24px",
          display: "flex", flexWrap: "wrap" as const, gap: "8px 32px", justifyContent: "center",
        }}>
          {trustBar.map((t, i) => (
            <span key={i} style={{ color: "rgba(255,255,255,0.92)", fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ color: "rgba(255,255,255,0.6)" }}>✓</span> {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── SECTION WRAPPER ── */
export function Section({ children, dark = false, style = {} }: {
  children: React.ReactNode; dark?: boolean; style?: React.CSSProperties;
}) {
  return (
    <section style={{
      padding: "80px 0",
      background: dark ? `linear-gradient(160deg, ${DS.navy} 0%, ${DS.navyMid} 100%)` : DS.white,
      position: "relative",
      ...style,
    }}>
      {dark && (
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "28px 28px", pointerEvents: "none",
        }} />
      )}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 1 }}>
        {children}
      </div>
    </section>
  );
}

/* ── STEP CARD ── */
export function StepCard({ num, title, desc, dark = false }: {
  num: string; title: string; desc: string; dark?: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: dark
          ? (hovered ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.05)")
          : (hovered ? DS.lightBg : DS.white),
        border: `1.5px solid ${dark ? "rgba(255,255,255,0.1)" : DS.border}`,
        borderRadius: 16, padding: "28px 24px",
        transition: "all 0.25s ease",
        transform: hovered ? "translateY(-3px)" : "none",
        boxShadow: hovered ? "0 8px 28px rgba(0,0,0,0.12)" : "none",
        height: "100%", boxSizing: "border-box" as const,
      }}
    >
      <div style={{
        width: 44, height: 44, borderRadius: 12,
        background: `${DS.red}18`, border: `2px solid ${DS.red}44`,
        display: "flex", alignItems: "center", justifyContent: "center",
        marginBottom: 16,
        fontSize: 18, fontWeight: 900, color: DS.red,
      }}>{num}</div>
      <h3 style={{ fontSize: 16, fontWeight: 700, color: dark ? DS.white : DS.navy2, marginBottom: 8 }}>{title}</h3>
      <p style={{ fontSize: 13, lineHeight: 1.65, color: dark ? "rgba(255,255,255,0.55)" : DS.gray, margin: 0 }}>{desc}</p>
    </div>
  );
}

/* ── CTA FORM SECTION ── */
export function CtaSection({ title = "Оставьте заявку", subtitle = "Перезвоним за 5 минут. Выезд в день обращения." }: {
  title?: string; subtitle?: string;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [service, setService] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <section id="form" style={{
      background: `linear-gradient(160deg, ${DS.navy} 0%, ${DS.navyMid} 100%)`,
      padding: "80px 0", position: "relative", overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)",
        backgroundSize: "28px 28px", pointerEvents: "none",
      }} />
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 1 }}>
        <FadeIn>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div style={{
              display: "inline-block", background: `${DS.red}22`, color: DS.red,
              borderRadius: 100, padding: "5px 16px", fontSize: 12, fontWeight: 700,
              letterSpacing: "0.08em", marginBottom: 16, textTransform: "uppercase" as const,
              border: `1px solid ${DS.red}33`,
            }}>Бесплатная консультация</div>
            <h2 style={{ fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 800, color: DS.white, margin: "0 0 12px", letterSpacing: "-0.02em" }}>
              {title}
            </h2>
            <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 16, margin: 0 }}>{subtitle}</p>
          </div>
        </FadeIn>

        {sent ? (
          <FadeIn>
            <div style={{
              background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 16, padding: "48px 32px", textAlign: "center",
            }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
              <h3 style={{ color: DS.white, fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Заявка принята!</h3>
              <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 15 }}>Перезвоним в течение 5 минут</p>
            </div>
          </FadeIn>
        ) : (
          <FadeIn delay={100}>
            <form onSubmit={handleSubmit} style={{
              background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 16, padding: "36px 32px", display: "flex", flexDirection: "column" as const, gap: 16,
            }}>
              <input
                className="form-field"
                placeholder="Ваше имя"
                value={name}
                onChange={e => setName(e.target.value)}
                style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)", color: DS.white, borderRadius: 10 }}
              />
              <input
                className="form-field"
                placeholder="+7 (___) ___-__-__"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                required
                style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)", color: DS.white, borderRadius: 10 }}
              />
              <select
                className="form-field"
                value={service}
                onChange={e => setService(e.target.value)}
                style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)", color: service ? DS.white : "rgba(255,255,255,0.4)", borderRadius: 10 }}
              >
                <option value="">Выберите услугу</option>
                <option value="klopov">Уничтожение клопов</option>
                <option value="tarakanov">Уничтожение тараканов</option>
                <option value="gryzunov">Уничтожение грызунов</option>
                <option value="kleshhej">Уничтожение клещей</option>
                <option value="pleseni">Удаление плесени</option>
                <option value="dezinfektsii">Дезинфекция</option>
              </select>
              <button type="submit" className="btn-red" style={{ borderRadius: 10, textTransform: "none" as const, fontSize: 16, padding: "16px 28px", justifyContent: "center" }}>
                Получить консультацию →
              </button>
              <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 12, textAlign: "center" as const, margin: 0 }}>
                Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности
              </p>
            </form>
          </FadeIn>
        )}
      </div>
    </section>
  );
}
