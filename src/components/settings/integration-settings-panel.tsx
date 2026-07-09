"use client";

import { useState } from "react";
import Image from "next/image";
import {
  CalendarDays,
  CreditCard,
  KeyRound,
  Loader2,
  MessageCircle,
  QrCode,
  RefreshCw,
  Server,
  Wifi,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type IntegrationState = Record<string, string>;
type WuzApiAction = "instance" | "connect" | "qrcode" | "new-qrcode" | "status";
type WuzApiStatus = {
  Connected?: boolean;
  LoggedIn?: boolean;
  connected?: boolean;
  loggedIn?: boolean;
} | null;

const initialState: IntegrationState = {
  mercadoPagoAccessToken: "",
  mercadoPagoPublicKey: "",
  mercadoPagoWebhookSecret: "",
  googleClientId: "",
  googleClientSecret: "",
  googleCalendarId: "primary",
  wuzApiBaseUrl: "http://localhost:8080",
  wuzApiInstanceName: "kesia-dutra-cabeleireira",
  wuzApiAdminToken: "change-me-admin-token",
  wuzApiSessionToken: "kesia-dutra-whatsapp-session-token",
  wuzApiWebhookSecret: "change-me-wuzapi-webhook-secret-32chars",
};

function SecretField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-zinc-700">{label}</span>
      <input
        type="password"
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 h-10 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-950 outline-none focus:border-zinc-950"
      />
    </label>
  );
}

function TextField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-zinc-700">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 h-10 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-950 outline-none focus:border-zinc-950"
      />
    </label>
  );
}

function StatusPill({
  configured,
  t,
}: {
  configured: boolean;
  t: Dictionary;
}) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${
        configured
          ? "bg-emerald-50 text-emerald-700 ring-emerald-100"
          : "bg-amber-50 text-amber-700 ring-amber-100"
      }`}
    >
      {configured ? t.settings.integrations.configured : t.settings.integrations.pending}
    </span>
  );
}

export function IntegrationSettingsPanel({ t }: { t: Dictionary }) {
  const [values, setValues] = useState(initialState);
  const [wuzApiAction, setWuzApiAction] = useState<WuzApiAction | null>(null);
  const [wuzApiStatus, setWuzApiStatus] = useState<WuzApiStatus>(null);
  const [wuzApiQrCode, setWuzApiQrCode] = useState<string | null>(null);
  const [wuzApiMessage, setWuzApiMessage] = useState<string | null>(null);

  function updateField(field: string, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  const mercadoPagoConfigured =
    values.mercadoPagoAccessToken.length > 0 && values.mercadoPagoPublicKey.length > 0;
  const googleConfigured =
    values.googleClientId.length > 0 && values.googleClientSecret.length > 0;
  const wuzApiConfigured =
    values.wuzApiBaseUrl.length > 0 &&
    values.wuzApiAdminToken.length > 0 &&
    values.wuzApiSessionToken.length > 0;
  const wuzApiConnected = Boolean(wuzApiStatus?.Connected ?? wuzApiStatus?.connected);
  const wuzApiLoggedIn = Boolean(wuzApiStatus?.LoggedIn ?? wuzApiStatus?.loggedIn);

  async function runWuzApiAction(
    action: WuzApiAction,
    request: () => Promise<Response>,
  ) {
    setWuzApiAction(action);
    setWuzApiMessage(null);

    try {
      const response = await request();
      const data = (await response.json()) as {
        created?: boolean;
        qrCode?: string | null;
        status?: WuzApiStatus;
        message?: string;
        error?: string;
      };

      if (!response.ok) {
        throw new Error(data.message ?? data.error ?? "Falha na WuzAPI.");
      }

      if (data.status !== undefined) {
        setWuzApiStatus(data.status);
      }

      if (data.qrCode !== undefined) {
        setWuzApiQrCode(data.qrCode);
      }

      const messages: Record<WuzApiAction, string> = {
        instance: data.created
          ? "Instância criada com as configurações padrão."
          : "Instância padrão já existe e foi sincronizada.",
        connect: "Conexão iniciada. Se ainda não estiver logado, solicite o QR Code.",
        qrcode: data.qrCode
          ? "QR Code gerado. Leia pelo WhatsApp do salão."
          : "Sessão já conectada ou QR Code indisponível no momento.",
        "new-qrcode": data.qrCode
          ? "Novo QR Code gerado. Leia pelo WhatsApp do salão."
          : "Novo QR Code solicitado, mas a WuzAPI ainda não retornou a imagem.",
        status: "Status atualizado.",
      };

      setWuzApiMessage(messages[action]);
    } catch (error) {
      setWuzApiMessage(
        error instanceof Error ? error.message : "Não foi possível falar com a WuzAPI.",
      );
    } finally {
      setWuzApiAction(null);
    }
  }

  return (
    <section className="rounded-lg bg-white p-4 ring-1 ring-zinc-200">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-zinc-950">
            {t.settings.integrationTitle}
          </h2>
          <p className="mt-1 text-sm leading-6 text-zinc-600">
            {t.settings.integrationDescription}
          </p>
        </div>
        <span className="grid size-10 place-items-center rounded-md bg-zinc-950 text-white">
          <KeyRound className="size-5" aria-hidden="true" />
        </span>
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-3">
        <article className="rounded-lg bg-zinc-50 p-4 ring-1 ring-zinc-100">
          <div className="flex items-start justify-between gap-3">
            <span className="grid size-10 place-items-center rounded-md bg-white text-zinc-800 ring-1 ring-zinc-200">
              <CreditCard className="size-5" aria-hidden="true" />
            </span>
            <StatusPill configured={mercadoPagoConfigured} t={t} />
          </div>
          <h3 className="mt-4 text-sm font-semibold text-zinc-950">
            {t.settings.integrations.mercadoPagoTitle}
          </h3>
          <p className="mt-2 text-sm leading-6 text-zinc-600">
            {t.settings.integrations.mercadoPagoDescription}
          </p>
          <div className="mt-4 space-y-3">
            <SecretField
              label={t.settings.fields.mercadoPagoAccessToken}
              value={values.mercadoPagoAccessToken}
              placeholder="APP_USR-..."
              onChange={(value) => updateField("mercadoPagoAccessToken", value)}
            />
            <SecretField
              label={t.settings.fields.mercadoPagoPublicKey}
              value={values.mercadoPagoPublicKey}
              placeholder="APP_USR-..."
              onChange={(value) => updateField("mercadoPagoPublicKey", value)}
            />
            <SecretField
              label={t.settings.fields.mercadoPagoWebhookSecret}
              value={values.mercadoPagoWebhookSecret}
              onChange={(value) => updateField("mercadoPagoWebhookSecret", value)}
            />
          </div>
        </article>

        <article className="rounded-lg bg-zinc-50 p-4 ring-1 ring-zinc-100">
          <div className="flex items-start justify-between gap-3">
            <span className="grid size-10 place-items-center rounded-md bg-white text-zinc-800 ring-1 ring-zinc-200">
              <CalendarDays className="size-5" aria-hidden="true" />
            </span>
            <StatusPill configured={googleConfigured} t={t} />
          </div>
          <h3 className="mt-4 text-sm font-semibold text-zinc-950">
            {t.settings.integrations.googleCalendarTitle}
          </h3>
          <p className="mt-2 text-sm leading-6 text-zinc-600">
            {t.settings.integrations.googleCalendarDescription}
          </p>
          <div className="mt-4 space-y-3">
            <SecretField
              label={t.settings.fields.googleClientId}
              value={values.googleClientId}
              onChange={(value) => updateField("googleClientId", value)}
            />
            <SecretField
              label={t.settings.fields.googleClientSecret}
              value={values.googleClientSecret}
              onChange={(value) => updateField("googleClientSecret", value)}
            />
            <TextField
              label={t.settings.fields.googleCalendarId}
              value={values.googleCalendarId}
              onChange={(value) => updateField("googleCalendarId", value)}
            />
          </div>
        </article>

        <article className="rounded-lg bg-zinc-50 p-4 ring-1 ring-zinc-100">
          <div className="flex items-start justify-between gap-3">
            <span className="grid size-10 place-items-center rounded-md bg-white text-zinc-800 ring-1 ring-zinc-200">
              <MessageCircle className="size-5" aria-hidden="true" />
            </span>
            <StatusPill configured={wuzApiConfigured} t={t} />
          </div>
          <h3 className="mt-4 text-sm font-semibold text-zinc-950">
            {t.settings.integrations.wuzApiTitle}
          </h3>
          <p className="mt-2 text-sm leading-6 text-zinc-600">
            {t.settings.integrations.wuzApiDescription}
          </p>
          <div className="mt-4 space-y-3">
            <TextField
              label={t.settings.fields.wuzApiBaseUrl}
              value={values.wuzApiBaseUrl}
              onChange={(value) => updateField("wuzApiBaseUrl", value)}
            />
            <TextField
              label="Nome da instância"
              value={values.wuzApiInstanceName}
              onChange={(value) => updateField("wuzApiInstanceName", value)}
            />
            <SecretField
              label={t.settings.fields.wuzApiAdminToken}
              value={values.wuzApiAdminToken}
              onChange={(value) => updateField("wuzApiAdminToken", value)}
            />
            <SecretField
              label={t.settings.fields.wuzApiSessionToken}
              value={values.wuzApiSessionToken}
              onChange={(value) => updateField("wuzApiSessionToken", value)}
            />
            <SecretField
              label={t.settings.fields.wuzApiWebhookSecret}
              value={values.wuzApiWebhookSecret}
              onChange={(value) => updateField("wuzApiWebhookSecret", value)}
            />
          </div>

          <div className="mt-4 rounded-lg bg-white p-3 ring-1 ring-zinc-200">
            <div className="flex flex-wrap items-center gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() =>
                  runWuzApiAction("instance", () =>
                    fetch("/api/integrations/wuzapi/instance", { method: "POST" }),
                  )
                }
                disabled={wuzApiAction !== null}
              >
                {wuzApiAction === "instance" ? (
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                ) : (
                  <Server className="size-4" aria-hidden="true" />
                )}
                Criar instância
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() =>
                  runWuzApiAction("connect", () =>
                    fetch("/api/integrations/wuzapi/connect", { method: "POST" }),
                  )
                }
                disabled={wuzApiAction !== null}
              >
                {wuzApiAction === "connect" ? (
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                ) : (
                  <Wifi className="size-4" aria-hidden="true" />
                )}
                Conectar
              </Button>
              <Button
                type="button"
                onClick={() =>
                  runWuzApiAction("qrcode", () =>
                    fetch("/api/integrations/wuzapi/qrcode", { method: "GET" }),
                  )
                }
                disabled={wuzApiAction !== null}
              >
                {wuzApiAction === "qrcode" ? (
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                ) : (
                  <QrCode className="size-4" aria-hidden="true" />
                )}
                Gerar QR Code
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() =>
                  runWuzApiAction("new-qrcode", () =>
                    fetch("/api/integrations/wuzapi/qrcode", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ forceNew: true }),
                    }),
                  )
                }
                disabled={wuzApiAction !== null}
              >
                {wuzApiAction === "new-qrcode" ? (
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                ) : (
                  <RefreshCw className="size-4" aria-hidden="true" />
                )}
                Novo QR Code
              </Button>
            </div>

            <button
              type="button"
              onClick={() =>
                runWuzApiAction("status", () =>
                  fetch("/api/integrations/wuzapi/instance", { method: "GET" }),
                )
              }
              className="mt-3 text-sm font-medium text-zinc-700 underline-offset-4 hover:underline"
              disabled={wuzApiAction !== null}
            >
              Atualizar status
            </button>

            <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-start">
              <div className="rounded-md bg-zinc-50 p-3 text-sm text-zinc-700">
                <p>
                  Status:{" "}
                  <span className="font-medium text-zinc-950">
                    {wuzApiLoggedIn
                      ? "WhatsApp logado"
                      : wuzApiConnected
                        ? "Aguardando leitura do QR Code"
                        : "Não conectado"}
                  </span>
                </p>
                {wuzApiMessage ? (
                  <p className="mt-2 text-zinc-600">{wuzApiMessage}</p>
                ) : null}
                <p className="mt-2 text-xs leading-5 text-zinc-500">
                  As ações usam as variáveis salvas no `.env`. Se o QR Code
                  expirar, clique em Novo QR Code para encerrar a sessão atual e
                  gerar outra leitura.
                </p>
              </div>

              {wuzApiQrCode ? (
                <div className="rounded-lg bg-white p-3 text-center ring-1 ring-zinc-200">
                  <Image
                    src={wuzApiQrCode}
                    alt="QR Code de conexão do WhatsApp"
                    width={180}
                    height={180}
                    unoptimized
                    className="mx-auto rounded-md"
                  />
                  <p className="mt-2 text-xs text-zinc-500">
                    WhatsApp &gt; Aparelhos conectados
                  </p>
                </div>
              ) : null}
            </div>
          </div>
        </article>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <Button type="button" variant="secondary">
          <Server className="size-4" aria-hidden="true" />
          {t.settings.integrations.testConnection}
        </Button>
        <Button type="button">{t.settings.saveDraft}</Button>
      </div>
    </section>
  );
}
