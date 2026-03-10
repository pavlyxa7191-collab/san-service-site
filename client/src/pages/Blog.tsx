import { useState, useEffect, useRef } from "react";
import { Link, useParams } from "wouter";
import { ArrowRight, Clock, Tag, ChevronRight } from "lucide-react";

// ─── DESIGN TOKENS (matching About.tsx) ────────────────────────────────────────
const NAVY = "#0D1F33";
const NAVY2 = "#1a2f4a";
const RED = "#CC0000";
const WHITE = "#ffffff";
const LIGHT_BG = "#f7f8fa";
const GRAY = "#6b7280";
const BORDER = "#e5e7eb";

// ─── FADE IN ANIMATION ─────────────────────────────────────────────────────────
function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(24px)",
      transition: `opacity 0.55s ease ${delay}ms, transform 0.55s ease ${delay}ms`,
    }}>
      {children}
    </div>
  );
}

// ─── ARTICLES DATA ──────────────────────────────────────────────────────────────
const articles = [
  {
    slug: "kak-izbavitsya-ot-klopov",
    title: "Как избавиться от клопов: полное руководство",
    excerpt: "Постельные клопы — одна из самых неприятных проблем. Рассказываем, как их обнаружить, почему самостоятельные методы не работают и что делать для полного уничтожения.",
    date: "15 февраля 2025",
    readTime: "7 мин",
    tag: "Клопы",
    color: "#dc2626",
    content: `
Постельные клопы (Cimex lectularius) — паразиты, питающиеся кровью человека. Они активны ночью, прячутся в щелях мебели, матрасах и плинтусах.

## Признаки заражения клопами

- Укусы на теле (особенно на открытых участках)
- Маленькие тёмные точки на постельном белье (экскременты)
- Характерный сладковатый запах в комнате
- Видимые особи в складках матраса

## Почему самостоятельная борьба не работает

Магазинные аэрозоли и спреи действуют только на взрослых особей. Яйца клопов устойчивы к большинству инсектицидов. Через 2–3 недели популяция восстанавливается.

## Профессиональные методы уничтожения

**Холодный туман** — распыление инсектицида в виде мелкодисперсного аэрозоля. Быстро, без запаха. Подходит для большинства случаев.

**Горячий туман** — обработка горячим паром с инсектицидом. Проникает в труднодоступные места. Максимальная эффективность.

**Опрыскивание** — точечная обработка очагов. Подходит для начальной стадии заражения.

## Подготовка к обработке

1. Уберите продукты в холодильник
2. Накройте посуду
3. Уберите домашних животных
4. Постирайте постельное бельё при температуре 60°C

## После обработки

- Проветрите помещение 2–4 часа
- Сделайте влажную уборку
- Не мойте плинтусы и углы 2 недели

Профессиональная обработка даёт гарантию до 3 лет. При повторном появлении — бесплатная обработка.
    `,
  },
  {
    slug: "dezinfektsiya-posle-covid",
    title: "Дезинфекция квартиры после COVID-19: нужна ли она?",
    excerpt: "Разбираемся, когда необходима профессиональная дезинфекция после коронавируса, какие методы эффективны и как правильно подготовить помещение.",
    date: "3 марта 2025",
    readTime: "5 мин",
    tag: "Дезинфекция",
    color: "#0891b2",
    content: `
После перенесённого COVID-19 многие задаются вопросом: нужна ли дезинфекция квартиры? Отвечаем подробно.

## Когда нужна профессиональная дезинфекция

- После выздоровления больного с подтверждённым COVID-19
- При наличии пожилых людей или людей с ослабленным иммунитетом в доме
- В офисах и организациях — по требованию Роспотребнадзора
- В медицинских учреждениях и детских садах

## Методы дезинфекции

**Влажная дезинфекция** — обработка всех поверхностей дезинфицирующим раствором. Эффективна против большинства вирусов и бактерий.

**Аэрозольная дезинфекция** — распыление дезинфектанта в воздухе. Обеззараживает воздух и труднодоступные поверхности.

**УФ-облучение** — дополнительный метод обеззараживания воздуха.

## Какие препараты используются

Профессиональные дезинфицирующие средства на основе:
- Четвертичных аммониевых соединений
- Хлорсодержащих препаратов
- Перекиси водорода

Все препараты сертифицированы и безопасны для людей после проветривания.

## Стоимость дезинфекции

Однокомнатная квартира — от 2 000 ₽. Офис до 100 м² — от 5 000 ₽. Точная цена зависит от площади и выбранного метода.
    `,
  },
  {
    slug: "kak-vyvesti-tarakanov",
    title: "Тараканы в квартире: причины появления и методы борьбы",
    excerpt: "Откуда берутся тараканы, почему они возвращаются после самостоятельной обработки и как навсегда избавиться от них с гарантией.",
    date: "20 января 2025",
    readTime: "6 мин",
    tag: "Тараканы",
    color: "#d97706",
    content: `
Тараканы — одни из самых живучих насекомых. Они адаптируются к инсектицидам, прячутся в щелях и размножаются с огромной скоростью.

## Почему появляются тараканы

- Соседи провели обработку — тараканы мигрировали к вам
- Принесли с продуктами или вещами
- Проникли через вентиляцию или канализацию

## Почему самостоятельные методы не работают

Гели и аэрозоли из магазина убивают только взрослых особей. Яйца (оотеки) устойчивы к большинству препаратов. Через 3–4 недели популяция восстанавливается.

## Профессиональные методы

**Холодный туман** — мелкодисперсный аэрозоль проникает в щели и труднодоступные места. Быстро, без запаха.

**Гелевые приманки** — долгосрочный эффект. Тараканы поедают приманку и заражают колонию.

**Комплексная обработка** — сочетание методов для максимального результата.

## Гарантия результата

Профессиональная обработка даёт гарантию до 3 лет. При повторном появлении — бесплатная обработка.
    `,
  },
  {
    slug: "dezinsektsiya-ofisa",
    title: "Дезинсекция офиса: как провести без остановки работы",
    excerpt: "Как организовать профессиональную обработку офиса от насекомых без простоя бизнеса. Требования СанПиН, сроки и стоимость.",
    date: "10 апреля 2025",
    readTime: "4 мин",
    tag: "Коммерция",
    color: "#7c3aed",
    content: `
Насекомые в офисе — это не только неприятно, но и нарушение санитарных норм. Рассказываем, как провести обработку без остановки работы.

## Требования СанПиН

Организации обязаны проводить профилактическую дезинсекцию согласно СП 3.5.3.3223-14. При обнаружении насекомых — немедленная обработка.

## Как провести обработку без простоя

1. Обработка в нерабочее время (ночью или в выходные)
2. Поэтапная обработка по зонам
3. Быстросохнущие препараты без запаха

## Что входит в обработку офиса

- Осмотр и выявление очагов
- Обработка всех помещений
- Обработка технических зон (серверные, склады)
- Акт выполненных работ для СЭС

## Стоимость

Офис до 100 м² — от 5 000 ₽. Торговый центр — по договорённости. Договор и официальные документы.
    `,
  },
];

// ─── ARTICLE PAGE ───────────────────────────────────────────────────────────────
function ArticlePage({ slug }: { slug: string }) {
  const article = articles.find((a) => a.slug === slug);
  if (!article) return (
    <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <h2 style={{ color: NAVY, fontSize: 24, fontWeight: 800, marginBottom: 12 }}>Статья не найдена</h2>
        <Link href="/blog" style={{ color: RED, textDecoration: "none", fontWeight: 600 }}>← Вернуться в блог</Link>
      </div>
    </div>
  );

  const paragraphs = article.content.trim().split("\n\n");

  return (
    <div style={{ background: WHITE }}>
      {/* Hero */}
      <section style={{ background: `linear-gradient(135deg, ${NAVY} 0%, ${NAVY2} 100%)`, padding: "80px 0 60px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          {/* Breadcrumb */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 28, fontSize: 13, color: "rgba(255,255,255,0.5)" }}>
            <Link href="/" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>Главная</Link>
            <ChevronRight size={14} />
            <Link href="/blog" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>Блог</Link>
            <ChevronRight size={14} />
            <span style={{ color: "rgba(255,255,255,0.8)" }}>{article.tag}</span>
          </div>
          {/* Tag badge */}
          <div style={{
            display: "inline-block", background: `${RED}22`, color: RED,
            borderRadius: 100, padding: "6px 18px", fontSize: 12, fontWeight: 700,
            letterSpacing: "0.08em", marginBottom: 20, textTransform: "uppercase" as const,
            border: `1px solid ${RED}44`,
          }}>
            {article.tag}
          </div>
          <h1 style={{
            fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)", fontWeight: 900, color: WHITE,
            margin: "0 0 20px", letterSpacing: "-0.03em", lineHeight: 1.15, maxWidth: 760,
          }}>
            {article.title}
          </h1>
          <div style={{ display: "flex", alignItems: "center", gap: 20, color: "rgba(255,255,255,0.5)", fontSize: 13 }}>
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Clock size={13} /> {article.readTime}
            </span>
            <span>{article.date}</span>
          </div>
        </div>
      </section>

      {/* Content */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "64px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 60, alignItems: "start" }}>
          {/* Article body */}
          <div>
            <div style={{ fontSize: 16, lineHeight: 1.75, color: "#374151" }}>
              {paragraphs.map((para, i) => {
                if (para.startsWith("## ")) {
                  return (
                    <h2 key={i} style={{ fontSize: 22, fontWeight: 800, color: NAVY, margin: "40px 0 16px", letterSpacing: "-0.02em", lineHeight: 1.2 }}>
                      {para.replace("## ", "")}
                    </h2>
                  );
                }
                if (para.includes("**")) {
                  const parts = para.split(/\*\*(.*?)\*\*/g);
                  return (
                    <p key={i} style={{ marginBottom: 16, color: "#374151" }}>
                      {parts.map((p, j) => j % 2 === 1 ? <strong key={j} style={{ color: NAVY, fontWeight: 700 }}>{p}</strong> : p)}
                    </p>
                  );
                }
                if (para.startsWith("- ")) {
                  const items = para.split("\n").filter((l) => l.startsWith("- "));
                  return (
                    <ul key={i} style={{ margin: "0 0 20px", paddingLeft: 0, listStyle: "none" }}>
                      {items.map((item, j) => (
                        <li key={j} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 10, color: "#374151", fontSize: 15 }}>
                          <span style={{ width: 6, height: 6, borderRadius: "50%", background: RED, flexShrink: 0, marginTop: 8 }} />
                          {item.replace("- ", "")}
                        </li>
                      ))}
                    </ul>
                  );
                }
                if (para.match(/^\d+\./)) {
                  const items = para.split("\n").filter((l) => l.match(/^\d+\./));
                  return (
                    <ol key={i} style={{ margin: "0 0 20px", paddingLeft: 0, listStyle: "none" }}>
                      {items.map((item, j) => (
                        <li key={j} style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 10, color: "#374151", fontSize: 15 }}>
                          <span style={{ width: 24, height: 24, borderRadius: "50%", background: `${RED}15`, color: RED, fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            {j + 1}
                          </span>
                          {item.replace(/^\d+\.\s/, "")}
                        </li>
                      ))}
                    </ol>
                  );
                }
                return (
                  <p key={i} style={{ marginBottom: 18, color: "#374151", fontSize: 15, lineHeight: 1.75 }}>
                    {para}
                  </p>
                );
              })}
            </div>

            {/* CTA block */}
            <div style={{
              marginTop: 48, borderRadius: 20, padding: "40px 36px",
              background: `linear-gradient(135deg, ${NAVY} 0%, ${NAVY2} 100%)`,
              position: "relative", overflow: "hidden",
            }}>
              <div style={{ position: "absolute", top: -20, right: -20, width: 120, height: 120, borderRadius: "50%", background: `${RED}15` }} />
              <h3 style={{ fontSize: 22, fontWeight: 800, color: WHITE, margin: "0 0 10px", letterSpacing: "-0.02em", position: "relative" }}>
                Нужна профессиональная помощь?
              </h3>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.65)", margin: "0 0 24px", position: "relative" }}>
                Оставьте заявку — специалист приедет в день обращения
              </p>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" as const, position: "relative" }}>
                <Link href="/calculator" style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  background: RED, color: WHITE, textDecoration: "none",
                  padding: "12px 24px", borderRadius: 10, fontWeight: 700, fontSize: 14,
                  letterSpacing: "0.02em",
                }}>
                  Рассчитать стоимость <ArrowRight size={14} />
                </Link>
                <a href="tel:+74951485806" style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  background: "transparent", color: WHITE, textDecoration: "none",
                  padding: "12px 24px", borderRadius: 10, fontWeight: 700, fontSize: 14,
                  border: "1.5px solid rgba(255,255,255,0.3)",
                }}>
                  Позвонить
                </a>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ position: "sticky", top: 100 }}>
            {/* Other articles */}
            <div style={{ background: LIGHT_BG, borderRadius: 16, padding: 28, marginBottom: 20, border: `1px solid ${BORDER}` }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: RED, letterSpacing: "0.1em", textTransform: "uppercase" as const, marginBottom: 20 }}>
                Другие статьи
              </div>
              <div style={{ display: "flex", flexDirection: "column" as const, gap: 16 }}>
                {articles.filter((a) => a.slug !== slug).slice(0, 3).map((a) => (
                  <Link key={a.slug} href={`/blog/${a.slug}`} style={{ textDecoration: "none", display: "block" }}>
                    <div style={{
                      padding: "14px 16px", borderRadius: 10, background: WHITE,
                      border: `1px solid ${BORDER}`, transition: "border-color 0.2s, box-shadow 0.2s",
                    }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = RED; (e.currentTarget as HTMLElement).style.boxShadow = `0 4px 16px ${RED}15`; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = BORDER; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
                    >
                      <div style={{ fontSize: 10, fontWeight: 700, color: RED, letterSpacing: "0.08em", textTransform: "uppercase" as const, marginBottom: 6 }}>
                        {a.tag}
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: NAVY, lineHeight: 1.4 }}>
                        {a.title}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Phone card */}
            <div style={{
              background: `linear-gradient(135deg, ${NAVY} 0%, ${NAVY2} 100%)`,
              borderRadius: 16, padding: 28,
            }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: `${RED}`, letterSpacing: "0.1em", textTransform: "uppercase" as const, marginBottom: 12 }}>
                Позвонить
              </div>
              <a href="tel:+74951485806" style={{ fontSize: 22, fontWeight: 900, color: WHITE, textDecoration: "none", display: "block", marginBottom: 6 }}>
                8(495)148-58-06
              </a>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", margin: 0 }}>Работаем 24/7</p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .blog-article-grid { grid-template-columns: 1fr !important; }
          .blog-sidebar { position: static !important; }
        }
        @media (max-width: 600px) {
          .blog-cta-grid { grid-template-columns: 1fr !important; }
          .blog-cta-btns { min-width: 0 !important; width: 100% !important; }
        }
      `}</style>
    </div>
  );
}

// ─── BLOG LIST ──────────────────────────────────────────────────────────────────
export default function Blog() {
  const params = useParams<{ slug?: string }>();
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  if (params.slug) {
    return <ArticlePage slug={params.slug} />;
  }

  return (
    <div style={{ background: WHITE }}>
      {/* Hero */}
      <section style={{ background: `linear-gradient(135deg, ${NAVY} 0%, ${NAVY2} 100%)`, padding: "80px 0 60px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <FadeIn>
            <div style={{
              display: "inline-block", background: `${RED}22`, color: RED,
              borderRadius: 100, padding: "6px 18px", fontSize: 12, fontWeight: 700,
              letterSpacing: "0.08em", marginBottom: 20, textTransform: "uppercase" as const,
              border: `1px solid ${RED}44`,
            }}>
              Блог
            </div>
            <h1 style={{
              fontSize: "clamp(2rem, 4vw, 3.25rem)", fontWeight: 900, color: WHITE,
              margin: "0 0 16px", letterSpacing: "-0.03em", lineHeight: 1.1,
            }}>
              Полезные статьи
            </h1>
            <p style={{ fontSize: 18, color: "rgba(255,255,255,0.6)", margin: 0, maxWidth: 520 }}>
              Советы специалистов по дезинфекции, дезинсекции и дератизации
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Articles grid */}
      <section style={{ padding: "80px 0", background: LIGHT_BG }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24 }}>
            {articles.map((article, i) => (
              <FadeIn key={article.slug} delay={i * 80}>
                <Link href={`/blog/${article.slug}`} style={{ textDecoration: "none", display: "block", height: "100%" }}>
                  <div
                    onMouseEnter={() => setHoveredCard(i)}
                    onMouseLeave={() => setHoveredCard(null)}
                    style={{
                      background: WHITE, borderRadius: 16,
                      border: `1.5px solid ${hoveredCard === i ? RED + "44" : BORDER}`,
                      boxShadow: hoveredCard === i ? `0 16px 48px ${RED}12` : "0 2px 8px rgba(0,9,25,0.04)",
                      transition: "all 0.3s ease",
                      transform: hoveredCard === i ? "translateY(-4px)" : "none",
                      overflow: "hidden", height: "100%", display: "flex", flexDirection: "column" as const,
                    }}
                  >
                    {/* Card top accent */}
                    <div style={{ height: 4, background: `linear-gradient(90deg, ${RED}, ${RED}88)` }} />

                    <div style={{ padding: "28px 28px 24px", flex: 1, display: "flex", flexDirection: "column" as const }}>
                      {/* Tag + read time */}
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
                        <span style={{
                          display: "inline-flex", alignItems: "center", gap: 5,
                          background: `${RED}12`, color: RED,
                          borderRadius: 100, padding: "4px 12px", fontSize: 11, fontWeight: 700,
                          letterSpacing: "0.06em", textTransform: "uppercase" as const,
                        }}>
                          <Tag size={9} /> {article.tag}
                        </span>
                        <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: GRAY }}>
                          <Clock size={11} /> {article.readTime}
                        </span>
                      </div>

                      {/* Title */}
                      <h2 style={{
                        fontSize: 18, fontWeight: 800, color: NAVY, margin: "0 0 12px",
                        letterSpacing: "-0.02em", lineHeight: 1.25,
                      }}>
                        {article.title}
                      </h2>

                      {/* Excerpt */}
                      <p style={{ fontSize: 14, lineHeight: 1.65, color: GRAY, margin: "0 0 24px", flex: 1 }}>
                        {article.excerpt}
                      </p>

                      {/* Footer */}
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 16, borderTop: `1px solid ${BORDER}` }}>
                        <span style={{ fontSize: 12, color: GRAY }}>{article.date}</span>
                        <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, fontWeight: 700, color: RED }}>
                          Читать <ArrowRight size={13} />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section style={{ padding: "80px 0", background: WHITE }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <FadeIn>
            <div className="blog-cta-grid" style={{
              background: `linear-gradient(135deg, ${NAVY} 0%, ${NAVY2} 100%)`,
              borderRadius: 24, padding: "60px 48px",
              display: "grid", gridTemplateColumns: "1fr auto", gap: 40, alignItems: "center",
            }}>
              <div>
                <div style={{
                  display: "inline-block", background: `${RED}22`, color: RED,
                  borderRadius: 100, padding: "5px 14px", fontSize: 11, fontWeight: 700,
                  letterSpacing: "0.08em", marginBottom: 16, textTransform: "uppercase" as const,
                }}>
                  Нужна помощь?
                </div>
                <h2 style={{ fontSize: "clamp(20px, 2.5vw, 32px)", fontWeight: 800, color: WHITE, margin: "0 0 10px", letterSpacing: "-0.02em" }}>
                  Оставьте заявку прямо сейчас
                </h2>
                <p style={{ fontSize: 15, color: "rgba(255,255,255,0.6)", margin: 0 }}>
                  Специалист приедет в день обращения. Работаем 24/7.
                </p>
              </div>
              <div className="blog-cta-btns" style={{ display: "flex", flexDirection: "column" as const, gap: 12, minWidth: 200 }}>
                <Link href="/calculator" style={{
                  display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
                  background: RED, color: WHITE, textDecoration: "none",
                  padding: "14px 28px", borderRadius: 10, fontWeight: 700, fontSize: 14,
                  whiteSpace: "nowrap" as const,
                }}>
                  Рассчитать цену <ArrowRight size={14} />
                </Link>
                <a href="tel:+74951485806" style={{
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  background: "transparent", color: WHITE, textDecoration: "none",
                  padding: "14px 28px", borderRadius: 10, fontWeight: 700, fontSize: 14,
                  border: "1.5px solid rgba(255,255,255,0.25)", whiteSpace: "nowrap" as const,
                }}>
                  8(495)148-58-06
                </a>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
