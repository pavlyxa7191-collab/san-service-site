import { useEffect } from "react";
import { Link } from "wouter";
import SchemaMarkup from "@/components/SchemaMarkup";
import { applyPageSeo } from "@/lib/seo";

const NAVY = "#0A0F1E";
const RED = "#D0021B";
const WHITE = "#ffffff";

const SERVICES = [
  { slug: "klopov", title: "Уничтожение клопов", desc: "Холодный и горячий туман, гарантия до 3 лет." },
  { slug: "tarakanov", title: "Уничтожение тараканов", desc: "Гели и опрыскивание, без запаха." },
  { slug: "gryzunov", title: "Уничтожение грызунов", desc: "Дератизация, приманочные станции." },
  { slug: "kleshhej", title: "Уничтожение клещей", desc: "Обработка участков и помещений." },
  { slug: "pleseni", title: "Удаление плесени", desc: "Антисептики, озонация." },
  { slug: "dezinfektsii", title: "Дезинфекция", desc: "Уничтожение патогенов для дома и бизнеса." },
  { slug: "zapahov", title: "Борьба с запахами", desc: "Озонация и дезодорация." },
] as const;

export default function ServicesIndex() {
  useEffect(() => {
    applyPageSeo({
      title: "Услуги дезинсекции и дезинфекции в Москве — Экоцентр",
      description:
        "Полный список услуг: клопы, тараканы, грызуны, клещи, плесень, дезинфекция, запахи. Официальный договор, гарантия, выезд 24/7.",
    });
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: WHITE, fontFamily: "'Inter', sans-serif" }}>
      <SchemaMarkup
        type="breadcrumb"
        items={[
          { name: "Главная", url: "/" },
          { name: "Услуги", url: "/services" },
        ]}
      />

      <section style={{ background: `linear-gradient(135deg, ${NAVY} 0%, #111827 100%)`, padding: "3rem 0 4rem" }}>
        <div className="container">
          <div style={{ width: 40, height: 4, background: RED, marginBottom: "1.25rem" }} />
          <h1 style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 900, color: WHITE, margin: "0 0 1rem", letterSpacing: "-0.02em" }}>
            Услуги санитарной службы
          </h1>
          <p style={{ fontSize: "1.05rem", color: "rgba(255,255,255,0.65)", maxWidth: 640, lineHeight: 1.6, margin: 0 }}>
            Профессиональная дезинсекция, дератизация и дезинфекция в Москве и Московской области. Выберите услугу — рассчитайте стоимость онлайн или позвоните 8(495)145-21-69.
          </p>
        </div>
      </section>

      <section style={{ padding: "3rem 0 4rem" }}>
        <div className="container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 280px), 1fr))",
              gap: "1.25rem",
            }}
          >
            {SERVICES.map((s) => (
              <Link key={s.slug} href={`/services/${s.slug}`} style={{ textDecoration: "none" }}>
                <article
                  style={{
                    height: "100%",
                    padding: "1.5rem",
                    borderRadius: 12,
                    border: "1px solid #e5e7eb",
                    background: "#fafafa",
                    transition: "box-shadow 0.2s, border-color 0.2s",
                  }}
                >
                  <h2 style={{ fontSize: "1.1rem", fontWeight: 800, color: NAVY, margin: "0 0 0.5rem", lineHeight: 1.3 }}>
                    {s.title}
                  </h2>
                  <p style={{ fontSize: "0.9rem", color: "#6b7280", margin: 0, lineHeight: 1.5 }}>{s.desc}</p>
                  <span style={{ display: "inline-block", marginTop: "1rem", fontSize: "0.85rem", fontWeight: 700, color: RED }}>
                    Подробнее →
                  </span>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
