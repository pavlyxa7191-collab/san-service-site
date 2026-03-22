# SEO — что сделано в проекте

## Технические основы

| Пункт | Реализация |
|-------|------------|
| Канонический домен | `client/src/siteConfig.ts` → `https://ses88.ru` (или `VITE_SITE_URL`) |
| `<title>` и `meta description` | `applyPageSeo()` на каждой публичной странице |
| Canonical + `og:url` при SPA | `syncPublicUrlFromLocation()` в `App.tsx` (`SpaSeoSync`) |
| Open Graph / Twitter Card | Задаются в `applyPageSeo` + дефолты в `index.html` |
| Изображение OG | `/og-image.svg` (public), единое для шаринга |
| Favicon | `/favicon.svg` |
| `robots` index/follow | По умолчанию в `applyPageSeo`; **noindex** — 404, несуществующая статья блога, админка |
| Яндекс.Метрика | `client/index.html` + хит при смене маршрута в SPA |
| `robots.txt` / `sitemap.xml` | Генерация при `vite build` (`vite.config.ts`, `SITEMAP_PATHS`) |

## Структурированные данные (JSON-LD)

- **LocalBusiness** + рейтинг — главная (`SchemaMarkup` без `type`).
- **WebSite** — главная (`type="website"`), связка с организацией.
- **FAQPage** — блок вопросов на главной (`type="faq"`).
- **Service** + **FAQPage** — страницы услуг.
- **BreadcrumbList** — услуги, статьи блога.
- **BlogPosting** — статьи блога (`type="article"`).

## Страница `/services`

Добавлена отдельная посадочная со списком услуг (исправляет битый breadcrumb «Услуги» → 404).

## Что поддерживать вручную

1. **`vite.config.ts` → `SITEMAP_PATHS`** — при добавлении нового публичного маршрута дописать URL.
2. **`publishedISO`** у новых статей в `Blog.tsx`.
3. По желанию заменить **`og-image.svg`** на экспорт 1200×630 px (PNG/JPG) для максимальной совместимости с соцсетями.
4. **Яндекс.Вебмастер / Google Search Console** — подтверждение сайта и отправка `sitemap.xml` (см. `YANDEX_WEBMASTER.md`).

## Проверка после деплоя

- Открыть исходный код главной: есть JSON-LD, мета-теги.
- `https://ses88.ru/robots.txt`, `https://ses88.ru/sitemap.xml`
- [Rich Results Test](https://search.google.com/test/rich-results) / валидатор Яндекса для нескольких URL.
