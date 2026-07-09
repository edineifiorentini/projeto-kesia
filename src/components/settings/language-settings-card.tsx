"use client";

import { useState } from "react";
import { Languages } from "lucide-react";
import {
  dictionaries,
  locales,
  type AppLocale,
} from "@/lib/i18n/dictionaries";

export function LanguageSettingsCard({
  initialLocale,
}: {
  initialLocale: AppLocale;
}) {
  const [locale, setLocale] = useState<AppLocale>(initialLocale);
  const t = dictionaries[locale];

  return (
    <section className="rounded-lg bg-white p-4 ring-1 ring-zinc-200">
      <div className="flex items-start gap-3">
        <span className="grid size-10 place-items-center rounded-md bg-emerald-50 text-emerald-700">
          <Languages className="size-5" aria-hidden="true" />
        </span>
        <div>
          <h2 className="text-base font-semibold text-zinc-950">
            {t.settings.languageTitle}
          </h2>
          <p className="mt-1 text-sm leading-6 text-zinc-600">
            {t.settings.languageDescription}
          </p>
        </div>
      </div>

      <label className="mt-5 block text-sm font-medium text-zinc-700">
        {t.settings.selectedLanguage}
      </label>
      <select
        value={locale}
        onChange={(event) => setLocale(event.target.value as AppLocale)}
        className="mt-2 h-10 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-950 outline-none focus:border-zinc-950"
      >
        {locales.map((localeOption) => (
          <option key={localeOption} value={localeOption}>
            {t.common.localeNames[localeOption]}
          </option>
        ))}
      </select>

      <div className="mt-5 rounded-lg bg-zinc-50 p-4">
        <p className="text-sm font-medium text-zinc-900">{t.settings.previewTitle}</p>
        <p className="mt-2 text-sm text-zinc-600">{t.dashboard.description}</p>
      </div>
    </section>
  );
}
