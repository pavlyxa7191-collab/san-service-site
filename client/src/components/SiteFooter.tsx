const NAVY = "#0D1F33";
const RED = "#CC0000";
const WHITE = "#ffffff";

export default function SiteFooter() {
  return (
    <footer style={{ background: NAVY, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px" }}>

        {/* 4-column grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "40px 32px",
        }}>

          {/* Column 1: Company */}
          <div>
            <div style={{
              fontSize: 11, fontWeight: 800, letterSpacing: "0.12em",
              textTransform: "uppercase" as const, color: RED, marginBottom: 16,
            }}>
              Компания
            </div>
            <div style={{ color: WHITE, fontWeight: 700, fontSize: 16, marginBottom: 4 }}>
              ООО «Экоцентр»
            </div>
            <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 13, marginBottom: 16 }}>
              Санитарная служба
            </div>
            <a
              href="tel:+74951485806"
              style={{
                color: WHITE, textDecoration: "none",
                fontSize: 15, fontWeight: 600,
                display: "inline-flex", alignItems: "center", gap: 6,
              }}
            >
              <span style={{ color: RED }}>☎</span> 8(495)148-58-06
            </a>
          </div>

          {/* Column 2: Requisites */}
          <div>
            <div style={{
              fontSize: 11, fontWeight: 800, letterSpacing: "0.12em",
              textTransform: "uppercase" as const, color: RED, marginBottom: 16,
            }}>
              Реквизиты
            </div>
            {[
              { label: "ИНН", value: "7726389900" },
              { label: "КПП", value: "772601001" },
              { label: "ОГРН", value: "1157746482250" },
            ].map(({ label, value }) => (
              <div key={label} style={{ marginBottom: 8 }}>
                <span style={{ color: "rgba(255,255,255,0.45)", fontSize: 13 }}>{label}: </span>
                <span style={{ color: WHITE, fontSize: 13, fontWeight: 500 }}>{value}</span>
              </div>
            ))}
          </div>

          {/* Column 3: Address */}
          <div>
            <div style={{
              fontSize: 11, fontWeight: 800, letterSpacing: "0.12em",
              textTransform: "uppercase" as const, color: RED, marginBottom: 16,
            }}>
              Адрес
            </div>
            <div style={{ color: WHITE, fontSize: 14, lineHeight: 1.8 }}>
              г. Москва,<br />
              ул. Профсоюзная, д. 56
            </div>
            <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 13, marginTop: 6 }}>
              Работаем по всей Москве и МО
            </div>
          </div>

          {/* Column 4: Licenses */}
          <div>
            <div style={{
              fontSize: 11, fontWeight: 800, letterSpacing: "0.12em",
              textTransform: "uppercase" as const, color: RED, marginBottom: 16,
            }}>
              Лицензии
            </div>
            <div style={{ color: WHITE, fontSize: 14, marginBottom: 8 }}>Лицензия СЭС</div>
            <div style={{ color: WHITE, fontSize: 14, marginBottom: 8 }}>Сертификаты на препараты</div>
            <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 13 }}>Работаем по СанПиН</div>
          </div>

        </div>

        {/* Bottom bar */}
        <div style={{
          marginTop: 32,
          paddingTop: 20,
          borderTop: "1px solid rgba(255,255,255,0.08)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap" as const,
          gap: 8,
        }}>
          <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 12 }}>
            © {new Date().getFullYear()} ООО «Экоцентр». Все права защищены.
          </span>
          <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 12 }}>
            Профессиональная дезинфекция в Москве
          </span>
        </div>

      </div>
    </footer>
  );
}
