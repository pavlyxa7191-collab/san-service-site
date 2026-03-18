/**
 * Обновляет <title> и <meta name="description"> страницы.
 * Вызывается из useEffect на каждой странице.
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
