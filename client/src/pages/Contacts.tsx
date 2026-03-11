import { useState, useEffect, useRef } from "react";
import { Phone, Mail, MapPin, Clock, ArrowRight, CheckCircle, MessageCircle } from "lucide-react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

// ─── DESIGN TOKENS (matching About.tsx) ────────────────────────────────────────
const NAVY = "#0A0F1E";
const NAVY2 = "#0D1F33";
const RED = "#D0021B";
const WHITE = "#ffffff";
const LIGHT_BG = "#f7f8fa";
const GRAY = "#6b7280";
const BORDER = "#e5e7eb";

// ─── FADE IN ANIMATION ─────────────────────────────────────────────────────────
function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(24px)",
      transition: `opacity 0.55s ease ${delay}ms, transform 0.55s ease ${delay}ms`,
    }}>
      {children}
    </div>
  );
}

// ─── CONTACT CARDS DATA ─────────────────────────────────────────────────────────
const contactCards = [
  {
    icon: <Phone size={22} color={RED} />,
    label: "Телефон",
    value: "8(495)148-58-06",
    sub: "Работаем 24/7",
    href: "tel:+74951485806",
    isLink: true,
  },
  {
    icon: <MessageCircle size={22} color={RED} />,
    label: "WhatsApp",
    value: "Написать в WhatsApp",
    sub: "Ответим за 5 минут",
    href: "https://wa.me/74951485806",
    isLink: true,
  },
  {
    icon: <Mail size={22} color={RED} />,
    label: "Email",
    value: "info@ses88.ru",
    sub: "Для официальных запросов",
    href: "mailto:info@ses88.ru",
    isLink: true,
  },
  {
    icon: <MapPin size={22} color={RED} />,
    label: "Адрес",
    value: "г. Москва, ул. Профсоюзная, д. 56",
    sub: "Работаем по всей Москве и МО",
    href: null,
    isLink: false,
  },
  {
    icon: <Clock size={22} color={RED} />,
    label: "Режим работы",
    value: "Круглосуточно, 7 дней",
    sub: "Выезд в день обращения",
    href: null,
    isLink: false,
  },
];

const trustItems = [
  "Официальный договор на каждый заказ",
  "Гарантия до 3 лет",
  "Сертифицированные препараты",
  "Безопасно для детей и животных",
  "ИНН: 7726389900 | ОГРН: 1157746482250",
];

export default function Contacts() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const createLead = trpc.leads.create.useMutation({
    onSuccess: () => setSubmitted(true),
    onError: () => toast.error("Ошибка при отправке. Позвоните нам напрямую."),
  });

  function validate() {
    const errs: { name?: string; phone?: string } = {};
    if (!name.trim()) errs.name = "Введите имя";
    if (!phone.trim() || phone.replace(/\D/g, "").length < 10) errs.phone = "Введите корректный телефон";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  const inputStyle = (field: string, hasError?: boolean) => ({
    width: "100%", padding: "14px 16px", borderRadius: 10, fontSize: 15,
    border: `1.5px solid ${hasError ? RED : focusedField === field ? NAVY : BORDER}`,
    outline: "none", background: WHITE, color: NAVY,
    transition: "border-color 0.2s",
    boxSizing: "border-box" as const,
  });

  return (
    <div style={{ background: WHITE }}>
      {/* Hero */}
      <section className="contacts-hero" style={{ background: `linear-gradient(135deg, ${NAVY} 0%, ${NAVY2} 100%)`, padding: "80px 0 60px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <FadeIn>
            {/* Breadcrumb */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 28, fontSize: 13, color: "rgba(255,255,255,0.45)" }}>
              <Link href="/" style={{ color: "rgba(255,255,255,0.45)", textDecoration: "none" }}>Главная</Link>
              <span>/</span>
              <span style={{ color: "rgba(255,255,255,0.8)" }}>Контакты</span>
            </div>
            <div style={{
              display: "inline-block", background: `${RED}22`, color: RED,
              borderRadius: 100, padding: "6px 18px", fontSize: 12, fontWeight: 700,
              letterSpacing: "0.08em", marginBottom: 20, textTransform: "uppercase" as const,
              border: `1px solid ${RED}44`,
            }}>
              Контакты
            </div>
            <h1 style={{
              fontSize: "clamp(2rem, 4vw, 3.25rem)", fontWeight: 900, color: WHITE,
              margin: "0 0 16px", letterSpacing: "-0.03em", lineHeight: 1.1,
            }}>
              Свяжитесь с нами
            </h1>
            <p style={{ fontSize: 18, color: "rgba(255,255,255,0.6)", margin: 0, maxWidth: 480 }}>
              Работаем 24/7. Выезд специалиста в день обращения.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Contact cards row */}
      <section style={{ padding: "64px 0", background: LIGHT_BG }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <FadeIn>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
              {contactCards.map((card, i) => (
                <FadeIn key={i} delay={i * 70}>
                  <div style={{
                    background: WHITE, borderRadius: 16, padding: "24px 20px",
                    border: `1.5px solid ${BORDER}`,
                    boxShadow: "0 2px 8px rgba(0,9,25,0.04)",
                    height: "100%", display: "flex", flexDirection: "column" as const, gap: 12,
                  }}>
                    <div style={{
                      width: 48, height: 48, borderRadius: 12,
                      background: `${RED}0f`, display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      {card.icon}
                    </div>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: GRAY, letterSpacing: "0.08em", textTransform: "uppercase" as const, marginBottom: 6 }}>
                        {card.label}
                      </div>
                      {card.isLink && card.href ? (
                        <a href={card.href} style={{ fontSize: 15, fontWeight: 700, color: NAVY, textDecoration: "none", display: "block", marginBottom: 4 }}
                          onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.color = RED}
                          onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.color = NAVY}
                        >
                          {card.value}
                        </a>
                      ) : (
                        <div style={{ fontSize: 15, fontWeight: 700, color: NAVY, marginBottom: 4 }}>{card.value}</div>
                      )}
                      <div style={{ fontSize: 12, color: GRAY }}>{card.sub}</div>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Main content: Form + Trust */}
      <section style={{ padding: "80px 0", background: WHITE }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 400px", gap: 48, alignItems: "start" }}>

            {/* Form */}
            <FadeIn>
              <div>
                <div style={{ marginBottom: 36 }}>
                  <div style={{
                    display: "inline-block", background: `${RED}0f`, color: RED,
                    borderRadius: 100, padding: "6px 18px", fontSize: 12, fontWeight: 700,
                    letterSpacing: "0.08em", marginBottom: 16, textTransform: "uppercase" as const,
                  }}>
                    Заявка
                  </div>
                  <h2 style={{ fontSize: "clamp(22px, 2.5vw, 36px)", fontWeight: 800, color: NAVY, margin: "0 0 10px", letterSpacing: "-0.02em" }}>
                    Оставить заявку
                  </h2>
                  <p style={{ fontSize: 15, color: GRAY, margin: 0 }}>
                    Перезвоним в течение 15 минут. Бесплатная консультация.
                  </p>
                </div>

                {submitted ? (
                  <div style={{
                    background: LIGHT_BG, borderRadius: 20, padding: "60px 40px",
                    textAlign: "center", border: `1.5px solid ${BORDER}`,
                  }}>
                    <div style={{
                      width: 72, height: 72, borderRadius: "50%",
                      background: `${RED}12`, display: "flex", alignItems: "center", justifyContent: "center",
                      margin: "0 auto 24px",
                    }}>
                      <CheckCircle size={36} color={RED} />
                    </div>
                    <h3 style={{ fontSize: 24, fontWeight: 800, color: NAVY, margin: "0 0 10px", letterSpacing: "-0.02em" }}>
                      Заявка принята!
                    </h3>
                    <p style={{ fontSize: 15, color: GRAY, margin: "0 0 28px" }}>
                      Наш специалист перезвонит вам в течение 15 минут.
                    </p>
                    <a href="tel:+74951485806" style={{
                      display: "inline-flex", alignItems: "center", gap: 8,
                      background: RED, color: WHITE, textDecoration: "none",
                      padding: "12px 28px", borderRadius: 10, fontWeight: 700, fontSize: 14,
                    }}>
                      <Phone size={14} /> 8(495)148-58-06
                    </a>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column" as const, gap: 20 }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                      <div>
                        <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: NAVY, letterSpacing: "0.05em", textTransform: "uppercase" as const, marginBottom: 8 }}>
                          Ваше имя *
                        </label>
                        <input
                          type="text"
                          placeholder="Иван Иванов"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          onFocus={() => setFocusedField("name")}
                          onBlur={() => setFocusedField(null)}
                          style={inputStyle("name", !!errors.name)}
                        />
                        {errors.name && <p style={{ fontSize: 12, color: RED, margin: "6px 0 0" }}>{errors.name}</p>}
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: NAVY, letterSpacing: "0.05em", textTransform: "uppercase" as const, marginBottom: 8 }}>
                          Телефон *
                        </label>
                        <input
                          type="tel"
                          placeholder="+7 (900) 000-00-00"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          onFocus={() => setFocusedField("phone")}
                          onBlur={() => setFocusedField(null)}
                          style={inputStyle("phone", !!errors.phone)}
                        />
                        {errors.phone && <p style={{ fontSize: 12, color: RED, margin: "6px 0 0" }}>{errors.phone}</p>}
                      </div>
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: NAVY, letterSpacing: "0.05em", textTransform: "uppercase" as const, marginBottom: 8 }}>
                        Email
                      </label>
                      <input
                        type="email"
                        placeholder="ivan@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onFocus={() => setFocusedField("email")}
                        onBlur={() => setFocusedField(null)}
                        style={inputStyle("email")}
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: NAVY, letterSpacing: "0.05em", textTransform: "uppercase" as const, marginBottom: 8 }}>
                        Сообщение
                      </label>
                      <textarea
                        rows={4}
                        placeholder="Опишите проблему..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onFocus={() => setFocusedField("message")}
                        onBlur={() => setFocusedField(null)}
                        style={{ ...inputStyle("message"), resize: "vertical" as const }}
                      />
                    </div>

                    <button
                      onClick={() => validate() && createLead.mutate({ name, phone, email, message, source: "contact-page" })}
                      disabled={createLead.isPending}
                      style={{
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                        background: createLead.isPending ? "#999" : RED, color: WHITE,
                        border: "none", borderRadius: 10, padding: "16px 32px",
                        fontSize: 15, fontWeight: 700, cursor: createLead.isPending ? "not-allowed" : "pointer",
                        transition: "background 0.2s, transform 0.15s",
                        letterSpacing: "0.02em",
                      }}
                      onMouseEnter={(e) => { if (!createLead.isPending) (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "none"; }}
                    >
                      {createLead.isPending ? "Отправка..." : "Отправить заявку"}
                      {!createLead.isPending && <ArrowRight size={16} />}
                    </button>

                    <p style={{ fontSize: 12, color: GRAY, margin: 0 }}>
                      Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности. Данные не передаются третьим лицам.
                    </p>
                  </div>
                )}
              </div>
            </FadeIn>

            {/* Sidebar: Trust block */}
            <FadeIn delay={100}>
              <div style={{ position: "sticky", top: 100 }}>
                {/* Quick call card */}
                <div style={{
                  background: `linear-gradient(135deg, ${NAVY} 0%, ${NAVY2} 100%)`,
                  borderRadius: 20, padding: "32px 28px", marginBottom: 20,
                }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: RED, letterSpacing: "0.1em", textTransform: "uppercase" as const, marginBottom: 12 }}>
                    Быстрый звонок
                  </div>
                  <a href="tel:+74951485806" style={{ fontSize: 26, fontWeight: 900, color: WHITE, textDecoration: "none", display: "block", marginBottom: 6, letterSpacing: "-0.02em" }}>
                    8(495)148-58-06
                  </a>
                  <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", margin: "0 0 24px" }}>Работаем 24/7</p>
                  <div style={{ display: "flex", gap: 10 }}>
                    <a href="tel:+74951485806" style={{
                      flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                      background: RED, color: WHITE, textDecoration: "none",
                      padding: "11px 16px", borderRadius: 8, fontWeight: 700, fontSize: 13,
                    }}>
                      <Phone size={13} /> Позвонить
                    </a>
                    <a href="https://wa.me/74951485806" style={{
                      flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                      background: "rgba(255,255,255,0.1)", color: WHITE, textDecoration: "none",
                      padding: "11px 16px", borderRadius: 8, fontWeight: 700, fontSize: 13,
                      border: "1px solid rgba(255,255,255,0.2)",
                    }}>
                      <MessageCircle size={13} /> WhatsApp
                    </a>
                  </div>
                </div>

                {/* Trust items */}
                <div style={{ background: LIGHT_BG, borderRadius: 20, padding: "28px 24px", border: `1.5px solid ${BORDER}` }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: RED, letterSpacing: "0.1em", textTransform: "uppercase" as const, marginBottom: 20 }}>
                    Почему выбирают нас
                  </div>
                  <div style={{ display: "flex", flexDirection: "column" as const, gap: 14 }}>
                    {trustItems.map((item, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                        <div style={{
                          width: 20, height: 20, borderRadius: "50%", background: `${RED}12`,
                          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1,
                        }}>
                          <CheckCircle size={12} color={RED} />
                        </div>
                        <span style={{ fontSize: 14, color: NAVY, lineHeight: 1.5 }}>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Requisites */}
      <section style={{ padding: "60px 0", background: LIGHT_BG }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <FadeIn>
            <div style={{
              background: `linear-gradient(135deg, ${NAVY} 0%, ${NAVY2} 100%)`,
              borderRadius: 20, padding: "40px 40px",
            }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 32 }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: `${RED}`, letterSpacing: "0.1em", textTransform: "uppercase" as const, marginBottom: 10 }}>
                    Компания
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: WHITE, marginBottom: 4 }}>ООО «Экоцентр»</div>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>Санитарная служба</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: `${RED}`, letterSpacing: "0.1em", textTransform: "uppercase" as const, marginBottom: 10 }}>
                    Реквизиты
                  </div>
                  <div style={{ fontSize: 14, color: "rgba(255,255,255,0.8)", lineHeight: 1.8 }}>
                    ИНН: 7726389900<br />
                    КПП: 772601001<br />
                    ОГРН: 1157746482250
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: `${RED}`, letterSpacing: "0.1em", textTransform: "uppercase" as const, marginBottom: 10 }}>
                    Адрес
                  </div>
                  <div style={{ fontSize: 14, color: "rgba(255,255,255,0.8)", lineHeight: 1.8 }}>
                    г. Москва,<br />
                    ул. Профсоюзная, д. 56<br />
                    <span style={{ color: "rgba(255,255,255,0.5)" }}>Работаем по всей Москве и МО</span>
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: `${RED}`, letterSpacing: "0.1em", textTransform: "uppercase" as const, marginBottom: 10 }}>
                    Лицензии
                  </div>
                  <div style={{ fontSize: 14, color: "rgba(255,255,255,0.8)", lineHeight: 1.8 }}>
                    Лицензия СЭС<br />
                    Сертификаты на препараты<br />
                    <span style={{ color: "rgba(255,255,255,0.5)" }}>Работаем по СанПиН</span>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      <style>{`
        @media (max-width: 900px) {
          .contacts-grid { grid-template-columns: 1fr !important; }
          .contacts-sidebar { position: static !important; }
        }
        @media (max-width: 600px) {
          .contacts-name-phone { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 768px) {
          .contacts-hero { padding: 3rem 0 2.5rem !important; }
        }
        @media (max-width: 480px) {
          .contacts-hero { padding: 2rem 0 !important; }
          .contacts-cta-btns { flex-direction: column !important; align-items: stretch !important; }
          .contacts-cta-btns a { text-align: center !important; justify-content: center !important; }
        }
      `}</style>
    </div>
  );
}
