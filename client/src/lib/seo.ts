import { absoluteUrl as siteAbsoluteUrl, DEFAULT_OG_IMAGE_PATH, SITE_URL, YANDEX_METRIKA_ID } from "@/siteConfig";

export type PageSeoOptions = {
  title: string;
  description: string;
  /** Если не задано — берётся title */
  ogTitle?: string;
  /** Если не задано — берётся description */
  ogDescription?: string;
  /** Путь от корня (/...) или полный https://... */
  ogImage?: string;
  /** index,follow | noindex,nofollow */
  robots?: string;
  /** Open Graph: тип контента */
  ogType?: "website" | "article";
};

function ensureMetaName(name: string, content: string) {
  let el = document.querySelector(`meta[name="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("name", name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function ensureMetaProperty(property: string, content: string) {
  let el = document.querySelector(`meta[property="${property}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("property", property);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

/**
 * Полный набор мета для страницы: title, description, OG, Twitter, robots.
 * Вызывать из useEffect на каждой странице после загрузки контента.
 */
export function applyPageSeo(opts: PageSeoOptions) {
  if (typeof document === "undefined") return;

  const ogTitle = opts.ogTitle ?? opts.title;
  const ogDesc = opts.ogDescription ?? opts.description;
  let ogImageUrl: string;
  if (opts.ogImage) {
    ogImageUrl = opts.ogImage.startsWith("http")
      ? opts.ogImage
      : siteAbsoluteUrl(opts.ogImage.startsWith("/") ? opts.ogImage : `/${opts.ogImage}`);
  } else {
    ogImageUrl = siteAbsoluteUrl(DEFAULT_OG_IMAGE_PATH);
  }

  document.title = opts.title;
  ensureMetaName("description", opts.description);

  if (opts.robots) {
    ensureMetaName("robots", opts.robots);
  } else {
    ensureMetaName("robots", "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1");
  }

  ensureMetaProperty("og:type", opts.ogType ?? "website");
  ensureMetaProperty("og:title", ogTitle);
  ensureMetaProperty("og:description", ogDesc);
  ensureMetaProperty("og:image", ogImageUrl);
  ensureMetaProperty("og:site_name", "Экоцентр — Санитарная служба");
  ensureMetaProperty("og:locale", "ru_RU");

  ensureMetaName("twitter:card", "summary_large_image");
  ensureMetaName("twitter:title", ogTitle);
  ensureMetaName("twitter:description", ogDesc);
  ensureMetaName("twitter:image", ogImageUrl);
}

/**
 * Обновляет <title> и <meta name="description"> страницы.
 * @deprecated предпочтительнее applyPageSeo
 */
export function setPageMeta(title: string, description?: string) {
  document.title = title;
  if (description) {
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute("content", description);
    }
  }
}

/**
 * Canonical, og:url и хит Яндекс.Метрики при навигации SPA (без полной перезагрузки).
 * Должен вызываться после applyPageSeo по событию location (см. SpaSeoSync).
 */
export function syncPublicUrlFromLocation() {
  if (typeof window === "undefined") return;

  const { pathname, search } = window.location;
  const base = SITE_URL.replace(/\/$/, "");
  const fullUrl = `${base}${pathname === "/" ? "/" : pathname}${search}`;

  let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    document.head.appendChild(link);
  }
  link.setAttribute("href", fullUrl);

  let ogUrl = document.querySelector('meta[property="og:url"]');
  if (!ogUrl) {
    ogUrl = document.createElement("meta");
    ogUrl.setAttribute("property", "og:url");
    document.head.appendChild(ogUrl);
  }
  ogUrl.setAttribute("content", fullUrl);

  const w = window as Window & { ym?: (...args: unknown[]) => void };
  if (typeof w.ym === "function") {
    try {
      w.ym(YANDEX_METRIKA_ID, "hit", window.location.href, { title: document.title });
    } catch {
      /* ignore */
    }
  }
}
