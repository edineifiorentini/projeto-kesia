import Link from "next/link";
import { redirect } from "next/navigation";
import { Scissors, ShieldCheck } from "lucide-react";
import { LoginForm } from "@/components/auth/login-form";
import { defaultLocale, getDictionary } from "@/lib/i18n/dictionaries";
import { getCurrentSession } from "@/lib/auth/session";

export default async function LoginPage() {
  const session = await getCurrentSession();

  if (session) {
    redirect("/admin");
  }

  const t = getDictionary(defaultLocale);

  return (
    <main className="min-h-screen bg-[#f6f4ef] px-4 py-8 text-zinc-950">
      <section className="mx-auto grid min-h-[calc(100vh-64px)] max-w-6xl items-center gap-8 lg:grid-cols-[minmax(0,1fr)_420px]">
        <div className="max-w-2xl">
          <Link href="/" className="inline-flex items-center gap-3 text-sm font-medium">
            <span className="grid size-10 place-items-center rounded-lg bg-zinc-950 text-white">
              <Scissors className="size-5" aria-hidden="true" />
            </span>
            {t.common.appName}
          </Link>
          <h1 className="mt-10 text-4xl font-semibold tracking-normal sm:text-5xl">
            Área administrativa protegida
          </h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-zinc-600">
            Entre para acessar agenda, clientes, comandas, financeiro, integrações e
            configurações do salão.
          </p>
          <div className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm text-zinc-700 ring-1 ring-zinc-200">
            <ShieldCheck className="size-4 text-emerald-600" aria-hidden="true" />
            Sessão segura por cookie HTTP-only
          </div>
        </div>

        <article className="rounded-lg bg-white p-6 ring-1 ring-zinc-200">
          <h2 className="text-2xl font-semibold tracking-normal">
            {t.auth.loginTitle}
          </h2>
          <p className="mt-2 text-sm leading-6 text-zinc-600">
            Use seu e-mail administrativo para acessar o painel.
          </p>
          <LoginForm
            emailLabel={t.auth.email}
            passwordLabel={t.auth.password}
            submitLabel={t.auth.submit}
            invalidCredentialsLabel={t.auth.invalidCredentials}
          />
          <p className="mt-5 text-xs leading-5 text-zinc-500">{t.auth.demoHint}</p>
        </article>
      </section>
    </main>
  );
}
