/**
 * Скриншоты отзывов с площадки объявлений (реальные изображения в public/reviews/).
 */
export const REVIEW_SCREENSHOTS = [
  { src: "/reviews/review-01.png", alt: "Отзывы клиентов — скриншот 1" },
  { src: "/reviews/review-02.png", alt: "Отзывы клиентов — скриншот 2" },
  { src: "/reviews/review-03.png", alt: "Отзывы клиентов — скриншот 3" },
  { src: "/reviews/review-04.png", alt: "Отзывы клиентов — скриншот 4" },
  { src: "/reviews/review-05.png", alt: "Отзывы клиентов — скриншот 5" },
  { src: "/reviews/review-06.png", alt: "Отзывы клиентов — скриншот 6" },
] as const;

export type ReviewScreenshot = (typeof REVIEW_SCREENSHOTS)[number];
