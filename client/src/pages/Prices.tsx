import { Link } from "wouter";
import { ArrowRight, CheckCircle, Phone } from "lucide-react";

const priceTable = [
  {
    service: "Уничтожение клопов",
    apartment1: "2 500",
    apartment2: "3 500",
    apartment3: "4 500",
    house: "от 5 000",
    office: "от 20 ₽/м²",
    href: "/services/klopov",
  },
  {
    service: "Уничтожение тараканов",
    apartment1: "1 800",
    apartment2: "2 500",
    apartment3: "3 200",
    house: "от 4 000",
    office: "от 15 ₽/м²",
    href: "/services/tarakanov",
  },
  {
    service: "Уничтожение грызунов",
    apartment1: "3 000",
    apartment2: "4 000",
    apartment3: "5 000",
    house: "от 6 000",
    office: "от 25 ₽/м²",
    href: "/services/gryzunov",
  },
  {
    service: "Удаление плесени",
    apartment1: "2 000",
    apartment2: "3 000",
    apartment3: "4 000",
    house: "от 5 000",
    office: "от 18 ₽/м²",
    href: "/services/pleseni",
  },
  {
    service: "Дезинфекция",
    apartment1: "1 500",
    apartment2: "2 200",
    apartment3: "3 000",
    house: "от 4 000",
    office: "от 12 ₽/м²",
    href: "/services/dezinfektsiya",
  },
];

const methods = [
  {
    name: "Холодный туман",
    desc: "Базовый метод. Без запаха. Быстро. Рекомендуется для квартир.",
    coefficient: "×1.0 (базовая цена)",
    tag: "Популярно",
  },
  {
    name: "Горячий туман",
    desc: "Максимальная эффективность. Глубокое проникновение в щели и мебель.",
    coefficient: "+2 000 ₽ к базовой цене",
    tag: "Рекомендуем",
  },
  {
    name: "Опрыскивание",
    desc: "Точечная обработка. Для небольших очагов заражения.",
    coefficient: "-500 ₽ от базовой цены",
    tag: null,
  },
];

export default function Prices() {
  return (
    <div className="bg-white">
      {/* Header */}
      <section style={{ background: "#0D1F33", borderBottom: "2px solid #CC0000" }}>
        <div className="container py-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="red-square" />
            <span className="section-label">Прайс-лист</span>
          </div>
          <h1
            className="font-black text-white mb-4"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "-0.03em" }}
          >
            Реальные фиксированные цены
          </h1>
          <p className="text-base" style={{ color: "#999", maxWidth: "600px" }}>
            Цены не меняются после согласования. Никаких скрытых платежей.
            Точная стоимость — после осмотра специалиста.
          </p>
        </div>
      </section>

      <div className="container py-16">
        {/* Price table */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-8" style={{ borderBottom: "2px solid #0D1F33", paddingBottom: "1rem" }}>
            <div className="red-square" />
            <h2 className="font-black text-xl" style={{ color: "#0D1F33", letterSpacing: "-0.02em" }}>
              Цены по типам помещений
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full" style={{ borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#0D1F33" }}>
                  <th className="text-left p-4 text-sm font-bold text-white" style={{ minWidth: "200px" }}>
                    Услуга
                  </th>
                  <th className="text-center p-4 text-sm font-bold text-white">1-комн.</th>
                  <th className="text-center p-4 text-sm font-bold text-white">2-комн.</th>
                  <th className="text-center p-4 text-sm font-bold text-white">3-комн.</th>
                  <th className="text-center p-4 text-sm font-bold text-white">Дом</th>
                  <th className="text-center p-4 text-sm font-bold text-white">Организация</th>
                  <th className="p-4" />
                </tr>
              </thead>
              <tbody>
                {priceTable.map((row, i) => (
                  <tr
                    key={row.service}
                    style={{ background: i % 2 === 0 ? "white" : "#F9F9F9", borderBottom: "1px solid #E0E0E0" }}
                  >
                    <td className="p-4 font-semibold text-sm" style={{ color: "#0D1F33" }}>
                      {row.service}
                    </td>
                    <td className="p-4 text-center font-bold text-sm" style={{ color: "#CC0000" }}>
                      {row.apartment1} ₽
                    </td>
                    <td className="p-4 text-center font-bold text-sm" style={{ color: "#CC0000" }}>
                      {row.apartment2} ₽
                    </td>
                    <td className="p-4 text-center font-bold text-sm" style={{ color: "#CC0000" }}>
                      {row.apartment3} ₽
                    </td>
                    <td className="p-4 text-center text-sm" style={{ color: "#0D1F33" }}>
                      {row.house}
                    </td>
                    <td className="p-4 text-center text-sm" style={{ color: "#0D1F33" }}>
                      {row.office}
                    </td>
                    <td className="p-4">
                      <Link
                        href={row.href}
                        className="text-xs font-bold no-underline flex items-center gap-1"
                        style={{ color: "#CC0000", whiteSpace: "nowrap" }}
                      >
                        Подробнее <ArrowRight size={10} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs mt-4" style={{ color: "#999" }}>
            * Цены указаны в рублях. Окончательная стоимость определяется после осмотра специалиста.
          </p>
        </div>

        {/* Methods */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-8" style={{ borderBottom: "2px solid #0D1F33", paddingBottom: "1rem" }}>
            <div className="red-square" />
            <h2 className="font-black text-xl" style={{ color: "#0D1F33", letterSpacing: "-0.02em" }}>
              Методы обработки
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px" style={{ background: "#E0E0E0" }}>
            {methods.map((m) => (
              <div key={m.name} className="bg-white p-8">
                {m.tag && (
                  <div
                    className="inline-block text-xs font-bold mb-4 px-2 py-1"
                    style={{ background: "#CC0000", color: "white", letterSpacing: "0.1em", textTransform: "uppercase" }}
                  >
                    {m.tag}
                  </div>
                )}
                <h3 className="font-bold text-base mb-3" style={{ color: "#0D1F33" }}>{m.name}</h3>
                <p className="text-sm leading-relaxed mb-4" style={{ color: "#666" }}>{m.desc}</p>
                <div className="text-sm font-bold" style={{ color: "#CC0000" }}>{m.coefficient}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Included */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-8" style={{ borderBottom: "2px solid #0D1F33", paddingBottom: "1rem" }}>
            <div className="red-square" />
            <h2 className="font-black text-xl" style={{ color: "#0D1F33", letterSpacing: "-0.02em" }}>
              Что входит в стоимость
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              "Выезд специалиста",
              "Диагностика помещения",
              "Все расходные материалы и препараты",
              "Оформление договора",
              "Гарантийный талон",
              "Консультация по профилактике",
              "Повторная обработка по гарантии",
              "Документы для Роспотребнадзора (для организаций)",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <CheckCircle size={16} style={{ color: "#CC0000", flexShrink: 0 }} />
                <span className="text-sm" style={{ color: "#0D1F33" }}>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="p-8 flex flex-col md:flex-row items-center justify-between gap-6" style={{ background: "#CC0000" }}>
          <div>
            <h3 className="font-black text-white text-xl mb-2" style={{ letterSpacing: "-0.02em" }}>
              Рассчитайте точную стоимость
            </h3>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.8)" }}>
              Используйте наш калькулятор или позвоните — консультация бесплатна
            </p>
          </div>
          <div className="flex gap-4">
            <Link href="/calculator" className="no-underline inline-flex items-center gap-2 font-bold text-sm px-6 py-3" style={{ background: "white", color: "#CC0000", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Калькулятор <ArrowRight size={14} />
            </Link>
            <a href="tel:+79300354841" className="no-underline inline-flex items-center gap-2 font-bold text-sm px-6 py-3" style={{ background: "transparent", color: "white", border: "2px solid rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              <Phone size={14} /> Позвонить
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
