import { useState, useRef, useEffect } from "react";
import { Link } from "wouter";
import SchemaMarkup from "@/components/SchemaMarkup";
import ReviewsCarousel from "@/components/ReviewsCarousel";
import { trpc } from "@/lib/trpc";
import {
  IconBedbugs, IconCockroaches, IconRodents, IconTicks, IconMold,
  IconDeodorization, IconColdFog, IconHotFog, IconSpray, IconOzonation,
  IconVentilation, IconGuarantee, IconSpecialist, IconCalculator,
  IconApartment, IconHouse, IconCommercial, IconOdor,
} from "@/components/Icons";

// ─── DESIGN TOKENS ───────────────────────────────────────────────────────────
const NAVY      = "#0A0F1E";
const NAVY_MID  = "#0A0F1E";
const NAVY_TEXT = "#111827";
const RED       = "#D0021B";
const RED_DARK  = "#a80015";
const WHITE     = "#ffffff";
const GRAY_TEXT = "#6b7280";

// ─── DATA ─────────────────────────────────────────────────────────────────────
const services = [
  { slug: "klopov",       Icon: IconBedbugs,      title: "Уничтожение клопов",    desc: "Полное уничтожение клопов горячим и холодным туманом. Обработка без запаха.",   price: "от 1 500 ₽", guarantee: "3 года",      iconBg: "#ebdbdb", iconColor: "#cc0000",  methods: ["Горячий туман", "Холодный туман", "Орошение"] },
  { slug: "tarakanov",    Icon: IconCockroaches,   title: "Уничтожение тараканов", desc: "Гелевые приманки и опрыскивание. Результат с первой обработки.",               price: "от 1 500 ₽", guarantee: "3 года",       iconBg: "#fff7e6", iconColor: "#d97706",  methods: ["Гелевая обработка", "Орошение", "Холодный туман"] },
  { slug: "gryzunov",     Icon: IconRodents,       title: "Уничтожение грызунов",  desc: "Дератизация мышей и крыс. Приманочные станции. Без запаха.",                   price: "от 2 000 ₽", guarantee: "6 месяцев",  iconBg: "#f0fff4", iconColor: "#059669",  methods: ["Приманочные станции", "Механический отлов", "Газация"] },
  { slug: "kleshhej",     Icon: IconTicks,         title: "Уничтожение клещей",    desc: "Обработка участков и помещений от клещей и комаров. Сезонная защита.",         price: "от 2 000 ₽", guarantee: "1 сезон",    iconBg: "#f0f9ff", iconColor: "#0284c7",  methods: ["Орошение", "Холодный туман", "Барьерная обработка"] },
  { slug: "pleseni",      Icon: IconMold,          title: "Удаление плесени",      desc: "Профессиональное удаление плесени и грибка. Обработка антисептиком.",          price: "от 3 500 ₽", guarantee: "2 года",      iconBg: "#f5f3ff", iconColor: "#7c3aed",  methods: ["Антисептик", "Озонация", "УФ-обработка"] },
  { slug: "dezinfektsii", Icon: IconDeodorization, title: "Дезинфекция",           desc: "Уничтожение патогенных микроорганизмов. Для медицины и общепита.",              price: "от 20 ₽/м²", guarantee: "по договору", iconBg: "#ecfdf5", iconColor: "#10b981",  methods: ["Холодный туман", "Орошение", "Озонация"] },
  { slug: "zapahov",      Icon: IconOdor,          title: "Борьба с запахами",     desc: "Устранение неприятных запахов. Озонирование воздуха. Безопасно.",              price: "от 2 500 ₽", guarantee: "по договору", iconBg: "#fffbeb", iconColor: "#f59e0b",  methods: ["Озонация", "Дезодорация", "Обработка вентиляции"] },
  { slug: "uborka",       Icon: IconGuarantee,     title: "Уборка после смерти",   desc: "Профессиональная биологическая уборка и дезинфекция помещения.",               price: "от 5 000 ₽", guarantee: "по договору", iconBg: "#fef2f2", iconColor: "#dc2626",  methods: ["Биологическая уборка", "Дезинфекция", "Дезодорация"] },
];

const methods = [
  { Icon: IconColdFog,       title: "Холодный туман",       desc: "Мелкодисперсное распыление. Проникает в труднодоступные места.", tag: "ПОПУЛЯРНО" },
  { Icon: IconHotFog,        title: "Горячий туман",        desc: "Термическая обработка. Максимальная эффективность при клопах.",   tag: "" },
  { Icon: IconSpray,         title: "Опрыскивание",         desc: "Направленная обработка. Длительный остаточный эффект.",           tag: "" },
  { Icon: IconOzonation,     title: "Озонация",             desc: "Обеззараживание воздуха. Устраняет запахи и вирусы.",             tag: "" },
  { Icon: IconDeodorization, title: "Дезодорация",          desc: "Нейтрализация запахов. Безопасно для людей и животных.",          tag: "" },
  { Icon: IconVentilation,   title: "Обработка вентиляции", desc: "Дезинфекция вентиляционных систем. Предотвращает инфекции.",      tag: "" },
];

const objectTypes = [
  { Icon: IconApartment,  title: "Квартиры",             items: ["Однокомнатная квартира", "Двухкомнатная квартира", "Трёхкомнатная квартира", "Студия / комната", "Коммунальная квартира"],  price: "от 1 500 ₽" },
  { Icon: IconHouse,      title: "Частные дома",         items: ["Коттедж до 150 м²", "Дача / загородный дом", "Таунхаус", "Дом с подвалом", "Дом с участком"],                              price: "от 3 500 ₽" },
  { Icon: IconCommercial, title: "Коммерческие объекты", items: ["Офис / бизнес-центр", "Ресторан / кафе", "Склад / производство", "Гостиница / хостел", "Медицинское учреждение"],          price: "от 5 000 ₽" },
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
  { q: "Даёте ли вы гарантию на результат?", a: "Да. На все виды работ выдаём официальный договор и гарантийный талон. Гарантия на уничтожение клопов — 3 года, тараканов — 3 года, грызунов — 6 месяцев, плесени — 2 года." },
];

// ─── SCROLL REVEAL HOOK ───────────────────────────────────────────────────────
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add("visible"); obs.disconnect(); } },
      { threshold: 0.08 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

// ─── SECTION LABEL ────────────────────────────────────────────────────────────
function SectionLabel({ text }: { text: string }) {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
      <div style={{ width: 28, height: 3, background: RED, borderRadius: 2 }} />
      <span style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" as const, color: RED }}>{text}</span>
    </div>
  );
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: "", phone: "", service: "" });
  const [submitted, setSubmitted] = useState(false);
  const createLead = trpc.leads.create.useMutation();

  useEffect(() => {
    document.title = "Профессиональная санитарная служба — Дезинсекция и дезинфекция в Москве";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "Профессиональная дезинсекция, дезинфекция и дератизация в Москве и МО. Уничтожение клопов, тараканов, грызунов. Гарантия 3 года. Работаем 24/7.");
  }, []);

  useEffect(() => {
    const hash = window.location.hash.replace(/^#/, "");
    if (hash !== "reviews" && hash !== "certificates") return;
    const id = hash === "reviews" ? "reviews" : "certificates";
    const t = window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
    return () => window.clearTimeout(t);
  }, []);

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
  const refReviews    = useReveal();
  const refFaq        = useReveal();

  return (
    <div style={{ fontFamily: "'Inter', 'Helvetica Neue', sans-serif", background: WHITE }}>
      <SchemaMarkup />

      {/* ═══════════════════════════════════════════════════════════════════
          HERO — 3 columns: text | specialist | form
      ═══════════════════════════════════════════════════════════════════ */}
      <section style={{
        background: NAVY, position: "relative", overflow: "visible",
        paddingBottom: "0",
        isolation: "isolate",
      }}>
        {/* Grid background */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: `linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
        }} />
        {/* Red top accent */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${RED} 0%, rgba(204,0,0,0.3) 70%, transparent 100%)`, zIndex: 2 }} />

        {/* Decorative circles — left side only */}
        <div style={{ position: "absolute", top: "8%", left: "-6%", width: 360, height: 360, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.03)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "20%", left: "4%", width: 180, height: 180, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.04)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "15%", left: "8%", width: 100, height: 100, borderRadius: "50%", border: `1px solid rgba(204,0,0,0.12)`, pointerEvents: "none" }} />

        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          {/* 3-column grid */}
          <div className="hero-grid" style={{
            display: "grid",
            gridTemplateColumns: "1fr 350px 320px",
            gap: "0",
            alignItems: "stretch",
            width: "100%",
            maxWidth: "100%",
            paddingTop: "2rem",
            paddingBottom: "0",
            overflow: "hidden",
          }}>

            {/* -- COL 1: Text -- */}
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", paddingRight: "2.5rem", minWidth: 0, overflow: "hidden" }}>
              {/* Badge */}
              <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.75rem", padding: "0.4rem 1rem", border: `1px solid rgba(204,0,0,0.4)`, borderRadius: 2, width: "fit-content", maxWidth: "100%", overflow: "hidden" }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: RED, flexShrink: 0 }} />
                <span style={{ fontSize: "clamp(0.55rem, 2vw, 0.68rem)", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: RED, whiteSpace: "nowrap" as const, overflow: "hidden", textOverflow: "ellipsis" }}>Лицензированная санитарная служба</span>
              </div>

              {/* H1 */}
              <h1 style={{ fontSize: "clamp(1.4rem, 3.5vw, 3rem)", fontWeight: 900, lineHeight: 1.1, letterSpacing: "-0.02em", color: WHITE, marginBottom: "1.25rem" }}>
                Профессиональная{" "}
                <span style={{ color: RED }}>дезинсекция</span>
                {" "}и{" "}
                <span style={{ color: RED }}>дезинфекция</span>
              </h1>

              {/* Subtitle */}
              <p style={{ fontSize: "clamp(0.9rem, 1.3vw, 1.1rem)", color: "rgba(255,255,255,0.65)", lineHeight: 1.65, marginBottom: "2rem", maxWidth: 460, width: "100%" }}>
                Уничтожение клопов, тараканов, грызунов и плесени.<br />
                Холодный и горячий туман от 1 500 ₽.<br />
                Гарантия до 3 лет. Обработка без запаха.
              </p>

              {/* CTA Buttons */}
              <div className="hero-cta-row" style={{ display: "flex", gap: "0.875rem", flexWrap: "wrap" as const, marginBottom: "2.5rem" }}>
                <Link href="/calculator" style={{
                  display: "inline-flex", alignItems: "center", gap: "0.5rem",
                  background: RED, color: WHITE, fontWeight: 800, fontSize: "0.85rem",
                  letterSpacing: "0.07em", textTransform: "uppercase" as const, padding: "0.875rem 1.75rem",
                  borderRadius: 8, textDecoration: "none", transition: "background 0.2s",
                }}
                  onMouseEnter={e => (e.currentTarget.style.background = RED_DARK)}
                  onMouseLeave={e => (e.currentTarget.style.background = RED)}>
                  Рассчитать стоимость →
                </Link>
                <a href="tel:+74951485806" style={{
                  display: "inline-flex", alignItems: "center", gap: "0.5rem",
                  background: "transparent", color: WHITE, fontWeight: 700, fontSize: "0.85rem",
                  letterSpacing: "0.07em", textTransform: "uppercase" as const, padding: "0.875rem 1.75rem",
                  border: "1px solid rgba(255,255,255,0.28)", borderRadius: 8, textDecoration: "none",
                  transition: "border-color 0.2s",
                }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.65)")}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.28)")}>
                  ☎ Позвонить
                </a>
              </div>

               {/* Stats + mobile photo in parallel (photo visible only on mobile via CSS) */}
              <div className="hero-bottom-row" style={{ display: "flex", alignItems: "center", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "1.75rem", gap: "0" }}>
                {/* Stats */}
                <div className="hero-stats" style={{ display: "flex", gap: "0", flex: 1 }}>
                  {[
                    { n: "15+",     label: "лет на рынке" },
                    { n: "12 000+", label: "обработок" },
                    { n: "3 года",  label: "макс. гарантия" },
                    { n: "24/7",    label: "выезд" },
                  ].map((s, i) => (
                    <div key={i} className="hero-stat-item" style={{
                      flex: 1,
                      paddingRight: i < 3 ? "1.25rem" : 0,
                      borderRight: i < 3 ? "1px solid rgba(255,255,255,0.08)" : "none",
                      marginRight: i < 3 ? "1.25rem" : 0,
                    }}>
                      <div style={{ fontSize: "1.6rem", fontWeight: 900, color: WHITE, letterSpacing: "-0.04em", lineHeight: 1 }}>{s.n}</div>
                      <div style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.4)", marginTop: "0.25rem", textTransform: "uppercase" as const, letterSpacing: "0.08em" }}>{s.label}</div>
                    </div>
                  ))}
                </div>
                {/* Mobile master photo — shown only on mobile, to the right of stats */}
                <div className="hero-mobile-master" style={{ display: "none" }}>
                  <img
                    src="/specialist-mobile.png"
                    alt="Специалист по дезинфекции"
                    style={{ width: "100%", height: "auto", objectFit: "contain", objectPosition: "center top", display: "block" }}
                  />
                </div>
              </div>
            </div>

            {/* -- COL 2: Specialist PNG -- */}
            <div className="hero-img-col" style={{ position: "relative", overflow: "visible", marginRight: "138px" }}>
              {/* Glow under specialist */}
              <div style={{
                position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)",
                width: "80%", height: "20%",
                background: "radial-gradient(ellipse at bottom, rgba(204,0,0,0.5) 0%, transparent 70%)",
                pointerEvents: "none",
                zIndex: 2,
              }} />
              <img
                src="https://private-us-east-1.manuscdn.com/user_upload_by_module/session_file/310519663313765274/GYbcCeYKAKjIWOOv.png?Expires=1804426519&Signature=Nzmptx3v99XLD9EK8EBGlk5Mi6IFOmQzv5JhydT4qxkPUUwpu9-YBbIQI6fKX9ZWii9SZA~XVh8FCqpT~911EcnixsPe57~73u8i1OpcKndX5JYROpDsl93CGN73TQFF3-86e2f39dHwFHJzdp~IC6PUBNjGD2oSeci0sU4np50SRV3U991qxJGIvAsEJps0VqmgZ~TfhMBcrohv9xveOZ-~xgxIR~lKg2GG3ofMSnlMnLFK7w8rQKFtyTyZ9Qv2HoptsKRWl397Mf1VYv-zrVbdHkeDbnvrb1HW~eai4vF5CTVfjFJ1sfwy82g7J-Ylp40yClEGWE5TEXkkZIPszQ__&Key-Pair-Id=K2HSFNDJXOU9YS"
                alt="Специалист по дезинфекции"
                loading="eager"
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "auto",
                  height: "92%",
                  maxHeight: "none",
                  objectFit: "contain",
                  objectPosition: "center bottom",
                  filter: "drop-shadow(0 0 0 transparent)",
                  zIndex: 3,
                  pointerEvents: "none",
                }}
              />
            </div>

            {/* -- COL 3: Lead Form -- */}
            <div className="hero-form-col" style={{ display: "flex", alignItems: "center", paddingLeft: "2rem" }}>
              <div style={{
                width: "100%",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.1)",
                backdropFilter: "blur(20px)",
                padding: "35px 42px 19px 11px",
                marginTop: "12px",
                marginRight: "19px",
                marginLeft: "-21px",
                borderRadius: 12,
                boxShadow: "0 24px 64px rgba(0,0,0,0.4)",
              }}>
                <div style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase" as const, color: RED, marginBottom: "0.6rem" }}>Бесплатная консультация</div>
                <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: WHITE, marginBottom: "1.5rem", lineHeight: 1.35 }}>
                  Оставьте заявку —<br />перезвоним за 5 минут
                </h3>

                {submitted ? (
                  <div style={{ textAlign: "center" as const, padding: "2rem 0" }}>
                    <div style={{ width: 52, height: 52, borderRadius: "50%", background: RED, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem", fontSize: "1.4rem", color: WHITE }}>✓</div>
                    <p style={{ color: WHITE, fontWeight: 700, fontSize: "1rem" }}>Заявка принята!</p>
                    <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.82rem", marginTop: "0.4rem" }}>Перезвоним в течение 5 минут</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    <input
                      className="form-field"
                      placeholder="Ваше имя"
                      value={formData.name}
                      onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                      required
                    />
                    <input
                      className="form-field"
                      type="tel"
                      placeholder="+7 (___) ___-__-__"
                      value={formData.phone}
                      onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))}
                      required
                    />
                    <select
                      className="form-field"
                      value={formData.service}
                      onChange={e => setFormData(p => ({ ...p, service: e.target.value }))}
                    >
                      <option value="">Выберите услугу</option>
                      {services.map(s => <option key={s.slug} value={s.slug}>{s.title}</option>)}
                    </select>
                    <button
                      type="submit"
                      disabled={createLead.isPending}
                      style={{
                        width: "100%", background: RED, color: WHITE, fontWeight: 800, fontSize: "0.85rem",
                        letterSpacing: "0.06em", textTransform: "uppercase" as const, padding: "0.9rem 1.5rem",
                        border: "none", borderRadius: 8, cursor: "pointer", transition: "background 0.2s",
                        marginTop: "0.25rem",
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = RED_DARK)}
                      onMouseLeave={e => (e.currentTarget.style.background = RED)}
                    >
                      {createLead.isPending ? "Отправка..." : "Получить консультацию →"}
                    </button>
                    <p style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.3)", textAlign: "center" as const }}>
                      Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности
                    </p>
                  </form>
                )}

                {/* Trust icons */}
                <div style={{ marginTop: "1.5rem", paddingTop: "1.25rem", borderTop: "1px solid rgba(255,255,255,0.08)", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {["Фиксированная цена", "Чек и сертификаты", "Безопасно для детей и животных"].map((t, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <span style={{ color: RED, fontWeight: 700, fontSize: "0.75rem", flexShrink: 0 }}>✓</span>
                      <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.55)" }}>{t}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          TRUST BAR
      ═══════════════════════════════════════════════════════════════════ */}
      <div style={{ background: NAVY_MID, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="container" style={{ padding: "0.875rem 0" }}>
          <div className="trust-bar" style={{ display: "flex", flexWrap: "wrap" as const, gap: "0.25rem", justifyContent: "space-between", alignItems: "center" }}>
            {[
              "✓ Лицензия СЭС",
              "✓ Сертифицированные препараты",
              "✓ Официальный договор",
              "✓ Гарантия в письменном виде",
              "✓ Выезд в день обращения",
            ].map((t, i) => (
              <span key={i} style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.7)", fontWeight: 500, padding: "0.25rem 0.75rem", letterSpacing: "0.02em" }}>{t}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          SERVICES — unified block with method chips
      ═══════════════════════════════════════════════════════════════════ */}
      <section style={{ padding: "5rem 0", background: WHITE }}>
        <div className="container">
          <div ref={refServices} className="reveal" style={{ marginBottom: "3rem" }}>
            <SectionLabel text="Услуги" />
            <h2 style={{ fontSize: "clamp(1.75rem, 3vw, 2.4rem)", fontWeight: 900, color: NAVY_TEXT, letterSpacing: "-0.03em", marginBottom: "0.5rem" }}>
              Услуги санитарной обработки
            </h2>
            <p style={{ color: GRAY_TEXT, fontSize: "1rem", maxWidth: 560 }}>
              Выберите вашу проблему — подберём оптимальный метод и рассчитаем стоимость
            </p>
          </div>

          <div className="services-grid-new" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1.25rem" }}>
            {services.map((s, i) => (
              <Link key={s.slug} href={`/services/${s.slug}`} style={{ textDecoration: "none", display: "flex" }}>
                <div
                  style={{
                    background: WHITE,
                    border: "1px solid #e8ecf2",
                    borderRadius: 12,
                    padding: "1.75rem 1.5rem",
                    transition: "all 0.25s ease",
                    cursor: "pointer",
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0",
                    position: "relative",
                    overflow: "hidden",
                    boxShadow: "0 1px 4px rgba(0,9,25,0.06)",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,9,25,0.12)";
                    e.currentTarget.style.borderColor = RED;
                    const accent = e.currentTarget.querySelector(".card-accent") as HTMLElement;
                    if (accent) accent.style.width = "100%";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,9,25,0.06)";
                    e.currentTarget.style.borderColor = "#e8ecf2";
                    const accent = e.currentTarget.querySelector(".card-accent") as HTMLElement;
                    if (accent) accent.style.width = "0%";
                  }}
                >
                  {/* Red accent line top */}
                  <div className="card-accent" style={{ position: "absolute", top: 0, left: 0, height: 3, width: "100%", background: RED, transition: "width 0.3s ease", borderRadius: "12px 12px 0 0" }} />
                  {/* Icon with colored bg */}
                  <div style={{
                    width: 56, height: 56, borderRadius: 19,
                    background: s.iconBg,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    marginBottom: "1.1rem", flexShrink: 0,
                  }}>
                    <s.Icon size={28} color={s.iconColor} />
                  </div>
                  {/* Title */}
                  <h3 style={{ fontSize: "1rem", fontWeight: 800, color: NAVY_TEXT, lineHeight: 1.3, margin: "0 0 0.5rem" }}>{s.title}</h3>
                  {/* Description */}
                  <p style={{ fontSize: "0.82rem", color: GRAY_TEXT, lineHeight: 1.6, margin: "0 0 1rem", flexGrow: 1 }}>{s.desc}</p>
                  {/* Method chips */}
                  <div style={{ display: "flex", flexWrap: "wrap" as const, gap: "0.35rem", marginBottom: "1.1rem" }}>
                    {s.methods.map((m, mi) => (
                      <span key={mi} style={{
                        fontSize: "0.625rem", fontWeight: 600,
                        background: mi === 0 ? `${s.iconColor}18` : "#f3f4f6",
                        color: mi === 0 ? s.iconColor : "#6b7280",
                        border: mi === 0 ? `1px solid ${s.iconColor}30` : "1px solid #e5e7eb",
                        padding: "0.2rem 0.55rem", borderRadius: 20,
                        letterSpacing: "0.02em",
                      }}>{m}</span>
                    ))}
                  </div>
                  {/* Price + guarantee row */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem", paddingTop: "0.75rem", borderTop: "1px solid #f3f4f6" }}>
                    <span style={{ fontSize: "1.1rem", fontWeight: 900, color: RED }}>{s.price}</span>
                    <span style={{ fontSize: "0.6rem", color: "#9ca3af", background: "#f9fafb", padding: "0.2rem 0.5rem", borderRadius: 20, border: "1px solid #e5e7eb", whiteSpace: "nowrap" as const, overflow: "hidden", textOverflow: "ellipsis", maxWidth: "50%" }}>Гарантия {s.guarantee}</span>
                  </div>
                  {/* CTA Button */}
                  <div style={{
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: RED, color: WHITE, fontWeight: 700, fontSize: "0.78rem",
                    letterSpacing: "0.05em", textTransform: "uppercase" as const,
                    padding: "0.7rem 1rem", borderRadius: 8,
                    transition: "background 0.2s",
                  }}>
                    Рассчитать стоимость →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* refMethods placeholder (methods block removed, merged into service cards) */}
      <div ref={refMethods} style={{ display: "none" }} />



      {/* ═══════════════════════════════════════════════════════════════════
          OBJECT TYPES
      ═══════════════════════════════════════════════════════════════════ */}
      <section style={{ padding: "5rem 0", background: "#f8f9fc" }}>
        <div className="container">
          <div ref={refObjects} className="reveal" style={{ marginBottom: "3rem" }}>
            <SectionLabel text="Объекты" />
            <h2 style={{ fontSize: "clamp(1.75rem, 3vw, 2.4rem)", fontWeight: 900, color: NAVY_TEXT, letterSpacing: "-0.03em" }}>
              Типы обрабатываемых объектов
            </h2>
          </div>
          <div className="objects-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem" }}>
            {objectTypes.map((o, i) => (
              <div key={i} style={{
                background: WHITE, border: "1px solid #e8ecf2",
                borderRadius: 12, overflow: "hidden",
                transition: "box-shadow 0.2s, transform 0.2s",
              }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,9,25,0.1)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                <div style={{ background: i === 1 ? NAVY : "#f0f4ff", padding: "1.5rem 1.75rem", borderBottom: "1px solid #e8ecf2", display: "flex", alignItems: "center", gap: "1rem" }}>
                  <div style={{ width: 52, height: 52, borderRadius: "50%", background: "white", border: "1px solid #e8ecf2", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 2px 8px rgba(0,9,25,0.08)" }}>
                    <o.Icon size={26} color={i === 1 ? NAVY : RED} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: "1.05rem", fontWeight: 800, color: i === 1 ? WHITE : NAVY_TEXT, margin: 0 }}>{o.title}</h3>
                    <span style={{ fontSize: "0.8rem", fontWeight: 700, color: RED }}>{o.price}</span>
                  </div>
                </div>
                <div style={{ padding: "1.25rem 1.75rem" }}>
                  {o.items.map((item, j) => (
                    <div key={j} style={{ display: "flex", alignItems: "center", gap: "0.6rem", padding: "0.45rem 0", borderBottom: j < o.items.length - 1 ? "1px solid #f0f4ff" : "none" }}>
                      <div style={{ width: 5, height: 5, borderRadius: "50%", background: RED, flexShrink: 0 }} />
                      <span style={{ fontSize: "0.85rem", color: GRAY_TEXT }}>{item}</span>
                    </div>
                  ))}
                </div>
                <div style={{ padding: "0 1.75rem 1.5rem" }}>
                  <Link href="/calculator" style={{
                    display: "block", textAlign: "center" as const, background: i === 1 ? RED : "transparent",
                    color: i === 1 ? WHITE : RED, border: `1px solid ${RED}`,
                    fontWeight: 700, fontSize: "0.8rem", letterSpacing: "0.06em", textTransform: "uppercase" as const,
                    padding: "0.7rem", borderRadius: 8, textDecoration: "none", transition: "all 0.2s",
                  }}>
                    Рассчитать стоимость →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          PROCESS — 5 steps
      ═══════════════════════════════════════════════════════════════════ */}
      <section style={{ padding: "5rem 0", background: WHITE }}>
        <div className="container">
          <div ref={refSteps} className="reveal" style={{ marginBottom: "3rem" }}>
            <SectionLabel text="Процесс" />
            <h2 style={{ fontSize: "clamp(1.75rem, 3vw, 2.4rem)", fontWeight: 900, color: NAVY_TEXT, letterSpacing: "-0.03em" }}>
              Как мы работаем
            </h2>
          </div>
          <div className="steps-grid" style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "0", position: "relative" }}>
            <div style={{ position: "absolute", top: "1.35rem", left: "10%", right: "10%", height: 1, background: "linear-gradient(90deg, transparent, #e8ecf2 10%, #e8ecf2 90%, transparent)", zIndex: 0 }} />
            {steps.map((s, i) => (
              <div key={i} style={{ padding: "0 1rem", textAlign: "center" as const, position: "relative", zIndex: 1 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: "50%",
                  background: i === 0 ? RED : WHITE,
                  border: `2px solid ${i === 0 ? RED : "#e8ecf2"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 1.25rem",
                  fontSize: "0.75rem", fontWeight: 800, color: i === 0 ? WHITE : NAVY_TEXT,
                  letterSpacing: "0.04em",
                }}>
                  {s.n}
                </div>
                <h3 style={{ fontSize: "0.85rem", fontWeight: 800, color: NAVY_TEXT, marginBottom: "0.5rem", lineHeight: 1.3 }}>{s.title}</h3>
                <p style={{ fontSize: "0.75rem", color: GRAY_TEXT, lineHeight: 1.65, margin: 0 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          ADVANTAGES — 4 columns on dark bg
      ═══════════════════════════════════════════════════════════════════ */}
      <section style={{ padding: "5rem 0", background: NAVY, position: "relative", overflow: "hidden" }}>
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: `linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
        }} />
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div ref={refAdvantages} className="reveal" style={{ marginBottom: "3rem" }}>
            <SectionLabel text="Почему мы" />
            <h2 style={{ fontSize: "clamp(1.75rem, 3vw, 2.4rem)", fontWeight: 900, color: WHITE, letterSpacing: "-0.03em" }}>
              Наши преимущества
            </h2>
          </div>
          <div className="advantages-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1px", background: "rgba(255,255,255,0.06)" }}>
            {[
              { Icon: IconGuarantee,  title: "Гарантия до 3 лет",      desc: "Официальный гарантийный талон на каждый вид работ",         num: "3 года" },
              { Icon: IconSpecialist, title: "Выезд в день обращения",  desc: "Специалист приедет в удобное для вас время. Без предоплаты", num: "24/7" },
              { Icon: IconCalculator, title: "Фиксированные цены",      desc: "Стоимость указана в договоре и не меняется после выезда",    num: "0%" },
              { Icon: IconColdFog,    title: "Безопасные препараты",    desc: "Сертифицированные средства, одобренные Роспотребнадзором",   num: "100%" },
            ].map((a, i) => (
              <div key={i} style={{
                padding: "2.25rem 1.75rem",
                background: i === 0 ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.025)",
                transition: "background 0.2s",
                position: "relative",
              }}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.07)")}
                onMouseLeave={e => (e.currentTarget.style.background = i === 0 ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.025)")}
              >
                <div style={{ fontSize: "2.5rem", fontWeight: 900, color: RED, letterSpacing: "-0.04em", lineHeight: 1, marginBottom: "1rem" }}>{a.num}</div>
                <div style={{ width: 52, height: 52, borderRadius: "50%", background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.18)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <a.Icon size={26} color="white" />
                </div>
                <h3 style={{ fontSize: "0.95rem", fontWeight: 800, color: WHITE, marginBottom: "0.4rem", marginTop: "0.875rem" }}>{a.title}</h3>
                <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.65, margin: 0 }}>{a.desc}</p>
                {i === 0 && <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 2, background: RED }} />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          REVIEWS (карусель — несколько карточек сразу)
      ═══════════════════════════════════════════════════════════════════ */}
      <ReviewsCarousel revealRef={refReviews} />

      {/* ═══════════════════════════════════════════════════════════════════
          GUARANTEES + CTA
      ═══════════════════════════════════════════════════════════════════ */}
      <section style={{ padding: "5rem 0", background: WHITE }}>
        <div className="container">
          <div className="guarantee-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "center" }}>
            <div>
              <SectionLabel text="Гарантии" />
              <h2 style={{ fontSize: "clamp(1.75rem, 3vw, 2.4rem)", fontWeight: 900, color: NAVY_TEXT, letterSpacing: "-0.03em", marginBottom: "1.25rem" }}>
                Работаем с официальной гарантией
              </h2>
              <p style={{ color: GRAY_TEXT, lineHeight: 1.75, marginBottom: "2rem" }}>
                На каждый вид работ выдаём официальный договор и гарантийный талон. Если результат не достигнут — повторная обработка бесплатно.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {[
                  { service: "Уничтожение клопов",    period: "3 года" },
                  { service: "Уничтожение тараканов", period: "3 года" },
                  { service: "Уничтожение грызунов",  period: "6 месяцев" },
                  { service: "Удаление плесени",      period: "2 года" },
                ].map((g, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "0.875rem 1.25rem", background: "#f8f9fc", borderRadius: 8, border: "1px solid #e8ecf2" }}>
                    <span style={{ fontSize: "0.88rem", fontWeight: 600, color: NAVY_TEXT }}>{g.service}</span>
                    <span style={{ fontSize: "0.88rem", fontWeight: 800, color: RED }}>{g.period}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Right: CTA card */}
            <div style={{ background: NAVY, borderRadius: 12, padding: "3rem", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: RED }} />
              <div style={{ position: "absolute", bottom: "-20%", right: "-10%", width: 200, height: 200, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.04)", pointerEvents: "none" }} />
              <div style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" as const, color: RED, marginBottom: "1rem" }}>Получить консультацию</div>
              <h3 style={{ fontSize: "1.5rem", fontWeight: 900, color: WHITE, marginBottom: "1rem", lineHeight: 1.3 }}>
                Бесплатный выезд специалиста
              </h3>
              <p style={{ color: "rgba(255,255,255,0.55)", lineHeight: 1.7, marginBottom: "2rem", fontSize: "0.9rem" }}>
                Специалист приедет, оценит объём работ и назовёт точную стоимость. Без предоплаты.
              </p>
              <a href="tel:+74951485806" style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
                background: RED, color: WHITE, fontWeight: 800, fontSize: "0.85rem",
                letterSpacing: "0.07em", textTransform: "uppercase" as const, padding: "0.875rem 1.75rem",
                borderRadius: 8, textDecoration: "none", transition: "background 0.2s",
              }}
                onMouseEnter={e => (e.currentTarget.style.background = RED_DARK)}
                onMouseLeave={e => (e.currentTarget.style.background = RED)}>
                ☎ Позвонить бесплатно
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          FAQ
      ═══════════════════════════════════════════════════════════════════ */}
      <section style={{ padding: "5rem 0", background: "#f8f9fc" }}>
        <div className="container">
          <div className="faq-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "start" }}>
            <div ref={refFaq} className="reveal">
              <SectionLabel text="FAQ" />
              <h2 style={{ fontSize: "clamp(1.75rem, 3vw, 2.4rem)", fontWeight: 900, color: NAVY_TEXT, letterSpacing: "-0.03em", marginBottom: "1rem" }}>
                Часто задаваемые вопросы
              </h2>
              <p style={{ color: GRAY_TEXT, lineHeight: 1.7, marginBottom: "2rem" }}>
                Если не нашли ответ — позвоните нам, консультация бесплатна.
              </p>
              <a href="tel:+74951485806" style={{
                display: "inline-flex", alignItems: "center", gap: "0.5rem",
                background: RED, color: WHITE, fontWeight: 800, fontSize: "0.85rem",
                letterSpacing: "0.07em", textTransform: "uppercase" as const, padding: "0.875rem 1.75rem",
                borderRadius: 8, textDecoration: "none", transition: "background 0.2s",
              }}
                onMouseEnter={e => (e.currentTarget.style.background = RED_DARK)}
                onMouseLeave={e => (e.currentTarget.style.background = RED)}>
                ☎ Позвонить бесплатно
              </a>
            </div>
            <div>
              {faqs.map((f, i) => (
                <div key={i} style={{ borderBottom: "1px solid #e8ecf2" }}>
                  <button style={{
                    width: "100%", background: "none", border: "none", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "1.25rem 0", gap: "1rem", textAlign: "left" as const,
                  }} onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                    <span style={{ fontSize: "0.92rem", fontWeight: 700, color: NAVY_TEXT, lineHeight: 1.4 }}>{f.q}</span>
                    <span style={{
                      color: RED, fontSize: "1.3rem", flexShrink: 0,
                      transition: "transform 0.25s ease",
                      transform: openFaq === i ? "rotate(45deg)" : "none",
                      lineHeight: 1, display: "block",
                    }}>+</span>
                  </button>
                  <div style={{ maxHeight: openFaq === i ? "300px" : "0", overflow: "hidden", transition: "max-height 0.3s ease" }}>
                    <p style={{ paddingBottom: "1.25rem", color: GRAY_TEXT, lineHeight: 1.7, fontSize: "0.88rem", margin: 0 }}>{f.a}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          CTA BANNER
      ═══════════════════════════════════════════════════════════════════ */}
      <section style={{ paddingTop: "7px", paddingBottom: "42px", background: RED, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(rgba(0,0,0,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.06) 1px, transparent 1px)`, backgroundSize: "40px 40px", pointerEvents: "none" }} />
        <div className="container" style={{ textAlign: "center" as const, position: "relative", zIndex: 1 }}>
          <h2 style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)", fontWeight: 900, color: WHITE, letterSpacing: "-0.03em", marginBottom: "0.75rem" }}>
            Готовы избавиться от вредителей?
          </h2>
          <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "1rem", marginBottom: "2.5rem" }}>
            Оставьте заявку — перезвоним за 5 минут и рассчитаем стоимость
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" as const }}>
            <Link href="/calculator" style={{
              display: "inline-flex", alignItems: "center", gap: "0.5rem",
              background: WHITE, color: RED, fontWeight: 800, fontSize: "0.85rem",
              letterSpacing: "0.07em", textTransform: "uppercase" as const, padding: "1rem 2.25rem",
              borderRadius: 8, textDecoration: "none",
            }}>
              Рассчитать стоимость →
            </Link>
            <a href="tel:+74951485806" style={{
              display: "inline-flex", alignItems: "center", gap: "0.5rem",
              background: "transparent", color: WHITE, fontWeight: 700, fontSize: "0.85rem",
              letterSpacing: "0.07em", textTransform: "uppercase" as const, padding: "1rem 2.25rem",
              border: "2px solid rgba(255,255,255,0.6)", borderRadius: 8, textDecoration: "none",
            }}>
              ☎ 8(495)148-58-06
            </a>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          STICKY MOBILE CTA
      ═══════════════════════════════════════════════════════════════════ */}
      <div className="sticky-cta">
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <a href="tel:+74951485806" style={{
            flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
            background: "rgba(255,255,255,0.1)", color: WHITE, fontWeight: 700, fontSize: "0.85rem",
            letterSpacing: "0.04em", padding: "0.875rem", border: "1px solid rgba(255,255,255,0.25)",
            borderRadius: 8, textDecoration: "none",
          }}>☎ Позвонить</a>
          <Link href="/calculator" style={{
            flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
            background: RED, color: WHITE, fontWeight: 800, fontSize: "0.85rem",
            letterSpacing: "0.04em", padding: "0.875rem", borderRadius: 8, textDecoration: "none",
          }}>Рассчитать →</Link>
        </div>
      </div>

    </div>
  );
}
