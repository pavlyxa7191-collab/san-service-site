import { Link } from "wouter";
import { ArrowRight, Shield, Award, Clock, Users, CheckCircle, Phone } from "lucide-react";

const stats = [
  { value: "15+", label: "лет на рынке" },
  { value: "12 000+", label: "выполненных заказов" },
  { value: "98%", label: "клиентов довольны результатом" },
  { value: "24/7", label: "работаем без выходных" },
];

const licenses = [
  "Лицензия на деятельность в области обращения с отходами I–IV классов опасности",
  "Свидетельство о государственной регистрации юридического лица",
  "Сертификаты соответствия на применяемые препараты",
  "Членство в Национальной ассоциации дезинфекционистов",
  "Разрешение Роспотребнадзора на проведение дезинфекционной деятельности",
];

const team = [
  {
    name: "Главный специалист",
    role: "Дезинфектолог высшей категории",
    exp: "12 лет опыта",
  },
  {
    name: "Специалист по дератизации",
    role: "Эксперт по грызунам",
    exp: "8 лет опыта",
  },
  {
    name: "Технолог",
    role: "Специалист по препаратам",
    exp: "10 лет опыта",
  },
];

export default function About() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section style={{ background: "#000919", borderBottom: "2px solid #CC0000" }}>
        <div className="container py-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="red-square" />
            <span className="section-label">О компании</span>
          </div>
          <h1
            className="font-black text-white mb-4"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "-0.03em" }}
          >
            ООО «Экоцентр»
          </h1>
          <p className="text-base" style={{ color: "#999", maxWidth: "600px" }}>
            Профессиональная санитарная служба. Работаем с 2008 года.
            Лицензированная деятельность по дезинфекции, дезинсекции и дератизации.
          </p>
        </div>
      </section>

      <div className="container py-16">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px mb-16" style={{ background: "#E0E0E0" }}>
          {stats.map((s) => (
            <div key={s.value} className="bg-white p-8 text-center">
              <div className="font-black mb-2" style={{ fontSize: "2.5rem", color: "#CC0000", letterSpacing: "-0.04em" }}>
                {s.value}
              </div>
              <div className="text-xs font-semibold" style={{ color: "#666", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* About text */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div>
            <div className="flex items-center gap-3 mb-6" style={{ borderBottom: "2px solid #000919", paddingBottom: "1rem" }}>
              <div className="red-square" />
              <h2 className="font-black text-xl" style={{ color: "#000919", letterSpacing: "-0.02em" }}>
                О нашей компании
              </h2>
            </div>
            <div className="space-y-4 text-sm leading-relaxed" style={{ color: "#444" }}>
              <p>
                ООО «Экоцентр» — профессиональная санитарная служба, работающая в Москве и Московской области с 2008 года.
                За это время мы выполнили более 12 000 заказов для частных лиц, организаций, предприятий общественного питания и медицинских учреждений.
              </p>
              <p>
                Мы работаем строго в соответствии с требованиями СанПиН, нормативами Роспотребнадзора и стандартами
                Национальной ассоциации дезинфекционистов. Все применяемые препараты сертифицированы и безопасны
                для людей и домашних животных при соблюдении инструкций.
              </p>
              <p>
                Наши специалисты проходят регулярное обучение и аттестацию. Мы используем только современное
                оборудование и препараты нового поколения, которые обеспечивают максимальную эффективность
                при минимальном воздействии на окружающую среду.
              </p>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-3 mb-6" style={{ borderBottom: "2px solid #000919", paddingBottom: "1rem" }}>
              <div className="red-square" />
              <h2 className="font-black text-xl" style={{ color: "#000919", letterSpacing: "-0.02em" }}>
                Наши преимущества
              </h2>
            </div>
            <div className="space-y-4">
              {[
                { icon: Shield, text: "Официальный договор и гарантийный талон на каждый заказ" },
                { icon: Award, text: "Сертифицированные препараты, одобренные Роспотребнадзором" },
                { icon: Clock, text: "Выезд специалиста в день обращения, работаем 24/7" },
                { icon: Users, text: "Собственный штат специалистов, без субподрядчиков" },
                { icon: CheckCircle, text: "Повторная обработка бесплатно при наступлении гарантийного случая" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-start gap-4 p-4" style={{ background: "#F5F5F5", border: "1px solid #E0E0E0" }}>
                  <Icon size={18} style={{ color: "#CC0000", flexShrink: 0, marginTop: "2px" }} />
                  <span className="text-sm" style={{ color: "#000919" }}>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Licenses */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-8" style={{ borderBottom: "2px solid #000919", paddingBottom: "1rem" }}>
            <div className="red-square" />
            <h2 className="font-black text-xl" style={{ color: "#000919", letterSpacing: "-0.02em" }}>
              Лицензии и сертификаты
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {licenses.map((lic) => (
              <div key={lic} className="flex items-start gap-3 p-4" style={{ border: "1px solid #E0E0E0" }}>
                <Award size={16} style={{ color: "#CC0000", flexShrink: 0, marginTop: "2px" }} />
                <span className="text-sm" style={{ color: "#000919" }}>{lic}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Requisites */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-8" style={{ borderBottom: "2px solid #000919", paddingBottom: "1rem" }}>
            <div className="red-square" />
            <h2 className="font-black text-xl" style={{ color: "#000919", letterSpacing: "-0.02em" }}>
              Реквизиты компании
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6" style={{ background: "#F5F5F5", border: "1px solid #E0E0E0" }}>
              <table className="w-full text-sm">
                <tbody>
                  {[
                    ["Полное наименование", "ООО «Экоцентр»"],
                    ["ИНН", "7726389900"],
                    ["ОГРН", "1157746482250"],
                    ["КПП", "772601001"],
                    ["Юридический адрес", "г. Москва, ул. Профсоюзная, д. 56"],
                    ["Расчётный счёт", "40702810938000123456"],
                    ["Банк", "ПАО Сбербанк"],
                    ["БИК", "044525225"],
                  ].map(([key, val]) => (
                    <tr key={key} style={{ borderBottom: "1px solid #E0E0E0" }}>
                      <td className="py-2 pr-4 font-semibold" style={{ color: "#666", whiteSpace: "nowrap" }}>{key}</td>
                      <td className="py-2" style={{ color: "#000919" }}>{val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-6" style={{ background: "#000919" }}>
              <div className="section-label mb-4">Контакты</div>
              <div className="space-y-4">
                <div>
                  <div className="text-xs font-bold mb-1" style={{ color: "#666" }}>Телефон</div>
                  <a href="tel:+79300354841" className="font-black text-xl text-white no-underline">
                    8(930)035-48-41
                  </a>
                </div>
                <div>
                  <div className="text-xs font-bold mb-1" style={{ color: "#666" }}>Email</div>
                  <a href="mailto:info@ses88.ru" className="text-white no-underline text-sm">info@ses88.ru</a>
                </div>
                <div>
                  <div className="text-xs font-bold mb-1" style={{ color: "#666" }}>Режим работы</div>
                  <div className="text-white text-sm">Круглосуточно, 24/7</div>
                </div>
                <div>
                  <div className="text-xs font-bold mb-1" style={{ color: "#666" }}>Сайт</div>
                  <a href="https://ses88.ru" className="text-white no-underline text-sm" target="_blank" rel="noopener noreferrer">ses88.ru</a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="p-8 flex flex-col md:flex-row items-center justify-between gap-6" style={{ background: "#CC0000" }}>
          <div>
            <h3 className="font-black text-white text-xl mb-2" style={{ letterSpacing: "-0.02em" }}>
              Готовы помочь прямо сейчас
            </h3>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.8)" }}>
              Позвоните или оставьте заявку — выезд в день обращения
            </p>
          </div>
          <div className="flex gap-4">
            <Link href="/calculator" className="no-underline inline-flex items-center gap-2 font-bold text-sm px-6 py-3" style={{ background: "white", color: "#CC0000", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Рассчитать стоимость <ArrowRight size={14} />
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
