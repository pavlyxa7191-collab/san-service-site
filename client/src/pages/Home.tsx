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
} from "lucide-react";
import { useState } from "react";

// ─── DATA ────────────────────────────────────────────────────────────────────

const services = [
  {
    id: "klopov",
    icon: Bug,
    title: "Уничтожение клопов",
    desc: "Полная ликвидация постельных клопов методом холодного или горячего тумана. Гарантия 3 года.",
    price: "от 2 500 ₽",
    href: "/services/klopov",
    tag: "Популярно",
  },
  {
    id: "tarakanov",
    icon: Bug,
    title: "Уничтожение тараканов",
    desc: "Эффективное уничтожение тараканов в квартирах, домах и на предприятиях. Без запаха.",
    price: "от 1 800 ₽",
    href: "/services/tarakanov",
    tag: null,
  },
  {
    id: "gryzunov",
    icon: Rat,
    title: "Уничтожение грызунов",
    desc: "Дератизация — уничтожение крыс и мышей. Установка ловушек и приманок. Договор.",
    price: "от 3 000 ₽",
    href: "/services/gryzunov",
    tag: null,
  },
  {
    id: "pleseni",
    icon: Droplets,
    title: "Удаление плесени",
    desc: "Профессиональное удаление плесени и грибка. Обработка антисептиками. Гарантия.",
    price: "от 2 000 ₽",
    href: "/services/pleseni",
    tag: null,
  },
  {
    id: "dezinfektsiya",
    icon: Zap,
    title: "Дезинфекция",
    desc: "Уничтожение патогенных микроорганизмов, вирусов и бактерий. Для предприятий и жилья.",
    price: "от 20 ₽/м²",
    href: "/services/dezinfektsiya",
    tag: null,
  },
];

const propertyTypes = [
  {
    title: "Квартиры и общежития",
    desc: "Обрабатываем как всё помещение, так и отдельные комнаты и мебель.",
    price: "от 1 690 ₽",
    icon: "🏠",
  },
  {
    title: "Частные дома и коттеджи",
    desc: "Уничтожаем клопов, тараканов, комаров, клещей, ос и прочую живность.",
    price: "от 2 490 ₽",
    icon: "🏡",
  },
  {
    title: "Организации и предприятия",
    desc: "Работаем по договору и нормам СанПиН, Роспотребнадзора. Оформляем документы.",
    price: "от 20 ₽/м²",
    icon: "🏢",
  },
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
  {
    q: "Насколько опасна дезинсекция для людей и животных?",
    a: "Мы используем только сертифицированные препараты, безопасные для людей и домашних животных после высыхания (2–4 часа). Во время обработки необходимо покинуть помещение.",
  },
  {
    q: "Какими средствами производится обработка?",
    a: "Применяем импортные инсектициды: Дельта Зона, Синузан, Лямбда Зона и другие. Все препараты имеют российские сертификаты и разрешения Роспотребнадзора.",
  },
  {
    q: "Сколько времени занимает обработка квартиры?",
    a: "Обработка однокомнатной квартиры занимает 30–45 минут. Трёхкомнатной — около 1,5 часов. После обработки нужно проветрить помещение в течение 2–4 часов.",
  },
  {
    q: "Можно ли вызвать специалиста в Московскую область?",
    a: "Да, мы работаем по всей Московской области без дополнительной платы за выезд в большинство городов. Уточните стоимость выезда по телефону.",
  },
  {
    q: "Даёте ли вы гарантию на результат?",
    a: "Да. Мы заключаем официальный договор и выдаём гарантийный талон на 3 года. Если насекомые появятся снова — проведём повторную обработку бесплатно.",
  },
];

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: "1px solid #E0E0E0" }}>
      <button
        className="w-full flex items-center justify-between py-5 text-left"
        onClick={() => setOpen(!open)}
      >
        <span className="font-semibold text-sm pr-4" style={{ color: "#0A0A0A" }}>
          {q}
        </span>
        <ChevronDown
          size={18}
          style={{
            color: "#CC0000",
            flexShrink: 0,
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s",
          }}
        />
      </button>
      {open && (
        <div className="pb-5 text-sm leading-relaxed" style={{ color: "#666" }}>
          {a}
        </div>
      )}
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <div className="bg-white">
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section
        style={{
          background: "#0A0A0A",
          minHeight: "90vh",
          display: "flex",
          alignItems: "center",
        }}
      >
        <div className="container py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left */}
            <div>
              {/* Label */}
              <div className="flex items-center gap-3 mb-8">
                <div className="red-square" />
                <span className="section-label" style={{ color: "#CC0000" }}>
                  Профессиональная санитарная служба
                </span>
              </div>

              {/* Headline */}
              <h1
                className="font-black leading-none mb-8"
                style={{
                  fontSize: "clamp(2.5rem, 5vw, 4rem)",
                  color: "white",
                  letterSpacing: "-0.03em",
                  lineHeight: 1.0,
                }}
              >
                Уничтожим
                <br />
                <span style={{ color: "#CC0000" }}>клопов,</span>
                <br />
                тараканов
                <br />и грызунов
              </h1>

              {/* Subtext */}
              <p className="text-base mb-10 leading-relaxed" style={{ color: "#999", maxWidth: "480px" }}>
                Гарантия по договору 3 года. Безопасные сертифицированные препараты.
                Выезд в день обращения. Работаем 24/7.
              </p>

              {/* Trust badges */}
              <div className="flex flex-wrap gap-4 mb-10">
                {[
                  "Без запаха",
                  "Безопасно для детей",
                  "Договор и гарантия",
                  "780+ отзывов",
                ].map((badge) => (
                  <div
                    key={badge}
                    className="flex items-center gap-2 text-xs font-semibold"
                    style={{ color: "#999", letterSpacing: "0.05em" }}
                  >
                    <CheckCircle size={12} style={{ color: "#CC0000" }} />
                    {badge}
                  </div>
                ))}
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap gap-4">
                <Link href="/calculator" className="btn-red no-underline">
                  Рассчитать стоимость
                  <ArrowRight size={16} />
                </Link>
                <a href="tel:+79300354841" className="btn-black no-underline" style={{ borderColor: "#444", color: "white" }}>
                  <Phone size={16} />
                  8(930)035-48-41
                </a>
              </div>
            </div>

            {/* Right — Stats grid */}
            <div className="hidden lg:grid grid-cols-2 gap-px" style={{ background: "#222" }}>
              {[
                { num: "3", unit: "года", label: "Гарантия по договору" },
                { num: "780+", unit: "", label: "Реальных отзывов" },
                { num: "24/7", unit: "", label: "Работаем без выходных" },
                { num: "10+", unit: "лет", label: "Опыт работы" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="p-10 flex flex-col justify-between"
                  style={{ background: "#111" }}
                >
                  <div
                    className="font-black leading-none mb-2"
                    style={{ fontSize: "3.5rem", color: "#CC0000", letterSpacing: "-0.04em" }}
                  >
                    {stat.num}
                    {stat.unit && (
                      <span className="text-xl ml-1" style={{ color: "#555" }}>
                        {stat.unit}
                      </span>
                    )}
                  </div>
                  <div className="text-sm font-medium" style={{ color: "#666" }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICES ─────────────────────────────────────────────────────── */}
      <section className="py-20" style={{ background: "#F5F5F5" }}>
        <div className="container">
          {/* Section header */}
          <div className="flex items-start justify-between mb-12" style={{ borderBottom: "2px solid #0A0A0A", paddingBottom: "1.5rem" }}>
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="red-square" />
                <span className="section-label">Наши услуги</span>
              </div>
              <h2
                className="font-black"
                style={{ fontSize: "clamp(1.8rem, 3vw, 2.5rem)", color: "#0A0A0A", letterSpacing: "-0.025em" }}
              >
                Полный спектр
                <br />
                санитарных услуг
              </h2>
            </div>
            <Link
              href="/services"
              className="hidden md:flex items-center gap-2 no-underline font-bold text-sm"
              style={{ color: "#CC0000", letterSpacing: "0.05em", textTransform: "uppercase" }}
            >
              Все услуги <ArrowRight size={14} />
            </Link>
          </div>

          {/* Service cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px" style={{ background: "#E0E0E0" }}>
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <div
                  key={service.id}
                  className="bg-white p-8 flex flex-col"
                  style={{ transition: "background 0.15s" }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "#FFF5F5";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "white";
                  }}
                >
                  {service.tag && (
                    <div
                      className="inline-block text-xs font-bold mb-4 px-2 py-1"
                      style={{
                        background: "#CC0000",
                        color: "white",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        alignSelf: "flex-start",
                      }}
                    >
                      {service.tag}
                    </div>
                  )}
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="w-10 h-10 flex items-center justify-center"
                      style={{ background: "#F5F5F5" }}
                    >
                      <Icon size={20} style={{ color: "#CC0000" }} />
                    </div>
                    <h3 className="font-bold text-base" style={{ color: "#0A0A0A" }}>
                      {service.title}
                    </h3>
                  </div>
                  <p className="text-sm leading-relaxed mb-6 flex-1" style={{ color: "#666" }}>
                    {service.desc}
                  </p>
                  <div className="flex items-center justify-between mt-auto pt-4" style={{ borderTop: "1px solid #E0E0E0" }}>
                    <span className="font-black text-lg" style={{ color: "#CC0000" }}>
                      {service.price}
                    </span>
                    <Link
                      href={service.href}
                      className="flex items-center gap-1 text-xs font-bold no-underline"
                      style={{ color: "#0A0A0A", letterSpacing: "0.05em", textTransform: "uppercase" }}
                    >
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
      <section className="py-20 bg-white">
        <div className="container">
          <div className="mb-12" style={{ borderBottom: "2px solid #0A0A0A", paddingBottom: "1.5rem" }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="red-square" />
              <span className="section-label">Схема работы</span>
            </div>
            <h2
              className="font-black"
              style={{ fontSize: "clamp(1.8rem, 3vw, 2.5rem)", color: "#0A0A0A", letterSpacing: "-0.025em" }}
            >
              Просто и прозрачно
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px" style={{ background: "#E0E0E0" }}>
            {steps.map((step, i) => (
              <div key={step.num} className="bg-white p-8">
                <div
                  className="font-black mb-4"
                  style={{ fontSize: "3rem", color: "#CC0000", letterSpacing: "-0.04em", lineHeight: 1 }}
                >
                  {step.num}
                </div>
                <h3 className="font-bold text-base mb-3" style={{ color: "#0A0A0A" }}>
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "#666" }}>
                  {step.desc}
                </p>
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute right-0 top-1/2" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROPERTY TYPES ───────────────────────────────────────────────── */}
      <section className="py-20" style={{ background: "#0A0A0A" }}>
        <div className="container">
          <div className="mb-12" style={{ borderBottom: "1px solid #222", paddingBottom: "1.5rem" }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="red-square" />
              <span className="section-label">Типы объектов</span>
            </div>
            <h2
              className="font-black"
              style={{ fontSize: "clamp(1.8rem, 3vw, 2.5rem)", color: "white", letterSpacing: "-0.025em" }}
            >
              Работаем с любыми
              <br />
              помещениями
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px" style={{ background: "#222" }}>
            {propertyTypes.map((pt) => (
              <div key={pt.title} className="p-10" style={{ background: "#111" }}>
                <div className="text-4xl mb-6">{pt.icon}</div>
                <h3 className="font-bold text-lg mb-3" style={{ color: "white" }}>
                  {pt.title}
                </h3>
                <p className="text-sm leading-relaxed mb-6" style={{ color: "#666" }}>
                  {pt.desc}
                </p>
                <div className="flex items-center justify-between">
                  <span className="font-black text-xl" style={{ color: "#CC0000" }}>
                    {pt.price}
                  </span>
                  <Link href="/calculator" className="btn-red no-underline text-xs py-2 px-4">
                    Рассчитать
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ADVANTAGES ───────────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="mb-12" style={{ borderBottom: "2px solid #0A0A0A", paddingBottom: "1.5rem" }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="red-square" />
              <span className="section-label">Почему выбирают нас</span>
            </div>
            <h2
              className="font-black"
              style={{ fontSize: "clamp(1.8rem, 3vw, 2.5rem)", color: "#0A0A0A", letterSpacing: "-0.025em" }}
            >
              Надёжность,
              <br />
              подтверждённая договором
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px" style={{ background: "#E0E0E0" }}>
            {advantages.map((adv) => {
              const Icon = adv.icon;
              return (
                <div key={adv.title} className="bg-white p-8">
                  <div className="flex items-start gap-4">
                    <div
                      className="w-12 h-12 flex items-center justify-center flex-shrink-0"
                      style={{ background: "#CC0000" }}
                    >
                      <Icon size={22} color="white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-base mb-2" style={{ color: "#0A0A0A" }}>
                        {adv.title}
                      </h3>
                      <p className="text-sm leading-relaxed" style={{ color: "#666" }}>
                        {adv.desc}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CALCULATOR CTA ───────────────────────────────────────────────── */}
      <section className="py-20" style={{ background: "#CC0000" }}>
        <div className="container">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div style={{ width: 12, height: 12, background: "white", flexShrink: 0 }} />
                <span
                  className="text-xs font-bold"
                  style={{ letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.7)" }}
                >
                  Калькулятор стоимости
                </span>
              </div>
              <h2
                className="font-black text-white"
                style={{ fontSize: "clamp(1.8rem, 3vw, 2.5rem)", letterSpacing: "-0.025em" }}
              >
                Узнайте точную стоимость
                <br />
                за 2 минуты
              </h2>
              <p className="mt-3 text-sm" style={{ color: "rgba(255,255,255,0.8)" }}>
                Выберите тип помещения, площадь и вид вредителя — получите расчёт и скидку 10%
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/calculator"
                className="no-underline inline-flex items-center gap-2 font-bold text-sm px-8 py-4"
                style={{
                  background: "white",
                  color: "#CC0000",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  border: "2px solid white",
                  transition: "all 0.15s",
                }}
              >
                Рассчитать стоимость <ArrowRight size={16} />
              </Link>
              <a
                href="tel:+79300354841"
                className="no-underline inline-flex items-center gap-2 font-bold text-sm px-8 py-4"
                style={{
                  background: "transparent",
                  color: "white",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  border: "2px solid rgba(255,255,255,0.5)",
                  transition: "all 0.15s",
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
      <section className="py-20 bg-white">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="red-square" />
                <span className="section-label">FAQ</span>
              </div>
              <h2
                className="font-black mb-6"
                style={{ fontSize: "clamp(1.8rem, 3vw, 2.5rem)", color: "#0A0A0A", letterSpacing: "-0.025em" }}
              >
                Часто задаваемые
                <br />
                вопросы
              </h2>
              <p className="text-sm leading-relaxed mb-8" style={{ color: "#666" }}>
                Не нашли ответ? Позвоните нам — консультация бесплатна.
              </p>
              <a href="tel:+79300354841" className="btn-red no-underline">
                <Phone size={16} />
                8(930)035-48-41
              </a>
            </div>
            <div style={{ borderTop: "2px solid #0A0A0A" }}>
              {faqs.map((faq) => (
                <FaqItem key={faq.q} q={faq.q} a={faq.a} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── REVIEWS STRIP ────────────────────────────────────────────────── */}
      <section className="py-12" style={{ background: "#F5F5F5", borderTop: "1px solid #E0E0E0" }}>
        <div className="container">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} size={20} fill="#CC0000" color="#CC0000" />
                ))}
              </div>
              <div>
                <div className="font-black text-2xl" style={{ color: "#0A0A0A" }}>
                  4.9
                </div>
                <div className="text-xs" style={{ color: "#666" }}>
                  средняя оценка
                </div>
              </div>
            </div>
            <div className="text-center">
              <div className="font-black text-2xl" style={{ color: "#CC0000" }}>
                780+
              </div>
              <div className="text-xs" style={{ color: "#666" }}>
                отзывов на Яндексе и Авито
              </div>
            </div>
            <div className="text-center">
              <div className="font-black text-2xl" style={{ color: "#0A0A0A" }}>
                10+
              </div>
              <div className="text-xs" style={{ color: "#666" }}>
                лет на рынке
              </div>
            </div>
            <div className="text-center">
              <div className="font-black text-2xl" style={{ color: "#0A0A0A" }}>
                5 000+
              </div>
              <div className="text-xs" style={{ color: "#666" }}>
                выполненных заказов
              </div>
            </div>
            <Link href="/calculator" className="btn-red no-underline">
              Оставить заявку <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── STICKY MOBILE CTA ────────────────────────────────────────────── */}
      <div
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex gap-2 p-3"
        style={{ background: "white", borderTop: "2px solid #CC0000", boxShadow: "0 -4px 20px rgba(0,0,0,0.1)" }}
      >
        <Link
          href="/calculator"
          className="flex-1 btn-red no-underline justify-center text-center"
          style={{ fontSize: "0.8rem", padding: "0.75rem 1rem" }}
        >
          Рассчитать стоимость
        </Link>
        <a
          href="tel:+79300354841"
          className="flex items-center justify-center px-4"
          style={{ background: "#0A0A0A", color: "white" }}
        >
          <Phone size={18} />
        </a>
      </div>
    </div>
  );
}
