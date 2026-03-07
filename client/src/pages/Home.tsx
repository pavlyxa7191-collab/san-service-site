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
/* ── Design Tokens ── */
const NAVY     = "#0D1F33";  /* --color-primary */
const NAVY_MID = "#122840";  /* --color-primary-mid */
const NAVY_DARK = "#081526"; /* --color-primary-dark */
const RED      = "#CC0000";  /* --color-accent */
const WHITE    = "#FFFFFF";
const GRAY_BG  = "#F5F7FA";

// ─── SERVICES DATA ────────────────────────────────────────────────────────────
const services = [
  { slug: "klopov",       Icon: IconBedbugs,     title: "Уничтожение клопов",    desc: "Полная ликвидация постельных клопов. Холодный и горячий туман.",    price: "от 1 500 ₽", guarantee: "3 года"       },
  { slug: "tarakanov",    Icon: IconCockroaches,  title: "Уничтожение тараканов", desc: "Дезинсекция от тараканов без запаха. Безопасно для детей.",          price: "от 1 500 ₽", guarantee: "1 год"        },
  { slug: "gryzunov",     Icon: IconRodents,      title: "Уничтожение грызунов",  desc: "Дератизация: мыши, крысы. Установка приманочных станций.",           price: "от 2 000 ₽", guarantee: "6 месяцев"    },
  { slug: "kleshhej",     Icon: IconTicks,        title: "Уничтожение клещей",    desc: "Обработка участков и помещений от клещей и комаров.",               price: "от 2 000 ₽", guarantee: "1 сезон"      },
  { slug: "pleseni",      Icon: IconMold,         title: "Удаление плесени",      desc: "Профессиональное удаление плесени и грибка. Обработка стен.",        price: "от 3 500 ₽", guarantee: "2 года"       },
  { slug: "dezinfektsii", Icon: IconDeodorization,title: "Дезинфекция",           desc: "Уничтожение патогенных микроорганизмов. Для предприятий.",           price: "от 20 ₽/м²", guarantee: "по договору"  },
  { slug: "zapahov",      Icon: IconOdor,         title: "Борьба с запахами",     desc: "Устранение неприятных запахов. Озонирование и дезодорация.",         price: "от 2 500 ₽", guarantee: "по договору"  },
  { slug: "uborka",       Icon: IconGuarantee,    title: "Уборка после смерти",   desc: "Профессиональная биологическая уборка. Дезинфекция и дезодорация.",  price: "от 5 000 ₽", guarantee: "по договору"  },
];

const methods = [
  { Icon: IconColdFog,      title: "Холодный туман",  desc: "Мелкодисперсное распыление инсектицида. Проникает в труднодоступные места." },
  { Icon: IconHotFog,       title: "Горячий туман",   desc: "Термическая обработка паром. Максимальная эффективность при клопах." },
  { Icon: IconSpray,        title: "Опрыскивание",    desc: "Направленная обработка поверхностей. Длительный остаточный эффект." },
  { Icon: IconOzonation,    title: "Озонация",        desc: "Обеззараживание воздуха и поверхностей. Устраняет запахи и вирусы." },
  { Icon: IconDeodorization,title: "Дезодорация",     desc: "Нейтрализация неприятных запахов. Безопасно для людей и животных." },
  { Icon: IconVentilation,  title: "Обработка вентиляции", desc: "Дезинфекция вентиляционных систем. Предотвращает распространение инфекций." },
];

const objectTypes = [
  { Icon: IconApartment,  title: "Квартиры",              desc: "1–5 комнат, студии, коммунальные квартиры",  price: "от 1 500 ₽" },
  { Icon: IconHouse,      title: "Частные дома",          desc: "Коттеджи, дачи, таунхаусы любой площади",    price: "от 3 500 ₽" },
  { Icon: IconCommercial, title: "Коммерческие объекты",  desc: "Офисы, рестораны, склады, производства",      price: "от 5 000 ₽" },
];

const steps = [
  { n: "01", title: "Звонок или заявка",     desc: "Оставьте заявку онлайн или позвоните. Консультация бесплатна." },
  { n: "02", title: "Диагностика",           desc: "Специалист оценивает масштаб проблемы и подбирает метод обработки." },
  { n: "03", title: "Договор и гарантия",    desc: "Заключаем официальный договор с гарантийными обязательствами." },
  { n: "04", title: "Обработка",             desc: "Профессиональная обработка сертифицированными препаратами." },
  { n: "05", title: "Контроль результата",   desc: "Проверяем эффективность. При необходимости — повторная обработка бесплатно." },
];

const faqs = [
  { q: "Насколько опасна дезинсекция для людей и животных?", a: "Все препараты сертифицированы и разрешены Роспотребнадзором. После обработки достаточно проветрить помещение 2–3 часа. Дети и животные могут вернуться через 4–6 часов." },
  { q: "Какими средствами производится обработка?", a: "Используем только сертифицированные препараты: Пушка, Китан, Тельк, Медин Форте. Все средства прошли государственную регистрацию и имеют санитарно-эпидемиологические заключения." },
  { q: "Сколько времени занимает обработка?", a: "Квартира: 30–40 минут. Крупные объекты: от 1 до 3 часов в зависимости от площади." },
  { q: "Даёте ли вы гарантию на результат?", a: "Да. На все виды работ выдаём оффициальный договор и гарантийный талон. Гарантия на уничтожение клопов — 3 года, тараканов — 1 год, грызунов — 6 месяцев, плесени — 2 года." },
];

// ─── SCROLL REVEAL HOOK ───────────────────────────────────────────────────────
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add("visible"); obs.disconnect(); } },
      { threshold: 0.12 }
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

  // Refs for reveal animations
  const refServices   = useReveal();
  const refMethods    = useReveal();
  const refSteps      = useReveal();
  const refObjects    = useReveal();
  const refAdvantages = useReveal();
  const refFaq        = useReveal();

  return (
    <div style={{ fontFamily: "'Inter', 'Helvetica Neue', sans-serif", background: WHITE }}>

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="hero-section grid-lines" style={{ minHeight: "90vh", display: "flex", alignItems: "center", position: "relative" }}>
        {/* Red top accent line */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: `linear-gradient(90deg, ${RED} 0%, rgba(255,255,255,0.3) 60%, transparent 100%)` }} />
        {/* Decorative circles */}
        <div style={{ position: "absolute", top: "15%", right: "8%", width: 320, height: 320, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.05)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "20%", right: "12%", width: 200, height: 200, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.07)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "10%", right: "5%", width: 120, height: 120, borderRadius: "50%", border: "1px solid rgba(204,0,0,0.12)", pointerEvents: "none" }} />

        <div className="container" style={{ position: "relative", zIndex: 1, paddingTop: "6rem", paddingBottom: "6rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 420px", gap: "4rem", alignItems: "center" }}>
            {/* Left: text */}
            <div>
              {/* Label */}
              <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.5rem" }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: RED, animation: "pulse-red 2s infinite" }} />
                <span className="section-label" style={{ color: RED }}>Лицензированная санитарная служба</span>
              </div>
              {/* Headline */}
              <h1 style={{ fontSize: "clamp(2.4rem, 5vw, 4rem)", fontWeight: 900, lineHeight: 1.08, letterSpacing: "-0.03em", color: WHITE, marginBottom: "1.5rem", maxWidth: 640 }}>
                Профессиональная<br />
                <span style={{ color: RED }}>дезинсекция</span> и<br />
                дезинфекция
              </h1>
              <p style={{ fontSize: "1.1rem", color: "rgba(255,255,255,0.75)", lineHeight: 1.65, marginBottom: "2.5rem", maxWidth: 520 }}>
                Уничтожение клопов, тараканов, грызунов и плесени.<br />
                Обработка без запаха. Холодный туман от 1 500 ₽. Гарантия до 3 лет.
              </p>
              {/* CTA buttons */}
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "3rem" }}>
                <Link href="/calculator" className="btn-red btn-pulse" style={{ fontSize: "0.9rem" }}>
                  Рассчитать стоимость →
                </Link>
                <a href="tel:+74955550000" className="btn-outline-white" style={{ fontSize: "0.9rem" }}>
                  ☎ Позвонить
                </a>
              </div>
              {/* Trust stats */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1px", background: "rgba(255,255,255,0.08)", maxWidth: 480 }}>
                {[
                  { n: "15+", label: "лет на рынке" },
                  { n: "12 000+", label: "обработок" },
                  { n: "3 года", label: "гарантия" },
                ].map((s, i) => (
                  <div key={i} className="stat-block" style={{ background: "rgba(13,31,51,0.7)", padding: "1rem 1.25rem" }}>
                    <div style={{ fontSize: "1.6rem", fontWeight: 900, color: WHITE, letterSpacing: "-0.04em", lineHeight: 1 }}>{s.n}</div>
                    <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.55)", marginTop: "0.3rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: quick form */}
            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(12px)", padding: "2rem", borderRadius: 4 }}>
              <div style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: RED, marginBottom: "0.75rem" }}>Бесплатная консультация</div>
              <h3 style={{ fontSize: "1.3rem", fontWeight: 800, color: WHITE, marginBottom: "1.5rem", lineHeight: 1.3 }}>Оставьте заявку — перезвоним за 5 минут</h3>
              {submitted ? (
                <div style={{ textAlign: "center", padding: "2rem 0" }}>
                  <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>✓</div>
                  <p style={{ color: WHITE, fontWeight: 600 }}>Заявка принята!</p>
                  <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.9rem", marginTop: "0.5rem" }}>Перезвоним в течение 5 минут</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
                  <input className="form-field" placeholder="Ваше имя" value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} required />
                  <input className="form-field" type="tel" placeholder="+7 (___) ___-__-__" value={formData.phone} onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))} required />
                  <select className="form-field" value={formData.service} onChange={e => setFormData(p => ({ ...p, service: e.target.value }))}>
                    <option value="">Выберите услугу</option>
                    {services.map(s => <option key={s.slug} value={s.slug}>{s.title}</option>)}
                  </select>
                  <button type="submit" className="btn-red" style={{ width: "100%", justifyContent: "center" }} disabled={createLead.isPending}>
                    {createLead.isPending ? "Отправка..." : "Получить консультацию →"}
                  </button>
                  <p style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.4)", textAlign: "center" }}>Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности</p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST BAR ─────────────────────────────────────────────────────── */}
      <div style={{ background: NAVY_MID, borderTop: `3px solid ${RED}`, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="container" style={{ padding: "1rem 0" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0", justifyContent: "space-between", alignItems: "center" }}>
            {[
              "✓ Лицензия СЭС",
              "✓ Сертифицированные препараты",
              "✓ Официальный договор",
              "✓ Гарантия в письменном виде",
              "✓ Выезд в день обращения",
            ].map((t, i) => (
              <span key={i} style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.8)", fontWeight: 600, padding: "0.25rem 0.75rem", letterSpacing: "0.02em" }}>{t}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ── SERVICES ──────────────────────────────────────────────────────── */}
      <section style={{ padding: "5rem 0", background: WHITE }}>
        <div className="container">
          <div ref={refServices} className="reveal" style={{ marginBottom: "3rem" }}>
            <div className="section-label" style={{ marginBottom: "0.75rem" }}>Наши услуги</div>
            <h2 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.5rem)", fontWeight: 900, color: NAVY, letterSpacing: "-0.03em", marginBottom: "0.75rem" }}>
              Полный спектр санитарных обработок
            </h2>
            <p style={{ color: "#6B7280", fontSize: "1.05rem", maxWidth: 560 }}>
              Профессиональная дезинсекция, дератизация и дезинфекция для жилых и коммерческих объектов
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.25rem" }}>
            {services.map((s, i) => (
              <Link key={s.slug} href={`/services/${s.slug}`}>
                <div className="light-card icon-card reveal" ref={i === 0 ? undefined : undefined}
                  style={{ padding: "1.75rem", borderRadius: 4, cursor: "pointer", display: "flex", flexDirection: "column", gap: "1rem", height: "100%",
                    animationDelay: `${i * 0.07}s`, opacity: 1 }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                    <s.Icon size={52} />
                    <span style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#6B7280", background: "#F5F7FA", padding: "0.25rem 0.6rem", borderRadius: 2 }}>
                      {s.guarantee}
                    </span>
                  </div>
                  <div>
                    <h3 style={{ fontSize: "1.05rem", fontWeight: 800, color: NAVY, marginBottom: "0.4rem", lineHeight: 1.3 }}>{s.title}</h3>
                    <p style={{ fontSize: "0.875rem", color: "#6B7280", lineHeight: 1.55 }}>{s.desc}</p>
                  </div>
                  <div style={{ marginTop: "auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: "1.2rem", fontWeight: 900, color: NAVY, letterSpacing: "-0.03em" }}>{s.price}</span>
                    <span style={{ fontSize: "0.8rem", color: RED, fontWeight: 700 }}>Подробнее →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── METHODS (виды обработок) ───────────────────────────────────────── */}
      <section className="navy-section" style={{ padding: "5rem 0" }}>
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div ref={refMethods} className="reveal" style={{ marginBottom: "3rem" }}>
            <div className="section-label" style={{ marginBottom: "0.75rem" }}>Методы обработки</div>
            <h2 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.5rem)", fontWeight: 900, color: WHITE, letterSpacing: "-0.03em", marginBottom: "0.75rem" }}>
              Виды санитарных обработок
            </h2>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "1.05rem", maxWidth: 520 }}>
              Выбираем метод в зависимости от типа вредителя, площади и особенностей объекта
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1px", background: "rgba(255,255,255,0.06)" }}>
            {methods.map((m, i) => (
              <div key={i} className="glass-card diag-line" style={{ padding: "2rem 1.75rem", transition: "background 0.2s ease" }}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.08)")}
                onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}>
                <m.Icon size={48} className="mb-4" />
                <h3 style={{ fontSize: "1rem", fontWeight: 800, color: WHITE, marginBottom: "0.5rem", marginTop: "1rem" }}>{m.title}</h3>
                <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.6)", lineHeight: 1.6 }}>{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW WE WORK ───────────────────────────────────────────────────── */}
      <section style={{ padding: "5rem 0", background: GRAY_BG }}>
        <div className="container">
          <div ref={refSteps} className="reveal" style={{ marginBottom: "3.5rem" }}>
            <div className="section-label" style={{ marginBottom: "0.75rem" }}>Схема работы</div>
            <h2 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.5rem)", fontWeight: 900, color: NAVY, letterSpacing: "-0.03em" }}>
              Как мы работаем
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "0", position: "relative" }}>
            {/* Connector line */}
            <div style={{ position: "absolute", top: "1.25rem", left: "10%", right: "10%", height: "2px", background: `linear-gradient(90deg, ${RED}, rgba(204,0,0,0.2))`, zIndex: 0 }} />
            {steps.map((s, i) => (
              <div key={i} style={{ position: "relative", zIndex: 1, padding: "0 1rem", textAlign: "center" }}>
                <div className="step-number" style={{ margin: "0 auto 1.25rem", background: i === 0 ? RED : WHITE, color: i === 0 ? WHITE : RED, borderColor: RED }}>
                  {s.n}
                </div>
                <h3 style={{ fontSize: "0.9rem", fontWeight: 800, color: NAVY, marginBottom: "0.5rem", lineHeight: 1.3 }}>{s.title}</h3>
                <p style={{ fontSize: "0.8rem", color: "#6B7280", lineHeight: 1.55 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── OBJECT TYPES ──────────────────────────────────────────────────── */}
      <section style={{ padding: "5rem 0", background: WHITE }}>
        <div className="container">
          <div ref={refObjects} className="reveal" style={{ marginBottom: "3rem" }}>
            <div className="section-label" style={{ marginBottom: "0.75rem" }}>Типы объектов</div>
            <h2 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.5rem)", fontWeight: 900, color: NAVY, letterSpacing: "-0.03em" }}>
              Работаем с любыми объектами
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0", border: `1px solid ${NAVY}`, borderRadius: 6, overflow: "hidden" }}>
            {objectTypes.map((o, i) => (
              <div key={i} style={{
                padding: "2.5rem 2rem",
                background: i === 1 ? NAVY : WHITE,
                borderRight: i < 2 ? `1px solid ${i === 0 ? "#E2E8F0" : "rgba(255,255,255,0.12)"}` : "none",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                position: "relative",
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = `0 12px 32px rgba(13,31,51,0.15)`; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}>
                {/* Red top accent line */}
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: i === 1 ? `linear-gradient(90deg, ${RED}, rgba(204,0,0,0.4))` : RED }} />
                <o.Icon size={52} />
                <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: i === 1 ? WHITE : NAVY, marginBottom: "0.5rem", marginTop: "1.25rem" }}>{o.title}</h3>
                <p style={{ fontSize: "0.875rem", color: i === 1 ? "rgba(255,255,255,0.65)" : "#6B7280", lineHeight: 1.6, marginBottom: "1.5rem" }}>{o.desc}</p>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "1.4rem", fontWeight: 900, color: i === 1 ? WHITE : NAVY, letterSpacing: "-0.03em" }}>{o.price}</span>
                  <span style={{ fontSize: "0.78rem", color: RED, fontWeight: 700, letterSpacing: "0.04em" }}>ЗАКАЗАТЬ →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ADVANTAGES ────────────────────────────────────────────────────── */}
      <section className="navy-section" style={{ padding: "5rem 0" }}>
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div ref={refAdvantages} className="reveal" style={{ marginBottom: "3rem" }}>
            <div className="section-label" style={{ marginBottom: "0.75rem" }}>Почему мы</div>
            <h2 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.5rem)", fontWeight: 900, color: WHITE, letterSpacing: "-0.03em" }}>
              Наши преимущества
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1px", background: "rgba(255,255,255,0.08)" }}>
            {[
              { Icon: IconGuarantee,   title: "Гарантия до 3 лет",       desc: "Оффициальный гарантийный талон на каждый вид работ", num: "3" },
              { Icon: IconSpecialist,  title: "Выезд в день обращения",   desc: "Специалист приедет в удобное для вас время. Без предоплаты", num: "24/7" },
              { Icon: IconCalculator,  title: "Фиксированные цены",       desc: "Стоимость указана в договоре и не меняется после выезда", num: "0%" },
              { Icon: IconColdFog,     title: "Безопасные препараты",      desc: "Сертифицированные средства, одобренные Роспотребнадзором", num: "100%" },
            ].map((a, i) => (
              <div key={i} style={{
                padding: "2.5rem 2rem",
                background: "rgba(255,255,255,0.03)",
                borderTop: `3px solid ${i === 0 ? RED : "rgba(255,255,255,0.08)"}`,
                transition: "background 0.2s ease",
                position: "relative",
              }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.07)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}>
                {/* Large number */}
                <div style={{ fontSize: "2.5rem", fontWeight: 900, color: RED, letterSpacing: "-0.04em", lineHeight: 1, marginBottom: "1rem" }}>{a.num}</div>
                <a.Icon size={36} />
                <h3 style={{ fontSize: "1rem", fontWeight: 800, color: WHITE, marginBottom: "0.5rem", marginTop: "0.875rem" }}>{a.title}</h3>
                <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.6 }}>{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────────── */}
      <section style={{ padding: "5rem 0", background: WHITE }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "start" }}>
            <div ref={refFaq} className="reveal-left">
              <div className="section-label" style={{ marginBottom: "0.75rem" }}>FAQ</div>
              <h2 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.5rem)", fontWeight: 900, color: NAVY, letterSpacing: "-0.03em", marginBottom: "1.25rem" }}>
                Часто задаваемые вопросы
              </h2>
              <p style={{ color: "#6B7280", lineHeight: 1.65, marginBottom: "2rem" }}>
                Если не нашли ответ — позвоните нам, консультация бесплатна.
              </p>
              <a href="tel:+74955550000" className="btn-red">☎ Позвонить бесплатно</a>
            </div>
            <div>
              {faqs.map((f, i) => (
                <div key={i} className="faq-item">
                  <button className="faq-question" onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{ width: "100%", background: "none", border: "none" }}>
                    <span>{f.q}</span>
                    <span style={{ color: RED, fontSize: "1.25rem", flexShrink: 0, transition: "transform 0.25s ease", transform: openFaq === i ? "rotate(45deg)" : "none" }}>+</span>
                  </button>
                  <div className={`faq-answer ${openFaq === i ? "open" : ""}`}>
                    <p style={{ paddingBottom: "1.25rem", color: "#6B7280", lineHeight: 1.65, fontSize: "0.9rem" }}>{f.a}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ────────────────────────────────────────────────────── */}
      <section style={{ padding: "4rem 0", background: RED }}>
        <div className="container" style={{ textAlign: "center" }}>
          <h2 style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: 900, color: WHITE, letterSpacing: "-0.03em", marginBottom: "0.75rem" }}>
            Готовы избавиться от вредителей?
          </h2>
          <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "1.05rem", marginBottom: "2rem" }}>
            Оставьте заявку — перезвоним за 5 минут и рассчитаем стоимость
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/calculator" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: WHITE, color: RED, fontWeight: 800, fontSize: "0.9rem", letterSpacing: "0.06em", textTransform: "uppercase", padding: "1rem 2rem", borderRadius: 2, textDecoration: "none" }}>
              Рассчитать стоимость →
            </Link>
            <a href="tel:+74955550000" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "transparent", color: WHITE, fontWeight: 700, fontSize: "0.9rem", letterSpacing: "0.06em", textTransform: "uppercase", padding: "1rem 2rem", border: "2px solid rgba(255,255,255,0.6)", borderRadius: 2, textDecoration: "none" }}>
              ☎ +7 (495) 555-00-00
            </a>
          </div>
        </div>
      </section>

      {/* ── STICKY MOBILE CTA ─────────────────────────────────────────────── */}
      <div className="sticky-cta">
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <a href="tel:+74955550000" className="btn-outline-white" style={{ flex: 1, justifyContent: "center", padding: "0.75rem" }}>☎ Позвонить</a>
          <Link href="/calculator" className="btn-red" style={{ flex: 1, justifyContent: "center", padding: "0.75rem" }}>Рассчитать →</Link>
        </div>
      </div>
    </div>
  );
}
