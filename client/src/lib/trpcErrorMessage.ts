/** Сообщение об ошибке из tRPC / fetch для тостов (безопасно для unknown). */
export function getTrpcMutationErrorMessage(err: unknown): string {
  if (err instanceof Error && err.message) return err.message;
  if (typeof err === "object" && err !== null && "message" in err) {
    const m = (err as { message?: unknown }).message;
    if (typeof m === "string" && m.length > 0) return m;
  }
  return "";
}
