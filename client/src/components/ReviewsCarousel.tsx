import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  useCarousel,
} from "@/components/ui/carousel";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { REVIEW_SCREENSHOTS } from "@/data/reviewScreenshots";

const RED = "#D0021B";
const GRAY = "#6b7280";
const NAVY_TEXT = "#111827";

const LOOP_MULTIPLIER = 2;

/** Стрелки карусели на светлом фоне */
const glassNav: CSSProperties = {
  background: "rgba(10, 15, 30, 0.78)",
  WebkitBackdropFilter: "blur(14px)",
  backdropFilter: "blur(14px)",
  border: "1px solid rgba(255, 255, 255, 0.32)",
  color: "#ffffff",
  boxShadow: "0 8px 28px rgba(0, 0, 0, 0.18)",
};

/** Лайтбокс — как у сертификатов */
const glassBtn: CSSProperties = {
  background: "rgba(255, 255, 255, 0.2)",
  WebkitBackdropFilter: "blur(16px)",
  backdropFilter: "blur(16px)",
  border: "1px solid rgba(255, 255, 255, 0.42)",
  color: "#ffffff",
  boxShadow: "0 8px 28px rgba(0, 0, 0, 0.28)",
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
      aria-label="Предыдущий скриншот"
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
      aria-label="Следующий скриншот"
      style={base}
      disabled={!loop && !canScrollNext}
      onClick={scrollNext}
      onMouseDown={(e) => e.preventDefault()}
    >
      <ChevronRight className="size-6" strokeWidth={2.5} aria-hidden />
    </button>
  );
}

type Props = {
  revealRef?: RefObject<HTMLDivElement | null>;
};

export default function ReviewsCarousel({ revealRef }: Props) {
  const [lightbox, setLightbox] = useState<number | null>(null);

  const loopSlides = useMemo(
    () =>
      Array.from({ length: LOOP_MULTIPLIER }, () => [...REVIEW_SCREENSHOTS])
        .flat()
        .map((shot, i) => ({
          ...shot,
          _key: `${shot.src}-${i}`,
          _index: i % REVIEW_SCREENSHOTS.length,
        })),
    []
  );

  const openLightbox = useCallback((index: number) => setLightbox(index), []);
  const closeLightbox = useCallback(() => setLightbox(null), []);

  const nextLb = useCallback(() => {
    setLightbox((prev) =>
      prev === null ? null : (prev + 1) % REVIEW_SCREENSHOTS.length
    );
  }, []);

  const prevLb = useCallback(() => {
    setLightbox((prev) =>
      prev === null
        ? null
        : (prev - 1 + REVIEW_SCREENSHOTS.length) % REVIEW_SCREENSHOTS.length
    );
  }, []);

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") nextLb();
      if (e.key === "ArrowLeft") prevLb();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightbox, closeLightbox, nextLb, prevLb]);

  return (
    <>
      <section style={{ padding: "5rem 0", background: "#f8f9fc" }}>
        <div className="container">
          <div ref={revealRef} className="reveal" style={{ marginBottom: "2rem" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                marginBottom: "0.75rem",
              }}
            >
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
            <p
              style={{
                margin: "0.75rem 0 0",
                maxWidth: 560,
                fontSize: "0.95rem",
                color: GRAY,
                lineHeight: 1.6,
              }}
            >
              Реальные отзывы с площадки объявлений — листайте скриншоты, нажмите для увеличения.
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
            <div className="flex w-full items-center gap-2 sm:gap-3">
              <ReviewsGlassPrev size={48} />
              <div className="min-w-0 flex-1">
                <CarouselContent className="-ml-3">
                  {loopSlides.map((shot) => (
                    <CarouselItem
                      key={shot._key}
                      className="pl-3 basis-[82%] min-[480px]:basis-[45%] lg:basis-[30%]"
                    >
                      <button
                        type="button"
                        onClick={() => openLightbox(shot._index)}
                        className="group w-full cursor-zoom-in overflow-hidden rounded-xl border border-[#e2e8f0] bg-white p-1.5 shadow-md transition-shadow hover:shadow-lg"
                        style={{ boxShadow: "0 4px 24px rgba(15, 25, 35, 0.08)" }}
                      >
                        <img
                          src={shot.src}
                          alt={shot.alt}
                          loading="lazy"
                          decoding="async"
                          className="mx-auto block max-h-[min(420px,52vh)] w-full object-contain object-top"
                        />
                        <span className="mt-2 block text-center text-[0.7rem] font-medium text-[#94a3b8] group-hover:text-[#64748b]">
                          Нажмите, чтобы открыть
                        </span>
                      </button>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </div>
              <ReviewsGlassNext size={48} />
            </div>
          </Carousel>

          <p className="mt-4 text-center text-xs" style={{ color: "#9ca3af" }}>
            Листайте стрелками или свайпом · видно сразу несколько скриншотов
          </p>
        </div>
      </section>

      {lightbox !== null &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Просмотр скриншота отзыва"
            className="min-h-[100dvh] w-full"
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 10000,
              background: "rgba(10, 15, 30, 0.52)",
            }}
            onClick={closeLightbox}
          >
            <div
              aria-hidden
              style={{
                position: "absolute",
                inset: 0,
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
                pointerEvents: "none",
              }}
            />

            <button
              type="button"
              aria-label="Закрыть"
              style={{
                position: "fixed",
                top: "max(12px, env(safe-area-inset-top))",
                right: "max(12px, env(safe-area-inset-right))",
                zIndex: 10003,
                width: 46,
                height: 46,
                borderRadius: 9999,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                border: "none",
                padding: 0,
                ...glassBtn,
                boxShadow: "0 10px 36px rgba(0,0,0,0.35)",
              }}
              onClick={(e) => {
                e.stopPropagation();
                closeLightbox();
              }}
            >
              <X className="size-5" strokeWidth={2.5} aria-hidden />
            </button>

            <div
              className="flex h-full min-h-[100dvh] flex-col items-center justify-center px-3 pb-8 pt-14 sm:px-8 sm:pb-10 sm:pt-16"
              style={{ position: "relative", zIndex: 10001 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex w-full max-w-[100vw] flex-1 flex-row items-center justify-center gap-2 min-[400px]:gap-4 sm:gap-6">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    prevLb();
                  }}
                  aria-label="Предыдущий"
                  style={{
                    ...glassBtn,
                    width: "clamp(44px, 11vw, 58px)",
                    height: "clamp(44px, 11vw, 58px)",
                    borderRadius: 9999,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    cursor: "pointer",
                    border: "none",
                    padding: 0,
                  }}
                >
                  <ChevronLeft
                    className="size-6 min-[400px]:size-7 md:size-8"
                    strokeWidth={2.5}
                    aria-hidden
                  />
                </button>

                <div className="flex min-h-0 min-w-0 flex-1 flex-col items-center justify-center">
                  <div
                    role="button"
                    tabIndex={0}
                    className="flex max-h-[min(78vh,1200px)] w-full cursor-zoom-out items-center justify-center"
                    onClick={closeLightbox}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        closeLightbox();
                      }
                    }}
                  >
                    <img
                      src={REVIEW_SCREENSHOTS[lightbox].src}
                      alt={REVIEW_SCREENSHOTS[lightbox].alt}
                      className="max-h-[min(78vh,1200px)] w-full max-w-full object-contain"
                      style={{
                        background: "transparent",
                        border: "none",
                        outline: "none",
                        boxShadow: "none",
                        display: "block",
                      }}
                    />
                  </div>
                  <p className="mt-3 text-center text-xs text-white/85 sm:text-sm">
                    {lightbox + 1} / {REVIEW_SCREENSHOTS.length}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    nextLb();
                  }}
                  aria-label="Следующий"
                  style={{
                    ...glassBtn,
                    width: "clamp(44px, 11vw, 58px)",
                    height: "clamp(44px, 11vw, 58px)",
                    borderRadius: 9999,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    cursor: "pointer",
                    border: "none",
                    padding: 0,
                  }}
                >
                  <ChevronRight
                    className="size-6 min-[400px]:size-7 md:size-8"
                    strokeWidth={2.5}
                    aria-hidden
                  />
                </button>
              </div>

              <p className="mt-2 text-center text-[11px] text-white/65 sm:text-xs">
                Клик по фону или по фото — закрыть
              </p>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
