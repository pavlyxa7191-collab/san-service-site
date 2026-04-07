import { YANDEX_METRIKA_ID } from "@/siteConfig";

declare global {
  interface Window {
    ym?: (id: number, method: string, ...args: unknown[]) => void;
  }
}

export function reachGoal(goal: string, params?: Record<string, unknown>) {
  if (typeof window !== "undefined" && typeof window.ym === "function") {
    window.ym(YANDEX_METRIKA_ID, "reachGoal", goal, params);
  }
}

let linkTrackingInitialized = false;

export function initLinkTracking() {
  if (linkTrackingInitialized || typeof document === "undefined") return;
  linkTrackingInitialized = true;

  document.addEventListener("click", (e) => {
    const anchor = (e.target as HTMLElement).closest?.("a[href]") as HTMLAnchorElement | null;
    if (!anchor) return;
    const href = anchor.getAttribute("href") || "";
    if (href.startsWith("tel:")) {
      reachGoal("phone_click");
    } else if (href.includes("wa.me") || href.includes("whatsapp")) {
      reachGoal("whatsapp_click");
    } else if (href.includes("t.me/")) {
      reachGoal("telegram_click");
    }
  });
}
