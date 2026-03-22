import { useState } from "react";
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

const NAVY = "#0A0F1E";
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

export default function CertificatesCarousel() {
  const [lightbox, setLightbox] = useState<number | null>(null);

  return (
    <>
      <section
        aria-labelledby="certificates-heading"
        style={{
          background: NAVY,
          borderTop: "1px solid rgba(255,255,255,0.08)",
          padding: "clamp(2.5rem, 6vw, 4rem) 0",
        }}
      >
        <div className="container" style={{ maxWidth: 1200, margin: "0 auto", padding: "0 1rem" }}>
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

          <div className="cert-carousel-wrap" style={{ position: "relative", padding: "0 0.25rem" }}>
            <Carousel
              opts={{
                align: "start",
                loop: true,
                dragFree: false,
              }}
              className="w-full mx-auto"
            >
              <CarouselContent className="-ml-2 sm:-ml-3 md:-ml-4">
                {CERTIFICATES.map((c, i) => (
                  <CarouselItem
                    key={c.src}
                    className="pl-2 sm:pl-3 md:pl-4 basis-[88%] sm:basis-[48%] lg:basis-[32%] xl:basis-1/4"
                  >
                    <button
                      type="button"
                      onClick={() => setLightbox(i)}
                      className="cert-card group w-full text-left rounded-xl overflow-hidden border border-white/10 bg-white/[0.04] transition-all duration-200 hover:border-red-500/40 hover:bg-white/[0.07] focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0F1E]"
                      style={{ cursor: "pointer" }}
                    >
                      <div
                        className="relative w-full overflow-hidden bg-white/90"
                        style={{ aspectRatio: "3 / 4", maxHeight: 420 }}
                      >
                        <img
                          src={c.src}
                          alt={c.alt}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-contain object-center p-2 sm:p-3 transition-transform duration-300 group-hover:scale-[1.02]"
                        />
                      </div>
                      <div style={{ padding: "0.65rem 0.85rem 0.85rem" }}>
                        <span
                          style={{
                            fontSize: "0.72rem",
                            fontWeight: 700,
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",
                            color: RED,
                          }}
                        >
                          {c.title}
                        </span>
                        <div
                          style={{
                            marginTop: 4,
                            fontSize: "0.78rem",
                            color: "rgba(255,255,255,0.45)",
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
                className="hidden sm:flex border-white/25 bg-[#0A0F1E]/95 text-white hover:bg-white/10 hover:text-white left-0 sm:left-1 md:left-2 size-9 md:size-10 shadow-lg"
                variant="outline"
              />
              <CarouselNext
                className="hidden sm:flex border-white/25 bg-[#0A0F1E]/95 text-white hover:bg-white/10 hover:text-white right-0 sm:right-1 md:right-2 size-9 md:size-10 shadow-lg"
                variant="outline"
              />
            </Carousel>

            {/* Подсказка для мобильных: свайп */}
            <p
              className="sm:hidden text-center"
              style={{
                marginTop: "1rem",
                fontSize: "0.75rem",
                color: "rgba(255,255,255,0.35)",
              }}
            >
              Свайпните влево / вправо, чтобы посмотреть все сертификаты
            </p>
          </div>
        </div>
      </section>

      <Dialog open={lightbox !== null} onOpenChange={(o) => !o && setLightbox(null)}>
        <DialogContent className="max-w-[min(96vw,900px)] max-h-[92vh] overflow-y-auto border-white/10 bg-[#0d1528] p-3 sm:p-6">
          {lightbox !== null && (
            <>
              <DialogTitle className="text-white text-base sm:text-lg font-bold pr-8">
                {CERTIFICATES[lightbox].alt}
              </DialogTitle>
              <DialogDescription className="sr-only">
                Увеличенное изображение сертификата для просмотра деталей документа.
              </DialogDescription>
              <div className="mt-3 rounded-lg overflow-hidden bg-white">
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
