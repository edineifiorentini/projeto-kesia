import { ModulePage } from "@/components/dashboard/module-page";
import { AppShell } from "@/components/layout/app-shell";
import {
  defaultLocale,
  getDictionary,
  type Dictionary,
  type ModuleKey,
} from "@/lib/i18n/dictionaries";

export function AdminModuleScreen({
  moduleKey,
  active,
}: {
  moduleKey: ModuleKey;
  active: keyof Dictionary["nav"];
}) {
  const t = getDictionary(defaultLocale);

  return (
    <AppShell t={t} active={active}>
      <ModulePage t={t} moduleKey={moduleKey} />
    </AppShell>
  );
}
