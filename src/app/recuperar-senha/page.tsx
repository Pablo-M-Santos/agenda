"use client";

import { FormEvent, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Loader2,
  Mail,
  ShieldCheck,
  Lock,
  Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";

type Step = "email" | "code" | "password";

export default function RecoverPasswordPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<Step>("email");
  const [error, setError] = useState("");

  async function handleRequestCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (loading) return;

    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/request-password-reset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error(
            data.error ||
              "Muitas tentativas. Aguarde alguns minutos e tente novamente.",
          );
        }

        throw new Error(data.error || "Erro ao solicitar recuperação.");
      }

      setStep("code");
    } catch (error) {
      console.error("Erro ao enviar recuperação:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Não foi possível enviar o código de recuperação.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (loading) return;

    setError("");

    if (code.length !== 6) {
      setError("Digite o código de 6 dígitos enviado para seu e-mail.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/verify-password-reset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          code,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Código inválido.");
      }

      setStep("password");
    } catch (error) {
      console.error("Erro ao verificar código:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Não foi possível verificar o código.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleChangePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (loading) return;

    setError("");

    if (password.length < 6) {
      setError("A senha deve possuir pelo menos 6 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          newPassword: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao redefinir senha.");
      }

      setCode("");
      setPassword("");
      setConfirmPassword("");
      setEmail("");
      router.replace("/login");
    } catch (error) {
      console.error("Erro ao redefinir senha:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Não foi possível redefinir sua senha.",
      );
    } finally {
      setLoading(false);
    }
  }

  function handleBack() {
    setError("");

    if (step === "code") {
      setStep("email");
      return;
    }

    if (step === "password") {
      setStep("code");
      return;
    }

    router.push("/login");
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#030507] px-4 py-8">
      {/* Background */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        {/* Glow principal */}
        <div className="absolute left-1/2 top-1/2 h-[650px] w-[650px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/[0.07] blur-[150px]" />

        {/* Glow superior */}
        <div className="absolute -left-20 -top-20 h-80 w-80 rounded-full bg-cyan-400/[0.035] blur-[120px]" />

        {/* Glow inferior */}
        <div className="absolute -bottom-32 -right-20 h-96 w-96 rounded-full bg-blue-500/[0.025] blur-[140px]" />

        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.018]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-[460px]">
        {/* ================= LOGO ================= */}
        <div className="mb-7 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-400/15 bg-blue-500/[0.08] shadow-[0_0_50px_rgba(37,99,235,0.10)]">
            <Zap className="h-7 w-7 fill-blue-400 text-blue-400" />
          </div>

          <h1 className="text-2xl font-semibold tracking-tight text-white">
            AGENDA
          </h1>

          <p className="mt-1.5 text-sm text-slate-500">
            Sua agenda, organizada.
          </p>
        </div>

        {/* ================= CARD ================= */}
        <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0B0F14]/95 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl">
          <div className="p-6 sm:p-8">
            {/* ================= STEPPER ================= */}
            <div className="mb-8">
              <div className="flex items-center">
                {/* Step 1 */}
                <div className="flex items-center">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full border text-xs font-semibold transition-all ${
                      step === "email"
                        ? "border-blue-400/40 bg-blue-500/15 text-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.12)]"
                        : "border-blue-500/30 bg-blue-500/10 text-blue-400"
                    }`}
                  >
                    1
                  </div>

                  <span
                    className={`ml-2 hidden text-xs font-medium sm:block ${
                      step === "email" ? "text-slate-200" : "text-slate-500"
                    }`}
                  >
                    E-mail
                  </span>
                </div>

                {/* Connector */}
                <div
                  className={`mx-3 h-px flex-1 transition-colors ${
                    step !== "email" ? "bg-blue-500/30" : "bg-white/[0.07]"
                  }`}
                />

                {/* Step 2 */}
                <div className="flex items-center">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full border text-xs font-semibold transition-all ${
                      step === "code"
                        ? "border-blue-400/40 bg-blue-500/15 text-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.12)]"
                        : step === "password"
                          ? "border-blue-500/30 bg-blue-500/10 text-blue-400"
                          : "border-white/[0.08] bg-white/[0.02] text-slate-600"
                    }`}
                  >
                    2
                  </div>

                  <span
                    className={`ml-2 hidden text-xs font-medium sm:block ${
                      step === "code" ? "text-slate-200" : "text-slate-500"
                    }`}
                  >
                    Verificação
                  </span>
                </div>

                {/* Connector */}
                <div
                  className={`mx-3 h-px flex-1 transition-colors ${
                    step === "password" ? "bg-blue-500/30" : "bg-white/[0.07]"
                  }`}
                />

                {/* Step 3 */}
                <div className="flex items-center">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full border text-xs font-semibold transition-all ${
                      step === "password"
                        ? "border-blue-400/40 bg-blue-500/15 text-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.12)]"
                        : "border-white/[0.08] bg-white/[0.02] text-slate-600"
                    }`}
                  >
                    3
                  </div>

                  <span
                    className={`ml-2 hidden text-xs font-medium sm:block ${
                      step === "password" ? "text-slate-200" : "text-slate-500"
                    }`}
                  >
                    Nova senha
                  </span>
                </div>
              </div>
            </div>

            {/* ================= EMAIL ================= */}
            {step === "email" && (
              <>
                <div className="mb-7">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-blue-400/10 bg-blue-500/[0.08]">
                    <Mail className="h-5 w-5 text-blue-400" />
                  </div>

                  <h2 className="text-xl font-semibold tracking-tight text-white">
                    Recuperar senha
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Informe seu e-mail e enviaremos um código de 6 dígitos para
                    recuperar sua senha.
                  </p>
                </div>

                <form onSubmit={handleRequestCode} className="space-y-5">
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-xs font-medium uppercase tracking-wide text-slate-400"
                    >
                      E-mail
                    </label>

                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="seu@email.com"
                      autoComplete="email"
                      autoFocus
                      required
                      disabled={loading}
                      className="h-12 w-full rounded-xl border border-white/[0.07] bg-[#070A0E] px-4 text-sm text-white outline-none transition-all placeholder:text-slate-700 hover:border-white/[0.11] focus:border-blue-500/40 focus:bg-[#080C11] focus:ring-4 focus:ring-blue-500/[0.08] disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>

                  {error && (
                    <div
                      role="alert"
                      className="rounded-xl border border-red-500/15 bg-red-500/[0.05] px-4 py-3 text-sm leading-5 text-red-400"
                    >
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-[0_8px_30px_rgba(37,99,235,0.15)] transition-all hover:bg-blue-500 hover:shadow-[0_8px_35px_rgba(37,99,235,0.22)] focus:outline-none focus:ring-4 focus:ring-blue-500/15 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        Enviar código
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                      </>
                    )}
                  </button>
                </form>
              </>
            )}

            {/* ================= CODE ================= */}
            {step === "code" && (
              <>
                <div className="mb-7">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-blue-400/10 bg-blue-500/[0.08]">
                    <ShieldCheck className="h-5 w-5 text-blue-400" />
                  </div>

                  <h2 className="text-xl font-semibold tracking-tight text-white">
                    Verificar código
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Enviamos um código de 6 dígitos para:
                  </p>

                  <div className="mt-3 rounded-lg border border-white/[0.05] bg-white/[0.02] px-3 py-2">
                    <p className="break-all text-sm font-medium text-blue-400">
                      {email}
                    </p>
                  </div>
                </div>

                <form onSubmit={handleVerifyCode} className="space-y-5">
                  <div>
                    <label
                      htmlFor="code"
                      className="mb-2 block text-xs font-medium uppercase tracking-wide text-slate-400"
                    >
                      Código de verificação
                    </label>

                    <input
                      id="code"
                      name="code"
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={code}
                      onChange={(event) =>
                        setCode(event.target.value.replace(/\D/g, ""))
                      }
                      placeholder="000000"
                      autoFocus
                      required
                      disabled={loading}
                      className="h-14 w-full rounded-xl border border-white/[0.07] bg-[#070A0E] px-4 text-center text-2xl font-semibold tracking-[0.55em] text-white outline-none transition-all placeholder:text-slate-700 hover:border-white/[0.11] focus:border-blue-500/40 focus:ring-4 focus:ring-blue-500/[0.08] disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>

                  {error && (
                    <div
                      role="alert"
                      className="rounded-xl border border-red-500/15 bg-red-500/[0.05] px-4 py-3 text-sm leading-5 text-red-400"
                    >
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading || code.length !== 6}
                    className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white transition-all hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Verificando...
                      </>
                    ) : (
                      <>
                        Verificar código
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                      </>
                    )}
                  </button>
                </form>
              </>
            )}

            {/* ================= PASSWORD ================= */}
            {step === "password" && (
              <>
                <div className="mb-7">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-blue-400/10 bg-blue-500/[0.08]">
                    <Lock className="h-5 w-5 text-blue-400" />
                  </div>

                  <h2 className="text-xl font-semibold tracking-tight text-white">
                    Nova senha
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Defina uma nova senha para acessar sua conta.
                  </p>
                </div>

                <form onSubmit={handleChangePassword} className="space-y-5">
                  <div>
                    <label
                      htmlFor="password"
                      className="mb-2 block text-xs font-medium uppercase tracking-wide text-slate-400"
                    >
                      Nova senha
                    </label>

                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="Digite sua nova senha"
                      maxLength={128}
                      autoComplete="new-password"
                      autoFocus
                      required
                      disabled={loading}
                      className="h-12 w-full rounded-xl border border-white/[0.07] bg-[#070A0E] px-4 text-sm text-white outline-none transition-all placeholder:text-slate-700 hover:border-white/[0.11] focus:border-blue-500/40 focus:ring-4 focus:ring-blue-500/[0.08] disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="mb-2 block text-xs font-medium uppercase tracking-wide text-slate-400"
                    >
                      Confirmar nova senha
                    </label>

                    <input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(event) =>
                        setConfirmPassword(event.target.value)
                      }
                      placeholder="Digite novamente sua senha"
                      maxLength={128}
                      autoComplete="new-password"
                      required
                      disabled={loading}
                      className="h-12 w-full rounded-xl border border-white/[0.07] bg-[#070A0E] px-4 text-sm text-white outline-none transition-all placeholder:text-slate-700 hover:border-white/[0.11] focus:border-blue-500/40 focus:ring-4 focus:ring-blue-500/[0.08] disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>

                  {/* Password hint */}
                  <div className="rounded-xl border border-white/[0.05] bg-white/[0.015] px-4 py-3">
                    <p className="text-xs text-slate-600">
                      Sua senha deve possuir pelo menos{" "}
                      <span className="text-slate-400">6 caracteres</span>.
                    </p>
                  </div>

                  {error && (
                    <div
                      role="alert"
                      className="rounded-xl border border-red-500/15 bg-red-500/[0.05] px-4 py-3 text-sm leading-5 text-red-400"
                    >
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-[0_8px_30px_rgba(37,99,235,0.15)] transition-all hover:bg-blue-500 hover:shadow-[0_8px_35px_rgba(37,99,235,0.22)] focus:outline-none focus:ring-4 focus:ring-blue-500/15 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      <>
                        Redefinir senha
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                      </>
                    )}
                  </button>
                </form>
              </>
            )}

            {/* ================= BACK ================= */}
            <div className="mt-7 border-t border-white/[0.05] pt-5 text-center">
              <button
                type="button"
                onClick={handleBack}
                disabled={loading}
                className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-blue-400 disabled:opacity-40"
              >
                <ArrowLeft className="h-4 w-4" />

                {step === "email" ? "Voltar para o login" : "Voltar"}
              </button>
            </div>
          </div>

          {/* Footer */}
          <p className="mt-5 text-center text-xs text-slate-700">
            AGENDA
            <span className="mx-2 text-slate-800">·</span>
            Controle de atendimentos
          </p>
        </div>
      </div>
    </main>
  );
}
