/**
 * Маска и проверка российского номера в формате +7 (XXX) XXX-XX-XX.
 */

/** Подсказка в поле, пока номер не введён (видна только при пустом value). */
export const RU_PHONE_PLACEHOLDER = "+7 (___) ___-__-__";

/** Форматирует ввод как +7 (XXX) XXX-XX-XX. Без цифр абонента возвращает "" — чтобы был виден placeholder и можно было стереть номер. */
export function formatRuPhoneInput(raw: string): string {
  let v = raw.replace(/\D/g, "");
  if (v.startsWith("8")) v = "7" + v.slice(1);
  if (v.startsWith("7")) v = v.slice(1);
  v = v.slice(0, 10);
  if (v.length === 0) return "";
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

/** Сколько цифр абонента (без ведущей 7 кода страны) находится слева от позиции курсора. */
export function nationalDigitsBeforeCursor(raw: string, caret: number): number {
  const sub = raw.slice(0, caret);
  let v = sub.replace(/\D/g, "");
  if (v.startsWith("8")) v = "7" + v.slice(1);
  if (v.startsWith("7")) v = v.slice(1);
  return v.length;
}

/**
 * Позиция курсора в отформатированной строке после того же количества цифр абонента.
 * Первая цифра в строке (+7…) — код страны, в счёт абонента не идёт.
 */
export function caretFromNationalCount(formatted: string, nationalDigits: number): number {
  if (!formatted) return 0;
  if (nationalDigits <= 0) {
    // Курсор был в зоне «+7 (» — ставим перед первой цифрой абонента, а не в начало «+»
    let skippedCountry = false;
    for (let i = 0; i < formatted.length; i++) {
      const c = formatted[i];
      if (c < "0" || c > "9") continue;
      if (!skippedCountry) {
        skippedCountry = true;
        continue;
      }
      return i;
    }
    return formatted.length;
  }
  let nationalSeen = 0;
  let skippedCountry = false;
  for (let i = 0; i < formatted.length; i++) {
    const c = formatted[i];
    if (c < "0" || c > "9") continue;
    if (!skippedCountry) {
      skippedCountry = true;
      continue;
    }
    nationalSeen++;
    if (nationalSeen >= nationalDigits) return i + 1;
  }
  return formatted.length;
}
