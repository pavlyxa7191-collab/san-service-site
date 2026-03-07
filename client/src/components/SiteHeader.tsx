import { Link, useLocation } from "wouter";
import { Phone, Menu, X, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";

const DARK = "#0f1923";
const RED = "#CC0000";

const navLinks = [
  {
    label: "Услуги",
    href: "/services",
    children: [
      { label: "Уничтожение клопов", href: "/services/klopov" },
      { label: "Уничтожение тараканов", href: "/services/tarakanov" },
      { label: "Уничтожение грызунов", href: "/services/gryzunov" },
      { label: "Уничтожение клещей", href: "/services/kleshchey" },
      { label: "Удаление плесени", href: "/services/pleseni" },
      { label: "Дезинфекция", href: "/services/dezinfektsiya" },
    ],
  },
  { label: "Цены", href: "/prices" },
  { label: "О компании", href: "/about" },
  { label: "Блог", href: "/blog" },
  { label: "Контакты", href: "/contacts" },
];

export default function SiteHeader() {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  return (
    <>
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          background: scrolled
            ? "rgba(15,25,35,0.97)"
            : "rgba(15,25,35,0.85)",
          backdropFilter: "blur(16px)",
          borderBottom: scrolled
            ? "1px solid rgba(255,255,255,0.08)"
            : "1px solid rgba(255,255,255,0.05)",
          transition: "all 0.3s ease",
          boxShadow: scrolled ? "0 4px 24px rgba(0,0,0,0.3)" : "none",
        }}
      >
        {/* Top bar */}
        <div
          style={{
            borderBottom: "1px solid rgba(255,255,255,0.05)",
            padding: "0.35rem 0",
          }}
        >
          <div className="container flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.35)", letterSpacing: "0.05em" }}>
                Работаем 24/7 · Выезд в день обращения
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.35)", letterSpacing: "0.05em" }}>
                Москва и Московская область
              </span>
            </div>
          </div>
        </div>

        {/* Main nav */}
        <div className="container flex items-center justify-between" style={{ height: "64px" }}>
          {/* Logo */}
          <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                background: "linear-gradient(135deg, #CC0000, #880000)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "3px",
                boxShadow: "0 3px 12px rgba(204,0,0,0.4)",
                flexShrink: 0,
              }}
            >
              <span style={{ color: "white", fontWeight: 900, fontSize: "1rem", letterSpacing: "-0.05em" }}>СЭС</span>
            </div>
            <div>
              <div style={{ fontSize: "0.9rem", fontWeight: 900, color: "white", letterSpacing: "-0.02em", lineHeight: 1.1 }}>
                Экоцентр
              </div>
              <div style={{ fontSize: "0.58rem", color: "rgba(255,255,255,0.4)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                Санитарная служба
              </div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) =>
              link.children ? (
                <div
                  key={link.label}
                  style={{ position: "relative" }}
                  onMouseEnter={() => setServicesOpen(true)}
                  onMouseLeave={() => setServicesOpen(false)}
                >
                  <button
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      padding: "0.5rem 0.875rem",
                      fontSize: "0.78rem",
                      fontWeight: 600,
                      color: location.startsWith("/services") ? RED : "rgba(255,255,255,0.75)",
                      letterSpacing: "0.03em",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      borderRadius: "3px",
                      transition: "color 0.15s",
                    }}
                  >
                    {link.label}
                    <ChevronDown size={13} style={{ transition: "transform 0.2s", transform: servicesOpen ? "rotate(180deg)" : "rotate(0deg)" }} />
                  </button>
                  {servicesOpen && (
                    <div
                      style={{
                        position: "absolute",
                        top: "100%",
                        left: 0,
                        minWidth: "240px",
                        background: "rgba(15,25,35,0.98)",
                        backdropFilter: "blur(16px)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "6px",
                        padding: "0.5rem",
                        boxShadow: "0 16px 48px rgba(0,0,0,0.4)",
                        zIndex: 200,
                      }}
                    >
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          style={{
                            display: "block",
                            padding: "0.6rem 0.875rem",
                            fontSize: "0.78rem",
                            fontWeight: 500,
                            color: "rgba(255,255,255,0.75)",
                            textDecoration: "none",
                            borderRadius: "4px",
                            transition: "all 0.15s",
                          }}
                          onMouseEnter={(e) => {
                            (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.07)";
                            (e.currentTarget as HTMLElement).style.color = "white";
                          }}
                          onMouseLeave={(e) => {
                            (e.currentTarget as HTMLElement).style.background = "transparent";
                            (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.75)";
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
                  style={{
                    padding: "0.5rem 0.875rem",
                    fontSize: "0.78rem",
                    fontWeight: 600,
                    color: location === link.href ? RED : "rgba(255,255,255,0.75)",
                    letterSpacing: "0.03em",
                    textDecoration: "none",
                    borderRadius: "3px",
                    transition: "color 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    if (location !== link.href) (e.currentTarget as HTMLElement).style.color = "white";
                  }}
                  onMouseLeave={(e) => {
                    if (location !== link.href) (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.75)";
                  }}
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <a
              href="tel:+79300354841"
              className="hidden md:flex items-center gap-2"
              style={{
                fontSize: "0.82rem",
                fontWeight: 700,
                color: "white",
                textDecoration: "none",
                letterSpacing: "0.02em",
              }}
            >
              <Phone size={14} style={{ color: RED }} />
              8(930)035-48-41
            </a>
            <Link
              href="/calculator"
              className="hidden md:inline-flex items-center"
              style={{
                background: "linear-gradient(135deg, #CC0000, #880000)",
                color: "white",
                fontWeight: 700,
                fontSize: "0.72rem",
                letterSpacing: "0.07em",
                textTransform: "uppercase",
                padding: "0.6rem 1.25rem",
                borderRadius: "3px",
                textDecoration: "none",
                boxShadow: "0 3px 12px rgba(204,0,0,0.35)",
                whiteSpace: "nowrap",
              }}
            >
              Заявка
            </Link>
            {/* Mobile menu toggle */}
            <button
              className="lg:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
              style={{
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "3px",
                padding: "0.5rem",
                color: "white",
                cursor: "pointer",
              }}
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div
            style={{
              background: "rgba(10,18,28,0.99)",
              backdropFilter: "blur(16px)",
              borderTop: "1px solid rgba(255,255,255,0.07)",
              padding: "1rem 0 1.5rem",
            }}
          >
            <div className="container flex flex-col gap-1">
              {navLinks.map((link) => (
                <div key={link.label}>
                  {link.children ? (
                    <>
                      <div style={{ padding: "0.6rem 0", fontSize: "0.75rem", fontWeight: 700, color: "rgba(255,255,255,0.4)", letterSpacing: "0.12em", textTransform: "uppercase" }}>
                        {link.label}
                      </div>
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          style={{
                            display: "block",
                            padding: "0.5rem 0.75rem",
                            fontSize: "0.85rem",
                            fontWeight: 500,
                            color: "rgba(255,255,255,0.7)",
                            textDecoration: "none",
                            borderRadius: "3px",
                          }}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </>
                  ) : (
                    <Link
                      href={link.href!}
                      style={{
                        display: "block",
                        padding: "0.6rem 0",
                        fontSize: "0.9rem",
                        fontWeight: 600,
                        color: location === link.href ? RED : "rgba(255,255,255,0.8)",
                        textDecoration: "none",
                        borderBottom: "1px solid rgba(255,255,255,0.05)",
                      }}
                    >
                      {link.label}
                    </Link>
                  )}
                </div>
              ))}
              <div className="flex gap-3 mt-4">
                <a
                  href="tel:+79300354841"
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    padding: "0.75rem",
                    background: "rgba(255,255,255,0.07)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "3px",
                    color: "white",
                    fontWeight: 700,
                    fontSize: "0.85rem",
                    textDecoration: "none",
                  }}
                >
                  <Phone size={15} />
                  Позвонить
                </a>
                <Link
                  href="/calculator"
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "linear-gradient(135deg, #CC0000, #880000)",
                    color: "white",
                    fontWeight: 700,
                    fontSize: "0.82rem",
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                    padding: "0.75rem",
                    borderRadius: "3px",
                    textDecoration: "none",
                    boxShadow: "0 3px 12px rgba(204,0,0,0.35)",
                  }}
                >
                  Рассчитать
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>
      {/* Spacer for fixed header */}
      <div style={{ height: "97px" }} />
    </>
  );
}
