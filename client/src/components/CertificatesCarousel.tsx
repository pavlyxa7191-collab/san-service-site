import { useMemo, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

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

/** Дублируем слайды для плавного бесконечного листания Embla (loop) */
const LOOP_MULTIPLIER = 3;

export default function CertificatesCarousel() {
  const [lightbox, setLightbox] = useState<number | null>(null);

  const loopSlides = useMemo(
    () =>
      Array.from({ length: LOOP_MULTIPLIER }, () => [...CERTIFICATES]).flat().map((c, i) => ({
        ...c,
        _key: `${c.src}-${i}`,
        _index: i % CERTIFICATES.length,
      })),
    []
  );

  return (
    <>
      <section
        aria-labelledby="certificates-heading"
        style={{
          background: "transparent",
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
                      onClick={() => setLightbox(c._index)}
                      className="cert-card group w-full text-left rounded-xl overflow-hidden border border-white/12 bg-transparent backdrop-blur-[2px] transition-all duration-200 hover:border-red-500/45 hover:bg-white/[0.03] focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0F1E]"
                      style={{ cursor: "pointer" }}
                    >
                      <div
                        className="relative w-full overflow-hidden bg-transparent"
                        style={{ aspectRatio: "3 / 4", maxHeight: 400 }}
                      >
                        <img
                          src={c.src}
                          alt={c.alt}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-contain object-center p-1 sm:p-2 transition-transform duration-300 group-hover:scale-[1.02] drop-shadow-[0_8px_24px_rgba(0,0,0,0.35)]"
                        />
                      </div>
                      <div style={{ padding: "0.55rem 0.65rem 0.75rem" }}>
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
                          Нажмите, чтобы увеличить
                        </div>
                      </div>
                    </button>
                  </CarouselItem>
                ))}
              </CarouselContent>

              <CarouselPrevious
                className="flex size-10 sm:size-11 rounded-full border border-white/30 bg-[#0A0F1E]/40 text-white shadow-[0_4px_20px_rgba(0,0,0,0.35)] backdrop-blur-md hover:bg-white/10 hover:text-white hover:border-white/45 disabled:opacity-40 left-0 sm:left-1 md:left-2 z-20"
                variant="outline"
              />
              <CarouselNext
                className="flex size-10 sm:size-11 rounded-full border border-white/30 bg-[#0A0F1E]/40 text-white shadow-[0_4px_20px_rgba(0,0,0,0.35)] backdrop-blur-md hover:bg-white/10 hover:text-white hover:border-white/45 disabled:opacity-40 right-0 sm:right-1 md:right-2 z-20"
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
              Свайпните влево / вправо — карусель листается по кругу
            </p>
          </div>
        </div>
      </section>

      <Dialog open={lightbox !== null} onOpenChange={(o) => !o && setLightbox(null)}>
        <DialogContent className="max-w-[min(96vw,900px)] max-h-[92vh] overflow-y-auto border-white/10 bg-[#0d1528]/95 backdrop-blur-sm p-3 sm:p-6">
          {lightbox !== null && (
            <>
              <DialogTitle className="text-white text-base sm:text-lg font-bold pr-8">
                {CERTIFICATES[lightbox].alt}
              </DialogTitle>
              <DialogDescription className="sr-only">
                Увеличенное изображение сертификата для просмотра деталей документа.
              </DialogDescription>
              <div className="mt-3 rounded-lg overflow-hidden bg-white/95">
                <img
                  src={CERTIFICATES[lightbox].src}
                  alt={CERTIFICATES[lightbox].alt}
                  className="w-full h-auto object-contain max-h-[min(78vh,1200px)]"
                />
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
