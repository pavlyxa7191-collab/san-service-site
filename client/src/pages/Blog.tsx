import { Link, useParams } from "wouter";
import { ArrowRight, Clock, Tag } from "lucide-react";

const articles = [
  {
    slug: "kak-izbavitsya-ot-klopov",
    title: "Как избавиться от клопов: полное руководство",
    excerpt: "Постельные клопы — одна из самых неприятных проблем. Рассказываем, как их обнаружить, почему самостоятельные методы не работают и что делать для полного уничтожения.",
    date: "15 февраля 2025",
    readTime: "7 мин",
    tag: "Клопы",
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

Все препараты сертифицированы и одобрены Роспотребнадзором.

## Документы после дезинфекции

Для организаций мы выдаём:
- Акт выполненных работ
- Журнал дезинфекции
- Сертификаты на препараты

Это необходимо для проверок Роспотребнадзора.
    `,
  },
  {
    slug: "kak-izbavitsya-ot-kryis",
    title: "Как избавиться от крыс в квартире и частном доме",
    excerpt: "Крысы — опасные переносчики болезней. Рассказываем о признаках заражения, методах дератизации и профилактике повторного появления.",
    date: "20 января 2025",
    readTime: "6 мин",
    tag: "Грызуны",
    content: `
Крысы — одни из самых опасных вредителей. Они переносят более 35 болезней, портят имущество и продукты питания.

## Признаки появления крыс

- Характерный запах мочи
- Погрызенные продукты, провода, мебель
- Экскременты (тёмные продолговатые гранулы)
- Шум в стенах и под полом ночью
- Следы лап на пыльных поверхностях

## Почему крысы опасны

Крысы переносят лептоспироз, хантавирус, сальмонеллёз и другие опасные заболевания. Они перегрызают электропроводку, что может привести к пожару.

## Методы дератизации

**Родентицидные приманки** — наиболее эффективный метод. Приманки раскладываются в специальных защитных станциях, недоступных для детей и животных.

**Механические ловушки** — используются как дополнение к основному методу.

**Клеевые ловушки** — для мышей в небольших помещениях.

## Профилактика

- Устраните все щели и отверстия в фундаменте и стенах
- Храните продукты в герметичных контейнерах
- Регулярно вывозите мусор
- Не оставляйте еду в открытом доступе

## Дератизация для предприятий

Для кафе, ресторанов, складов и производств мы заключаем договоры на регулярное обслуживание с ведением журнала дератизации.
    `,
  },
  {
    slug: "pleseni-v-kvartire",
    title: "Плесень в квартире: причины, опасность и методы удаления",
    excerpt: "Плесень опасна для здоровья и разрушает конструкции. Объясняем, почему она появляется, чем грозит и как правильно от неё избавиться.",
    date: "10 февраля 2025",
    readTime: "8 мин",
    tag: "Плесень",
    content: `
Плесень — это грибок, который размножается спорами. Она появляется в местах с высокой влажностью и плохой вентиляцией.

## Почему появляется плесень

- Высокая влажность воздуха (более 60%)
- Плохая вентиляция
- Промерзание стен
- Протечки труб и кровли
- Конденсат на окнах

## Чем опасна плесень

Споры плесени вызывают:
- Аллергические реакции
- Бронхиальную астму
- Хронический бронхит
- Снижение иммунитета
- Головные боли и усталость

Особенно опасна плесень для детей, пожилых людей и людей с хроническими заболеваниями.

## Почему самостоятельная обработка не помогает

Бытовые средства (белизна, уксус) убивают видимую плесень, но не проникают в глубину материала. Через 2–4 недели плесень появляется снова.

## Профессиональное удаление плесени

1. Механическое удаление видимой плесени
2. Обработка антисептиком глубокого проникновения
3. Нанесение защитного покрытия
4. Рекомендации по устранению причин

## Профилактика

- Обеспечьте хорошую вентиляцию
- Поддерживайте влажность воздуха 40–60%
- Регулярно проветривайте помещение
- Устраните источники протечек
    `,
  },
];

// ─── ARTICLE PAGE ─────────────────────────────────────────────────────────────

function ArticlePage({ slug }: { slug: string }) {
  const article = articles.find((a) => a.slug === slug);

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-black text-2xl mb-4" style={{ color: "#0D1F33" }}>Статья не найдена</h1>
          <Link href="/blog" className="btn-red no-underline">К статьям</Link>
        </div>
      </div>
    );
  }

  const paragraphs = article.content.trim().split("\n\n");

  return (
    <div className="bg-white">
      <section style={{ background: "#0D1F33", borderBottom: "2px solid #CC0000" }}>
        <div className="container py-16">
          <div className="flex items-center gap-2 mb-4 text-sm" style={{ color: "#666" }}>
            <Link href="/" className="no-underline" style={{ color: "#666" }}>Главная</Link>
            <span>/</span>
            <Link href="/blog" className="no-underline" style={{ color: "#666" }}>Блог</Link>
            <span>/</span>
            <span style={{ color: "#CC0000" }}>{article.tag}</span>
          </div>
          <div className="flex items-center gap-3 mb-4">
            <div className="red-square" />
            <span className="section-label">{article.tag}</span>
          </div>
          <h1
            className="font-black text-white mb-4"
            style={{ fontSize: "clamp(1.5rem, 3vw, 2.5rem)", letterSpacing: "-0.03em", maxWidth: "800px" }}
          >
            {article.title}
          </h1>
          <div className="flex items-center gap-4 text-xs" style={{ color: "#666" }}>
            <span className="flex items-center gap-1"><Clock size={12} /> {article.readTime}</span>
            <span>{article.date}</span>
          </div>
        </div>
      </section>

      <div className="container py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <div className="prose max-w-none" style={{ color: "#444" }}>
              {paragraphs.map((para, i) => {
                if (para.startsWith("## ")) {
                  return (
                    <h2 key={i} className="font-black text-xl mt-8 mb-4" style={{ color: "#0D1F33", letterSpacing: "-0.02em" }}>
                      {para.replace("## ", "")}
                    </h2>
                  );
                }
                if (para.startsWith("**") && para.endsWith("**")) {
                  return (
                    <p key={i} className="font-bold text-sm mb-3" style={{ color: "#0D1F33" }}>
                      {para.replace(/\*\*/g, "")}
                    </p>
                  );
                }
                if (para.startsWith("- ")) {
                  const items = para.split("\n").filter((l) => l.startsWith("- "));
                  return (
                    <ul key={i} className="mb-4 space-y-2">
                      {items.map((item, j) => (
                        <li key={j} className="flex items-start gap-2 text-sm">
                          <div className="red-square mt-1 flex-shrink-0" />
                          <span>{item.replace("- ", "")}</span>
                        </li>
                      ))}
                    </ul>
                  );
                }
                return (
                  <p key={i} className="text-sm leading-relaxed mb-4" style={{ color: "#444" }}>
                    {para}
                  </p>
                );
              })}
            </div>

            <div className="mt-12 p-8" style={{ background: "#CC0000" }}>
              <h3 className="font-black text-white text-xl mb-3" style={{ letterSpacing: "-0.02em" }}>
                Нужна профессиональная помощь?
              </h3>
              <p className="text-sm mb-6" style={{ color: "rgba(255,255,255,0.8)" }}>
                Оставьте заявку — специалист приедет в день обращения
              </p>
              <div className="flex gap-4">
                <Link href="/calculator" className="no-underline inline-flex items-center gap-2 font-bold text-sm px-6 py-3" style={{ background: "white", color: "#CC0000", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Рассчитать стоимость <ArrowRight size={14} />
                </Link>
                <a href="tel:+79300354841" className="no-underline inline-flex items-center gap-2 font-bold text-sm px-6 py-3" style={{ background: "transparent", color: "white", border: "2px solid rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Позвонить
                </a>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <div className="p-6 mb-6" style={{ background: "#F5F5F5", border: "1px solid #E0E0E0" }}>
              <div className="section-label mb-4">Другие статьи</div>
              <div className="space-y-4">
                {articles.filter((a) => a.slug !== slug).slice(0, 3).map((a) => (
                  <Link key={a.slug} href={`/blog/${a.slug}`} className="block no-underline group">
                    <div className="text-xs font-bold mb-1" style={{ color: "#CC0000", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      {a.tag}
                    </div>
                    <div className="text-sm font-semibold group-hover:underline" style={{ color: "#0D1F33" }}>
                      {a.title}
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="p-6" style={{ background: "#0D1F33" }}>
              <div className="section-label mb-3">Позвонить</div>
              <a href="tel:+79300354841" className="font-black text-xl text-white no-underline block mb-2">
                8(930)035-48-41
              </a>
              <p className="text-xs" style={{ color: "#666" }}>Работаем 24/7</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── BLOG LIST ─────────────────────────────────────────────────────────────────

export default function Blog() {
  const params = useParams<{ slug?: string }>();

  if (params.slug) {
    return <ArticlePage slug={params.slug} />;
  }

  return (
    <div className="bg-white">
      <section style={{ background: "#0D1F33", borderBottom: "2px solid #CC0000" }}>
        <div className="container py-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="red-square" />
            <span className="section-label">Блог</span>
          </div>
          <h1
            className="font-black text-white mb-4"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "-0.03em" }}
          >
            Полезные статьи
          </h1>
          <p className="text-base" style={{ color: "#999" }}>
            Советы специалистов по дезинфекции, дезинсекции и дератизации
          </p>
        </div>
      </section>

      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px" style={{ background: "#E0E0E0" }}>
          {articles.map((article) => (
            <Link key={article.slug} href={`/blog/${article.slug}`} className="no-underline group">
              <div className="bg-white p-8 h-full" style={{ transition: "background 0.15s" }}>
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="inline-flex items-center gap-1 text-xs font-bold px-2 py-1"
                    style={{ background: "#CC0000", color: "white", letterSpacing: "0.05em", textTransform: "uppercase" }}
                  >
                    <Tag size={10} /> {article.tag}
                  </div>
                  <div className="flex items-center gap-1 text-xs" style={{ color: "#999" }}>
                    <Clock size={10} /> {article.readTime}
                  </div>
                </div>
                <h2
                  className="font-black text-lg mb-3 group-hover:underline"
                  style={{ color: "#0D1F33", letterSpacing: "-0.02em", lineHeight: 1.2 }}
                >
                  {article.title}
                </h2>
                <p className="text-sm leading-relaxed mb-4" style={{ color: "#666" }}>
                  {article.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs" style={{ color: "#999" }}>{article.date}</span>
                  <span className="flex items-center gap-1 text-xs font-bold" style={{ color: "#CC0000" }}>
                    Читать <ArrowRight size={10} />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
