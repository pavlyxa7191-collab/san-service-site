declare global {
  interface Window {
    KV?: {
      sendForm: (data: FormData) => void;
    };
  }
}

export function notifyKvbot(fields: Record<string, string | undefined | null>) {
  if (typeof window === "undefined") return;
  const kv = window.KV;
  if (!kv || typeof kv.sendForm !== "function") return;
  try {
    const fd = new FormData();
    for (const [k, v] of Object.entries(fields)) {
      if (v != null && String(v).trim() !== "") fd.append(k, String(v));
    }
    kv.sendForm(fd);
  } catch {
    /* kvbot script offline — silently ignore */
  }
}
