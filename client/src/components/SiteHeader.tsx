import { Link, useLocation } from "wouter";
import { Phone, Menu, X, ChevronDown } from "lucide-react";
import { useState, useRef } from "react";

/* Design Tokens */
const NAVY = "#0d1f3c";
const NAVY_DARK = "#091729";
const RED = "#CC0000";

const navLinks = [
  {
    label: "Услуги",
    href: "/services",
    children: [
      { label: "Уничтожение клопов", href: "/services/klopov" },
      { label: "Уничтожение тараканов", href: "/services/tarakanov" },
      { label: "Уничтожение грызунов", href: "/services/gryzunov" },
      { label: "Уничтожение клещей", href: "/services/kleshhej" },
      { label: "Удаление плесени", href: "/services/pleseni" },
      { label: "Дезинфекция", href: "/services/dezinfektsii" },
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
  const [servicesOpen, setServicesOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openServices = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setServicesOpen(true);
  };
  const closeServices = () => {
    closeTimer.current = setTimeout(() => setServicesOpen(false), 150);
  };

  return (
    <>
      {/* CSS for responsive nav */}
      <style>{`
        .site-nav-desktop {
          display: flex;
          align-items: center;
          flex: 1;
          overflow: visible;
          gap: 0;
        }
        .site-nav-mobile-toggle {
          display: none;
        }
        .site-phone-link {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .site-cta-btn {
          display: inline-flex;
          align-items: center;
        }
        @media (max-width: 900px) {
          .site-nav-desktop {
            display: none !important;
          }
          .site-nav-mobile-toggle {
            display: flex !important;
          }
          .site-phone-link {
            display: none !important;
          }
          .site-cta-btn {
            display: none !important;
          }
        }
        .nav-link-item:hover {
          color: white !important;
        }
        .dropdown-item:hover {
          background: rgba(255,255,255,0.07) !important;
          color: white !important;
        }
      `}</style>

      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          background: NAVY,
          borderBottom: "1px solid rgba(255,255,255,0.1)",
          boxShadow: "0 4px 24px rgba(0,0,0,0.35)",
        }}
      >
        {/* Top bar */}
        <div style={{ background: NAVY_DARK, borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "0.3rem 0" }}>
          <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.4)", letterSpacing: "0.05em" }}>Работаем 24/7 · Выезд в день обращения</span>
            <span style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.4)", letterSpacing: "0.05em" }}>Москва и Московская область</span>
          </div>
        </div>

        {/* Main nav */}
        <div className="container" style={{ display: "flex", alignItems: "center", height: "64px", overflow: "visible", gap: 0 }}>
          {/* Logo */}
          <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "10px", flexShrink: 0, marginRight: "28px" }}>
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

          {/* Desktop nav — visible on ≥900px via CSS */}
          <nav className="site-nav-desktop">
            {navLinks.map((link) =>
              link.children ? (
                <div
                  key={link.label}
                  style={{ position: "relative" }}
                  onMouseEnter={openServices}
                  onMouseLeave={closeServices}
                >
                  <button
                    className="nav-link-item"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      height: "64px",
                      gap: "4px",
                      padding: "0 0.85rem",
                      fontSize: "0.82rem",
                      fontWeight: 600,
                      color: location.startsWith("/services") ? RED : "rgba(255,255,255,0.85)",
                      letterSpacing: "0.02em",
                      background: "none",
                      border: "none",
                      borderBottom: location.startsWith("/services") ? `2px solid ${RED}` : "2px solid transparent",
                      cursor: "pointer",
                      transition: "all 0.15s",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {link.label}
                    <ChevronDown
                      size={13}
                      style={{
                        transition: "transform 0.2s",
                        transform: servicesOpen ? "rotate(180deg)" : "rotate(0deg)",
                      }}
                    />
                  </button>
                  {servicesOpen && (
                    <div
                      style={{
                        position: "absolute",
                        top: "100%",
                        left: 0,
                        minWidth: "260px",
                        background: NAVY,
                        border: "1px solid rgba(255,255,255,0.12)",
                        borderTop: `2px solid ${RED}`,
                        borderRadius: "0 0 8px 8px",
                        padding: "0.5rem 0",
                        boxShadow: "0 16px 48px rgba(0,0,0,0.5)",
                        zIndex: 200,
                      }}
                      onMouseEnter={openServices}
                      onMouseLeave={closeServices}
                    >
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="dropdown-item"
                          style={{
                            display: "block",
                            padding: "0.65rem 1.25rem",
                            fontSize: "0.83rem",
                            fontWeight: 500,
                            color: location === child.href ? RED : "rgba(255,255,255,0.8)",
                            textDecoration: "none",
                            transition: "all 0.15s",
                            borderLeft: location === child.href ? `3px solid ${RED}` : "3px solid transparent",
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
                  className="nav-link-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    height: "64px",
                    padding: "0 0.85rem",
                    fontSize: "0.82rem",
                    fontWeight: 600,
                    color: location === link.href ? RED : "rgba(255,255,255,0.85)",
                    letterSpacing: "0.02em",
                    textDecoration: "none",
                    transition: "all 0.15s",
                    whiteSpace: "nowrap",
                    borderBottom: location === link.href ? `2px solid ${RED}` : "2px solid transparent",
                  }}
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>

          {/* Right side */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexShrink: 0, marginLeft: "auto" }}>
            <a
              href="tel:+74951485806"
              className="site-phone-link"
              style={{
                fontSize: "0.82rem",
                fontWeight: 700,
                color: "white",
                textDecoration: "none",
                letterSpacing: "0.02em",
              }}
            >
              <Phone size={14} style={{ color: RED }} />
              8(495)148-58-06
            </a>
            <Link
              href="/calculator"
              className="site-cta-btn"
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
            {/* Mobile menu toggle — hidden on ≥900px via CSS */}
            <button
              className="site-nav-mobile-toggle"
              onClick={() => setMobileOpen(!mobileOpen)}
              style={{
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "3px",
                padding: "0.5rem",
                color: "white",
                cursor: "pointer",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile menu — shown only when mobileOpen */}
        {mobileOpen && (
          <div
            style={{
              background: "rgba(13,31,51,0.99)",
              borderTop: "1px solid rgba(255,255,255,0.07)",
              padding: "1rem 0 1.5rem",
            }}
          >
            <div className="container" style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              {navLinks.map((link) => (
                <div key={link.label}>
                  {link.children ? (
                    <>
                      <div
                        style={{
                          padding: "0.6rem 0",
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          color: "rgba(255,255,255,0.4)",
                          letterSpacing: "0.12em",
                          textTransform: "uppercase",
                        }}
                      >
                        {link.label}
                      </div>
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          style={{
                            display: "block",
                            padding: "0.6rem 0.75rem",
                            fontSize: "0.88rem",
                            fontWeight: 500,
                            color: location === child.href ? RED : "rgba(255,255,255,0.75)",
                            textDecoration: "none",
                            borderRadius: "4px",
                            borderLeft: location === child.href ? `3px solid ${RED}` : "3px solid transparent",
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
                        padding: "0.7rem 0.75rem",
                        fontSize: "0.95rem",
                        fontWeight: 600,
                        color: location === link.href ? RED : "white",
                        textDecoration: "none",
                        borderRadius: "4px",
                        borderLeft: location === link.href ? `3px solid ${RED}` : "3px solid transparent",
                      }}
                    >
                      {link.label}
                    </Link>
                  )}
                </div>
              ))}
              <div style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                <a
                  href="tel:+74951485806"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "1rem",
                    fontWeight: 700,
                    color: "white",
                    textDecoration: "none",
                    marginBottom: "0.75rem",
                  }}
                >
                  <Phone size={16} style={{ color: RED }} />
                  8(495)148-58-06
                </a>
                <Link
                  href="/calculator"
                  style={{
                    display: "block",
                    background: "linear-gradient(135deg, #CC0000, #880000)",
                    color: "white",
                    fontWeight: 700,
                    fontSize: "0.85rem",
                    letterSpacing: "0.07em",
                    textTransform: "uppercase",
                    padding: "0.75rem 1.5rem",
                    borderRadius: "4px",
                    textDecoration: "none",
                    textAlign: "center",
                  }}
                >
                  Рассчитать стоимость
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
