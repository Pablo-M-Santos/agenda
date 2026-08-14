"use client";

import { FormEvent, useState } from "react";

import {
  createClient,
} from "@/services/client.service";

interface ClientFormProps {
  onSuccess: () => void;
  onCancel?: () => void;
}

export function ClientForm({
  onSuccess,
  onCancel,
}: ClientFormProps) {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    condominium: "",
    houseNumber: "",
    notes: "",
  });

  function handleChange(
    field: keyof typeof form,
    value: string
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
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
      console.error(
        "Erro ao criar cliente:",
        error
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      <div>
        <label className="mb-2 block text-sm font-medium">
          Nome
        </label>

        <input
          value={form.name}
          onChange={(event) =>
            handleChange(
              "name",
              event.target.value
            )
          }
          placeholder="Nome completo"
          required
          disabled={loading}
          className="w-full rounded-lg border px-4 py-3 text-sm outline-none focus:border-black disabled:bg-gray-50"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Telefone
        </label>

        <input
          value={form.phone}
          onChange={(event) =>
            handleChange(
              "phone",
              event.target.value
            )
          }
          placeholder="(85) 99999-9999"
          required
          disabled={loading}
          className="w-full rounded-lg border px-4 py-3 text-sm outline-none focus:border-black disabled:bg-gray-50"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-[1fr_140px]">
        <div>
          <label className="mb-2 block text-sm font-medium">
            Condomínio
          </label>

          <input
            value={form.condominium}
            onChange={(event) =>
              handleChange(
                "condominium",
                event.target.value
              )
            }
            placeholder="Nome do condomínio"
            required
            disabled={loading}
            className="w-full rounded-lg border px-4 py-3 text-sm outline-none focus:border-black disabled:bg-gray-50"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Casa
          </label>

          <input
            value={form.houseNumber}
            onChange={(event) =>
              handleChange(
                "houseNumber",
                event.target.value
              )
            }
            placeholder="124"
            required
            disabled={loading}
            className="w-full rounded-lg border px-4 py-3 text-sm outline-none focus:border-black disabled:bg-gray-50"
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Observações
        </label>

        <textarea
          value={form.notes}
          onChange={(event) =>
            handleChange(
              "notes",
              event.target.value
            )
          }
          placeholder="Informações adicionais..."
          rows={3}
          disabled={loading}
          className="w-full resize-none rounded-lg border px-4 py-3 text-sm outline-none focus:border-black disabled:bg-gray-50"
        />
      </div>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-lg border px-4 py-3 text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
          >
            Cancelar
          </button>
        )}

        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-black px-4 py-3 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
        >
          {loading
            ? "Salvando..."
            : "Cadastrar cliente"}
        </button>
      </div>
    </form>
  );
}