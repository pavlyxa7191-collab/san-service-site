/** Сообщение об ошибке из tRPC / fetch для тостов (безопасно для unknown). */
export function getTrpcMutationErrorMessage(err: unknown): string {
  if (typeof err === "object" && err !== null && "message" in err) {
    const m = (err as { message?: unknown }).message;
    if (typeof m === "string" && m.length > 0) return m;
  }
  if (typeof err === "string" && err.length > 0) return err;
  return "";
}
