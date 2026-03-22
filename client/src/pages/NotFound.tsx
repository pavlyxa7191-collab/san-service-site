import { useEffect } from "react";
import { Link } from "wouter";
import { applyPageSeo } from "@/lib/seo";

const RED = "#D0021B";
const NAVY = "#0A0F1E";

export default function NotFound() {
  useEffect(() => {
    applyPageSeo({
      title: "Страница не найдена — Санитарная служба",
      description: "Запрошенная страница не существует. Перейдите на главную или воспользуйтесь меню.",
      robots: "noindex, nofollow",
    });
  }, []);

  return (
    <div style={{
      minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "#f8f9fc", padding: "40px 24px",
    }}>
      <div style={{ textAlign: "center", maxWidth: 480 }}>
        <div style={{
          fontSize: "7rem", fontWeight: 900, color: NAVY,
          lineHeight: 1, letterSpacing: "-0.04em", marginBottom: "0.5rem",
          opacity: 0.12,
        }}>404</div>
        <h1 style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 800, color: NAVY, margin: "0 0 1rem", letterSpacing: "-0.02em" }}>
          Страница не найдена
        </h1>
        <p style={{ fontSize: "1rem", color: "#6b7280", lineHeight: 1.65, margin: "0 0 2rem" }}>
          Такой страницы не существует или она была перемещена.
          Воспользуйтесь меню или вернитесь на главную.
        </p>
        <Link href="/" style={{
          display: "inline-flex", alignItems: "center", gap: "0.5rem",
          background: RED, color: "#fff", fontWeight: 700, fontSize: "0.88rem",
          letterSpacing: "0.06em", textTransform: "uppercase",
          padding: "0.875rem 2rem", borderRadius: 8, textDecoration: "none",
        }}>
          ← На главную
        </Link>
      </div>
    </div>
  );
}
