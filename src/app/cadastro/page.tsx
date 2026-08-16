"use client";

import { FormEvent, useState } from "react";
import { ArrowRight, Eye, EyeOff, Loader2, UserPlus, Zap } from "lucide-react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useRouter } from "next/navigation";

import { auth } from "@/lib/firebase/auth";

export default function CadastroPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (loading) return;

    setError("");

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    if (password.length < 6) {
      setError("A senha deve possuir pelo menos 6 caracteres.");
      return;
    }

    setLoading(true);

    try {
      const credential = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password,
      );

      await updateProfile(credential.user, {
        displayName: name.trim(),
      });

      router.replace("/dashboard");
    } catch (error: any) {
      console.error("Erro ao criar conta:", error);

      switch (error.code) {
        case "auth/email-already-in-use":
          setError("Este e-mail já está cadastrado.");
          break;

        case "auth/invalid-email":
          setError("Informe um e-mail válido.");
          break;

        case "auth/weak-password":
          setError("A senha escolhida é muito fraca.");
          break;

        default:
          setError("Não foi possível criar sua conta. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#05070A] px-4 py-8">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {/* Glow azul */}
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/10 blur-[120px]" />

        {/* Glow ciano */}
        <div className="absolute left-[20%] top-[15%] h-64 w-64 rounded-full bg-cyan-400/[0.04] blur-[100px]" />

        {/* Grid sutil */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      {/* Conteúdo */}
      <div className="relative z-10 w-full max-w-[420px]">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-500/10 shadow-[0_0_40px_rgba(37,99,235,0.12)]">
            <Zap className="h-7 w-7 fill-blue-400 text-blue-400" />
          </div>

          <h1 className="text-2xl font-semibold tracking-tight text-white">
            AGENDA
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            Organize seus atendimentos.
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#0D1117]/95 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-8">
          {/* Header */}
          <div className="mb-7">
            <h2 className="text-xl font-semibold text-white">Criar conta</h2>

            <p className="mt-1.5 text-sm leading-6 text-slate-400">
              Crie sua conta para começar a organizar sua agenda.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Nome */}
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Nome
              </label>

              <input
                id="name"
                name="name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Seu nome"
                autoComplete="name"
                autoFocus
                required
                disabled={loading}
                className="w-full rounded-xl border border-white/[0.08] bg-[#080B10] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 hover:border-white/[0.12] focus:border-blue-500/60 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>

            {/* E-mail */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-slate-300"
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
                required
                disabled={loading}
                className="w-full rounded-xl border border-white/[0.08] bg-[#080B10] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 hover:border-white/[0.12] focus:border-blue-500/60 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>

            {/* Senha */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Senha
              </label>

              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Digite sua senha"
                  autoComplete="new-password"
                  required
                  disabled={loading}
                  className="w-full rounded-xl border border-white/[0.08] bg-[#080B10] px-4 py-3 pr-12 text-sm text-white outline-none transition placeholder:text-slate-600 hover:border-white/[0.12] focus:border-blue-500/60 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  disabled={loading}
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-500 transition hover:bg-white/5 hover:text-slate-300 disabled:cursor-not-allowed"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              <p className="mt-2 text-xs text-slate-600">
                Mínimo de 6 caracteres.
              </p>
            </div>

            {/* Confirmar senha */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Confirmar senha
              </label>

              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="Digite a senha novamente"
                  autoComplete="new-password"
                  required
                  disabled={loading}
                  className={`w-full rounded-xl border bg-[#080B10] px-4 py-3 pr-12 text-sm text-white outline-none transition placeholder:text-slate-600 hover:border-white/[0.12] focus:ring-4 disabled:cursor-not-allowed disabled:opacity-60 ${
                    confirmPassword && password !== confirmPassword
                      ? "border-red-500/40 focus:border-red-500/60 focus:ring-red-500/10"
                      : "border-white/[0.08] focus:border-blue-500/60 focus:ring-blue-500/10"
                  }`}
                />

                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((current) => !current)}
                  disabled={loading}
                  aria-label={
                    showConfirmPassword ? "Ocultar senha" : "Mostrar senha"
                  }
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-500 transition hover:bg-white/5 hover:text-slate-300 disabled:cursor-not-allowed"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              {confirmPassword && password !== confirmPassword && (
                <p className="mt-2 text-xs text-red-400">
                  As senhas não coincidem.
                </p>
              )}
            </div>

            {/* Erro */}
            {error && (
              <div
                role="alert"
                className="rounded-xl border border-red-500/20 bg-red-500/[0.06] px-4 py-3 text-sm text-red-400"
              >
                {error}
              </div>
            )}

            {/* Botão */}
            <button
              type="submit"
              disabled={loading}
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/10 transition hover:bg-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Criando conta...
                </>
              ) : (
                <>
                  Criar conta
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </form>

          {/* Login */}
          <div className="mt-6 border-t border-white/[0.06] pt-6 text-center">
            <p className="text-sm text-slate-500">Já possui uma conta?</p>

            <button
              type="button"
              onClick={() => router.push("/login")}
              className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-blue-400 transition hover:text-blue-300"
            >
              Entrar na minha conta
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-xs text-slate-600">
            AGENDA
            <span className="mx-2 text-slate-700">·</span>
            Controle de atendimentos
          </p>
        </div>
      </div>
    </main>
  );
}
