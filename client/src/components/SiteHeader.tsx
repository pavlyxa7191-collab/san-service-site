import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Phone, Menu, X, ChevronDown } from "lucide-react";

const navLinks = [
  {
    label: "Услуги",
    href: "/services",
    children: [
      { label: "Уничтожение клопов", href: "/services/klopov" },
      { label: "Уничтожение тараканов", href: "/services/tarakanov" },
      { label: "Уничтожение грызунов", href: "/services/gryzunov" },
      { label: "Удаление плесени", href: "/services/pleseni" },
      { label: "Дезинфекция", href: "/services/dezinfektsiya" },
    ],
  },
  { label: "Цены", href: "/prices" },
  { label: "Калькулятор", href: "/calculator" },
  { label: "О компании", href: "/about" },
  { label: "Блог", href: "/blog" },
  { label: "Контакты", href: "/contacts" },
];

export default function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [location] = useLocation();

  return (
    <>
      {/* Top bar */}
      <div style={{ backgroundColor: "#0A0A0A" }} className="text-white text-xs">
        <div className="container flex items-center justify-between py-2">
          <div className="flex items-center gap-4">
            <span style={{ color: "#E0E0E0" }}>Москва и Московская область</span>
            <span style={{ color: "#666" }}>|</span>
            <span style={{ color: "#E0E0E0" }}>Работаем 24/7</span>
          </div>
          <div className="flex items-center gap-4">
            <span style={{ color: "#E0E0E0" }}>dezservis88@yandex.ru</span>
          </div>
        </div>
      </div>

      {/* Main header */}
      <header className="bg-white sticky top-0 z-50" style={{ borderBottom: "2px solid #0A0A0A" }}>
        <div className="container flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 no-underline">
            <div className="flex items-center gap-2">
              <div className="red-square-lg" />
              <div>
                <div
                  className="font-black tracking-tight leading-none"
                  style={{ fontSize: "1.1rem", color: "#0A0A0A", letterSpacing: "-0.02em" }}
                >
                  САНЭПИДЕМ
                </div>
                <div
                  className="font-black tracking-tight leading-none"
                  style={{ fontSize: "1.1rem", color: "#CC0000", letterSpacing: "-0.02em" }}
                >
                  СЛУЖБА
                </div>
              </div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) =>
              link.children ? (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => setServicesOpen(true)}
                  onMouseLeave={() => setServicesOpen(false)}
                >
                  <button
                    className="flex items-center gap-1 font-semibold text-sm tracking-wide"
                    style={{ color: "#0A0A0A", letterSpacing: "0.02em" }}
                  >
                    {link.label}
                    <ChevronDown size={14} />
                  </button>
                  {servicesOpen && (
                    <div
                      className="absolute top-full left-0 bg-white z-50 min-w-[220px]"
                      style={{ border: "2px solid #0A0A0A", marginTop: "0.5rem" }}
                    >
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block px-4 py-3 text-sm font-medium no-underline"
                          style={{
                            color: "#0A0A0A",
                            borderBottom: "1px solid #E0E0E0",
                            transition: "background 0.1s",
                          }}
                          onMouseEnter={(e) => {
                            (e.currentTarget as HTMLElement).style.background = "#FFF5F5";
                            (e.currentTarget as HTMLElement).style.color = "#CC0000";
                          }}
                          onMouseLeave={(e) => {
                            (e.currentTarget as HTMLElement).style.background = "white";
                            (e.currentTarget as HTMLElement).style.color = "#0A0A0A";
                          }}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href!}
                  className="font-semibold text-sm no-underline"
                  style={{
                    color: location === link.href ? "#CC0000" : "#0A0A0A",
                    letterSpacing: "0.02em",
                    borderBottom: location === link.href ? "2px solid #CC0000" : "2px solid transparent",
                    paddingBottom: "2px",
                  }}
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>

          {/* CTA */}
          <div className="flex items-center gap-4">
            <a
              href="tel:+79300354841"
              className="hidden md:flex items-center gap-2 no-underline"
              style={{ color: "#0A0A0A" }}
            >
              <Phone size={16} style={{ color: "#CC0000" }} />
              <span className="font-bold text-sm">8(930)035-48-41</span>
            </a>
            <Link href="/calculator" className="btn-red hidden sm:inline-flex no-underline">
              Заказать звонок
            </Link>
            <button
              className="lg:hidden p-2"
              onClick={() => setMobileOpen(!mobileOpen)}
              style={{ color: "#0A0A0A" }}
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div
            className="lg:hidden bg-white"
            style={{ borderTop: "1px solid #E0E0E0" }}
          >
            <div className="container py-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <div key={link.label}>
                  <Link
                    href={link.href || "#"}
                    className="block py-3 font-semibold text-sm no-underline"
                    style={{
                      color: "#0A0A0A",
                      borderBottom: "1px solid #F0F0F0",
                      letterSpacing: "0.02em",
                    }}
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                  {link.children && (
                    <div className="pl-4">
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block py-2 text-sm no-underline"
                          style={{ color: "#666666" }}
                          onClick={() => setMobileOpen(false)}
                        >
                          — {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <a
                href="tel:+79300354841"
                className="flex items-center gap-2 py-3 no-underline"
                style={{ color: "#CC0000" }}
              >
                <Phone size={16} />
                <span className="font-bold">8(930)035-48-41</span>
              </a>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
