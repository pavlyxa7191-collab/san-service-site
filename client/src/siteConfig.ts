/**
 * Канонический URL сайта для SEO (schema.org, Open Graph и т.д.).
 * Задаётся в .env как VITE_SITE_URL; по умолчанию — ses88.ru.
 */
export const DEFAULT_SITE_ORIGIN = "https://ses88.ru";

const raw = import.meta.env.VITE_SITE_URL?.trim();
export const SITE_URL = raw ? raw.replace(/\/$/, "") : DEFAULT_SITE_ORIGIN;

/** ID счётчика Яндекс.Метрики (client/index.html) */
export const YANDEX_METRIKA_ID = 108200352;

/** Картинка по умолчанию для Open Graph / соцсетей (лежит в public/) */
export const DEFAULT_OG_IMAGE_PATH = "/og-image.svg";

export function absoluteUrl(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${p}`;
}
