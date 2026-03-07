import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import {
  IconBedbugs, IconCockroaches, IconRodents, IconTicks, IconMold,
  IconColdFog, IconHotFog, IconSpray, IconOzonation, IconDeodorization,
  IconGuarantee, IconSpecialist, IconCalculator, IconApartment, IconHouse,
  IconCommercial, IconVentilation, IconOdor,
} from "@/components/Icons";

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const NAVY      = "#000919";   // Primary: almost-black navy (header, footer, hero, dark blocks)
const NAVY_MID  = "#001230";   // Mid navy: card surfaces, overlays
const NAVY_LIGHT = "#001F4D";  // Light navy: borders, dividers in dark sections
const RED       = "#CC0000";   // Accent: CTA buttons, highlights
const RED_DARK  = "#990000";   // Hover state
const WHITE     = "#FFFFFF";
const GRAY_BG   = "#F4F6FA";   // Subtle section background
const GRAY_TEXT = "#6B7280";   // Muted body text
const NAVY_TEXT = "#0A1628";   // Dark text on white

// ─── SERVICES DATA ────────────────────────────────────────────────────────────
const services = [
  { slug: "klopov",       Icon: IconBedbugs,      title: "Уничтожение клопов",    desc: "Холодный и горячий туман. Полная ликвидация постельных клопов.",    price: "от 1 500 ₽", guarantee: "3 года",      color: RED },
  { slug: "tarakanov",    Icon: IconCockroaches,   title: "Уничтожение тараканов", desc: "Дезинсекция без запаха. Безопасно для детей и домашних животных.",  price: "от 1 500 ₽", guarantee: "1 год",       color: RED },
  { slug: "gryzunov",     Icon: IconRodents,       title: "Уничтожение грызунов",  desc: "Дератизация: мыши, крысы. Приманочные станции по периметру.",       price: "от 2 000 ₽", guarantee: "6 месяцев",   color: RED },
  { slug: "kleshhej",     Icon: IconTicks,         title: "Уничтожение клещей",    desc: "Обработка участков и помещений от клещей и комаров.",               price: "от 2 000 ₽", guarantee: "1 сезон",     color: RED },
  { slug: "pleseni",      Icon: IconMold,          title: "Удаление плесени",      desc: "Профессиональное удаление плесени и грибка. Обработка стен.",        price: "от 3 500 ₽", guarantee: "2 года",      color: RED },
  { slug: "dezinfektsii", Icon: IconDeodorization, title: "Дезинфекция",           desc: "Уничтожение патогенных микроорганизмов. Для предприятий и жилья.",   price: "от 20 ₽/м²", guarantee: "по договору", color: RED },
  { slug: "zapahov",      Icon: IconOdor,          title: "Борьба с запахами",     desc: "Устранение неприятных запахов. Озонирование и дезодорация.",         price: "от 2 500 ₽", guarantee: "по договору", color: RED },
  { slug: "uborka",       Icon: IconGuarantee,     title: "Уборка после смерти",   desc: "Профессиональная биологическая уборка. Дезинфекция и дезодорация.",  price: "от 5 000 ₽", guarantee: "по договору", color: RED },
];

const methods = [
  { Icon: IconColdFog,       title: "Холодный туман",       desc: "Мелкодисперсное распыление инсектицида. Проникает в труднодоступные места.", tag: "ПОПУЛЯРНО" },
  { Icon: IconHotFog,        title: "Горячий туман",        desc: "Термическая обработка. Максимальная эффективность при клопах и клещах.",     tag: "" },
  { Icon: IconSpray,         title: "Опрыскивание",         desc: "Направленная обработка поверхностей. Длительный остаточный эффект.",          tag: "" },
  { Icon: IconOzonation,     title: "Озонация",             desc: "Обеззараживание воздуха и поверхностей. Устраняет запахи и вирусы.",          tag: "" },
  { Icon: IconDeodorization, title: "Дезодорация",          desc: "Нейтрализация неприятных запахов. Безопасно для людей и животных.",           tag: "" },
  { Icon: IconVentilation,   title: "Обработка вентиляции", desc: "Дезинфекция вентиляционных систем. Предотвращает распространение инфекций.",  tag: "" },
];

const objectTypes = [
  { Icon: IconApartment,  title: "Квартиры",             desc: "1–5 комнат, студии, коммунальные квартиры",  price: "от 1 500 ₽", items: ["Однокомнатная квартира", "Двухкомнатная квартира", "Трёхкомнатная квартира", "Студия / комната", "Коммунальная квартира"] },
  { Icon: IconHouse,      title: "Частные дома",         desc: "Коттеджи, дачи, таунхаусы любой площади",    price: "от 3 500 ₽", items: ["Коттедж до 150 м²", "Дача / загородный дом", "Таунхаус", "Дом с подвалом", "Дом с участком"] },
  { Icon: IconCommercial, title: "Коммерческие объекты", desc: "Офисы, рестораны, склады, производства",      price: "от 5 000 ₽", items: ["Офис / бизнес-центр", "Ресторан / кафе", "Склад / производство", "Гостиница / хостел", "Медицинское учреждение"] },
];

const steps = [
  { n: "01", title: "Звонок или заявка",   desc: "Оставьте заявку онлайн или позвоните. Консультация бесплатна." },
  { n: "02", title: "Диагностика",         desc: "Специалист оценивает масштаб проблемы и подбирает метод." },
  { n: "03", title: "Договор и гарантия",  desc: "Заключаем официальный договор с гарантийными обязательствами." },
  { n: "04", title: "Обработка",           desc: "Профессиональная обработка сертифицированными препаратами." },
  { n: "05", title: "Контроль результата", desc: "Проверяем эффективность. Повторная обработка — бесплатно." },
];

const faqs = [
  { q: "Насколько опасна дезинсекция для людей и животных?", a: "Все препараты сертифицированы и разрешены Роспотребнадзором. После обработки достаточно проветрить помещение 2–3 часа. Дети и животные могут вернуться через 4–6 часов." },
  { q: "Какими средствами производится обработка?", a: "Используем только сертифицированные препараты: Пушка, Китан, Тельк, Медин Форте. Все средства прошли государственную регистрацию и имеют санитарно-эпидемиологические заключения." },
  { q: "Сколько времени занимает обработка?", a: "Квартира: 30–40 минут. Крупные объекты: от 1 до 3 часов в зависимости от площади." },
  { q: "Даёте ли вы гарантию на результат?", a: "Да. На все виды работ выдаём официальный договор и гарантийный талон. Гарантия на уничтожение клопов — 3 года, тараканов — 1 год, грызунов — 6 месяцев, плесени — 2 года." },
];

// ─── SCROLL REVEAL HOOK ───────────────────────────────────────────────────────
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add("visible"); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: "", phone: "", service: "" });
  const [submitted, setSubmitted] = useState(false);
  const createLead = trpc.leads.create.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createLead.mutateAsync({ ...formData, source: "hero_form" });
      setSubmitted(true);
    } catch {
      setSubmitted(true);
    }
  };

  const refServices   = useReveal();
  const refMethods    = useReveal();
  const refSteps      = useReveal();
  const refObjects    = useReveal();
  const refAdvantages = useReveal();
  const refFaq        = useReveal();

  return (
    <div style={{ fontFamily: "'Inter', 'Helvetica Neue', sans-serif", background: WHITE }}>

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section style={{
        minHeight: "92vh", display: "flex", alignItems: "center", position: "relative",
        background: NAVY, overflow: "hidden", isolation: "isolate",
      }}>
        {/* Grid lines background */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }} />
        {/* Red top accent line */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: `linear-gradient(90deg, ${RED} 0%, rgba(204,0,0,0.4) 60%, transparent 100%)`, zIndex: 2 }} />
        {/* Decorative geometry - top left corner */}
        <div style={{ position: "absolute", top: "5%", left: "-8%", width: 400, height: 400, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.03)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "15%", left: "2%", width: 200, height: 200, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.04)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "10%", left: "5%", width: 120, height: 120, borderRadius: "50%", border: `1px solid rgba(204,0,0,0.1)`, pointerEvents: "none" }} />
        {/* Diagonal accent */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "80px", background: `linear-gradient(to bottom right, transparent 49.9%, ${WHITE} 50%)`, pointerEvents: "none" }} />

        <div className="container" style={{ position: "relative", zIndex: 1, paddingTop: "7rem", paddingBottom: "7rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 380px 360px", gap: "3rem", alignItems: "stretch" }}>
            {/* Left: text */}
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.75rem", padding: "0.4rem 1rem", border: `1px solid rgba(204,0,0,0.4)`, borderRadius: 2 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: RED, animation: "pulse-red 2s infinite" }} />
                <span style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: RED }}>Лицензированная санитарная служба</span>
              </div>
              <h1 style={{ fontSize: "clamp(2.6rem, 5.5vw, 4.2rem)", fontWeight: 900, lineHeight: 1.06, letterSpacing: "-0.03em", color: WHITE, marginBottom: "1.5rem", maxWidth: 660 }}>
                Профессиональная<br />
                <span style={{ color: RED }}>дезинсекция</span> и<br />
                дезинфекция
              </h1>
              <p style={{ fontSize: "1.1rem", color: "rgba(255,255,255,0.7)", lineHeight: 1.7, marginBottom: "2.5rem", maxWidth: 520 }}>
                Уничтожение клопов, тараканов, грызунов и плесени.<br />
                Обработка без запаха. Холодный туман от 1 500 ₽. Гарантия до 3 лет.
              </p>
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "3.5rem" }}>
                <Link href="/calculator" style={{
                  display: "inline-flex", alignItems: "center", gap: "0.5rem",
                  background: RED, color: WHITE, fontWeight: 800, fontSize: "0.88rem",
                  letterSpacing: "0.06em", textTransform: "uppercase", padding: "0.9rem 1.75rem",
                  borderRadius: 2, textDecoration: "none", transition: "background 0.2s",
                }}
                  onMouseEnter={e => (e.currentTarget.style.background = RED_DARK)}
                  onMouseLeave={e => (e.currentTarget.style.background = RED)}>
                  Рассчитать стоимость →
                </Link>
                <a href="tel:+74955550000" style={{
                  display: "inline-flex", alignItems: "center", gap: "0.5rem",
                  background: "transparent", color: WHITE, fontWeight: 700, fontSize: "0.88rem",
                  letterSpacing: "0.06em", textTransform: "uppercase", padding: "0.9rem 1.75rem",
                  border: "1px solid rgba(255,255,255,0.3)", borderRadius: 2, textDecoration: "none",
                  transition: "border-color 0.2s",
                }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.7)")}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)")}>
                  ☎ Позвонить
                </a>
              </div>
              {/* Trust stats */}
              <div style={{ display: "flex", gap: "0", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "2rem" }}>
                {[
                  { n: "15+", label: "лет на рынке" },
                  { n: "12 000+", label: "обработок" },
                  { n: "3 года", label: "макс. гарантия" },
                  { n: "24/7", label: "выезд" },
                ].map((s, i) => (
                  <div key={i} style={{ flex: 1, paddingRight: "1.5rem", borderRight: i < 3 ? "1px solid rgba(255,255,255,0.08)" : "none", marginRight: i < 3 ? "1.5rem" : 0 }}>
                    <div style={{ fontSize: "1.75rem", fontWeight: 900, color: WHITE, letterSpacing: "-0.04em", lineHeight: 1 }}>{s.n}</div>
                    <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.45)", marginTop: "0.3rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Center: specialist image - fills full hero height */}
            <div style={{
              position: "relative",
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "center",
              alignSelf: "stretch",
              overflow: "visible",
            }}>
              {/* Subtle radial glow behind figure */}
              <div style={{
                position: "absolute",
                bottom: 0,
                left: "50%",
                transform: "translateX(-50%)",
                width: "120%",
                height: "60%",
                background: "radial-gradient(ellipse at bottom, rgba(204,0,0,0.08) 0%, transparent 70%)",
                pointerEvents: "none",
                zIndex: 1,
              }} />
              <img
                src="/specialist-hero.png"
                alt="Специалист по дезинфекции"
                style={{
                  position: "absolute",
                  bottom: "-7rem",
                  left: "50%",
                  transform: "translateX(-50%)",
                  height: "calc(100% + 7rem)",
                  width: "auto",
                  maxWidth: "none",
                  objectFit: "contain",
                  objectPosition: "bottom center",
                  filter: "drop-shadow(-8px 0 24px rgba(0,0,0,0.4)) drop-shadow(8px 0 24px rgba(0,0,0,0.3))",
                  zIndex: 2,
                }}
              />
            </div>

            {/* Right: quick form */}
            <div style={{
              background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
              backdropFilter: "blur(16px)", padding: "2.25rem", borderRadius: 4,
              boxShadow: "0 24px 64px rgba(0,0,0,0.4)",
            }}>
              <div style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: RED, marginBottom: "0.75rem" }}>Бесплатная консультация</div>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: WHITE, marginBottom: "1.75rem", lineHeight: 1.3 }}>Оставьте заявку —<br />перезвоним за 5 минут</h3>
              {submitted ? (
                <div style={{ textAlign: "center", padding: "2.5rem 0" }}>
                  <div style={{ width: 56, height: 56, borderRadius: "50%", background: RED, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem", fontSize: "1.5rem", color: WHITE }}>✓</div>
                  <p style={{ color: WHITE, fontWeight: 700, fontSize: "1.1rem" }}>Заявка принята!</p>
                  <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.875rem", marginTop: "0.5rem" }}>Перезвоним в течение 5 минут</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
                  <input className="form-field" placeholder="Ваше имя" value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} required />
                  <input className="form-field" type="tel" placeholder="+7 (___) ___-__-__" value={formData.phone} onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))} required />
                  <select className="form-field" value={formData.service} onChange={e => setFormData(p => ({ ...p, service: e.target.value }))}>
                    <option value="">Выберите услугу</option>
                    {services.map(s => <option key={s.slug} value={s.slug}>{s.title}</option>)}
                  </select>
                  <button type="submit" style={{
                    width: "100%", background: RED, color: WHITE, fontWeight: 800, fontSize: "0.88rem",
                    letterSpacing: "0.06em", textTransform: "uppercase", padding: "0.95rem 1.5rem",
                    border: "none", borderRadius: 2, cursor: "pointer", transition: "background 0.2s",
                  }}
                    disabled={createLead.isPending}
                    onMouseEnter={e => (e.currentTarget.style.background = RED_DARK)}
                    onMouseLeave={e => (e.currentTarget.style.background = RED)}>
                    {createLead.isPending ? "Отправка..." : "Получить консультацию →"}
                  </button>
                  <p style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.35)", textAlign: "center" }}>Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности</p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST BAR ─────────────────────────────────────────────────────── */}
      <div style={{ background: NAVY_MID, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="container" style={{ padding: "0.875rem 0" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0", justifyContent: "space-between", alignItems: "center" }}>
            {[
              { icon: "✓", text: "Лицензия СЭС" },
              { icon: "✓", text: "Сертифицированные препараты" },
              { icon: "✓", text: "Официальный договор" },
              { icon: "✓", text: "Гарантия в письменном виде" },
              { icon: "✓", text: "Выезд в день обращения" },
            ].map((t, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.25rem 0.75rem" }}>
                <span style={{ color: RED, fontWeight: 700, fontSize: "0.8rem" }}>{t.icon}</span>
                <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.75)", fontWeight: 500, letterSpacing: "0.02em" }}>{t.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── SERVICES ──────────────────────────────────────────────────────── */}
      <section style={{ padding: "6rem 0", background: WHITE }}>
        <div className="container">
          <div ref={refServices} className="reveal" style={{ marginBottom: "3.5rem", display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
                <div style={{ width: 24, height: 2, background: RED }} />
                <span style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: RED }}>Наши услуги</span>
              </div>
              <h2 style={{ fontSize: "clamp(1.9rem, 3.5vw, 2.6rem)", fontWeight: 900, color: NAVY_TEXT, letterSpacing: "-0.03em", lineHeight: 1.15 }}>
                Полный спектр<br />санитарных обработок
              </h2>
            </div>
            <p style={{ color: GRAY_TEXT, fontSize: "1rem", maxWidth: 420, lineHeight: 1.65 }}>
              Профессиональная дезинсекция, дератизация и дезинфекция для жилых и коммерческих объектов
            </p>
          </div>

          {/* Services grid: 4 columns */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1px", background: "#E8ECF2" }}>
            {services.map((s, i) => (
              <Link key={s.slug} href={`/services/${s.slug}`} style={{ textDecoration: "none" }}>
                <div style={{
                  background: WHITE, padding: "2rem 1.75rem", display: "flex", flexDirection: "column", gap: "1rem",
                  height: "100%", cursor: "pointer", transition: "background 0.2s ease, transform 0.2s ease",
                  position: "relative", overflow: "hidden",
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = NAVY; e.currentTarget.style.transform = "translateY(-2px)"; const title = e.currentTarget.querySelector(".card-title") as HTMLElement; const desc = e.currentTarget.querySelector(".card-desc") as HTMLElement; const price = e.currentTarget.querySelector(".card-price") as HTMLElement; const link = e.currentTarget.querySelector(".card-link") as HTMLElement; if (title) title.style.color = WHITE; if (desc) desc.style.color = "rgba(255,255,255,0.6)"; if (price) price.style.color = WHITE; if (link) link.style.color = RED; }}
                  onMouseLeave={e => { e.currentTarget.style.background = WHITE; e.currentTarget.style.transform = ""; const title = e.currentTarget.querySelector(".card-title") as HTMLElement; const desc = e.currentTarget.querySelector(".card-desc") as HTMLElement; const price = e.currentTarget.querySelector(".card-price") as HTMLElement; const link = e.currentTarget.querySelector(".card-link") as HTMLElement; if (title) title.style.color = NAVY_TEXT; if (desc) desc.style.color = GRAY_TEXT; if (price) price.style.color = NAVY_TEXT; if (link) link.style.color = RED; }}>
                  {/* Top accent line */}
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: i === 0 ? RED : "transparent", transition: "background 0.2s" }} className="card-accent" />
                  {/* Number */}
                  <div style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.12em", color: "rgba(0,9,25,0.2)", fontVariantNumeric: "tabular-nums" }}>
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  {/* Icon */}
                  <s.Icon size={44} />
                  {/* Content */}
                  <div style={{ flex: 1 }}>
                    <h3 className="card-title" style={{ fontSize: "1rem", fontWeight: 800, color: NAVY_TEXT, marginBottom: "0.5rem", lineHeight: 1.3, transition: "color 0.2s" }}>{s.title}</h3>
                    <p className="card-desc" style={{ fontSize: "0.84rem", color: GRAY_TEXT, lineHeight: 1.6, transition: "color 0.2s" }}>{s.desc}</p>
                  </div>
                  {/* Footer */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "1rem", borderTop: "1px solid rgba(0,0,0,0.06)" }}>
                    <span className="card-price" style={{ fontSize: "1.1rem", fontWeight: 900, color: NAVY_TEXT, letterSpacing: "-0.03em", transition: "color 0.2s" }}>{s.price}</span>
                    <span className="card-link" style={{ fontSize: "0.78rem", color: RED, fontWeight: 700, letterSpacing: "0.04em", transition: "color 0.2s" }}>Подробнее →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── METHODS (виды обработок) ───────────────────────────────────────── */}
      <section style={{ padding: "6rem 0", background: NAVY, position: "relative", overflow: "hidden" }}>
        {/* Grid lines */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: `linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
        }} />
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div ref={refMethods} className="reveal" style={{ marginBottom: "3.5rem", display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
                <div style={{ width: 24, height: 2, background: RED }} />
                <span style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: RED }}>Методы обработки</span>
              </div>
              <h2 style={{ fontSize: "clamp(1.9rem, 3.5vw, 2.6rem)", fontWeight: 900, color: WHITE, letterSpacing: "-0.03em", lineHeight: 1.15 }}>
                Виды санитарных<br />обработок
              </h2>
            </div>
            <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "1rem", maxWidth: 400, lineHeight: 1.65 }}>
              Выбираем метод в зависимости от типа вредителя, площади и особенностей объекта
            </p>
          </div>

          {/* Methods grid: 3×2 */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1px", background: "rgba(255,255,255,0.06)" }}>
            {methods.map((m, i) => (
              <div key={i} style={{
                background: "rgba(255,255,255,0.02)", padding: "2.25rem 2rem",
                transition: "background 0.2s ease", position: "relative", cursor: "default",
              }}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.07)")}
                onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}>
                {/* Tag */}
                {m.tag && (
                  <div style={{ position: "absolute", top: "1.25rem", right: "1.25rem", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.12em", color: RED, background: "rgba(204,0,0,0.12)", padding: "0.2rem 0.5rem", borderRadius: 2 }}>
                    {m.tag}
                  </div>
                )}
                {/* Number */}
                <div style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.12em", color: "rgba(255,255,255,0.2)", marginBottom: "1.25rem" }}>
                  {String(i + 1).padStart(2, "0")}
                </div>
                <m.Icon size={44} />
                <h3 style={{ fontSize: "1rem", fontWeight: 800, color: WHITE, marginBottom: "0.5rem", marginTop: "1.25rem", lineHeight: 1.3 }}>{m.title}</h3>
                <p style={{ fontSize: "0.84rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.65 }}>{m.desc}</p>
                {/* Bottom accent */}
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "2px", background: i === 0 ? RED : "transparent", transition: "background 0.2s" }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW WE WORK ───────────────────────────────────────────────────── */}
      <section style={{ padding: "6rem 0", background: GRAY_BG }}>
        <div className="container">
          <div ref={refSteps} className="reveal" style={{ marginBottom: "4rem" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
              <div style={{ width: 24, height: 2, background: RED }} />
              <span style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: RED }}>Схема работы</span>
            </div>
            <h2 style={{ fontSize: "clamp(1.9rem, 3.5vw, 2.6rem)", fontWeight: 900, color: NAVY_TEXT, letterSpacing: "-0.03em" }}>
              Как мы работаем
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "0", position: "relative" }}>
            <div style={{ position: "absolute", top: "1.5rem", left: "5%", right: "5%", height: "1px", background: `linear-gradient(90deg, ${RED} 0%, rgba(204,0,0,0.15) 100%)`, zIndex: 0 }} />
            {steps.map((s, i) => (
              <div key={i} style={{ position: "relative", zIndex: 1, padding: "0 1rem", textAlign: "center" }}>
                <div style={{
                  width: 48, height: 48, borderRadius: "50%", margin: "0 auto 1.5rem",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "0.8rem", fontWeight: 900, letterSpacing: "0.05em",
                  background: i === 0 ? RED : WHITE,
                  color: i === 0 ? WHITE : RED,
                  border: `2px solid ${i === 0 ? RED : "rgba(204,0,0,0.3)"}`,
                  boxShadow: i === 0 ? `0 0 0 4px rgba(204,0,0,0.15)` : "none",
                }}>
                  {s.n}
                </div>
                <h3 style={{ fontSize: "0.875rem", fontWeight: 800, color: NAVY_TEXT, marginBottom: "0.5rem", lineHeight: 1.3 }}>{s.title}</h3>
                <p style={{ fontSize: "0.78rem", color: GRAY_TEXT, lineHeight: 1.6 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── OBJECT TYPES ──────────────────────────────────────────────────── */}
      <section style={{ padding: "6rem 0", background: WHITE }}>
        <div className="container">
          <div ref={refObjects} className="reveal" style={{ marginBottom: "3.5rem" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
              <div style={{ width: 24, height: 2, background: RED }} />
              <span style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: RED }}>Типы объектов</span>
            </div>
            <h2 style={{ fontSize: "clamp(1.9rem, 3.5vw, 2.6rem)", fontWeight: 900, color: NAVY_TEXT, letterSpacing: "-0.03em" }}>
              Работаем с любыми объектами
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem" }}>
            {objectTypes.map((o, i) => (
              <div key={i} style={{
                background: i === 1 ? NAVY : WHITE,
                border: `1px solid ${i === 1 ? "transparent" : "#E8ECF2"}`,
                borderRadius: 4, padding: "2.5rem 2rem",
                position: "relative", overflow: "hidden",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = i === 1 ? `0 20px 48px rgba(0,9,25,0.5)` : `0 12px 32px rgba(0,9,25,0.1)`; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}>
                {/* Top accent */}
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: RED }} />
                {/* Icon */}
                <o.Icon size={48} />
                <h3 style={{ fontSize: "1.3rem", fontWeight: 800, color: i === 1 ? WHITE : NAVY_TEXT, marginBottom: "0.5rem", marginTop: "1.5rem" }}>{o.title}</h3>
                <p style={{ fontSize: "0.875rem", color: i === 1 ? "rgba(255,255,255,0.6)" : GRAY_TEXT, lineHeight: 1.65, marginBottom: "1.5rem" }}>{o.desc}</p>
                {/* List */}
                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 1.75rem", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                  {o.items.map((item, j) => (
                    <li key={j} style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.82rem", color: i === 1 ? "rgba(255,255,255,0.7)" : GRAY_TEXT }}>
                      <span style={{ color: RED, fontWeight: 700, fontSize: "0.7rem" }}>—</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "1.25rem", borderTop: `1px solid ${i === 1 ? "rgba(255,255,255,0.1)" : "#E8ECF2"}` }}>
                  <span style={{ fontSize: "1.5rem", fontWeight: 900, color: i === 1 ? WHITE : NAVY_TEXT, letterSpacing: "-0.03em" }}>{o.price}</span>
                  <Link href="/calculator" style={{ fontSize: "0.78rem", color: RED, fontWeight: 700, letterSpacing: "0.04em", textDecoration: "none" }}>РАССЧИТАТЬ →</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ADVANTAGES ────────────────────────────────────────────────────── */}
      <section style={{ padding: "6rem 0", background: NAVY, position: "relative", overflow: "hidden" }}>
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: `linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }} />
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div ref={refAdvantages} className="reveal" style={{ marginBottom: "3.5rem" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
              <div style={{ width: 24, height: 2, background: RED }} />
              <span style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: RED }}>Почему мы</span>
            </div>
            <h2 style={{ fontSize: "clamp(1.9rem, 3.5vw, 2.6rem)", fontWeight: 900, color: WHITE, letterSpacing: "-0.03em" }}>
              Наши преимущества
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1px", background: "rgba(255,255,255,0.06)" }}>
            {[
              { Icon: IconGuarantee,  title: "Гарантия до 3 лет",      desc: "Официальный гарантийный талон на каждый вид работ",        num: "3 года" },
              { Icon: IconSpecialist, title: "Выезд в день обращения",  desc: "Специалист приедет в удобное для вас время. Без предоплаты", num: "24/7" },
              { Icon: IconCalculator, title: "Фиксированные цены",      desc: "Стоимость указана в договоре и не меняется после выезда",   num: "0%" },
              { Icon: IconColdFog,    title: "Безопасные препараты",    desc: "Сертифицированные средства, одобренные Роспотребнадзором",  num: "100%" },
            ].map((a, i) => (
              <div key={i} style={{
                padding: "2.5rem 2rem", background: "rgba(255,255,255,0.025)",
                transition: "background 0.2s ease", position: "relative",
              }}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.07)")}
                onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.025)")}>
                <div style={{ fontSize: "2.8rem", fontWeight: 900, color: RED, letterSpacing: "-0.04em", lineHeight: 1, marginBottom: "1.25rem", fontVariantNumeric: "tabular-nums" }}>{a.num}</div>
                <a.Icon size={36} />
                <h3 style={{ fontSize: "1rem", fontWeight: 800, color: WHITE, marginBottom: "0.5rem", marginTop: "1rem" }}>{a.title}</h3>
                <p style={{ fontSize: "0.84rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.65 }}>{a.desc}</p>
                {/* Bottom line accent */}
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "2px", background: i === 0 ? RED : "transparent" }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────────── */}
      <section style={{ padding: "6rem 0", background: WHITE }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6rem", alignItems: "start" }}>
            <div ref={refFaq} className="reveal-left">
              <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
                <div style={{ width: 24, height: 2, background: RED }} />
                <span style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: RED }}>FAQ</span>
              </div>
              <h2 style={{ fontSize: "clamp(1.9rem, 3.5vw, 2.6rem)", fontWeight: 900, color: NAVY_TEXT, letterSpacing: "-0.03em", marginBottom: "1.25rem" }}>
                Часто задаваемые вопросы
              </h2>
              <p style={{ color: GRAY_TEXT, lineHeight: 1.7, marginBottom: "2rem" }}>
                Если не нашли ответ — позвоните нам, консультация бесплатна.
              </p>
              <a href="tel:+74955550000" style={{
                display: "inline-flex", alignItems: "center", gap: "0.5rem",
                background: RED, color: WHITE, fontWeight: 800, fontSize: "0.88rem",
                letterSpacing: "0.06em", textTransform: "uppercase", padding: "0.9rem 1.75rem",
                borderRadius: 2, textDecoration: "none", transition: "background 0.2s",
              }}
                onMouseEnter={e => (e.currentTarget.style.background = RED_DARK)}
                onMouseLeave={e => (e.currentTarget.style.background = RED)}>
                ☎ Позвонить бесплатно
              </a>
            </div>
            <div>
              {faqs.map((f, i) => (
                <div key={i} style={{ borderBottom: "1px solid #E8ECF2" }}>
                  <button style={{
                    width: "100%", background: "none", border: "none", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "1.25rem 0", gap: "1rem", textAlign: "left",
                  }} onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                    <span style={{ fontSize: "0.95rem", fontWeight: 700, color: NAVY_TEXT, lineHeight: 1.4 }}>{f.q}</span>
                    <span style={{ color: RED, fontSize: "1.4rem", flexShrink: 0, transition: "transform 0.25s ease", transform: openFaq === i ? "rotate(45deg)" : "none", lineHeight: 1 }}>+</span>
                  </button>
                  <div style={{ maxHeight: openFaq === i ? "200px" : "0", overflow: "hidden", transition: "max-height 0.3s ease" }}>
                    <p style={{ paddingBottom: "1.25rem", color: GRAY_TEXT, lineHeight: 1.7, fontSize: "0.9rem" }}>{f.a}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ────────────────────────────────────────────────────── */}
      <section style={{ padding: "5rem 0", background: RED, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(rgba(0,0,0,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.06) 1px, transparent 1px)`, backgroundSize: "40px 40px", pointerEvents: "none" }} />
        <div className="container" style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
          <h2 style={{ fontSize: "clamp(1.7rem, 3vw, 2.4rem)", fontWeight: 900, color: WHITE, letterSpacing: "-0.03em", marginBottom: "0.75rem" }}>
            Готовы избавиться от вредителей?
          </h2>
          <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "1.05rem", marginBottom: "2.5rem" }}>
            Оставьте заявку — перезвоним за 5 минут и рассчитаем стоимость
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/calculator" style={{
              display: "inline-flex", alignItems: "center", gap: "0.5rem",
              background: WHITE, color: RED, fontWeight: 800, fontSize: "0.88rem",
              letterSpacing: "0.06em", textTransform: "uppercase", padding: "1rem 2.25rem",
              borderRadius: 2, textDecoration: "none",
            }}>
              Рассчитать стоимость →
            </Link>
            <a href="tel:+74955550000" style={{
              display: "inline-flex", alignItems: "center", gap: "0.5rem",
              background: "transparent", color: WHITE, fontWeight: 700, fontSize: "0.88rem",
              letterSpacing: "0.06em", textTransform: "uppercase", padding: "1rem 2.25rem",
              border: "2px solid rgba(255,255,255,0.6)", borderRadius: 2, textDecoration: "none",
            }}>
              ☎ +7 (495) 555-00-00
            </a>
          </div>
        </div>
      </section>

      {/* ── STICKY MOBILE CTA ─────────────────────────────────────────────── */}
      <div className="sticky-cta">
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <a href="tel:+74955550000" style={{
            flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
            background: "rgba(255,255,255,0.1)", color: WHITE, fontWeight: 700, fontSize: "0.85rem",
            letterSpacing: "0.04em", padding: "0.875rem", border: "1px solid rgba(255,255,255,0.25)",
            borderRadius: 2, textDecoration: "none",
          }}>☎ Позвонить</a>
          <Link href="/calculator" style={{
            flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
            background: RED, color: WHITE, fontWeight: 800, fontSize: "0.85rem",
            letterSpacing: "0.04em", padding: "0.875rem", borderRadius: 2, textDecoration: "none",
          }}>Рассчитать →</Link>
        </div>
      </div>
    </div>
  );
}
