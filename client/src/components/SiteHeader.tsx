import { Link, useLocation } from "wouter";
import { Phone, Menu, X, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect, useCallback, type CSSProperties, type MouseEvent } from "react";

/* Design Tokens */
const NAVY = "#0d1f3c";
const NAVY_DARK = "#091729";
const RED = "#CC0000";

/** Единый порядок пунктов: десктоп и мобильное меню рендерятся из этого массива */
const SERVICE_LINKS = [
  { label: "Уничтожение клопов", href: "/services/klopov" },
  { label: "Уничтожение тараканов", href: "/services/tarakanov" },
  { label: "Уничтожение грызунов", href: "/services/gryzunov" },
  { label: "Уничтожение клещей", href: "/services/kleshhej" },
  { label: "Удаление плесени", href: "/services/pleseni" },
  { label: "Дезинфекция", href: "/services/dezinfektsii" },
  { label: "Борьба с запахами", href: "/services/zapahov" },
] as const;

type NavEntry =
  | { kind: "dropdown"; id: string; label: string; children: readonly { label: string; href: string }[] }
  | { kind: "link"; href: string; label: string }
  | { kind: "anchor"; id: "reviews" | "certificates"; label: string; hash: "#reviews" | "#certificates" };

const navEntries: NavEntry[] = [
  { kind: "dropdown", id: "services", label: "Услуги", children: SERVICE_LINKS },
  { kind: "link", href: "/prices", label: "Цены" },
  { kind: "anchor", id: "reviews", label: "Отзывы", hash: "#reviews" },
  { kind: "anchor", id: "certificates", label: "Сертификаты", hash: "#certificates" },
  { kind: "link", href: "/about", label: "О компании" },
  { kind: "link", href: "/blog", label: "Блог" },
  { kind: "link", href: "/contacts", label: "Контакты" },
];

export default function SiteHeader() {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
    setMobileServicesOpen(false);
  }, [location]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const openServices = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setServicesOpen(true);
  };
  const closeServices = () => {
    closeTimer.current = setTimeout(() => setServicesOpen(false), 150);
  };

  const path = location.split("?")[0];

  const scrollToBlock = useCallback((id: string) => {
    window.requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, []);

  const onReviewsNav = useCallback(
    (e: MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      setMobileOpen(false);
      if (path === "/" || path.startsWith("/services/")) {
        scrollToBlock("reviews");
      } else {
        window.location.assign("/#reviews");
      }
    },
    [path, scrollToBlock]
  );

  const onCertificatesNav = useCallback(
    (e: MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      setMobileOpen(false);
      if (path === "/" || path.startsWith("/services/")) {
        scrollToBlock("certificates");
      } else {
        window.location.assign("/#certificates");
      }
    },
    [path, scrollToBlock]
  );

  const anchorLinkStyle = (active: boolean): CSSProperties => ({
    display: "flex",
    alignItems: "center",
    height: "64px",
    padding: "0 0.85rem",
    fontSize: "0.82rem",
    fontWeight: 600,
    color: active ? RED : "rgba(255,255,255,0.85)",
    letterSpacing: "0.02em",
    textDecoration: "none",
    transition: "all 0.15s",
    whiteSpace: "nowrap",
    borderBottom: active ? `2px solid ${RED}` : "2px solid transparent",
  });

  return (
    <>
      <style>{`
        /* ── HEADER RESPONSIVE ── */
        .site-nav-desktop {
          display: flex;
          align-items: center;
          flex: 1;
          flex-wrap: nowrap;
          overflow: visible;
          gap: 0;
          min-width: 0;
        }
        .site-nav-mobile-toggle {
          display: none;
          flex-shrink: 0;
        }
        .site-phone-link {
          display: flex;
          align-items: center;
          gap: 6px;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .site-cta-btn {
          display: inline-flex;
          align-items: center;
          flex-shrink: 0;
          white-space: nowrap;
        }
        @media (max-width: 900px) {
          .site-nav-desktop { display: none !important; }
          .site-nav-mobile-toggle { display: flex !important; }
          .site-phone-link { display: none !important; }
          .site-cta-btn { display: none !important; }
        }
        .nav-link-item:hover { color: white !important; }
        .dropdown-item:hover {
          background: rgba(255,255,255,0.07) !important;
          color: white !important;
        }

        /* ── OFF-CANVAS MOBILE MENU ── */
        .mobile-menu-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.55);
          z-index: 98;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s ease;
        }
        .mobile-menu-overlay.open {
          opacity: 1;
          pointer-events: auto;
        }
        .mobile-menu-drawer {
          position: fixed;
          top: 0;
          right: 0;
          bottom: 0;
          width: min(320px, 90vw);
          max-width: 100vw;
          background: #0d1f3c;
          z-index: 99;
          transform: translateX(100%);
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          overflow-y: auto;
          overflow-x: hidden;
          -webkit-overflow-scrolling: touch;
          display: flex;
          flex-direction: column;
        }
        .mobile-menu-drawer.open {
          transform: translateX(0);
        }
        .mobile-menu-close {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 1.25rem;
          border-bottom: 1px solid rgba(255,255,255,0.08);
          flex-shrink: 0;
        }
        .mobile-menu-nav {
          flex: 1;
          padding: 0.75rem 0;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
        }
        .mobile-nav-link {
          display: block;
          padding: 0.85rem 1.25rem;
          font-size: 1rem;
          font-weight: 600;
          color: rgba(255,255,255,0.9);
          text-decoration: none;
          border-left: 3px solid transparent;
          transition: background 0.15s, border-color 0.15s;
        }
        .mobile-nav-link:hover,
        .mobile-nav-link.active {
          background: rgba(255,255,255,0.05);
          border-left-color: ${RED};
          color: white;
        }
        .mobile-nav-link.active { color: ${RED}; }
        .mobile-services-toggle {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          padding: 0.85rem 1.25rem;
          font-size: 1rem;
          font-weight: 600;
          color: rgba(255,255,255,0.9);
          background: none;
          border: none;
          border-left: 3px solid transparent;
          cursor: pointer;
          text-align: left;
          transition: background 0.15s;
        }
        .mobile-services-toggle:hover { background: rgba(255,255,255,0.05); }
        .mobile-services-children {
          background: rgba(0,0,0,0.2);
          overflow: hidden;
          max-height: 0;
          transition: max-height 0.3s ease;
        }
        .mobile-services-children.open { max-height: 400px; }
        .mobile-services-child {
          display: block;
          padding: 0.65rem 1.25rem 0.65rem 2rem;
          font-size: 0.9rem;
          font-weight: 500;
          color: rgba(255,255,255,0.7);
          text-decoration: none;
          transition: background 0.15s, color 0.15s;
        }
        .mobile-services-child:hover { background: rgba(255,255,255,0.05); color: white; }
        .mobile-menu-footer {
          padding: 1rem 1.25rem 1.5rem;
          border-top: 1px solid rgba(255,255,255,0.08);
          flex-shrink: 0;
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
          maxWidth: "100vw",
          overflow: "visible",
        }}
      >
        {/* Top bar */}
        <div style={{ background: NAVY_DARK, borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "0.3rem 0" }}>
          <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.5rem" }}>
            <span style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.4)", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>Работаем 24/7 · Выезд в день обращения</span>
            <span style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.4)", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>Москва и МО</span>
          </div>
        </div>

        {/* Main nav */}
        <div
          className="container"
          style={{
            display: "flex",
            alignItems: "center",
            height: "64px",
            overflow: "visible",
            gap: 0,
            maxWidth: "100%",
          }}
        >
          {/* Logo */}
          <Link
            href="/"
            style={{
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              flexShrink: 0,
              marginRight: "28px",
              minWidth: 0,
            }}
          >
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
            <div style={{ minWidth: 0 }}>
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
            {navEntries.map((entry, navIndex) =>
              entry.kind === "dropdown" ? (
                <div
                  key={entry.id}
                  style={{ position: "relative", order: navIndex }}
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
                    {entry.label}
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
                      {entry.children.map((child) => (
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
              ) : entry.kind === "link" ? (
                <Link
                  key={entry.href}
                  href={entry.href}
                  className="nav-link-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    height: "64px",
                    padding: "0 0.85rem",
                    fontSize: "0.82rem",
                    fontWeight: 600,
                    color: location === entry.href ? RED : "rgba(255,255,255,0.85)",
                    letterSpacing: "0.02em",
                    textDecoration: "none",
                    transition: "all 0.15s",
                    whiteSpace: "nowrap",
                    borderBottom: location === entry.href ? `2px solid ${RED}` : "2px solid transparent",
                    order: navIndex,
                  }}
                >
                  {entry.label}
                </Link>
              ) : (
                <a
                  key={entry.id}
                  href={entry.hash}
                  onClick={entry.id === "reviews" ? onReviewsNav : onCertificatesNav}
                  className="nav-link-item"
                  style={{ ...anchorLinkStyle(false), order: navIndex }}
                >
                  {entry.label}
                </a>
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
            {/* Mobile hamburger — hidden on ≥900px via CSS */}
            <button
              className="site-nav-mobile-toggle"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? "Закрыть меню" : "Открыть меню"}
              aria-expanded={mobileOpen}
              style={{
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: "6px",
                padding: "0.5rem",
                color: "white",
                cursor: "pointer",
                alignItems: "center",
                justifyContent: "center",
                minWidth: "40px",
                minHeight: "40px",
                flexShrink: 0,
              }}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* ── OFF-CANVAS OVERLAY ── */}
      <div
        className={`mobile-menu-overlay${mobileOpen ? " open" : ""}`}
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
      />

      {/* ── OFF-CANVAS DRAWER ── */}
      <div
        className={`mobile-menu-drawer${mobileOpen ? " open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Навигационное меню"
      >
        {/* Drawer header */}
        <div className="mobile-menu-close">
          <Link
            href="/"
            style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "8px" }}
            onClick={() => setMobileOpen(false)}
          >
            <div
              style={{
                width: "30px",
                height: "30px",
                background: "linear-gradient(135deg, #CC0000, #880000)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "3px",
                flexShrink: 0,
              }}
            >
              <span style={{ color: "white", fontWeight: 900, fontSize: "0.8rem" }}>СЭС</span>
            </div>
            <span style={{ color: "white", fontWeight: 700, fontSize: "0.9rem" }}>Экоцентр</span>
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            aria-label="Закрыть меню"
            style={{
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: "6px",
              padding: "0.4rem",
              color: "white",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav links */}
        <nav className="mobile-menu-nav">
          {navEntries.map((entry, navIndex) =>
            entry.kind === "dropdown" ? (
              <div key={entry.id} style={{ order: navIndex }}>
                <button
                  className="mobile-services-toggle"
                  onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                  aria-expanded={mobileServicesOpen}
                >
                  <span>{entry.label}</span>
                  <ChevronDown
                    size={16}
                    style={{
                      color: "rgba(255,255,255,0.5)",
                      transition: "transform 0.25s",
                      transform: mobileServicesOpen ? "rotate(180deg)" : "rotate(0deg)",
                      flexShrink: 0,
                    }}
                  />
                </button>
                <div className={`mobile-services-children${mobileServicesOpen ? " open" : ""}`}>
                  {entry.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className="mobile-services-child"
                      onClick={() => setMobileOpen(false)}
                      style={{
                        color: location === child.href ? RED : "rgba(255,255,255,0.7)",
                      }}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              </div>
            ) : entry.kind === "link" ? (
              <Link
                key={entry.href}
                href={entry.href}
                className={`mobile-nav-link${location === entry.href ? " active" : ""}`}
                onClick={() => setMobileOpen(false)}
                style={{ order: navIndex }}
              >
                {entry.label}
              </Link>
            ) : (
              <a
                key={entry.id}
                href={entry.hash}
                className="mobile-nav-link"
                onClick={entry.id === "reviews" ? onReviewsNav : onCertificatesNav}
                style={{ order: navIndex }}
              >
                {entry.label}
              </a>
            )
          )}
        </nav>

        {/* Footer with phone + CTA */}
        <div className="mobile-menu-footer">
          <a
            href="tel:+74951485806"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "1.05rem",
              fontWeight: 700,
              color: "white",
              textDecoration: "none",
              marginBottom: "0.75rem",
            }}
          >
            <Phone size={18} style={{ color: RED, flexShrink: 0 }} />
            8(495)148-58-06
          </a>
          <Link
            href="/calculator"
            onClick={() => setMobileOpen(false)}
            style={{
              display: "block",
              background: "linear-gradient(135deg, #CC0000, #880000)",
              color: "white",
              fontWeight: 700,
              fontSize: "0.85rem",
              letterSpacing: "0.07em",
              textTransform: "uppercase",
              padding: "0.875rem 1.5rem",
              borderRadius: "6px",
              textDecoration: "none",
              textAlign: "center",
              boxShadow: "0 4px 16px rgba(204,0,0,0.35)",
            }}
          >
            Рассчитать стоимость
          </Link>
        </div>
      </div>
    </>
  );
}
