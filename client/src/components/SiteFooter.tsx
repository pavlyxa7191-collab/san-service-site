import { Link } from "wouter";
import { Phone, Mail, MapPin, Shield, FileText } from "lucide-react";

const services = [
  { label: "Уничтожение клопов", href: "/services/klopov" },
  { label: "Уничтожение тараканов", href: "/services/tarakanov" },
  { label: "Уничтожение грызунов", href: "/services/gryzunov" },
  { label: "Удаление плесени", href: "/services/pleseni" },
  { label: "Дезинфекция", href: "/services/dezinfektsiya" },
];

const cities = [
  { label: "Москва", href: "/services/klopov/moskva" },
  { label: "Воскресенск", href: "/services/klopov/voskresensk" },
  { label: "Коломна", href: "/services/klopov/kolomna" },
  { label: "Жуковский", href: "/services/klopov/zhukovsky" },
  { label: "Раменское", href: "/services/klopov/ramenskoe" },
];

export default function SiteFooter() {
  return (
    <footer style={{ backgroundColor: "#0A0A0A", color: "white" }}>
      {/* Main footer */}
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="red-square-lg" />
              <div>
                <div
                  className="font-black leading-none"
                  style={{ fontSize: "1rem", letterSpacing: "-0.02em" }}
                >
                  САНЭПИДЕМ
                </div>
                <div
                  className="font-black leading-none"
                  style={{ fontSize: "1rem", color: "#CC0000", letterSpacing: "-0.02em" }}
                >
                  СЛУЖБА
                </div>
              </div>
            </div>
            <p className="text-sm leading-relaxed mb-6" style={{ color: "#999" }}>
              Профессиональная дезинсекция, дезинфекция и дератизация в Москве
              и Московской области. Гарантия по договору 3 года.
            </p>
            <div className="flex items-center gap-3 mb-3">
              <Shield size={14} style={{ color: "#CC0000" }} />
              <span className="text-xs" style={{ color: "#999" }}>
                Лицензированная деятельность
              </span>
            </div>
            <div className="flex items-center gap-3">
              <FileText size={14} style={{ color: "#CC0000" }} />
              <span className="text-xs" style={{ color: "#999" }}>
                Договор и гарантийный талон
              </span>
            </div>
          </div>

          {/* Services */}
          <div>
            <div
              className="font-bold text-xs mb-6"
              style={{ letterSpacing: "0.15em", textTransform: "uppercase", color: "#CC0000" }}
            >
              Услуги
            </div>
            <ul className="space-y-3">
              {services.map((s) => (
                <li key={s.href}>
                  <Link
                    href={s.href}
                    className="text-sm no-underline flex items-center gap-2"
                    style={{ color: "#999", transition: "color 0.15s" }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "white")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "#999")}
                  >
                    <span style={{ color: "#CC0000" }}>—</span>
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Cities */}
          <div>
            <div
              className="font-bold text-xs mb-6"
              style={{ letterSpacing: "0.15em", textTransform: "uppercase", color: "#CC0000" }}
            >
              Города
            </div>
            <ul className="space-y-3">
              {cities.map((c) => (
                <li key={c.href}>
                  <Link
                    href={c.href}
                    className="text-sm no-underline flex items-center gap-2"
                    style={{ color: "#999", transition: "color 0.15s" }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "white")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "#999")}
                  >
                    <span style={{ color: "#CC0000" }}>—</span>
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacts */}
          <div>
            <div
              className="font-bold text-xs mb-6"
              style={{ letterSpacing: "0.15em", textTransform: "uppercase", color: "#CC0000" }}
            >
              Контакты
            </div>
            <div className="space-y-4">
              <a
                href="tel:+79300354841"
                className="flex items-start gap-3 no-underline"
                style={{ color: "white" }}
              >
                <Phone size={16} style={{ color: "#CC0000", marginTop: "2px", flexShrink: 0 }} />
                <div>
                  <div className="font-bold text-sm">8(930)035-48-41</div>
                  <div className="text-xs" style={{ color: "#666" }}>
                    Основной номер
                  </div>
                </div>
              </a>
              <a
                href="tel:+74951485806"
                className="flex items-start gap-3 no-underline"
                style={{ color: "white" }}
              >
                <Phone size={16} style={{ color: "#CC0000", marginTop: "2px", flexShrink: 0 }} />
                <div>
                  <div className="font-bold text-sm">8(495)148-58-06</div>
                  <div className="text-xs" style={{ color: "#666" }}>
                    Московский номер
                  </div>
                </div>
              </a>
              <a
                href="mailto:dezservis88@yandex.ru"
                className="flex items-start gap-3 no-underline"
                style={{ color: "white" }}
              >
                <Mail size={16} style={{ color: "#CC0000", marginTop: "2px", flexShrink: 0 }} />
                <div className="text-sm">dezservis88@yandex.ru</div>
              </a>
              <div className="flex items-start gap-3">
                <MapPin size={16} style={{ color: "#CC0000", marginTop: "2px", flexShrink: 0 }} />
                <div className="text-sm" style={{ color: "#999" }}>
                  Московская обл., г. Воскресенск,
                  <br />
                  ул. Хрипунова, д. 5, оф. 16
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div style={{ borderTop: "1px solid #222" }} />

      {/* Bottom bar — Requisites */}
      <div className="container py-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-6">
            <span className="text-xs" style={{ color: "#555" }}>
              © {new Date().getFullYear()} ООО «Экоцентр»
            </span>
            <span className="text-xs" style={{ color: "#555" }}>
              ИНН: 5005040782
            </span>
            <span className="text-xs" style={{ color: "#555" }}>
              КПП: 500501001
            </span>
            <span className="text-xs" style={{ color: "#555" }}>
              ОГРН: 1025004456174
            </span>
            <span className="text-xs" style={{ color: "#555" }}>
              Все права защищены
            </span>
          </div>
          <div className="flex items-center gap-6">
            <Link
              href="/privacy"
              className="text-xs no-underline"
              style={{ color: "#555" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "white")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "#555")}
            >
              Политика конфиденциальности
            </Link>
            <Link
              href="/sitemap"
              className="text-xs no-underline"
              style={{ color: "#555" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "white")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "#555")}
            >
              Карта сайта
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
