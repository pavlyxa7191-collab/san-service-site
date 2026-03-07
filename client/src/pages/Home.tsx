import { Link } from "wouter";
import {
  Phone,
  ArrowRight,
  CheckCircle,
  Shield,
  Clock,
  Star,
  ChevronDown,
  Bug,
  Rat,
  Droplets,
  Zap,
  FileCheck,
  Users,
  Award,
  ThumbsUp,
  Leaf,
} from "lucide-react";
import { useState } from "react";

// ─── PHOTO URLS (Unsplash — permanent, free) ─────────────────────────────────
// Specialist in protective suit spraying
const PHOTO_HERO = "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=800&q=80&fit=crop";
// Disinfection specialist at work
const PHOTO_TREATMENT = "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=800&q=80&fit=crop";

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const DARK = "#0f1923";
const DARK2 = "#162030";
const DARK3 = "#1a2535";
const RED = "#CC0000";

// ─── DATA ────────────────────────────────────────────────────────────────────
const services = [
  { id: "klopov", icon: Bug, title: "Уничтожение клопов", desc: "Полная ликвидация постельных клопов методом холодного или горячего тумана. Гарантия 3 года.", price: "от 2 500 ₽", href: "/services/klopov", tag: "Популярно" },
  { id: "tarakanov", icon: Bug, title: "Уничтожение тараканов", desc: "Эффективное уничтожение тараканов в квартирах, домах и на предприятиях. Без запаха.", price: "от 1 800 ₽", href: "/services/tarakanov", tag: null },
  { id: "gryzunov", icon: Rat, title: "Уничтожение грызунов", desc: "Дератизация — уничтожение крыс и мышей. Установка ловушек и приманок. Договор.", price: "от 3 000 ₽", href: "/services/gryzunov", tag: null },
  { id: "kleshchey", icon: Leaf, title: "Уничтожение клещей", desc: "Обработка участков, газонов и территорий от клещей. Безопасно для детей и животных.", price: "от 1 500 ₽", href: "/services/kleshchey", tag: null },
  { id: "pleseni", icon: Droplets, title: "Удаление плесени", desc: "Профессиональное удаление плесени и грибка. Обработка антисептиками. Гарантия.", price: "от 2 000 ₽", href: "/services/pleseni", tag: null },
  { id: "dezinfektsiya", icon: Zap, title: "Дезинфекция", desc: "Уничтожение патогенных микроорганизмов, вирусов и бактерий. Для предприятий и жилья.", price: "от 20 ₽/м²", href: "/services/dezinfektsiya", tag: null },
];

const propertyTypes = [
  { title: "Квартиры и общежития", desc: "Обрабатываем как всё помещение, так и отдельные комнаты и мебель.", price: "от 1 690 ₽", icon: "🏠" },
  { title: "Частные дома и коттеджи", desc: "Уничтожаем клопов, тараканов, комаров, клещей, ос и прочую живность.", price: "от 2 490 ₽", icon: "🏡" },
  { title: "Организации и предприятия", desc: "Работаем по договору и нормам СанПиН, Роспотребнадзора. Оформляем документы.", price: "от 20 ₽/м²", icon: "🏢" },
];

const steps = [
  { num: "01", title: "Консультация", desc: "Бесплатно отвечаем на вопросы и называем фиксированную цену" },
  { num: "02", title: "Выезд специалиста", desc: "Приезжаем в удобное время, проводим диагностику" },
  { num: "03", title: "Обработка", desc: "Проводим полную обработку сертифицированными препаратами" },
  { num: "04", title: "Гарантия", desc: "Выдаём договор и гарантийный талон на 3 года" },
];

const advantages = [
  { icon: Shield, title: "Гарантия 3 года", desc: "Официальный договор с гарантийным обслуживанием" },
  { icon: FileCheck, title: "Сертифицированные препараты", desc: "Только проверенные импортные средства" },
  { icon: Users, title: "Безопасно для семьи", desc: "Безвредно для детей, животных и аллергиков" },
  { icon: Clock, title: "Работаем 24/7", desc: "Выезд в день обращения, включая выходные" },
  { icon: Award, title: "Лицензированная компания", desc: "ООО «Экоцентр», ИНН 5005040782" },
  { icon: ThumbsUp, title: "780+ отзывов", desc: "Реальные отзывы на Яндексе и Авито" },
];

const faqs = [
  { q: "Насколько опасна дезинсекция для людей и животных?", a: "Мы используем только сертифицированные препараты, безопасные для людей и домашних животных после высыхания (2–4 часа). Во время обработки необходимо покинуть помещение." },
  { q: "Какими средствами производится обработка?", a: "Применяем импортные инсектициды: Дельта Зона, Синузан, Лямбда Зона и другие. Все препараты имеют российские сертификаты и разрешения Роспотребнадзора." },
  { q: "Сколько времени занимает обработка квартиры?", a: "Обработка однокомнатной квартиры занимает 30–45 минут. Трёхкомнатной — около 1,5 часов. После обработки нужно проветрить помещение в течение 2–4 часов." },
  { q: "Можно ли вызвать специалиста в Московскую область?", a: "Да, мы работаем по всей Московской области без дополнительной платы за выезд в большинство городов. Уточните стоимость выезда по телефону." },
  { q: "Даёте ли вы гарантию на результат?", a: "Да. Мы заключаем официальный договор и выдаём гарантийный талон на 3 года. Если насекомые появятся снова — проведём повторную обработку бесплатно." },
];

// ─── FAQ ITEM ────────────────────────────────────────────────────────────────
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: "1px solid #E8ECF0" }}>
      <button
        className="w-full flex items-center justify-between py-5 text-left"
        onClick={() => setOpen(!open)}
        style={{ background: "none", border: "none", cursor: "pointer", width: "100%" }}
      >
        <span className="font-semibold text-sm pr-4" style={{ color: "#1a2535" }}>
          {q}
        </span>
        <ChevronDown
          size={18}
          style={{ color: RED, flexShrink: 0, transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}
        />
      </button>
      {open && (
        <div className="pb-5 text-sm leading-relaxed" style={{ color: "#6B7280" }}>
          {a}
        </div>
      )}
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <div style={{ background: "#F5F7FA" }}>

      {/* ── HERO ──────────────────────────────────────────────────────────────────── */}
      <section
        style={{
          minHeight: "92vh",
          display: "flex",
          alignItems: "center",
          position: "relative",
          overflow: "hidden",
          backgroundImage: `url(${PHOTO_HERO})`,
          backgroundSize: "cover",
          backgroundPosition: "center right",
        }}
      >
        {/* Multi-layer overlay */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(105deg, rgba(8,16,28,0.95) 0%, rgba(12,22,38,0.88) 45%, rgba(15,28,50,0.6) 75%, rgba(15,28,50,0.3) 100%)" }} />
        {/* Red accent glow */}
        <div style={{ position: "absolute", top: "-5%", left: "-5%", width: "50%", height: "70%", background: "radial-gradient(ellipse, rgba(204,0,0,0.12) 0%, transparent 60%)", pointerEvents: "none" }} />
        {/* Blue glow bottom-right */}
        <div style={{ position: "absolute", bottom: "-10%", right: "10%", width: "45%", height: "60%", background: "radial-gradient(ellipse, rgba(30,70,130,0.3) 0%, transparent 65%)", pointerEvents: "none" }} />
        {/* White shimmer top */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.25) 40%, rgba(255,255,255,0.08) 100%)" }} />
        {/* Red accent bottom */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "2px", background: "linear-gradient(90deg, rgba(204,0,0,0.5) 0%, transparent 60%)" }} />

        <div className="container py-24" style={{ position: "relative", zIndex: 1 }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left — text */}
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div style={{ width: 8, height: 8, background: RED, flexShrink: 0 }} />
                <span style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(204,80,80,0.9)" }}>
                  Профессиональная санитарная служба
                </span>
              </div>

              <h1
                className="font-black leading-none mb-8"
                style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", color: "white", letterSpacing: "-0.03em", lineHeight: 1.0 }}
              >
                Уничтожим
                <br />
                <span style={{ color: RED }}>клопов,</span>
                <br />
                тараканов
                <br />и грызунов
              </h1>

              <p className="text-base mb-10 leading-relaxed" style={{ color: "rgba(255,255,255,0.6)", maxWidth: "480px" }}>
                Гарантия по договору 3 года. Безопасные сертифицированные препараты.
                Выезд в день обращения. Работаем 24/7.
              </p>

              <div className="flex flex-wrap gap-4 mb-10">
                {["Без запаха", "Безопасно для детей", "Договор и гарантия", "780+ отзывов"].map((badge) => (
                  <div key={badge} className="flex items-center gap-2 text-xs font-semibold" style={{ color: "rgba(255,255,255,0.55)", letterSpacing: "0.04em" }}>
                    <CheckCircle size={12} style={{ color: RED }} />
                    {badge}
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-4">
                <Link
                  href="/calculator"
                  style={{
                    display: "inline-flex", alignItems: "center", gap: "8px",
                    background: "linear-gradient(135deg, #CC0000, #880000)",
                    color: "white", fontWeight: 700, fontSize: "0.82rem",
                    letterSpacing: "0.06em", textTransform: "uppercase",
                    padding: "0.9rem 1.75rem", borderRadius: "3px",
                    boxShadow: "0 4px 20px rgba(204,0,0,0.4)",
                    textDecoration: "none", transition: "all 0.2s",
                  }}
                >
                  Рассчитать стоимость <ArrowRight size={16} />
                </Link>
                <a
                  href="tel:+79300354841"
                  style={{
                    display: "inline-flex", alignItems: "center", gap: "8px",
                    background: "rgba(255,255,255,0.07)",
                    color: "rgba(255,255,255,0.9)", fontWeight: 700, fontSize: "0.82rem",
                    letterSpacing: "0.04em",
                    padding: "0.9rem 1.75rem", borderRadius: "3px",
                    border: "1.5px solid rgba(255,255,255,0.2)",
                    textDecoration: "none", transition: "all 0.2s",
                  }}
                >
                  <Phone size={16} />
                  8(930)035-48-41
                </a>
              </div>
            </div>

            {/* Right — Photo + Stats overlay */}
            <div className="hidden lg:block relative">
              {/* Photo */}
              <div
                style={{
                  position: "relative",
                  borderRadius: "6px",
                  overflow: "hidden",
                  boxShadow: "0 24px 60px rgba(15,25,35,0.18)",
                  border: "1px solid #E2E8F0",
                }}
              >
                <img
                  src={PHOTO_HERO}
                  alt="Специалист по дезинфекции"
                  style={{ width: "100%", height: "420px", objectFit: "cover", display: "block" }}
                />
                {/* Gradient overlay on photo */}
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(15,25,35,0.5) 0%, rgba(15,25,35,0.15) 100%)" }} />
                {/* White shimmer on photo top */}
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)" }} />
              </div>

              {/* Stats overlay — glass cards */}
              <div className="grid grid-cols-2 gap-3 mt-3">
                {[
                  { num: "3 года", label: "Гарантия по договору" },
                  { num: "780+", label: "Реальных отзывов" },
                  { num: "24/7", label: "Работаем без выходных" },
                  { num: "10+ лет", label: "Опыт работы" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.09)",
                      backdropFilter: "blur(8px)",
                      borderRadius: "4px",
                      padding: "1rem 1.25rem",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    {/* Top shimmer */}
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)" }} />
                    <div style={{ fontSize: "1.5rem", fontWeight: 900, color: RED, letterSpacing: "-0.04em", lineHeight: 1 }}>
                      {stat.num}
                    </div>
                    <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.5)", marginTop: "4px" }}>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICES ─────────────────────────────────────────────────────── */}
      <section className="py-20" style={{ background: "white" }}>
        <div className="container">
          <div className="flex items-start justify-between mb-12" style={{ borderBottom: "2px solid #1a2535", paddingBottom: "1.5rem" }}>
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div style={{ width: 8, height: 8, background: RED }} />
                <span style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: RED }}>
                  Наши услуги
                </span>
              </div>
              <h2 className="font-black" style={{ fontSize: "clamp(1.8rem, 3vw, 2.5rem)", color: DARK, letterSpacing: "-0.025em" }}>
                Полный спектр<br />санитарных услуг
              </h2>
            </div>
            <Link href="/prices" className="hidden md:flex items-center gap-2 no-underline font-bold text-sm" style={{ color: RED, letterSpacing: "0.05em", textTransform: "uppercase" }}>
              Все цены <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <div
                  key={service.id}
                  style={{
                    background: "white",
                    border: "1px solid #E8ECF0",
                    borderRadius: "6px",
                    padding: "1.75rem",
                    display: "flex",
                    flexDirection: "column",
                    transition: "all 0.2s ease",
                    cursor: "pointer",
                    boxShadow: "0 2px 8px rgba(15,25,35,0.04)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 32px rgba(15,25,35,0.12)";
                    (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)";
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(204,0,0,0.25)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 8px rgba(15,25,35,0.04)";
                    (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                    (e.currentTarget as HTMLElement).style.borderColor = "#E8ECF0";
                  }}
                >
                  {service.tag && (
                    <div style={{ display: "inline-block", fontSize: "0.62rem", fontWeight: 700, marginBottom: "1rem", padding: "3px 8px", background: RED, color: "white", letterSpacing: "0.1em", textTransform: "uppercase", alignSelf: "flex-start", borderRadius: "2px" }}>
                      {service.tag}
                    </div>
                  )}
                  <div className="flex items-center gap-3 mb-4">
                    <div style={{ width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(204,0,0,0.08)", borderRadius: "4px", flexShrink: 0 }}>
                      <Icon size={20} style={{ color: RED }} />
                    </div>
                    <h3 className="font-bold text-base" style={{ color: DARK }}>
                      {service.title}
                    </h3>
                  </div>
                  <p className="text-sm leading-relaxed mb-6 flex-1" style={{ color: "#6B7280" }}>
                    {service.desc}
                  </p>
                  <div className="flex items-center justify-between mt-auto pt-4" style={{ borderTop: "1px solid #F0F3F7" }}>
                    <span className="font-black text-lg" style={{ color: RED }}>{service.price}</span>
                    <Link href={service.href} className="flex items-center gap-1 text-xs font-bold no-underline" style={{ color: DARK, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                      Подробнее <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────── */}
      <section className="py-20" style={{ background: "#F5F7FA" }}>
        <div className="container">
          <div className="mb-12" style={{ borderBottom: "2px solid #1a2535", paddingBottom: "1.5rem" }}>
            <div className="flex items-center gap-3 mb-3">
              <div style={{ width: 8, height: 8, background: RED }} />
              <span style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: RED }}>
                Схема работы
              </span>
            </div>
            <h2 className="font-black" style={{ fontSize: "clamp(1.8rem, 3vw, 2.5rem)", color: DARK, letterSpacing: "-0.025em" }}>
              Просто и прозрачно
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {steps.map((step) => (
              <div
                key={step.num}
                style={{
                  background: "white",
                  border: "1px solid #E8ECF0",
                  borderRadius: "6px",
                  padding: "2rem",
                  position: "relative",
                  overflow: "hidden",
                  boxShadow: "0 2px 8px rgba(15,25,35,0.04)",
                }}
              >
                {/* Left red accent line */}
                <div style={{ position: "absolute", top: 0, left: 0, width: "3px", height: "100%", background: "linear-gradient(180deg, #CC0000, #880000)" }} />
                <div className="font-black mb-4" style={{ fontSize: "3rem", color: "rgba(204,0,0,0.12)", letterSpacing: "-0.04em", lineHeight: 1 }}>
                  {step.num}
                </div>
                <h3 className="font-bold text-base mb-3" style={{ color: DARK }}>{step.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#6B7280" }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROPERTY TYPES — dark section with photo ─────────────────────── */}
      <section
        style={{
          background: "#F0F4F8",
          position: "relative",
          overflow: "hidden",
          padding: "5rem 0",
        }}
      >
        {/* Background radial glow */}
        <div style={{ position: "absolute", top: "-30%", right: "-10%", width: "60%", height: "120%", background: "radial-gradient(ellipse, rgba(30,60,100,0.3) 0%, transparent 65%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)" }} />

        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left text */}
            <div>
              <div className="mb-10" style={{ borderBottom: "2px solid #1a2535", paddingBottom: "1.5rem" }}>
                <div className="flex items-center gap-3 mb-3">
                  <div style={{ width: 8, height: 8, background: RED }} />
                  <span style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(204,80,80,0.9)" }}>
                    Типы объектов
                  </span>
                </div>
                <h2 className="font-black" style={{ fontSize: "clamp(1.8rem, 3vw, 2.5rem)", color: "#0A1828", letterSpacing: "-0.025em" }}>
                  Работаем с любыми<br />помещениями
                </h2>
              </div>

              <div className="flex flex-col gap-4">
                {propertyTypes.map((pt) => (
                  <div
                    key={pt.title}
                    style={{
                      background: "white",
                      border: "1px solid #E2E8F0",
                      borderLeft: "3px solid #CC0000",
                      borderRadius: "6px",
                      padding: "1.5rem",
                      position: "relative",
                      overflow: "hidden",
                      transition: "all 0.2s",
                      boxShadow: "0 2px 8px rgba(15,25,35,0.05)",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.background = "white";
                      (e.currentTarget as HTMLElement).style.borderColor = "rgba(204,0,0,0.4)";
                      (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 24px rgba(15,25,35,0.1)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.background = "white";
                      (e.currentTarget as HTMLElement).style.borderColor = "#E2E8F0";
                      (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 8px rgba(15,25,35,0.05)";
                    }}
                  >
                    {/* Top shimmer */}
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)" }} />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span style={{ fontSize: "2rem" }}>{pt.icon}</span>
                        <div>
                          <h3 className="font-bold text-sm" style={{ color: "#0A1828" }}>{pt.title}</h3>
                          <p className="text-xs mt-1 leading-relaxed" style={{ color: "#6B7280" }}>{pt.desc}</p>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0 ml-4">
                        <div className="font-black text-lg" style={{ color: RED }}>{pt.price}</div>
                        <Link href="/calculator" className="text-xs font-bold no-underline" style={{ color: "#0A1828", textTransform: "uppercase", letterSpacing: "0.05em", opacity: 0.5 }}>
                          Рассчитать →
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — photo */}
            <div className="hidden lg:block">
              <div
                style={{
                  position: "relative",
                  borderRadius: "6px",
                  overflow: "hidden",
                  boxShadow: "0 24px 60px rgba(15,25,35,0.18)",
                  border: "1px solid #E2E8F0",
                }}
              >
                <img
                  src={PHOTO_TREATMENT}
                  alt="Обработка помещения от насекомых"
                  style={{ width: "100%", height: "460px", objectFit: "cover", display: "block" }}
                />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(15,25,35,0.4) 0%, transparent 60%)" }} />
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)" }} />
                {/* Badge on photo */}
                <div
                  style={{
                    position: "absolute",
                    bottom: "1.5rem",
                    left: "1.5rem",
                    background: "rgba(255,255,255,0.92)",
                    backdropFilter: "blur(12px)",
                    border: "1px solid rgba(255,255,255,0.8)",
                    borderRadius: "6px",
                    padding: "0.875rem 1.25rem",
                    boxShadow: "0 4px 16px rgba(15,25,35,0.15)",
                  }}
                >
                  <div style={{ fontSize: "0.65rem", color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "4px" }}>Сертифицировано</div>
                  <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#0A1828" }}>Роспотребнадзор РФ</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ADVANTAGES ───────────────────────────────────────────────────── */}
      <section className="py-20" style={{ background: "white" }}>
        <div className="container">
          <div className="mb-12" style={{ borderBottom: "2px solid #1a2535", paddingBottom: "1.5rem" }}>
            <div className="flex items-center gap-3 mb-3">
              <div style={{ width: 8, height: 8, background: RED }} />
              <span style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: RED }}>
                Почему выбирают нас
              </span>
            </div>
            <h2 className="font-black" style={{ fontSize: "clamp(1.8rem, 3vw, 2.5rem)", color: DARK, letterSpacing: "-0.025em" }}>
              Надёжность,<br />подтверждённая договором
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {advantages.map((adv) => {
              const Icon = adv.icon;
              return (
                <div
                  key={adv.title}
                  style={{
                    background: "white",
                    border: "1px solid #E8ECF0",
                    borderRadius: "6px",
                    padding: "1.75rem",
                    boxShadow: "0 2px 8px rgba(15,25,35,0.04)",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 28px rgba(15,25,35,0.1)";
                    (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 8px rgba(15,25,35,0.04)";
                    (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                  }}
                >
                  <div className="flex items-start gap-4">
                    <div style={{ width: "44px", height: "44px", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #CC0000, #880000)", borderRadius: "4px", flexShrink: 0, boxShadow: "0 4px 12px rgba(204,0,0,0.25)" }}>
                      <Icon size={20} color="white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-base mb-2" style={{ color: DARK }}>{adv.title}</h3>
                      <p className="text-sm leading-relaxed" style={{ color: "#6B7280" }}>{adv.desc}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CALCULATOR CTA — gradient dark ───────────────────────────────── */}
      <section
        style={{
          background: "linear-gradient(135deg, #0d1b2a 0%, #162436 60%, #1e3048 100%)",
          padding: "5rem 0",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", top: "-50%", left: "-10%", width: "50%", height: "200%", background: "radial-gradient(ellipse, rgba(204,0,0,0.08) 0%, transparent 60%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)" }} />

        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div style={{ width: 8, height: 8, background: RED }} />
                <span style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(204,80,80,0.9)" }}>
                  Калькулятор стоимости
                </span>
              </div>
              <h2 className="font-black text-white" style={{ fontSize: "clamp(1.8rem, 3vw, 2.5rem)", letterSpacing: "-0.025em" }}>
                Узнайте точную стоимость<br />за 2 минуты
              </h2>
              <p className="mt-3 text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>
                Выберите тип помещения, площадь и вид вредителя — получите расчёт и скидку 10%
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/calculator"
                style={{
                  display: "inline-flex", alignItems: "center", gap: "8px",
                  background: "linear-gradient(135deg, #CC0000, #880000)",
                  color: "white", fontWeight: 700, fontSize: "0.82rem",
                  letterSpacing: "0.06em", textTransform: "uppercase",
                  padding: "0.9rem 2rem", borderRadius: "3px",
                  boxShadow: "0 4px 20px rgba(204,0,0,0.4)",
                  textDecoration: "none",
                }}
              >
                Рассчитать стоимость <ArrowRight size={16} />
              </Link>
              <a
                href="tel:+79300354841"
                style={{
                  display: "inline-flex", alignItems: "center", gap: "8px",
                  background: "rgba(255,255,255,0.07)",
                  color: "rgba(255,255,255,0.85)", fontWeight: 700, fontSize: "0.82rem",
                  letterSpacing: "0.04em",
                  padding: "0.9rem 2rem", borderRadius: "3px",
                  border: "1.5px solid rgba(255,255,255,0.2)",
                  textDecoration: "none",
                }}
              >
                <Phone size={16} />
                Позвонить
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section className="py-20" style={{ background: "#F5F7FA" }}>
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div style={{ width: 8, height: 8, background: RED }} />
                <span style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: RED }}>
                  FAQ
                </span>
              </div>
              <h2 className="font-black mb-6" style={{ fontSize: "clamp(1.8rem, 3vw, 2.5rem)", color: DARK, letterSpacing: "-0.025em" }}>
                Часто задаваемые<br />вопросы
              </h2>
              <p className="text-sm leading-relaxed mb-8" style={{ color: "#6B7280" }}>
                Не нашли ответ? Позвоните нам — консультация бесплатна.
              </p>
              <a
                href="tel:+79300354841"
                style={{
                  display: "inline-flex", alignItems: "center", gap: "8px",
                  background: "linear-gradient(135deg, #CC0000, #880000)",
                  color: "white", fontWeight: 700, fontSize: "0.82rem",
                  letterSpacing: "0.06em", textTransform: "uppercase",
                  padding: "0.875rem 1.75rem", borderRadius: "3px",
                  boxShadow: "0 4px 16px rgba(204,0,0,0.3)",
                  textDecoration: "none",
                }}
              >
                <Phone size={16} />
                8(930)035-48-41
              </a>
            </div>
            <div style={{ borderTop: "2px solid #1a2535" }}>
              {faqs.map((faq) => (
                <FaqItem key={faq.q} q={faq.q} a={faq.a} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── REVIEWS STRIP ────────────────────────────────────────────────── */}
      <section
        className="py-12"
        style={{
          background: "linear-gradient(135deg, #0d1b2a 0%, #162436 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)" }} />
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} size={18} fill={RED} color={RED} />
                ))}
              </div>
              <div>
                <div className="font-black text-2xl" style={{ color: "white" }}>4.9</div>
                <div className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>средняя оценка</div>
              </div>
            </div>
            {[
              { num: "780+", label: "отзывов на Яндексе и Авито" },
              { num: "10+", label: "лет на рынке" },
              { num: "5 000+", label: "выполненных заказов" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="font-black text-2xl" style={{ color: RED }}>{s.num}</div>
                <div className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>{s.label}</div>
              </div>
            ))}
            <Link
              href="/calculator"
              style={{
                display: "inline-flex", alignItems: "center", gap: "8px",
                background: "linear-gradient(135deg, #CC0000, #880000)",
                color: "white", fontWeight: 700, fontSize: "0.78rem",
                letterSpacing: "0.06em", textTransform: "uppercase",
                padding: "0.75rem 1.5rem", borderRadius: "3px",
                boxShadow: "0 3px 14px rgba(204,0,0,0.4)",
                textDecoration: "none",
              }}
            >
              Оставить заявку <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── STICKY MOBILE CTA ────────────────────────────────────────────── */}
      <div
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex gap-2 p-3"
        style={{
          background: "rgba(15,25,35,0.97)",
          backdropFilter: "blur(12px)",
          borderTop: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 -4px 24px rgba(0,0,0,0.3)",
        }}
      >
        <Link
          href="/calculator"
          className="flex-1 no-underline justify-center text-center"
          style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "linear-gradient(135deg, #CC0000, #880000)",
            color: "white", fontWeight: 700, fontSize: "0.8rem",
            letterSpacing: "0.05em", textTransform: "uppercase",
            padding: "0.75rem 1rem", borderRadius: "3px",
            boxShadow: "0 3px 12px rgba(204,0,0,0.4)",
          }}
        >
          Рассчитать стоимость
        </Link>
        <a
          href="tel:+79300354841"
          style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "0 1rem",
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: "3px",
            color: "white",
          }}
        >
          <Phone size={18} />
        </a>
      </div>
    </div>
  );
}
