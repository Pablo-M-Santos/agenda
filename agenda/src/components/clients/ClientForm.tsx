"use client";

import { FormEvent, useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { createClient } from "@/services/client.service";

interface ClientFormProps {
  onSuccess: () => void;
  onCancel?: () => void;
}

export function ClientForm({ onSuccess, onCancel }: ClientFormProps) {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    condominium: "",
    houseNumber: "",
    notes: "",
  });

  function handleChange(field: keyof typeof form, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (loading) {
      return;
    }

    try {
      setLoading(true);

      await createClient({
        name: form.name.trim(),
        phone: form.phone.trim(),
        condominium: form.condominium.trim(),
        houseNumber: form.houseNumber.trim(),
        notes: form.notes.trim(),
      });

      onSuccess();
    } catch (error) {
      console.error("Erro ao criar cliente:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-300">
          Nome
        </label>

        <input
          value={form.name}
          onChange={(event) => handleChange("name", event.target.value)}
          placeholder="Nome completo"
          required
          disabled={loading}
          className="w-full rounded-xl border border-white/[0.08] bg-[#080B10] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 hover:border-white/[0.12] focus:border-blue-500/60 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-300">
          Telefone
        </label>

        <input
          value={form.phone}
          onChange={(event) => handleChange("phone", event.target.value)}
          placeholder="(85) 99999-9999"
          required
          disabled={loading}
          className="w-full rounded-xl border border-white/[0.08] bg-[#080B10] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 hover:border-white/[0.12] focus:border-blue-500/60 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-[1fr_140px]">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Condomínio
          </label>

          <input
            value={form.condominium}
            onChange={(event) =>
              handleChange("condominium", event.target.value)
            }
            placeholder="Nome do condomínio"
            required
            disabled={loading}
            className="w-full rounded-xl border border-white/[0.08] bg-[#080B10] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 hover:border-white/[0.12] focus:border-blue-500/60 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Casa
          </label>

          <input
            value={form.houseNumber}
            onChange={(event) =>
              handleChange("houseNumber", event.target.value)
            }
            placeholder="124"
            required
            disabled={loading}
            className="w-full rounded-xl border border-white/[0.08] bg-[#080B10] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 hover:border-white/[0.12] focus:border-blue-500/60 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60"
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-300">
          Observações
        </label>

        <textarea
          value={form.notes}
          onChange={(event) => handleChange("notes", event.target.value)}
          placeholder="Informações adicionais..."
          rows={3}
          disabled={loading}
          className="w-full resize-none rounded-xl border border-white/[0.08] bg-[#080B10] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 hover:border-white/[0.12] focus:border-blue-500/60 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60"
        />
      </div>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-xl border border-white/[0.08] bg-[#080B10] px-4 py-3 text-sm font-medium text-slate-400 transition hover:bg-white/[0.03] hover:text-white disabled:opacity-50"
          >
            Cancelar
          </button>
        )}

        <button
          type="submit"
          disabled={loading}
          className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/10 transition hover:bg-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Salvando...
            </>
          ) : (
            <>
              Cadastrar cliente
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
