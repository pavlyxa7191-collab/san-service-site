import { Link } from "wouter";
import { Phone, ArrowRight, Shield, Clock, CheckCircle, Star, ChevronDown } from "lucide-react";
import { useState } from "react";

// ─── CDN PHOTOS (permanent CloudFront S3 URLs) ────────────────────────────────
// Permanent CloudFront CDN URLs (uploaded via storagePut)
const CDN_BASE = "https://d2xsxph8kpxj0f.cloudfront.net/310519663313765274/L8SjSLKH4wQcbNtHZ9BCPq";
const PHOTO_HERO       = `${CDN_BASE}/site-photos/hero.jpg`;
const PHOTO_SPECIALIST = `${CDN_BASE}/site-photos/specialist.jpg`;
const PHOTO_KITCHEN    = `${CDN_BASE}/site-photos/kitchen.jpg`;
const PHOTO_ROOM       = `${CDN_BASE}/site-photos/room.jpg`;
const PHOTO_PRODUCTS   = `${CDN_BASE}/site-photos/products.jpg`;
const PHOTO_PROCESS    = `${CDN_BASE}/site-photos/process.jpg`;
const PHOTO_WORK       = `${CDN_BASE}/site-photos/work.jpg`;
const PHOTO_TEAM       = `${CDN_BASE}/site-photos/team.jpg`;
const PHOTO_EQUIPMENT  = `${CDN_BASE}/site-photos/equipment.jpg`;
const PHOTO_SPRAY      = `${CDN_BASE}/site-photos/spray.jpg`;

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const NAVY        = "#0f1923";
const NAVY_MID    = "#1a2d40";
const RED         = "#CC0000";
const WHITE       = "#FFFFFF";
const GRAY_BG     = "#F5F7FA";
const GRAY_BORDER = "#E2E8F0";
const TEXT_DARK   = "#1a2332";
const TEXT_MID    = "#4a5568";

// ─── SERVICES DATA ────────────────────────────────────────────────────────────
const services = [
  { slug: "klopov",    icon: "🪲", title: "Уничтожение клопов",    desc: "Полная ликвидация постельных клопов. Холодный и горячий туман.", price: "от 2 500 ₽", guarantee: "3 года",     photo: PHOTO_SPECIALIST },
  { slug: "tarakanov", icon: "🪳", title: "Уничтожение тараканов", desc: "Дезинсекция от тараканов без запаха. Безопасно для детей.",      price: "от 1 500 ₽", guarantee: "1 год",      photo: PHOTO_KITCHEN    },
  { slug: "gryzunov",  icon: "🐀", title: "Уничтожение грызунов",  desc: "Дератизация: мыши, крысы. Установка приманочных станций.",       price: "от 3 000 ₽", guarantee: "6 месяцев",  photo: PHOTO_PROCESS    },
  { slug: "kleshhej",  icon: "🕷️", title: "Уничтожение клещей",    desc: "Обработка участков и помещений от клещей и комаров.",           price: "от 2 000 ₽", guarantee: "1 сезон",    photo: PHOTO_WORK       },
  { slug: "pleseni",   icon: "🍄", title: "Удаление плесени",      desc: "Профессиональное удаление плесени и грибка. Обработка стен.",    price: "от 3 500 ₽", guarantee: "2 года",     photo: PHOTO_ROOM       },
  { slug: "dezinfektsii", icon: "🧪", title: "Дезинфекция",        desc: "Уничтожение патогенных микроорганизмов. Для предприятий.",       price: "от 20 ₽/м²", guarantee: "по договору", photo: PHOTO_PRODUCTS   },
];

const faqs = [
  { q: "Насколько опасна дезинсекция для людей и животных?", a: "Все препараты, которые мы используем, сертифицированы и разрешены Роспотребнадзором. После обработки достаточно проветрить помещение 2–3 часа. Дети и животные могут вернуться через 4–6 часов." },
  { q: "Какими средствами производится обработка?", a: "Мы используем только сертифицированные импортные препараты: Сипаз Про, Дельта Зона, Форс Сайт. Все средства прошли государственную регистрацию и имеют санитарно-эпидемиологические заключения." },
  { q: "Сколько времени занимает обработка квартиры?", a: "Обработка стандартной квартиры (1–3 комнаты) занимает от 1 до 2 часов. Крупные объекты (дома, офисы, склады) — от 3 до 8 часов в зависимости от площади." },
  { q: "Можно ли вызвать специалиста в Московскую область?", a: "Да, мы работаем по всей Московской области: Воскресенск, Коломна, Жуковский, Раменское, Люберцы и другие города. Выезд в день обращения." },
  { q: "Даёте ли вы гарантию на результат?", a: "Да. На все виды работ мы выдаём официальный договор и гарантийный талон. Гарантия на уничтожение клопов — 3 года, тараканов — 1 год, грызунов — 6 месяцев, плесени — 2 года." },
];

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: "", phone: "", service: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/trpc/leads.submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ json: { ...formData, source: "hero_form" } }),
      });
      if (res.ok) setSubmitted(true);
    } catch {
      setSubmitted(true);
    }
  };

  return (
    <div style={{ fontFamily: "'Inter', 'Helvetica Neue', sans-serif", background: WHITE }}>

      {/* ── HERO ──────────────────────────────────────────────────────────────── */}
      <section
        style={{
          minHeight: "88vh",
          display: "flex",
          alignItems: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background photo */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${PHOTO_HERO})`,
            backgroundSize: "cover",
            backgroundPosition: "center 30%",
            opacity: 0.75,
          }}
        />
        {/* Gradient overlay — left dark, right transparent */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(100deg, ${NAVY} 25%, rgba(15,25,35,0.75) 55%, rgba(15,25,35,0.25) 100%)`,
          }}
        />
        {/* White shimmer line top */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: `linear-gradient(90deg, ${RED} 0%, rgba(255,255,255,0.3) 50%, transparent 100%)` }} />

        <div className="container" style={{ position: "relative", zIndex: 1, paddingTop: "100px", paddingBottom: "80px" }}>
          <div style={{ maxWidth: "620px" }}>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 mb-6" style={{ background: "rgba(204,0,0,0.15)", border: "1px solid rgba(204,0,0,0.4)", padding: "6px 14px", borderRadius: "2px" }}>
              <div style={{ width: 7, height: 7, background: RED, borderRadius: "50%" }} />
              <span className="text-xs font-bold" style={{ color: "#ff6666", letterSpacing: "0.14em", textTransform: "uppercase" }}>Лицензированная санитарная служба</span>
            </div>

            <h1 className="font-black leading-none mb-6" style={{ fontSize: "clamp(2.4rem, 5vw, 3.8rem)", color: WHITE, letterSpacing: "-0.03em" }}>
              Профессиональная{" "}
              <span style={{ color: RED }}>дезинсекция</span>{" "}
              и<br />дезинфекция
            </h1>

            <p className="text-lg mb-8 leading-relaxed" style={{ color: "rgba(255,255,255,0.8)", maxWidth: "480px" }}>
              Уничтожение клопов, тараканов, грызунов и плесени. Москва и Московская область. Гарантия до 3 лет. Выезд в день обращения.
            </p>

            {/* Stats row */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, auto)", gap: "0", marginBottom: "40px", maxWidth: "420px" }}>
              {[
                { val: "15+",   label: "лет опыта" },
                { val: "780+",  label: "отзывов" },
                { val: "3 г.",  label: "гарантия" },
                { val: "24/7",  label: "работаем" },
              ].map((s, i) => (
                <div key={s.label} style={{ paddingLeft: i > 0 ? "20px" : "0", paddingRight: "20px", borderLeft: i > 0 ? "1px solid rgba(255,255,255,0.25)" : "none" }}>
                  <div style={{ fontWeight: 900, fontSize: "1.5rem", color: RED, letterSpacing: "-0.04em", lineHeight: 1.1 }}>{s.val}</div>
                  <div style={{ fontSize: "0.65rem", marginTop: "4px", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.1em", whiteSpace: "nowrap" }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-3">
              <Link
                href="/calculator"
                className="inline-flex items-center gap-2 font-bold no-underline"
                style={{ background: RED, color: WHITE, padding: "14px 28px", fontSize: "0.85rem", letterSpacing: "0.08em", textTransform: "uppercase" }}
              >
                Рассчитать стоимость <ArrowRight size={16} />
              </Link>
              <a
                href="tel:+79300354841"
                className="inline-flex items-center gap-2 font-bold no-underline"
                style={{ background: "transparent", color: WHITE, padding: "14px 28px", fontSize: "0.85rem", letterSpacing: "0.08em", textTransform: "uppercase", border: "1px solid rgba(255,255,255,0.3)" }}
              >
                <Phone size={16} /> 8(930)035-48-41
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICES ──────────────────────────────────────────────────────────── */}
      <section style={{ background: WHITE, padding: "80px 0" }}>
        <div className="container">
          <div className="flex items-center gap-3 mb-2">
            <div style={{ width: 12, height: 12, background: RED }} />
            <span className="text-xs font-bold" style={{ color: RED, letterSpacing: "0.14em", textTransform: "uppercase" }}>Услуги</span>
          </div>
          <div className="flex items-end justify-between mb-10" style={{ borderBottom: `2px solid ${TEXT_DARK}`, paddingBottom: "1rem" }}>
            <h2 className="font-black text-3xl" style={{ color: TEXT_DARK, letterSpacing: "-0.03em" }}>
              Все виды санитарной обработки
            </h2>
            <Link href="/calculator" className="text-sm font-bold no-underline hidden md:block" style={{ color: RED }}>
              Рассчитать стоимость →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s) => (
              <div
                key={s.slug}
                className="flex flex-col overflow-hidden"
                style={{
                  border: `1px solid ${GRAY_BORDER}`,
                  transition: "box-shadow 0.2s, transform 0.2s",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 32px rgba(0,0,0,0.12)";
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                }}
              >
                {/* Photo */}
                <div style={{ height: "180px", overflow: "hidden", position: "relative" }}>
                  <img
                    src={s.photo}
                    alt={s.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }}
                  />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(15,25,35,0.5) 0%, transparent 60%)" }} />
                  <div style={{ position: "absolute", top: "12px", left: "12px", fontSize: "1.8rem" }}>{s.icon}</div>
                </div>
                {/* Content */}
                <div className="flex flex-col flex-1 p-5">
                  <h3 className="font-black text-lg mb-2" style={{ color: TEXT_DARK, letterSpacing: "-0.02em" }}>{s.title}</h3>
                  <p className="text-sm leading-relaxed mb-4 flex-1" style={{ color: TEXT_MID }}>{s.desc}</p>
                  <div className="flex items-center justify-between mt-auto pt-4" style={{ borderTop: `1px solid ${GRAY_BORDER}` }}>
                    <div>
                      <div className="font-black" style={{ color: RED, fontSize: "1.1rem" }}>{s.price}</div>
                      <div className="text-xs" style={{ color: TEXT_MID }}>Гарантия {s.guarantee}</div>
                    </div>
                    <Link
                      href={`/services/${s.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-bold no-underline"
                      style={{ color: WHITE, background: TEXT_DARK, padding: "8px 14px", textTransform: "uppercase", letterSpacing: "0.06em" }}
                    >
                      Подробнее <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PHOTO STRIP ───────────────────────────────────────────────────────── */}
      <section style={{ padding: "0" }}>
        <div className="grid grid-cols-2 md:grid-cols-5" style={{ height: "240px" }}>
          {[PHOTO_SPECIALIST, PHOTO_KITCHEN, PHOTO_PROCESS, PHOTO_WORK, PHOTO_EQUIPMENT].map((photo, i) => (
            <div
              key={i}
              style={{
                backgroundImage: `url(${photo})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                position: "relative",
              }}
            >
              <div style={{ position: "absolute", inset: 0, background: "rgba(15,25,35,0.2)" }} />
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────────────────────── */}
      <section style={{ background: GRAY_BG, padding: "80px 0" }}>
        <div className="container">
          <div className="flex items-center gap-3 mb-2">
            <div style={{ width: 12, height: 12, background: RED }} />
            <span className="text-xs font-bold" style={{ color: RED, letterSpacing: "0.14em", textTransform: "uppercase" }}>Схема работы</span>
          </div>
          <h2 className="font-black text-3xl mb-10" style={{ color: TEXT_DARK, letterSpacing: "-0.03em", borderBottom: `2px solid ${TEXT_DARK}`, paddingBottom: "1rem" }}>
            Просто и прозрачно
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0" style={{ border: `1px solid ${GRAY_BORDER}` }}>
            {[
              { num: "01", title: "Консультация", desc: "Бесплатно отвечаем на вопросы и называем фиксированную цену" },
              { num: "02", title: "Выезд специалиста", desc: "Приезжаем в удобное время, проводим диагностику" },
              { num: "03", title: "Обработка", desc: "Проводим полную обработку сертифицированными препаратами" },
              { num: "04", title: "Гарантия", desc: "Выдаём договор и гарантийный талон на срок до 3 лет" },
            ].map((step, i) => (
              <div
                key={step.num}
                className="p-8"
                style={{
                  borderRight: i < 3 ? `1px solid ${GRAY_BORDER}` : "none",
                  background: WHITE,
                }}
              >
                <div className="font-black text-5xl mb-4" style={{ color: GRAY_BORDER, letterSpacing: "-0.06em", lineHeight: 1 }}>{step.num}</div>
                <div style={{ width: 24, height: 3, background: RED, marginBottom: "16px" }} />
                <h3 className="font-black text-base mb-3" style={{ color: TEXT_DARK }}>{step.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: TEXT_MID }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROPERTY TYPES ────────────────────────────────────────────────────── */}
      <section style={{ background: WHITE, padding: "80px 0" }}>
        <div className="container">
          <div className="flex items-center gap-3 mb-2">
            <div style={{ width: 12, height: 12, background: RED }} />
            <span className="text-xs font-bold" style={{ color: RED, letterSpacing: "0.14em", textTransform: "uppercase" }}>Типы объектов</span>
          </div>
          <h2 className="font-black text-3xl mb-10" style={{ color: TEXT_DARK, letterSpacing: "-0.03em", borderBottom: `2px solid ${TEXT_DARK}`, paddingBottom: "1rem" }}>
            Работаем с любыми помещениями
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: "🏠", title: "Квартиры и общежития", desc: "Обрабатываем как всё помещение, так и отдельные комнаты и мебель.", price: "от 1 690 ₽", photo: PHOTO_KITCHEN },
              { icon: "🏡", title: "Частные дома и коттеджи", desc: "Уничтожаем клопов, тараканов, комаров, клещей, ос и прочую живность.", price: "от 2 490 ₽", photo: PHOTO_ROOM },
              { icon: "🏢", title: "Организации и предприятия", desc: "Работаем по договору и нормам СанПиН, Роспотребнадзора. Оформляем документы.", price: "от 20 ₽/м²", photo: PHOTO_WORK },
            ].map((t) => (
              <div key={t.title} style={{ border: `1px solid ${GRAY_BORDER}`, overflow: "hidden" }}>
                <div style={{ height: "160px", backgroundImage: `url(${t.photo})`, backgroundSize: "cover", backgroundPosition: "center", position: "relative" }}>
                  <div style={{ position: "absolute", inset: 0, background: "rgba(15,25,35,0.3)" }} />
                  <div style={{ position: "absolute", bottom: "12px", left: "12px", fontSize: "2rem" }}>{t.icon}</div>
                </div>
                <div className="p-6">
                  <h3 className="font-black text-base mb-2" style={{ color: TEXT_DARK }}>{t.title}</h3>
                  <p className="text-sm leading-relaxed mb-4" style={{ color: TEXT_MID }}>{t.desc}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-black" style={{ color: RED }}>{t.price}</span>
                    <Link href="/calculator" className="text-xs font-bold no-underline" style={{ color: TEXT_DARK, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                      Рассчитать →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRUST / WHY US ────────────────────────────────────────────────────── */}
      <section style={{ background: GRAY_BG, padding: "80px 0" }}>
        <div className="container">
          <div className="flex items-center gap-3 mb-2">
            <div style={{ width: 12, height: 12, background: RED }} />
            <span className="text-xs font-bold" style={{ color: RED, letterSpacing: "0.14em", textTransform: "uppercase" }}>Почему выбирают нас</span>
          </div>
          <h2 className="font-black text-3xl mb-10" style={{ color: TEXT_DARK, letterSpacing: "-0.03em", borderBottom: `2px solid ${TEXT_DARK}`, paddingBottom: "1rem" }}>
            Надёжность и гарантия результата
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: <Shield size={20} />, title: "Гарантия 3 года", desc: "Официальный договор с гарантийным обслуживанием" },
                { icon: <CheckCircle size={20} />, title: "Сертифицированные препараты", desc: "Только проверенные импортные средства" },
                { icon: <Shield size={20} />, title: "Безопасно для семьи", desc: "Безвредно для детей, животных и аллергиков" },
                { icon: <Clock size={20} />, title: "Работаем 24/7", desc: "Выезд в день обращения, включая выходные" },
                { icon: <CheckCircle size={20} />, title: "Лицензированная компания", desc: "ООО «Экоцентр», ИНН 5005040782" },
                { icon: <Star size={20} />, title: "780+ отзывов", desc: "Реальные отзывы на Яндексе и Авито" },
              ].map((item) => (
                <div key={item.title} className="p-5" style={{ background: WHITE, border: `1px solid ${GRAY_BORDER}` }}>
                  <div className="mb-3" style={{ color: RED }}>{item.icon}</div>
                  <div className="font-bold text-sm mb-1" style={{ color: TEXT_DARK }}>{item.title}</div>
                  <div className="text-xs leading-relaxed" style={{ color: TEXT_MID }}>{item.desc}</div>
                </div>
              ))}
            </div>
            <div style={{ position: "relative" }}>
              <img
                src={PHOTO_TEAM}
                alt="Специалист за работой"
                style={{ width: "100%", height: "420px", objectFit: "cover", display: "block" }}
              />
              <div style={{ position: "absolute", bottom: "-16px", right: "-16px", background: RED, color: WHITE, padding: "20px 24px", fontWeight: 900, fontSize: "1.4rem", letterSpacing: "-0.03em", lineHeight: 1.2 }}>
                15 лет<br /><span style={{ fontSize: "0.75rem", fontWeight: 400, letterSpacing: "0.05em", textTransform: "uppercase" }}>на рынке</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA CALCULATOR ────────────────────────────────────────────────────── */}
      <section style={{ background: NAVY_MID, padding: "80px 0", position: "relative", overflow: "hidden" }}>
        {/* Background photo with overlay */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${PHOTO_SPRAY})`, backgroundSize: "cover", backgroundPosition: "center", opacity: 0.15 }} />
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg, ${NAVY} 0%, ${NAVY_MID} 100%)`, opacity: 0.9 }} />
        {/* White shimmer */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)` }} />

        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div className="flex items-center gap-3 mb-2">
            <div style={{ width: 12, height: 12, background: RED }} />
            <span className="text-xs font-bold" style={{ color: "rgba(255,255,255,0.5)", letterSpacing: "0.14em", textTransform: "uppercase" }}>Калькулятор стоимости</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 items-center">
            <div>
              <h2 className="font-black text-3xl mb-4" style={{ color: WHITE, letterSpacing: "-0.03em" }}>
                Узнайте точную стоимость за 2 минуты
              </h2>
              <p className="mb-8 leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>
                Выберите тип помещения, площадь и вид вредителей — получите точный расчёт без скрытых доплат. Фиксированная цена в договоре.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-8">
                {[
                  { val: "1 500 ₽", label: "Минимальная цена" },
                  { val: "3 года", label: "Максимальная гарантия" },
                  { val: "2 часа", label: "Среднее время обработки" },
                  { val: "100%", label: "Результат или возврат" },
                ].map((s) => (
                  <div key={s.label} style={{ borderLeft: `3px solid ${RED}`, paddingLeft: "16px" }}>
                    <div className="font-black text-xl" style={{ color: WHITE, letterSpacing: "-0.03em" }}>{s.val}</div>
                    <div className="text-xs" style={{ color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.label}</div>
                  </div>
                ))}
              </div>
              <Link
                href="/calculator"
                className="inline-flex items-center gap-2 font-bold no-underline"
                style={{ background: RED, color: WHITE, padding: "16px 32px", fontSize: "0.85rem", letterSpacing: "0.08em", textTransform: "uppercase" }}
              >
                Рассчитать стоимость <ArrowRight size={16} />
              </Link>
            </div>
            {/* Quick form */}
            <div style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", padding: "32px", backdropFilter: "blur(8px)" }}>
              {submitted ? (
                <div className="text-center py-8">
                  <CheckCircle size={48} style={{ color: RED, margin: "0 auto 16px" }} />
                  <div className="font-black text-xl mb-2" style={{ color: WHITE }}>Заявка принята!</div>
                  <div style={{ color: "rgba(255,255,255,0.6)" }}>Перезвоним в течение 15 минут</div>
                </div>
              ) : (
                <>
                  <h3 className="font-black text-lg mb-6" style={{ color: WHITE }}>Оставить заявку</h3>
                  <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input
                      type="text"
                      placeholder="Ваше имя"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.2)", color: WHITE, padding: "12px 16px", fontSize: "0.9rem", outline: "none" }}
                    />
                    <input
                      type="tel"
                      placeholder="Телефон *"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.2)", color: WHITE, padding: "12px 16px", fontSize: "0.9rem", outline: "none" }}
                    />
                    <select
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                      style={{ background: "rgba(30,45,64,0.9)", border: "1px solid rgba(255,255,255,0.2)", color: formData.service ? WHITE : "rgba(255,255,255,0.4)", padding: "12px 16px", fontSize: "0.9rem", outline: "none" }}
                    >
                      <option value="">Выберите услугу</option>
                      {services.map((s) => <option key={s.slug} value={s.slug} style={{ color: TEXT_DARK }}>{s.title}</option>)}
                    </select>
                    <button
                      type="submit"
                      className="font-bold"
                      style={{ background: RED, color: WHITE, padding: "14px", fontSize: "0.85rem", letterSpacing: "0.08em", textTransform: "uppercase", border: "none", cursor: "pointer" }}
                    >
                      Оставить заявку
                    </button>
                    <p className="text-xs text-center" style={{ color: "rgba(255,255,255,0.35)" }}>
                      Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности
                    </p>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────────────── */}
      <section style={{ background: WHITE, padding: "80px 0" }}>
        <div className="container">
          <div className="flex items-center gap-3 mb-2">
            <div style={{ width: 12, height: 12, background: RED }} />
            <span className="text-xs font-bold" style={{ color: RED, letterSpacing: "0.14em", textTransform: "uppercase" }}>FAQ</span>
          </div>
          <h2 className="font-black text-3xl mb-10" style={{ color: TEXT_DARK, letterSpacing: "-0.03em", borderBottom: `2px solid ${TEXT_DARK}`, paddingBottom: "1rem" }}>
            Часто задаваемые вопросы
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16">
            <div>
              {faqs.map((faq, i) => (
                <div key={i} style={{ borderBottom: `1px solid ${GRAY_BORDER}` }}>
                  <button
                    className="w-full text-left py-5 flex items-center justify-between gap-4"
                    style={{ background: "none", border: "none", cursor: "pointer" }}
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    <span className="font-bold text-sm" style={{ color: TEXT_DARK }}>{faq.q}</span>
                    <ChevronDown
                      size={18}
                      style={{ color: RED, flexShrink: 0, transform: openFaq === i ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}
                    />
                  </button>
                  {openFaq === i && (
                    <div className="pb-5 text-sm leading-relaxed" style={{ color: TEXT_MID }}>{faq.a}</div>
                  )}
                </div>
              ))}
              <div className="mt-8 p-6" style={{ background: GRAY_BG, borderLeft: `4px solid ${RED}` }}>
                <div className="font-bold mb-2" style={{ color: TEXT_DARK }}>Остались вопросы?</div>
                <div className="text-sm mb-4" style={{ color: TEXT_MID }}>Звоните — консультация бесплатно</div>
                <a href="tel:+79300354841" className="font-black no-underline" style={{ color: RED, fontSize: "1.2rem" }}>8(930)035-48-41</a>
              </div>
            </div>
            <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: "16px" }}>
              <img src={PHOTO_PROCESS} alt="Процесс обработки" style={{ width: "100%", height: "280px", objectFit: "cover" }} />
              <img src={PHOTO_EQUIPMENT} alt="Оборудование" style={{ width: "100%", height: "200px", objectFit: "cover" }} />
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────────────────────────────── */}
      <section style={{ background: RED, padding: "60px 0" }}>
        <div className="container text-center">
          <h2 className="font-black text-3xl mb-4" style={{ color: WHITE, letterSpacing: "-0.03em" }}>
            Готовы избавиться от вредителей?
          </h2>
          <p className="mb-8" style={{ color: "rgba(255,255,255,0.8)" }}>Выезд в день обращения. Гарантия результата.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a href="tel:+79300354841" className="inline-flex items-center gap-2 font-bold no-underline" style={{ background: WHITE, color: RED, padding: "16px 32px", fontSize: "0.85rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>
              <Phone size={16} /> 8(930)035-48-41
            </a>
            <Link href="/calculator" className="inline-flex items-center gap-2 font-bold no-underline" style={{ background: "transparent", color: WHITE, padding: "16px 32px", fontSize: "0.85rem", letterSpacing: "0.08em", textTransform: "uppercase", border: "2px solid rgba(255,255,255,0.5)" }}>
              Оставить заявку <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── MOBILE STICKY CTA ─────────────────────────────────────────────────── */}
      <div
        className="md:hidden"
        style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 50, display: "flex", boxShadow: "0 -4px 20px rgba(0,0,0,0.15)" }}
      >
        <a
          href="tel:+79300354841"
          className="flex-1 flex items-center justify-center gap-2 font-bold no-underline"
          style={{ background: NAVY, color: WHITE, padding: "16px", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.06em" }}
        >
          <Phone size={16} /> Позвонить
        </a>
        <Link
          href="/calculator"
          className="flex-1 flex items-center justify-center gap-2 font-bold no-underline"
          style={{ background: RED, color: WHITE, padding: "16px", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.06em" }}
        >
          Рассчитать <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
