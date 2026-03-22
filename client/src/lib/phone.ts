/**
 * Маска и проверка российского номера в формате +7 (XXX) XXX-XX-XX.
 */

/** Форматирует ввод как +7 (XXX) XXX-XX-XX. */
export function formatRuPhoneInput(raw: string): string {
  let v = raw.replace(/\D/g, "");
  if (v.startsWith("8")) v = "7" + v.slice(1);
  if (v.startsWith("7")) v = v.slice(1);
  v = v.slice(0, 10);
  let f = "+7 (";
  if (v.length > 0) f += v.slice(0, 3);
  if (v.length >= 3) f += ") " + v.slice(3, 6);
  if (v.length >= 6) f += "-" + v.slice(6, 8);
  if (v.length >= 8) f += "-" + v.slice(8, 10);
  return f;
}

/** Полный номер: код страны 7 и 10 цифр абонента (всего 11 цифр в строке). */
export function isCompleteRuPhone(formatted: string): boolean {
  return formatted.replace(/\D/g, "").length >= 11;
}
