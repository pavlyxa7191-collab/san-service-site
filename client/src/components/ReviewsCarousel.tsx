import { useMemo, type CSSProperties, type RefObject } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  useCarousel,
} from "@/components/ui/carousel";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { REVIEWS, type ReviewItem } from "@/data/reviews";

const RED = "#D0021B";
const NAVY_TEXT = "#111827";
const GRAY = "#6b7280";
const GOLD = "#EAB308";

const LOOP_MULTIPLIER = 2;

/** Стрелки на светлом фоне — тёмное «стекло», как контраст у сертификатов */
const glassNav: CSSProperties = {
  background: "rgba(10, 15, 30, 0.78)",
  WebkitBackdropFilter: "blur(14px)",
  backdropFilter: "blur(14px)",
  border: "1px solid rgba(255, 255, 255, 0.32)",
  color: "#ffffff",
  boxShadow: "0 8px 28px rgba(0, 0, 0, 0.18)",
};

function ReviewsGlassPrev({ size = 48 }: { size?: number }) {
  const { scrollPrev, canScrollPrev, opts } = useCarousel();
  const loop = Boolean(opts && "loop" in opts && opts.loop);
  const base: CSSProperties = {
    ...glassNav,
    width: size,
    height: size,
    borderRadius: 9999,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    cursor: "pointer",
    transition: "transform 0.15s ease, opacity 0.15s ease",
  };

  return (
    <button
      type="button"
      aria-label="Предыдущие отзывы"
      style={base}
      disabled={!loop && !canScrollPrev}
      onClick={scrollPrev}
      onMouseDown={(e) => e.preventDefault()}
    >
      <ChevronLeft className="size-6" strokeWidth={2.5} aria-hidden />
    </button>
  );
}

function ReviewsGlassNext({ size = 48 }: { size?: number }) {
  const { scrollNext, canScrollNext, opts } = useCarousel();
  const loop = Boolean(opts && "loop" in opts && opts.loop);
  const base: CSSProperties = {
    ...glassNav,
    width: size,
    height: size,
    borderRadius: 9999,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    cursor: "pointer",
    transition: "transform 0.15s ease, opacity 0.15s ease",
  };

  return (
    <button
      type="button"
      aria-label="Следующие отзывы"
      style={base}
      disabled={!loop && !canScrollNext}
      onClick={scrollNext}
      onMouseDown={(e) => e.preventDefault()}
    >
      <ChevronRight className="size-6" strokeWidth={2.5} aria-hidden />
    </button>
  );
}

function hueFromName(name: string): number {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
  return Math.abs(h) % 360;
}

function ReviewCard({ r }: { r: ReviewItem }) {
  const initial = (r.name.match(/[А-Яа-яA-Za-zЁё]/u)?.[0] ?? "?").toUpperCase();
  const hue = hueFromName(r.name);

  return (
    <article
      className="flex h-full flex-col rounded-xl border border-[#e8ecf2] bg-white p-5 shadow-sm transition-shadow duration-200 hover:shadow-md"
      style={{ minHeight: 320 }}
    >
      <div className="mb-3 flex gap-0.5">
        {Array.from({ length: r.stars }).map((_, j) => (
          <span key={j} style={{ color: GOLD, fontSize: "1rem", lineHeight: 1 }}>
            ★
          </span>
        ))}
      </div>
      <span
        className="mb-3 w-fit rounded px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wide"
        style={{
          color: RED,
          background: "rgba(208, 2, 27, 0.06)",
        }}
      >
        {r.service}
      </span>
      {r.photo ? (
        <div className="mb-3 overflow-hidden rounded-lg border border-[#eef1f6]">
          <img
            src={r.photo}
            alt=""
            className="h-36 w-full object-cover"
            loading="lazy"
            decoding="async"
          />
        </div>
      ) : null}
      <p
        className="mb-4 flex-1 text-[0.88rem] leading-relaxed line-clamp-6"
        style={{ color: GRAY }}
      >
        «{r.text}»
      </p>
      {r.reply ? (
        <div
          className="mb-4 rounded-lg border border-[#eef1f6] bg-[#f8fafc] px-3 py-2 text-[0.78rem] leading-snug text-[#475569] line-clamp-3"
        >
          <span className="font-semibold text-[#334155]">Ответ: </span>
          {r.reply}
        </div>
      ) : null}
      <div className="mt-auto flex items-center gap-3 border-t border-[#f0f4ff] pt-4">
        <div
          className="flex size-10 shrink-0 items-center justify-center rounded-full text-[0.85rem] font-bold text-white"
          style={{ background: `hsl(${hue}, 42%, 44%)` }}
        >
          {initial}
        </div>
        <div className="min-w-0">
          <div className="truncate text-[0.85rem] font-bold" style={{ color: NAVY_TEXT }}>
            {r.name}
          </div>
          <div className="text-[0.72rem]" style={{ color: "#9ca3af" }}>
            {r.date}
          </div>
        </div>
      </div>
    </article>
  );
}

type Props = {
  /** ref для scroll-reveal на главной */
  revealRef?: RefObject<HTMLDivElement | null>;
};

export default function ReviewsCarousel({ revealRef }: Props) {
  const loopSlides = useMemo(
    () =>
      Array.from({ length: LOOP_MULTIPLIER }, () => [...REVIEWS])
        .flat()
        .map((r, i) => ({
          ...r,
          _key: `${r.id}-${i}`,
        })),
    []
  );

  return (
    <section style={{ padding: "5rem 0", background: "#f8f9fc" }}>
      <div className="container">
        <div ref={revealRef} className="reveal" style={{ marginBottom: "2rem" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
            <div style={{ width: 28, height: 3, background: RED, borderRadius: 2 }} />
            <span
              style={{
                fontSize: "0.68rem",
                fontWeight: 700,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: RED,
              }}
            >
              Отзывы
            </span>
          </div>
          <h2
            style={{
              fontSize: "clamp(1.75rem, 3vw, 2.4rem)",
              fontWeight: 900,
              color: NAVY_TEXT,
              letterSpacing: "-0.03em",
              margin: 0,
            }}
          >
            Что говорят наши клиенты
          </h2>
          <p style={{ margin: "0.75rem 0 0", maxWidth: 560, fontSize: "0.95rem", color: GRAY, lineHeight: 1.6 }}>
            Реальные отзывы с площадки объявлений. Листайте — отзывов много, с нами справляются разные задачи.
          </p>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
            dragFree: false,
            skipSnaps: false,
            slidesToScroll: 1,
          }}
          className="w-full"
        >
          <div className="flex w-full items-stretch gap-2 sm:gap-3">
            <ReviewsGlassPrev size={48} />
            <div className="min-w-0 flex-1">
              <CarouselContent className="-ml-3">
                {loopSlides.map((r) => (
                  <CarouselItem
                    key={r._key}
                    className="pl-3 basis-[88%] min-[520px]:basis-[47%] lg:basis-[31.5%]"
                  >
                    <ReviewCard r={r} />
                  </CarouselItem>
                ))}
              </CarouselContent>
            </div>
            <ReviewsGlassNext size={48} />
          </div>
        </Carousel>

        <p className="mt-4 text-center text-xs" style={{ color: "#9ca3af" }}>
          Листайте стрелками или свайпом · на экране сразу несколько карточек
        </p>
      </div>
    </section>
  );
}
