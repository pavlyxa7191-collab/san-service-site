import { useState, useEffect } from "react";

const PHONE = "84951485806";
const PHONE_DISPLAY = "8(495)148-58-06";
const WHATSAPP_URL = `https://wa.me/74951485806`;

export default function StickyCallButton() {
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);

  // Show after scrolling 300px
  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Auto-collapse after 4 seconds
  useEffect(() => {
    if (!expanded) return;
    const t = setTimeout(() => setExpanded(false), 4000);
    return () => clearTimeout(t);
  }, [expanded]);

  if (!visible) return null;

  return (
    <>
      <style>{`
        @media (min-width: 768px) {
          .sticky-call-btn { display: none !important; }
        }
        @keyframes pulse-ring {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        .pulse-ring {
          animation: pulse-ring 1.5s ease-out infinite;
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .slide-up {
          animation: slide-up 0.2s ease-out;
        }
      `}</style>

      <div
        className="sticky-call-btn"
        style={{
          position: "fixed",
          bottom: 20,
          right: 16,
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: 8,
        }}
      >
        {/* Expanded panel */}
        {expanded && (
          <div
            className="slide-up"
            style={{
              background: "white",
              borderRadius: 16,
              padding: "16px",
              boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
              minWidth: 220,
              border: "1px solid #e2e8f0",
            }}
          >
            <div style={{ color: "#718096", fontSize: "0.72rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 }}>
              Связаться с нами
            </div>
            <a
              href={`tel:+7${PHONE.slice(1)}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                background: "#0d1f3c",
                color: "white",
                borderRadius: 10,
                padding: "11px 14px",
                textDecoration: "none",
                fontWeight: 700,
                fontSize: "0.9rem",
                marginBottom: 8,
              }}
            >
              <span style={{ fontSize: "1.1rem" }}>📞</span>
              {PHONE_DISPLAY}
            </a>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                background: "#25D366",
                color: "white",
                borderRadius: 10,
                padding: "11px 14px",
                textDecoration: "none",
                fontWeight: 700,
                fontSize: "0.9rem",
              }}
            >
              <span style={{ fontSize: "1.1rem" }}>💬</span>
              WhatsApp
            </a>
          </div>
        )}

        {/* Main button */}
        <div style={{ position: "relative" }}>
          {/* Pulse ring */}
          {!expanded && (
            <div
              className="pulse-ring"
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                background: "#CC0000",
                pointerEvents: "none",
              }}
            />
          )}
          <button
            onClick={() => setExpanded((v) => !v)}
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: expanded ? "#0d1f3c" : "#CC0000",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 16px rgba(204,0,0,0.4)",
              transition: "background 0.2s, transform 0.15s",
              position: "relative",
              zIndex: 1,
              fontSize: "1.4rem",
            }}
            aria-label="Позвонить"
          >
            {expanded ? "✕" : "📞"}
          </button>
        </div>
      </div>
    </>
  );
}
