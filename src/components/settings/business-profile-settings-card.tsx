"use client";

import { useState } from "react";
import { Building2, MapPin, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Dictionary } from "@/lib/i18n/dictionaries";

const defaultBusinessProfile = {
  salonName: "Késia Dutra Cabeleireira",
  responsibleName: "Késia Dutra",
  document: "",
  phone: "",
  whatsapp: "",
  email: "",
  zipCode: "",
  street: "",
  number: "",
  complement: "",
  neighborhood: "",
  city: "",
  state: "",
};

type BusinessProfileField = keyof typeof defaultBusinessProfile;

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-zinc-700">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 h-10 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-950 outline-none focus:border-zinc-950"
      />
    </label>
  );
}

export function BusinessProfileSettingsCard({ t }: { t: Dictionary }) {
  const [profile, setProfile] = useState(defaultBusinessProfile);
  const [saved, setSaved] = useState(false);

  function updateField(field: BusinessProfileField, value: string) {
    setProfile((current) => ({ ...current, [field]: value }));
    setSaved(false);
  }

  return (
    <section className="rounded-lg bg-white p-4 ring-1 ring-zinc-200">
      <div className="flex items-start gap-3">
        <span className="grid size-10 place-items-center rounded-md bg-zinc-950 text-white">
          <Building2 className="size-5" aria-hidden="true" />
        </span>
        <div>
          <h2 className="text-base font-semibold text-zinc-950">
            {t.settings.businessProfileTitle}
          </h2>
          <p className="mt-1 text-sm leading-6 text-zinc-600">
            {t.settings.businessProfileDescription}
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-6">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold text-zinc-900">
            <UserRound className="size-4" aria-hidden="true" />
            {t.settings.fieldGroups.identification}
          </div>
          <div className="mt-3 grid gap-4 md:grid-cols-2">
            <Field
              label={t.settings.fields.salonName}
              value={profile.salonName}
              onChange={(value) => updateField("salonName", value)}
            />
            <Field
              label={t.settings.fields.responsibleName}
              value={profile.responsibleName}
              onChange={(value) => updateField("responsibleName", value)}
            />
            <Field
              label={t.settings.fields.document}
              value={profile.document}
              onChange={(value) => updateField("document", value)}
            />
            <Field
              label={t.settings.fields.email}
              value={profile.email}
              onChange={(value) => updateField("email", value)}
              type="email"
            />
            <Field
              label={t.settings.fields.phone}
              value={profile.phone}
              onChange={(value) => updateField("phone", value)}
              type="tel"
            />
            <Field
              label={t.settings.fields.whatsapp}
              value={profile.whatsapp}
              onChange={(value) => updateField("whatsapp", value)}
              type="tel"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 text-sm font-semibold text-zinc-900">
            <MapPin className="size-4" aria-hidden="true" />
            {t.settings.fieldGroups.address}
          </div>
          <div className="mt-3 grid gap-4 md:grid-cols-6">
            <div className="md:col-span-2">
              <Field
                label={t.settings.fields.zipCode}
                value={profile.zipCode}
                onChange={(value) => updateField("zipCode", value)}
              />
            </div>
            <div className="md:col-span-3">
              <Field
                label={t.settings.fields.street}
                value={profile.street}
                onChange={(value) => updateField("street", value)}
              />
            </div>
            <Field
              label={t.settings.fields.number}
              value={profile.number}
              onChange={(value) => updateField("number", value)}
            />
            <div className="md:col-span-2">
              <Field
                label={t.settings.fields.complement}
                value={profile.complement}
                onChange={(value) => updateField("complement", value)}
              />
            </div>
            <div className="md:col-span-2">
              <Field
                label={t.settings.fields.neighborhood}
                value={profile.neighborhood}
                onChange={(value) => updateField("neighborhood", value)}
              />
            </div>
            <div className="md:col-span-1">
              <Field
                label={t.settings.fields.city}
                value={profile.city}
                onChange={(value) => updateField("city", value)}
              />
            </div>
            <div className="md:col-span-1">
              <Field
                label={t.settings.fields.state}
                value={profile.state}
                onChange={(value) => updateField("state", value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Button type="button" onClick={() => setSaved(true)}>
          {t.settings.saveDraft}
        </Button>
        {saved ? (
          <p className="text-sm font-medium text-emerald-700">
            {t.settings.savedDraft}
          </p>
        ) : null}
      </div>
    </section>
  );
}
