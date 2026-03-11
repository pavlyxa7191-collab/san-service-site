import { useState } from "react";
import { Link } from "wouter";
import { ArrowRight, CheckCircle, Phone, ChevronDown } from "lucide-react";

// ── Design tokens ──────────────────────────────────────────────────────────────
const NAVY = "#0A0F1E";
const RED = "#D0021B";
const WHITE = "#ffffff";

// ── SVG Icons ─────────────────────────────────────────────────────────────────
function IconBug({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <circle cx="24" cy="26" r="12" fill={RED} opacity="0.12" />
      <ellipse cx="24" cy="27" rx="8" ry="10" stroke={RED} strokeWidth="2.2" fill="none" />
      <circle cx="24" cy="18" r="5" stroke={RED} strokeWidth="2.2" fill="none" />
      <line x1="16" y1="22" x2="8" y2="18" stroke={RED} strokeWidth="2" strokeLinecap="round" />
      <line x1="16" y1="27" x2="7" y2="27" stroke={RED} strokeWidth="2" strokeLinecap="round" />
      <line x1="16" y1="32" x2="9" y2="36" stroke={RED} strokeWidth="2" strokeLinecap="round" />
      <line x1="32" y1="22" x2="40" y2="18" stroke={RED} strokeWidth="2" strokeLinecap="round" />
      <line x1="32" y1="27" x2="41" y2="27" stroke={RED} strokeWidth="2" strokeLinecap="round" />
      <line x1="32" y1="32" x2="39" y2="36" stroke={RED} strokeWidth="2" strokeLinecap="round" />
      <line x1="21" y1="13" x2="19" y2="9" stroke={RED} strokeWidth="2" strokeLinecap="round" />
      <line x1="27" y1="13" x2="29" y2="9" stroke={RED} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function IconCockroach({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <circle cx="24" cy="24" r="12" fill={RED} opacity="0.12" />
      <ellipse cx="24" cy="26" rx="7" ry="9" stroke={RED} strokeWidth="2.2" fill="none" />
      <ellipse cx="24" cy="18" r="4.5" stroke={RED} strokeWidth="2.2" fill="none" />
      <line x1="17" y1="21" x2="9" y2="17" stroke={RED} strokeWidth="1.8" strokeLinecap="round" />
      <line x1="17" y1="26" x2="8" y2="26" stroke={RED} strokeWidth="1.8" strokeLinecap="round" />
      <line x1="17" y1="31" x2="10" y2="35" stroke={RED} strokeWidth="1.8" strokeLinecap="round" />
      <line x1="31" y1="21" x2="39" y2="17" stroke={RED} strokeWidth="1.8" strokeLinecap="round" />
      <line x1="31" y1="26" x2="40" y2="26" stroke={RED} strokeWidth="1.8" strokeLinecap="round" />
      <line x1="31" y1="31" x2="38" y2="35" stroke={RED} strokeWidth="1.8" strokeLinecap="round" />
      <line x1="22" y1="14" x2="20" y2="10" stroke={RED} strokeWidth="1.8" strokeLinecap="round" />
      <line x1="26" y1="14" x2="28" y2="10" stroke={RED} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function IconRat({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <circle cx="24" cy="26" r="12" fill={RED} opacity="0.12" />
      <ellipse cx="22" cy="28" rx="9" ry="7" stroke={RED} strokeWidth="2.2" fill="none" />
      <circle cx="34" cy="22" r="5" stroke={RED} strokeWidth="2.2" fill="none" />
      <path d="M31 22 Q22 20 22 28" stroke={RED} strokeWidth="2.2" fill="none" />
      <circle cx="36" cy="20" r="1.2" fill={RED} />
      <line x1="36" y1="20" x2="42" y2="17" stroke={RED} strokeWidth="1.6" strokeLinecap="round" />
      <line x1="36" y1="21" x2="43" y2="21" stroke={RED} strokeWidth="1.6" strokeLinecap="round" />
      <line x1="13" y1="32" x2="8" y2="38" stroke={RED} strokeWidth="2" strokeLinecap="round" />
      <line x1="17" y1="34" x2="15" y2="40" stroke={RED} strokeWidth="2" strokeLinecap="round" />
      <line x1="27" y1="34" x2="29" y2="40" stroke={RED} strokeWidth="2" strokeLinecap="round" />
      <path d="M31 30 Q38 30 40 36" stroke={RED} strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function IconMold({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <circle cx="24" cy="24" r="12" fill={RED} opacity="0.12" />
      <circle cx="20" cy="28" r="5" stroke={RED} strokeWidth="2.2" fill="none" />
      <circle cx="28" cy="24" r="4" stroke={RED} strokeWidth="2" fill="none" />
      <circle cx="22" cy="20" r="3" stroke={RED} strokeWidth="1.8" fill="none" />
      <circle cx="30" cy="30" r="3" stroke={RED} strokeWidth="1.8" fill="none" />
      <line x1="20" y1="23" x2="20" y2="18" stroke={RED} strokeWidth="1.8" strokeLinecap="round" />
      <line x1="24" y1="20" x2="26" y2="16" stroke={RED} strokeWidth="1.8" strokeLinecap="round" />
      <line x1="28" y1="20" x2="30" y2="16" stroke={RED} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function IconSpray({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <circle cx="24" cy="24" r="12" fill={RED} opacity="0.12" />
      <rect x="14" y="26" width="14" height="12" rx="3" stroke={RED} strokeWidth="2.2" fill="none" />
      <rect x="18" y="20" width="6" height="8" rx="2" stroke={RED} strokeWidth="2" fill="none" />
      <line x1="24" y1="22" x2="32" y2="22" stroke={RED} strokeWidth="2" strokeLinecap="round" />
      <line x1="32" y1="22" x2="32" y2="26" stroke={RED} strokeWidth="2" strokeLinecap="round" />
      <line x1="32" y1="26" x2="36" y2="26" stroke={RED} strokeWidth="2" strokeLinecap="round" />
      <circle cx="36" cy="24" r="1.5" fill={RED} />
      <line x1="36" y1="22" x2="39" y2="19" stroke={RED} strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      <line x1="37" y1="24" x2="41" y2="23" stroke={RED} strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      <line x1="36" y1="26" x2="39" y2="29" stroke={RED} strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
}

function IconFog({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <circle cx="24" cy="24" r="12" fill={RED} opacity="0.12" />
      <path d="M12 22 Q18 18 24 22 Q30 26 36 22" stroke={RED} strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <path d="M10 27 Q16 23 22 27 Q28 31 34 27 Q37 25 38 27" stroke={RED} strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M14 32 Q20 28 26 32 Q32 36 38 32" stroke={RED} strokeWidth="1.8" fill="none" strokeLinecap="round" opacity="0.7" />
      <circle cx="24" cy="16" r="4" stroke={RED} strokeWidth="2" fill="none" />
      <line x1="24" y1="12" x2="24" y2="9" stroke={RED} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function IconShield({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <circle cx="24" cy="24" r="12" fill={RED} opacity="0.12" />
      <path d="M24 10 L36 15 L36 26 Q36 34 24 40 Q12 34 12 26 L12 15 Z" stroke={RED} strokeWidth="2.2" fill="none" />
      <path d="M18 24 L22 28 L30 20" stroke={RED} strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconSmell({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <circle cx="24" cy="26" r="12" fill={RED} opacity="0.12" />
      <ellipse cx="24" cy="32" rx="8" ry="5" stroke={RED} strokeWidth="2" fill="none" />
      <path d="M20 32 Q20 26 24 24 Q28 22 28 18 Q28 14 24 13" stroke={RED} strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M16 30 Q14 24 18 20 Q22 16 20 11" stroke={RED} strokeWidth="1.6" fill="none" strokeLinecap="round" opacity="0.7" />
      <path d="M32 30 Q34 24 30 20 Q26 16 28 11" stroke={RED} strokeWidth="1.6" fill="none" strokeLinecap="round" opacity="0.7" />
      <circle cx="24" cy="13" r="2" fill={RED} opacity="0.5" />
      <circle cx="20" cy="11" r="1.5" fill={RED} opacity="0.4" />
      <circle cx="28" cy="11" r="1.5" fill={RED} opacity="0.4" />
    </svg>
  );
}

// ── Data ───────────────────────────────────────────────────────────────────────
const services = [
  {
    slug: "klopov",
    title: "Уничтожение клопов",
    Icon: IconBug,
    badge: null,
    prices: [
      { label: "1-комнатная квартира", value: "1 500 ₽" },
      { label: "2-комнатная квартира", value: "2 500 ₽" },
      { label: "3-комнатная квартира", value: "3 000 ₽" },
      { label: "Частный дом", value: "от 4 000 ₽" },
      { label: "Офис / организация", value: "от 20 ₽/м²" },
    ],
    guarantee: "3 года",
    href: "/services/klopov",
  },
  {
    slug: "tarakanov",
    title: "Уничтожение тараканов",
    Icon: IconCockroach,
    badge: "Популярно",
    prices: [
      { label: "1-комнатная квартира", value: "1 500 ₽" },
      { label: "2-комнатная квартира", value: "500 ₽/м²" },
      { label: "3-комнатная квартира", value: "450 ₽/м²" },
      { label: "Частный дом", value: "400 ₽/м²" },
      { label: "Офис / организация", value: "от 15 ₽/м²" },
    ],
    guarantee: "3 года",
    href: "/services/tarakanov",
  },
  {
    slug: "gryzunov",
    title: "Уничтожение грызунов",
    Icon: IconRat,
    badge: null,
    prices: [
      { label: "1-комнатная квартира", value: "3 000 ₽" },
      { label: "2-комнатная квартира", value: "4 000 ₽" },
      { label: "3-комнатная квартира", value: "5 000 ₽" },
      { label: "Частный дом", value: "от 6 000 ₽" },
      { label: "Офис / организация", value: "от 25 ₽/м²" },
    ],
    guarantee: "1 год",
    href: "/services/gryzunov",
  },
  {
    slug: "pleseni",
    title: "Удаление плесени",
    Icon: IconMold,
    badge: null,
    prices: [
      { label: "1-комнатная квартира", value: "2 000 ₽" },
      { label: "2-комнатная квартира", value: "3 000 ₽" },
      { label: "3-комнатная квартира", value: "4 000 ₽" },
      { label: "Частный дом", value: "от 5 000 ₽" },
      { label: "Офис / организация", value: "от 18 ₽/м²" },
    ],
    guarantee: "2 года",
    href: "/services/pleseni",
  },
  {
    slug: "dezinfektsiya",
    title: "Дезинфекция",
    Icon: IconSpray,
    badge: null,
    prices: [
      { label: "1-комнатная квартира", value: "1 500 ₽" },
      { label: "2-комнатная квартира", value: "2 200 ₽" },
      { label: "3-комнатная квартира", value: "3 000 ₽" },
      { label: "Частный дом", value: "от 4 000 ₽" },
      { label: "Офис / организация", value: "от 12 ₽/м²" },
    ],
    guarantee: "1 год",
    href: "/services/dezinfektsiya",
  },
  {
    slug: "zapahi",
    title: "Удаление запахов",
    Icon: IconSmell,
    badge: null,
    prices: [
      { label: "1-комнатная квартира", value: "2 000 ₽" },
      { label: "2-комнатная квартира", value: "3 000 ₽" },
      { label: "3-комнатная квартира", value: "4 000 ₽" },
      { label: "Частный дом", value: "от 5 000 ₽" },
      { label: "Офис / организация", value: "от 15 ₽/м²" },
    ],
    guarantee: "1 год",
    href: "/services/zapahi",
  },
];

const methods = [
  {
    Icon: IconFog,
    name: "Холодный туман",
    desc: "Базовый метод. Без запаха, быстро. Рекомендуется для квартир и офисов.",
    price: "Базовая цена",
    badge: "Популярно",
    badgeColor: NAVY,
  },
  {
    Icon: IconFog,
    name: "Горячий туман",
    desc: "Максимальная эффективность. Глубокое проникновение в щели и мебель.",
    price: "+1 000 ₽ к базовой",
    badge: "Рекомендуем",
    badgeColor: RED,
  },
  {
    Icon: IconSpray,
    name: "Опрыскивание",
    desc: "Точечная обработка. Для небольших очагов заражения.",
    price: "−500 ₽ от базовой",
    badge: null,
    badgeColor: NAVY,
  },
];

const included = [
  "Выезд специалиста",
  "Диагностика помещения",
  "Все расходные материалы и препараты",
  "Оформление договора",
  "Гарантийный талон (действует на усиленную обработку)",
  "Консультация по профилактике",
  "Повторная обработка по гарантии",
  "Документы для Роспотребнадзора (для организаций)",
];

// ── Service Card ───────────────────────────────────────────────────────────────
function ServiceCard({ s }: { s: typeof services[0] }) {
  const [open, setOpen] = useState(false);
  const visiblePrices = open ? s.prices : s.prices.slice(0, 3);

  return (
    <div
      style={{
        background: WHITE,
        borderRadius: 16,
        border: "1.5px solid #EAEAEA",
        boxShadow: "0 2px 16px rgba(0,9,25,0.06)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        transition: "box-shadow 0.2s, transform 0.2s",
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 40px rgba(0,9,25,0.13)";
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)";
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 16px rgba(0,9,25,0.06)";
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
      }}
    >
      {/* Card header */}
      <div style={{ padding: "1.5rem 1.5rem 1rem", borderBottom: "1px solid #F0F0F0" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 52, height: 52, borderRadius: 14,
              background: "rgba(204,0,0,0.06)",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              <s.Icon size={28} />
            </div>
            <div>
              <h3 style={{ fontSize: "1rem", fontWeight: 800, color: NAVY, lineHeight: 1.2, margin: 0 }}>
                {s.title}
              </h3>
              <div style={{ fontSize: "0.72rem", color: "#888", marginTop: 3 }}>
                Гарантия {s.guarantee}
              </div>
            </div>
          </div>
          {s.badge && (
            <span style={{
              fontSize: "0.65rem", fontWeight: 800, letterSpacing: "0.08em",
              textTransform: "uppercase", background: RED, color: WHITE,
              padding: "3px 8px", borderRadius: 6, flexShrink: 0,
            }}>
              {s.badge}
            </span>
          )}
        </div>
      </div>

      {/* Price rows */}
      <div style={{ padding: "0.75rem 1.5rem", flex: 1 }}>
        {visiblePrices.map((p, i) => (
          <div
            key={p.label}
            style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "0.55rem 0",
              borderBottom: i < visiblePrices.length - 1 ? "1px solid #F5F5F5" : "none",
            }}
          >
            <span style={{ fontSize: "0.82rem", color: "#555", fontWeight: 500 }}>{p.label}</span>
            <span style={{ fontSize: "1rem", fontWeight: 800, color: RED, letterSpacing: "-0.01em" }}>
              {p.value}
            </span>
          </div>
        ))}

        {s.prices.length > 3 && (
          <button
            onClick={() => setOpen(!open)}
            style={{
              display: "flex", alignItems: "center", gap: 4, marginTop: "0.5rem",
              background: "none", border: "none", cursor: "pointer",
              fontSize: "0.78rem", fontWeight: 700, color: NAVY, padding: 0,
            }}
          >
            {open ? "Скрыть" : `Ещё ${s.prices.length - 3} варианта`}
            <ChevronDown
              size={14}
              style={{ transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
            />
          </button>
        )}
      </div>

      {/* Footer */}
      <div style={{ padding: "0.875rem 1.5rem", borderTop: "1px solid #F0F0F0", background: "#FAFAFA" }}>
        <Link
          href={s.href}
          style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            textDecoration: "none", color: NAVY, fontSize: "0.82rem", fontWeight: 700,
          }}
        >
          <span>Подробнее об услуге</span>
          <ArrowRight size={15} style={{ color: RED }} />
        </Link>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function Prices() {
  return (
    <div style={{ background: "#F7F8FA", minHeight: "100vh" }}>

      {/* ── HERO ── */}
      <section className="prices-hero" style={{ background: NAVY, borderBottom: `3px solid ${RED}` }}>
        <div className="container" style={{ paddingTop: "4rem", paddingBottom: "4rem" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: "1rem" }}>
            <div style={{ width: 32, height: 3, background: RED, borderRadius: 2 }} />
            <span style={{ fontSize: "0.72rem", fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: RED }}>
              Прайс-лист
            </span>
          </div>
          <h1 style={{
            fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 900, color: WHITE,
            letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: "1rem",
          }}>
            Цены на услуги
          </h1>
          <p style={{ fontSize: "1.05rem", color: "rgba(255,255,255,0.55)", maxWidth: 520, lineHeight: 1.6, marginBottom: "2rem" }}>
            Фиксированные цены без скрытых платежей. Точная стоимость — после осмотра специалиста.
          </p>
          {/* Trust pills */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {["Фиксированная цена", "Чек и договор", "Гарантия до 3 лет", "Выезд в день обращения"].map(t => (
              <div key={t} style={{
                display: "flex", alignItems: "center", gap: 6,
                background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 100, padding: "5px 14px",
                fontSize: "0.78rem", fontWeight: 600, color: "rgba(255,255,255,0.75)",
              }}>
                <CheckCircle size={12} style={{ color: RED }} />
                {t}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICE CARDS ── */}
      <div className="container" style={{ paddingTop: "3.5rem", paddingBottom: "1rem" }}>
        <div style={{ marginBottom: "2rem" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 900, color: NAVY, letterSpacing: "-0.02em", marginBottom: "0.375rem" }}>
            Цены по услугам
          </h2>
          <p style={{ fontSize: "0.88rem", color: "#777" }}>
            Нажмите на карточку, чтобы узнать подробности об услуге
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "1.25rem",
          marginBottom: "3.5rem",
        }}>
          {services.map(s => <ServiceCard key={s.slug} s={s} />)}
        </div>
      </div>

      {/* ── METHODS ── */}
      <div style={{ background: WHITE, borderTop: "1px solid #EAEAEA", borderBottom: "1px solid #EAEAEA" }}>
        <div className="container" style={{ paddingTop: "3rem", paddingBottom: "3rem" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 900, color: NAVY, letterSpacing: "-0.02em", marginBottom: "0.375rem" }}>
            Методы обработки
          </h2>
          <p style={{ fontSize: "0.88rem", color: "#777", marginBottom: "2rem" }}>
            Выберите метод при заказе — цена рассчитывается автоматически
          </p>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: "1.25rem",
          }}>
            {methods.map(m => (
              <div
                key={m.name}
                style={{
                  background: WHITE,
                  borderRadius: 16,
                  border: "1.5px solid #EAEAEA",
                  padding: "1.5rem",
                  boxShadow: "0 2px 12px rgba(0,9,25,0.05)",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {m.badge && (
                  <span style={{
                    position: "absolute", top: 16, right: 16,
                    fontSize: "0.65rem", fontWeight: 800, letterSpacing: "0.08em",
                    textTransform: "uppercase", background: m.badgeColor, color: WHITE,
                    padding: "3px 8px", borderRadius: 6,
                  }}>
                    {m.badge}
                  </span>
                )}
                <div style={{
                  width: 48, height: 48, borderRadius: 12,
                  background: "rgba(204,0,0,0.06)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  marginBottom: "1rem",
                }}>
                  <m.Icon size={26} />
                </div>
                <h3 style={{ fontSize: "1rem", fontWeight: 800, color: NAVY, marginBottom: "0.5rem" }}>
                  {m.name}
                </h3>
                <p style={{ fontSize: "0.82rem", color: "#666", lineHeight: 1.6, marginBottom: "1rem" }}>
                  {m.desc}
                </p>
                <div style={{
                  fontSize: "0.88rem", fontWeight: 800, color: RED,
                  padding: "6px 12px", background: "rgba(204,0,0,0.06)",
                  borderRadius: 8, display: "inline-block",
                }}>
                  {m.price}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── INCLUDED ── */}
      <div className="container" style={{ paddingTop: "3rem", paddingBottom: "3rem" }}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 900, color: NAVY, letterSpacing: "-0.02em", marginBottom: "0.375rem" }}>
          Что входит в стоимость
        </h2>
        <p style={{ fontSize: "0.88rem", color: "#777", marginBottom: "2rem" }}>
          Без скрытых доплат — всё включено в цену
        </p>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "0.875rem",
        }}>
          {included.map((item) => (
            <div
              key={item}
              style={{
                display: "flex", alignItems: "center", gap: 12,
                background: WHITE, borderRadius: 12,
                border: "1.5px solid #EAEAEA",
                padding: "0.875rem 1.125rem",
                boxShadow: "0 1px 6px rgba(0,9,25,0.04)",
              }}
            >
              <div style={{
                width: 28, height: 28, borderRadius: 8,
                background: "rgba(204,0,0,0.08)",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                <CheckCircle size={14} style={{ color: RED }} />
              </div>
              <span style={{ fontSize: "0.85rem", fontWeight: 600, color: NAVY }}>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── CTA BANNER ── */}
      <div className="container" style={{ paddingBottom: "4rem" }}>
        <div style={{
          background: `linear-gradient(135deg, ${NAVY} 0%, #0a1628 100%)`,
          borderRadius: 20,
          padding: "2.5rem",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1.5rem",
          position: "relative",
          overflow: "hidden",
        }}>
          {/* Decorative circle */}
          <div style={{
            position: "absolute", right: -60, top: -60,
            width: 240, height: 240, borderRadius: "50%",
            border: "1px solid rgba(255,255,255,0.06)",
            pointerEvents: "none",
          }} />
          <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: 3, background: `linear-gradient(90deg, ${RED} 0%, transparent 60%)` }} />

          <div>
            <h3 style={{ fontSize: "1.375rem", fontWeight: 900, color: WHITE, letterSpacing: "-0.02em", marginBottom: "0.5rem" }}>
              Рассчитайте точную стоимость
            </h3>
            <p style={{ fontSize: "0.88rem", color: "rgba(255,255,255,0.55)", maxWidth: 400 }}>
              Используйте наш калькулятор или позвоните — консультация бесплатна
            </p>
          </div>

          <div style={{ display: "flex", gap: "0.875rem", flexWrap: "wrap" }}>
            <Link
              href="/calculator"
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "0.875rem 1.75rem",
                background: RED, color: WHITE, textDecoration: "none",
                fontWeight: 800, fontSize: "0.85rem", letterSpacing: "0.06em",
                textTransform: "uppercase", borderRadius: 10,
              }}
            >
              Калькулятор <ArrowRight size={15} />
            </Link>
            <a
              href="tel:+74951485806"
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "0.875rem 1.75rem",
                background: "rgba(255,255,255,0.08)", color: WHITE, textDecoration: "none",
                fontWeight: 700, fontSize: "0.85rem", letterSpacing: "0.06em",
                textTransform: "uppercase", borderRadius: 10,
                border: "1.5px solid rgba(255,255,255,0.18)",
              }}
            >
              <Phone size={15} /> Позвонить
            </a>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .prices-hero .container { padding-top: 3rem !important; padding-bottom: 2.5rem !important; }
        }
        @media (max-width: 480px) {
          .prices-hero .container { padding-top: 2rem !important; padding-bottom: 2rem !important; }
        }
      `}</style>
    </div>
  );
}
