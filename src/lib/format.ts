import type { AppLocale } from "./i18n/dictionaries";

export function formatMoney(cents: number, locale: AppLocale = "pt-BR") {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "BRL",
  }).format(cents / 100);
}

export function formatPercent(value: number, locale: AppLocale = "pt-BR") {
  return new Intl.NumberFormat(locale, {
    style: "percent",
    maximumFractionDigits: 0,
  }).format(value / 100);
}

export function formatTime(date: Date, locale: AppLocale = "pt-BR") {
  return new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "America/Sao_Paulo",
  }).format(date);
}
