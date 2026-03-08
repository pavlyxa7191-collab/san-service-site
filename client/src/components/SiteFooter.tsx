import { Link } from "wouter";
import { Phone, Mail, MapPin, Clock, Shield, FileText } from "lucide-react";

/* Design Tokens */
const DARK = "#000919";   // --color-primary: Deep navy (almost black-blue)
const DARK2 = "#081526";  // --color-primary-dark: Deeper variant
const RED = "#CC0000";    // --color-accent

const services = [
  { label: "Уничтожение клопов", href: "/services/klopov" },
  { label: "Уничтожение тараканов", href: "/services/tarakanov" },
  { label: "Уничтожение грызунов", href: "/services/gryzunov" },
  { label: "Уничтожение клещей", href: "/services/kleshhej" },
  { label: "Удаление плесени", href: "/services/pleseni" },
  { label: "Дезинфекция", href: "/services/dezinfektsii" },
];

const cities = [
  { label: "Москва", href: "/services/klopov/moskva" },
  { label: "Воскресенск", href: "/services/klopov/voskresensk" },
  { label: "Коломна", href: "/services/klopov/kolomna" },
  { label: "Жуковский", href: "/services/klopov/zhukovsky" },
  { label: "Раменское", href: "/services/klopov/ramenskoe" },
  { label: "Люберцы", href: "/services/klopov/lyubertsy" },
];

export default function SiteFooter() {
  return (
    <footer
      style={{
        background: `linear-gradient(180deg, ${DARK} 0%, ${DARK2} 100%)`,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Top shimmer line */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)" }} />
      {/* Background glow */}
      <div style={{ position: "absolute", bottom: "-30%", right: "-10%", width: "50%", height: "80%", background: "radial-gradient(ellipse, rgba(30,60,100,0.2) 0%, transparent 65%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: "-20%", left: "-5%", width: "40%", height: "60%", background: "radial-gradient(ellipse, rgba(204,0,0,0.04) 0%, transparent 65%)", pointerEvents: "none" }} />

      {/* CTA Banner */}
      <div
        style={{
          background: "linear-gradient(135deg, rgba(204,0,0,0.1) 0%, rgba(204,0,0,0.05) 100%)",
          borderBottom: "1px solid rgba(204,0,0,0.15)",
          padding: "2rem 0",
          position: "relative",
        }}
      >
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(90deg, transparent, rgba(204,0,0,0.35), transparent)" }} />
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "white", letterSpacing: "-0.02em" }}>
              Нужна срочная обработка?
            </div>
            <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.45)", marginTop: "4px" }}>
              Выезд специалиста в день обращения — работаем 24/7
            </div>
          </div>
          <div className="flex gap-3 flex-wrap">
            <a
              href="tel:+74951485806"
              style={{
                display: "inline-flex", alignItems: "center", gap: "8px",
                background: "linear-gradient(135deg, #CC0000, #880000)",
                color: "white", fontWeight: 700, fontSize: "0.82rem",
                letterSpacing: "0.05em", textTransform: "uppercase",
                padding: "0.75rem 1.5rem", borderRadius: "3px",
                textDecoration: "none",
                boxShadow: "0 3px 14px rgba(204,0,0,0.4)",
              }}
            >
              <Phone size={15} />
              8(495)148-58-06
            </a>
            <Link
              href="/calculator"
              style={{
                display: "inline-flex", alignItems: "center", gap: "8px",
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.12)",
                color: "rgba(255,255,255,0.85)", fontWeight: 700, fontSize: "0.82rem",
                letterSpacing: "0.04em",
                padding: "0.75rem 1.5rem", borderRadius: "3px",
                textDecoration: "none",
              }}
            >
              Рассчитать цену
            </Link>
          </div>
        </div>
      </div>

      {/* Main footer grid */}
      <div className="container py-16" style={{ position: "relative", zIndex: 1 }}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Company info */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div
                style={{
                  width: "40px", height: "40px",
                  background: "linear-gradient(135deg, #CC0000, #880000)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  borderRadius: "3px",
                  boxShadow: "0 3px 12px rgba(204,0,0,0.4)",
                  flexShrink: 0,
                }}
              >
                <span style={{ color: "white", fontWeight: 900, fontSize: "0.9rem", letterSpacing: "-0.05em" }}>СЭС</span>
              </div>
              <div>
                <div style={{ fontSize: "0.95rem", fontWeight: 900, color: "white", letterSpacing: "-0.02em" }}>Экоцентр</div>
                <div style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.35)", letterSpacing: "0.08em", textTransform: "uppercase" }}>Санитарная служба</div>
              </div>
            </div>
            <p style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.4)", lineHeight: 1.7, marginBottom: "1.25rem" }}>
              Профессиональная дезинсекция, дератизация и дезинфекция в Москве и Московской области. Гарантия 3 года по договору.
            </p>
            <div className="flex flex-col gap-3">
              {[
                { icon: Phone, text: "8(495)148-58-06", href: "tel:+74951485806" },
                { icon: Mail, text: "dezservis88@yandex.ru", href: "mailto:dezservis88@yandex.ru" },
              ].map((c) => {
                const Icon = c.icon;
                return (
                  <a
                    key={c.text}
                    href={c.href}
                    style={{
                      display: "flex", alignItems: "center", gap: "8px",
                      fontSize: "0.78rem", color: "rgba(255,255,255,0.6)",
                      textDecoration: "none", transition: "color 0.15s",
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "white"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.6)"; }}
                  >
                    <Icon size={13} style={{ color: RED, flexShrink: 0 }} />
                    {c.text}
                  </a>
                );
              })}
              <div style={{ display: "flex", alignItems: "flex-start", gap: "8px", fontSize: "0.78rem", color: "rgba(255,255,255,0.4)" }}>
                <MapPin size={13} style={{ color: RED, flexShrink: 0, marginTop: "2px" }} />
                Московская обл., г. Воскресенск, ул. Хрипунова, д. 5, оф. 16
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.78rem", color: "rgba(255,255,255,0.4)" }}>
                <Clock size={13} style={{ color: RED, flexShrink: 0 }} />
                Работаем 24/7
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: "1.25rem" }}>
              Услуги
            </h4>
            <div className="flex flex-col gap-2">
              {services.map((s) => (
                <Link
                  key={s.href}
                  href={s.href}
                  style={{
                    fontSize: "0.82rem", color: "rgba(255,255,255,0.55)",
                    textDecoration: "none", transition: "color 0.15s",
                    display: "flex", alignItems: "center", gap: "8px",
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "white"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.55)"; }}
                >
                  <span style={{ width: "4px", height: "4px", background: RED, borderRadius: "50%", flexShrink: 0 }} />
                  {s.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Cities + Company links */}
          <div>
            <h4 style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: "1.25rem" }}>
              Города
            </h4>
            <div className="flex flex-col gap-2 mb-8">
              {cities.map((c) => (
                <Link
                  key={c.href}
                  href={c.href}
                  style={{
                    fontSize: "0.82rem", color: "rgba(255,255,255,0.55)",
                    textDecoration: "none", transition: "color 0.15s",
                    display: "flex", alignItems: "center", gap: "8px",
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "white"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.55)"; }}
                >
                  <span style={{ width: "4px", height: "4px", background: RED, borderRadius: "50%", flexShrink: 0 }} />
                  {c.label}
                </Link>
              ))}
            </div>

            <h4 style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: "1rem" }}>
              Компания
            </h4>
            <div className="flex flex-col gap-2">
              {[
                { label: "О компании", href: "/about" },
                { label: "Цены", href: "/prices" },
                { label: "Блог", href: "/blog" },
                { label: "Контакты", href: "/contacts" },
              ].map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  style={{
                    fontSize: "0.82rem", color: "rgba(255,255,255,0.55)",
                    textDecoration: "none", transition: "color 0.15s",
                    display: "flex", alignItems: "center", gap: "8px",
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "white"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.55)"; }}
                >
                  <span style={{ width: "4px", height: "4px", background: "rgba(255,255,255,0.2)", borderRadius: "50%", flexShrink: 0 }} />
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Trust & Requisites */}
          <div>
            <h4 style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: "1.25rem" }}>
              Гарантии
            </h4>
            <div className="flex flex-col gap-3 mb-6">
              {[
                { icon: Shield, text: "Гарантия по договору 3 года" },
                { icon: FileText, text: "Сертифицированные препараты" },
                { icon: Shield, text: "Безопасно для детей и животных" },
                { icon: FileText, text: "Официальный договор" },
                { icon: Shield, text: "Санитарные заключения" },
              ].map((g) => {
                const Icon = g.icon;
                return (
                  <div key={g.text} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.78rem", color: "rgba(255,255,255,0.5)" }}>
                    <Icon size={12} style={{ color: RED, flexShrink: 0 }} />
                    {g.text}
                  </div>
                );
              })}
            </div>

            {/* Requisites glass card */}
            <div
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "5px",
                padding: "1rem 1.125rem",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)" }} />
              <div style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginBottom: "0.75rem" }}>
                Реквизиты
              </div>
              {[
                ["Организация", "ООО «Экоцентр»"],
                ["ИНН", "5005040782"],
                ["КПП", "500501001"],
                ["ОГРН", "1025004456174"],
              ].map(([label, value]) => (
                <div key={label} style={{ display: "flex", flexDirection: "column", marginBottom: "0.5rem" }}>
                  <span style={{ fontSize: "0.62rem", color: "rgba(255,255,255,0.28)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</span>
                  <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.65)", fontWeight: 600 }}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        style={{
          borderTop: "1px solid rgba(255,255,255,0.06)",
          padding: "1.25rem 0",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div className="container flex flex-col md:flex-row items-center justify-between gap-3">
          <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.28)" }}>
            © {new Date().getFullYear()} ООО «Экоцентр». Все права защищены.
          </div>
          <div className="flex gap-5">
            {[
              { label: "Политика конфиденциальности", href: "/privacy" },
              { label: "Карта сайта", href: "/sitemap" },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.28)", textDecoration: "none", transition: "color 0.15s" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.6)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.28)"; }}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
