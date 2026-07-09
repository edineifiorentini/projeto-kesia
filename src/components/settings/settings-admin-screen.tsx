import { LockKeyhole, ShieldCheck } from "lucide-react";
import { ModulePage } from "@/components/dashboard/module-page";
import { AppShell } from "@/components/layout/app-shell";
import { BusinessProfileSettingsCard } from "@/components/settings/business-profile-settings-card";
import { IntegrationSettingsPanel } from "@/components/settings/integration-settings-panel";
import { LanguageSettingsCard } from "@/components/settings/language-settings-card";
import { defaultLocale, getDictionary } from "@/lib/i18n/dictionaries";

export function SettingsAdminScreen() {
  const t = getDictionary(defaultLocale);

  return (
    <AppShell t={t} active="settings">
      <div className="space-y-6">
        <ModulePage t={t} moduleKey="settings" />

        <BusinessProfileSettingsCard t={t} />

        <IntegrationSettingsPanel t={t} />

        <section className="grid gap-6 xl:grid-cols-3">
          <LanguageSettingsCard initialLocale={defaultLocale} />

          <article className="rounded-lg bg-white p-4 ring-1 ring-zinc-200">
            <span className="grid size-10 place-items-center rounded-md bg-sky-50 text-sky-700">
              <ShieldCheck className="size-5" aria-hidden="true" />
            </span>
            <h2 className="mt-4 text-base font-semibold text-zinc-950">
              {t.settings.privacyTitle}
            </h2>
            <p className="mt-2 text-sm leading-6 text-zinc-600">
              {t.settings.privacyDescription}
            </p>
          </article>

          <article className="rounded-lg bg-white p-4 ring-1 ring-zinc-200">
            <span className="grid size-10 place-items-center rounded-md bg-amber-50 text-amber-700">
              <LockKeyhole className="size-5" aria-hidden="true" />
            </span>
            <h2 className="mt-4 text-base font-semibold text-zinc-950">
              {t.settings.permissionsTitle}
            </h2>
            <p className="mt-2 text-sm leading-6 text-zinc-600">
              {t.settings.permissionsDescription}
            </p>
          </article>
        </section>
      </div>
    </AppShell>
  );
}
