import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
} from "react";
import { createPortal } from "react-dom";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  useCarousel,
} from "@/components/ui/carousel";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

const RED = "#D0021B";
const WHITE = "#ffffff";

const CERTIFICATES = [
  {
    src: "/certificates/juraks.png",
    alt: "Свидетельство о госрегистрации препарата ЮРАКС 25%",
    title: "ЮРАКС 25%",
  },
  {
    src: "/certificates/krys-smert.png",
    alt: "Сертификат соответствия средства «Крысиная смерть»",
    title: "Крысиная смерть",
  },
  {
    src: "/certificates/storm-ultra.png",
    alt: "Свидетельство о госрегистрации родентицида Storm Ultra",
    title: "Storm Ultra",
  },
  {
    src: "/certificates/liquidator.png",
    alt: "Свидетельство о госрегистрации средства АС-Ликвидатор",
    title: "АС-Ликвидатор",
  },
] as const;

type Cert = (typeof CERTIFICATES)[number];

const LOOP_MULTIPLIER = 3;

/** Inline «стекло» — не зависит от Tailwind/shadcn (у Button accent = красный) */
const glassBtn: CSSProperties = {
  background: "rgba(255, 255, 255, 0.2)",
  WebkitBackdropFilter: "blur(16px)",
  backdropFilter: "blur(16px)",
  border: "1px solid rgba(255, 255, 255, 0.42)",
  color: "#ffffff",
  boxShadow: "0 8px 28px rgba(0, 0, 0, 0.28)",
};

function CertCarouselGlassPrev({ size = 48 }: { size?: number }) {
  const { scrollPrev, canScrollPrev, opts } = useCarousel();
  const loop = Boolean(opts && "loop" in opts && opts.loop);
  const base: CSSProperties = {
    ...glassBtn,
    width: size,
    height: size,
    borderRadius: 9999,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    cursor: "pointer",
    transition: "transform 0.15s ease, background 0.15s ease",
  };

  return (
    <button
      type="button"
      aria-label="Предыдущий слайд"
      style={base}
      disabled={!loop && !canScrollPrev}
      onClick={scrollPrev}
      onMouseDown={(e) => e.preventDefault()}
    >
      <ChevronLeft className="size-6" strokeWidth={2.5} aria-hidden />
    </button>
  );
}

function CertCarouselGlassNext({ size = 48 }: { size?: number }) {
  const { scrollNext, canScrollNext, opts } = useCarousel();
  const loop = Boolean(opts && "loop" in opts && opts.loop);
  const base: CSSProperties = {
    ...glassBtn,
    width: size,
    height: size,
    borderRadius: 9999,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    cursor: "pointer",
    transition: "transform 0.15s ease, background 0.15s ease",
  };

  return (
    <button
      type="button"
      aria-label="Следующий слайд"
      style={base}
      disabled={!loop && !canScrollNext}
      onClick={scrollNext}
      onMouseDown={(e) => e.preventDefault()}
    >
      <ChevronRight className="size-6" strokeWidth={2.5} aria-hidden />
    </button>
  );
}

function CertificateCard({
  c,
  index,
  onOpen,
  variant = "grid",
}: {
  c: Cert;
  index: number;
  onOpen: (i: number) => void;
  /** В узкой карусели — только картинка по центру, целиком в экране */
  variant?: "grid" | "carousel";
}) {
  const isCarousel = variant === "carousel";

  return (
    <button
      type="button"
      onClick={() => onOpen(index)}
      aria-label={c.alt}
      className={`cert-card group w-full overflow-visible transition-opacity duration-200 hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0F1E] rounded-none ${
        isCarousel ? "text-center" : "text-left"
      }`}
      style={{
        cursor: "pointer",
        background: "transparent",
        border: "none",
        padding: 0,
        boxShadow: "none",
      }}
    >
      <div
        className={`relative w-full bg-transparent ${isCarousel ? "flex min-h-[220px] items-center justify-center py-1" : "overflow-visible"}`}
        style={
          isCarousel
            ? {
                maxHeight: "min(68vh, 520px)",
              }
            : { aspectRatio: "3 / 4", maxHeight: 400 }
        }
      >
        <img
          src={c.src}
          alt={c.alt}
          loading="lazy"
          decoding="async"
          className={`object-contain object-center transition-transform duration-300 drop-shadow-[0_12px_32px_rgba(0,0,0,0.45)] ${
            isCarousel
              ? "max-h-[min(68vh,520px)] w-full max-w-full"
              : "h-full w-full group-hover:scale-[1.02]"
          }`}
          style={{
            background: "transparent",
            border: "none",
            outline: "none",
            boxShadow: "none",
          }}
        />
      </div>
    </button>
  );
}

export default function CertificatesCarousel() {
  const [lightbox, setLightbox] = useState<number | null>(null);

  const loopSlides = useMemo(
    () =>
      Array.from({ length: LOOP_MULTIPLIER }, () => [...CERTIFICATES])
        .flat()
        .map((c, i) => ({
          ...c,
          _key: `${c.src}-${i}`,
          _index: i % CERTIFICATES.length,
        })),
    []
  );

  const openLightbox = useCallback((index: number) => {
    setLightbox(index);
  }, []);

  const closeLightbox = useCallback(() => setLightbox(null), []);

  const nextInLightbox = useCallback(() => {
    setLightbox((prev) =>
      prev === null ? null : (prev + 1) % CERTIFICATES.length
    );
  }, []);

  const prevInLightbox = useCallback(() => {
    setLightbox((prev) =>
      prev === null ? null : (prev - 1 + CERTIFICATES.length) % CERTIFICATES.length
    );
  }, []);

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") nextInLightbox();
      if (e.key === "ArrowLeft") prevInLightbox();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightbox, closeLightbox, nextInLightbox, prevInLightbox]);

  return (
    <>
      {/* Резерв: гарантированно 4 колонки с 768px даже если Tailwind md не сработал */}
      <style>{`
        @media (min-width: 768px) {
          .certificates-grid-static {
            display: grid !important;
            grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
            gap: 1rem;
          }
          .certificates-carousel-only {
            display: none !important;
          }
        }
        @media (max-width: 767.98px) {
          .certificates-grid-static {
            display: none !important;
          }
          .certificates-carousel-only {
            display: block !important;
          }
          /* Ровно 100% ширины вьюпорта Embla — без «края» соседнего слайда */
          .certificates-carousel-only [data-slot="carousel-content"] > div {
            margin-left: 0 !important;
            column-gap: 0 !important;
          }
          .certificates-carousel-only [data-slot="carousel-item"] {
            flex: 0 0 100% !important;
            width: 100% !important;
            max-width: 100% !important;
            min-width: 0 !important;
            padding-left: 0 !important;
            padding-right: 0 !important;
            box-sizing: border-box !important;
          }
        }
      `}</style>
      <section
        id="certificates"
        className="scroll-mt-[100px]"
        aria-labelledby="certificates-heading"
        style={{
          background:
            "linear-gradient(180deg, rgba(10,15,30,0.92) 0%, rgba(10,15,30,0.98) 55%, #0A0F1E 100%)",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          padding: "clamp(2.5rem, 6vw, 4rem) 0",
        }}
      >
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 1rem" }}>
          <div style={{ textAlign: "center", marginBottom: "clamp(1.5rem, 4vw, 2.25rem)" }}>
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
                Документы
              </span>
            </div>
            <h2
              id="certificates-heading"
              style={{
                fontSize: "clamp(1.35rem, 4vw, 2rem)",
                fontWeight: 800,
                color: WHITE,
                letterSpacing: "-0.02em",
                lineHeight: 1.2,
                margin: 0,
              }}
            >
              Сертификаты и регистрация препаратов
            </h2>
            <p
              style={{
                margin: "0.75rem auto 0",
                maxWidth: 520,
                fontSize: "clamp(0.875rem, 2vw, 1rem)",
                color: "rgba(255,255,255,0.55)",
                lineHeight: 1.55,
              }}
            >
              Работаем только с препаратами, прошедшими государственную регистрацию и имеющими
              разрешение Роспотребнадзора.
            </p>
          </div>

          {/* Статичные 4 в ряд с 768px */}
          <div className="certificates-grid-static gap-3 sm:gap-4">
            {CERTIFICATES.map((c, i) => (
              <CertificateCard key={c.src} c={c} index={i} onOpen={openLightbox} />
            ))}
          </div>

          {/* Узкие экраны: карусель, стрелки в одном ряду с лентой */}
          <div className="certificates-carousel-only">
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
              <div className="flex w-full items-center gap-1.5 sm:gap-3">
                <CertCarouselGlassPrev size={44} />
                <div className="min-w-0 flex-1">
                  <CarouselContent className="-ml-0">
                    {loopSlides.map((c) => (
                      <CarouselItem
                        key={c._key}
                        className="basis-full !pl-0 min-w-0 shrink-0"
                      >
                        <CertificateCard
                          c={c}
                          index={c._index}
                          onOpen={openLightbox}
                          variant="carousel"
                        />
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                </div>
                <CertCarouselGlassNext size={44} />
              </div>
            </Carousel>
          </div>
        </div>
      </section>

      {lightbox !== null &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="lightbox-title"
            className="min-h-[100dvh] w-full"
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 10000,
              background: "rgba(10, 15, 30, 0.52)",
            }}
            onClick={closeLightbox}
          >
            {/* Размытие отдельным слоем: backdrop-filter на родителе ломает position:fixed у крестика */}
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
              <div className="flex w-full max-w-[100vw] flex-1 flex-row items-center justify-center gap-2 px-0 min-[400px]:gap-4 sm:gap-6">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    prevInLightbox();
                  }}
                  aria-label="Предыдущий сертификат"
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
                  {/* div вместо button — без глобальных стилей кнопок */}
                  <div
                    role="button"
                    tabIndex={0}
                    className="flex max-h-[min(72vh,1100px)] w-full cursor-zoom-out items-center justify-center"
                    onClick={closeLightbox}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        closeLightbox();
                      }
                    }}
                  >
                    <img
                      src={CERTIFICATES[lightbox].src}
                      alt=""
                      className="max-h-[min(72vh,1100px)] w-full max-w-full object-contain"
                      style={{
                        background: "transparent",
                        border: "none",
                        outline: "none",
                        boxShadow: "none",
                        display: "block",
                      }}
                    />
                  </div>
                  <p
                    id="lightbox-title"
                    className="mt-3 max-w-full px-1 text-center text-xs font-semibold leading-snug text-white/95 sm:text-sm"
                  >
                    {CERTIFICATES[lightbox].alt}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    nextInLightbox();
                  }}
                  aria-label="Следующий сертификат"
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

              <p className="mt-3 text-center text-[11px] text-white/65 sm:text-xs">
                Клик по фону или по фото — закрыть
              </p>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
