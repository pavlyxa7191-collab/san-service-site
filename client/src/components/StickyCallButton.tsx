import { useState, useEffect } from "react";

const PHONE = "84951485806";
const PHONE_DISPLAY = "8(495)148-58-06";
const WHATSAPP_NUMBER = "79099030699";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;
const TELEGRAM_URL = `https://t.me/dezmasters`;

// Phone SVG icon (proper telephone handset)
function PhoneIcon({ size = 24, color = "white" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.21h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6 6l.86-.86a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
    </svg>
  );
}

// WhatsApp SVG icon
function WhatsAppIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="white">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
    </svg>
  );
}

// Telegram SVG icon
function TelegramIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="white">
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
    </svg>
  );
}

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
          bottom: 90,
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
              <PhoneIcon size={18} />
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
                marginBottom: 8,
              }}
            >
              <WhatsAppIcon size={18} />
              WhatsApp
            </a>
            <a
              href={TELEGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                background: "#2AABEE",
                color: "white",
                borderRadius: 10,
                padding: "11px 14px",
                textDecoration: "none",
                fontWeight: 700,
                fontSize: "0.9rem",
              }}
            >
              <TelegramIcon size={18} />
              Telegram
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
            }}
            aria-label="Позвонить"
          >
            {expanded
              ? <span style={{ color: "white", fontSize: "1.2rem", fontWeight: 700 }}>✕</span>
              : <PhoneIcon size={24} color="white" />
            }
          </button>
        </div>
      </div>
    </>
  );
}
