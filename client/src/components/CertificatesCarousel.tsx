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

          <div
            className="cert-carousel-wrap relative px-10 sm:px-12 md:px-14 lg:px-16"
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
              className="w-full mx-auto"
            >
              <CarouselContent className="-ml-3 md:-ml-4">
                {loopSlides.map((c) => (
                  <CarouselItem
                    key={c._key}
                    className="pl-3 md:pl-4 basis-[88%] sm:basis-1/2 lg:basis-1/4"
                  >
                    <button
                      type="button"
                      onClick={() => openLightbox(c._index)}
                      className="cert-card group w-full text-left rounded-lg overflow-visible transition-opacity duration-200 hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0F1E]"
                      style={{
                        cursor: "pointer",
                        background: "transparent",
                        border: "none",
                        padding: 0,
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
                          style={{ background: "transparent" }}
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
                className="flex size-10 sm:size-11 rounded-full border border-white/35 bg-[#0A0F1E]/55 text-white shadow-lg backdrop-blur-sm hover:bg-white/15 hover:text-white hover:border-white/50 disabled:opacity-35 left-0 sm:left-1 md:left-2 z-20"
                variant="outline"
              />
              <CarouselNext
                className="flex size-10 sm:size-11 rounded-full border border-white/35 bg-[#0A0F1E]/55 text-white shadow-lg backdrop-blur-sm hover:bg-white/15 hover:text-white hover:border-white/50 disabled:opacity-35 right-0 sm:right-1 md:right-2 z-20"
                variant="outline"
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

      {/* Лайтбокс без белых рамок: клик по фону или по фото — закрыть; стрелки — листать */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8"
          style={{ background: "rgba(0,0,0,0.82)" }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="lightbox-title"
          onClick={closeLightbox}
        >
          <div
            className="relative flex max-h-[92vh] w-full max-w-[min(96vw,920px)] flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={closeLightbox}
              className="absolute -top-1 right-0 z-30 flex size-10 items-center justify-center rounded-full border border-white/30 bg-black/50 text-white transition hover:bg-white/20 sm:-right-2 sm:top-0"
              aria-label="Закрыть"
            >
              <X className="size-5" />
            </button>

            <h3
              id="lightbox-title"
              className="mb-3 max-w-full pr-10 text-left text-sm font-bold text-white sm:text-base"
            >
              {CERTIFICATES[lightbox].alt}
            </h3>

            <div className="relative flex w-full items-center justify-center gap-2 sm:gap-4">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  prevInLightbox();
                }}
                className="hidden shrink-0 sm:flex size-11 items-center justify-center rounded-full border border-white/35 bg-white/10 text-white transition hover:bg-white/20 md:size-12"
                aria-label="Предыдущий сертификат"
              >
                <ChevronLeft className="size-6" />
              </button>

              <button
                type="button"
                onClick={closeLightbox}
                className="max-h-[min(78vh,1100px)] w-full cursor-zoom-out bg-transparent p-0"
                aria-label="Закрыть просмотр (повторный клик)"
              >
                <img
                  src={CERTIFICATES[lightbox].src}
                  alt=""
                  className="mx-auto h-auto max-h-[min(78vh,1100px)] w-full object-contain"
                  style={{ background: "transparent" }}
                />
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  nextInLightbox();
                }}
                className="hidden shrink-0 sm:flex size-11 items-center justify-center rounded-full border border-white/35 bg-white/10 text-white transition hover:bg-white/20 md:size-12"
                aria-label="Следующий сертификат"
              >
                <ChevronRight className="size-6" />
              </button>
            </div>

            <p className="mt-3 text-center text-xs text-white/50">
              Клик по затемнению или по снимку — закрыть · стрелки на клавиатуре ← →
            </p>

            <div className="mt-4 flex justify-center gap-3 sm:hidden">
              <button
                type="button"
                onClick={prevInLightbox}
                className="flex size-10 items-center justify-center rounded-full border border-white/35 bg-white/10 text-white"
                aria-label="Назад"
              >
                <ChevronLeft className="size-5" />
              </button>
              <button
                type="button"
                onClick={nextInLightbox}
                className="flex size-10 items-center justify-center rounded-full border border-white/35 bg-white/10 text-white"
                aria-label="Вперёд"
              >
                <ChevronRight className="size-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
