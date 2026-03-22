import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
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

const LOOP_MULTIPLIER = 3;

/** Общие стили красных стрелок карусели (внутри области, слева / справа) */
const carouselArrowClass =
  "!flex !size-11 sm:!size-12 !rounded-full !border-2 !border-red-800 !shadow-lg " +
  "!text-white !top-1/2 !-translate-y-1/2 !z-30 " +
  "hover:!brightness-110 active:!scale-95 disabled:!opacity-40 " +
  "[&_svg]:!size-6";

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
      <section
        aria-labelledby="certificates-heading"
        style={{
          background:
            "linear-gradient(180deg, rgba(10,15,30,0.92) 0%, rgba(10,15,30,0.98) 55%, #0A0F1E 100%)",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          padding: "clamp(2.5rem, 6vw, 4rem) 0",
        }}
      >
        <div className="container" style={{ maxWidth: 1280, margin: "0 auto", padding: "0 1rem" }}>
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

          {/* overflow-visible — стрелки не обрезаются; на lg — 3 карточки в ряд */}
          <div
            className="cert-carousel-wrap relative overflow-visible px-12 sm:px-14 md:px-16"
            style={{ paddingBottom: "0.5rem" }}
          >
            <Carousel
              opts={{
                align: "start",
                loop: true,
                dragFree: false,
                skipSnaps: false,
                slidesToScroll: 1,
              }}
              className="relative w-full mx-auto"
            >
              <CarouselContent className="-ml-3 md:-ml-4">
                {loopSlides.map((c) => (
                  <CarouselItem
                    key={c._key}
                    className="pl-3 md:pl-4 basis-[88%] sm:basis-1/2 lg:basis-1/3"
                  >
                    <button
                      type="button"
                      onClick={() => openLightbox(c._index)}
                      className="cert-card group w-full text-left overflow-visible transition-opacity duration-200 hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0F1E] rounded-none"
                      style={{
                        cursor: "pointer",
                        background: "transparent",
                        border: "none",
                        padding: 0,
                        boxShadow: "none",
                      }}
                    >
                      <div
                        className="relative w-full overflow-visible bg-transparent"
                        style={{ aspectRatio: "3 / 4", maxHeight: 400 }}
                      >
                        <img
                          src={c.src}
                          alt={c.alt}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-contain object-center transition-transform duration-300 group-hover:scale-[1.02] drop-shadow-[0_12px_32px_rgba(0,0,0,0.45)]"
                          style={{
                            background: "transparent",
                            border: "none",
                            outline: "none",
                            boxShadow: "none",
                          }}
                        />
                      </div>
                      <div style={{ padding: "0.55rem 0 0.75rem" }}>
                        <span
                          style={{
                            fontSize: "0.7rem",
                            fontWeight: 700,
                            letterSpacing: "0.06em",
                            textTransform: "uppercase",
                            color: RED,
                          }}
                        >
                          {c.title}
                        </span>
                        <div
                          style={{
                            marginTop: 3,
                            fontSize: "0.72rem",
                            color: "rgba(255,255,255,0.4)",
                          }}
                        >
                          Нажмите, чтобы открыть
                        </div>
                      </div>
                    </button>
                  </CarouselItem>
                ))}
              </CarouselContent>

              <CarouselPrevious
                variant="outline"
                className={`${carouselArrowClass} !left-2 sm:!left-3 !bg-[#D0021B] !border-[#b00118] hover:!bg-[#b00118] hover:!border-[#9a0115]`}
              />
              <CarouselNext
                variant="outline"
                className={`${carouselArrowClass} !right-2 sm:!right-3 !bg-[#D0021B] !border-[#b00118] hover:!bg-[#b00118] hover:!border-[#9a0115]`}
              />
            </Carousel>

            <p
              className="sm:hidden text-center"
              style={{
                marginTop: "1rem",
                fontSize: "0.75rem",
                color: "rgba(255,255,255,0.35)",
              }}
            >
              Свайпните влево / вправо
            </p>
          </div>
        </div>
      </section>

      {/* Полноэкранный лайтбокс: полупрозрачный фон, без тёмной «колонки», без рамок у фото */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-[100] flex min-h-[100dvh] w-full flex-col"
          style={{
            background: "rgba(10, 15, 30, 0.42)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="lightbox-title"
          onClick={closeLightbox}
        >
          <div
            className="relative flex min-h-0 flex-1 flex-col items-center justify-center px-3 py-4 sm:px-6 sm:py-6"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={closeLightbox}
              className="absolute right-3 top-3 z-50 flex size-11 items-center justify-center rounded-full border-2 border-white/40 text-white shadow-md transition hover:bg-white/15 sm:right-5 sm:top-5"
              style={{ backgroundColor: RED }}
              aria-label="Закрыть"
            >
              <X className="size-5" />
            </button>

            <div className="flex w-full max-w-[100vw] flex-1 flex-row items-center justify-center gap-2 px-1 min-[400px]:gap-4 sm:gap-6 md:gap-8">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  prevInLightbox();
                }}
                className="flex size-10 shrink-0 items-center justify-center rounded-full border-2 border-red-900 text-white shadow-lg transition hover:brightness-110 min-[400px]:size-12 md:size-14"
                style={{ backgroundColor: RED }}
                aria-label="Предыдущий сертификат"
              >
                <ChevronLeft className="size-6 min-[400px]:size-7 md:size-8" strokeWidth={2.5} />
              </button>

              <div className="flex min-h-0 min-w-0 flex-1 flex-col items-center justify-center">
                <button
                  type="button"
                  onClick={closeLightbox}
                  className="flex max-h-[min(78vh,1200px)] w-full cursor-zoom-out items-center justify-center bg-transparent p-0"
                  style={{ border: "none", outline: "none", boxShadow: "none" }}
                  aria-label="Закрыть просмотр"
                >
                  <img
                    src={CERTIFICATES[lightbox].src}
                    alt=""
                    className="max-h-[min(78vh,1200px)] w-full max-w-full object-contain"
                    style={{
                      background: "transparent",
                      border: "none",
                      outline: "none",
                      boxShadow: "none",
                      display: "block",
                    }}
                  />
                </button>
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
                className="flex size-10 shrink-0 items-center justify-center rounded-full border-2 border-red-900 text-white shadow-lg transition hover:brightness-110 min-[400px]:size-12 md:size-14"
                style={{ backgroundColor: RED }}
                aria-label="Следующий сертификат"
              >
                <ChevronRight className="size-6 min-[400px]:size-7 md:size-8" strokeWidth={2.5} />
              </button>
            </div>

            <p className="mt-2 text-center text-[11px] text-white/70 sm:text-xs">
              Клик по фону или по сертификату — закрыть
            </p>
          </div>
        </div>
      )}
    </>
  );
}
