"use client";

import { FormEvent, useState } from "react";

import { createClient } from "@/services/client.service";
import { createAppointment } from "@/services/appointment.service";

interface AppointmentFormProps {
  onSuccess: () => void;
  onCancel?: () => void;
}

export function AppointmentForm({ onSuccess, onCancel }: AppointmentFormProps) {
  const [loading, setLoading] = useState(false);

  const [saveAsClient, setSaveAsClient] = useState(false);

  const [form, setForm] = useState({
    clientName: "",
    clientPhone: "",
    condominium: "",
    houseNumber: "",
    date: "",
    startTime: "",
    service: "",
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

    setLoading(true);

    try {
      let clientId: string | undefined;

      if (saveAsClient) {
        clientId = await createClient({
          name: form.clientName.trim(),
          phone: form.clientPhone.trim(),
          condominium: form.condominium.trim(),
          houseNumber: form.houseNumber.trim(),
          notes: "",
        });
      }

      await createAppointment({
        clientId,

        clientName: form.clientName.trim(),
        clientPhone: form.clientPhone.trim(),

        condominium: form.condominium.trim(),
        houseNumber: form.houseNumber.trim(),

        date: form.date,
        startTime: form.startTime,

        service: form.service.trim(),
        notes: form.notes.trim(),

        status: "SCHEDULED",
      });

      onSuccess();
    } catch (error) {
      console.error("Erro ao criar agendamento:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium">Cliente</label>

          <input
            value={form.clientName}
            onChange={(event) => handleChange("clientName", event.target.value)}
            placeholder="Nome do cliente"
            required
            className="w-full rounded-lg border px-4 py-3 text-sm outline-none focus:border-black"
          />
        </div>

        <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3">
          <input
            type="checkbox"
            checked={saveAsClient}
            onChange={(event) => setSaveAsClient(event.target.checked)}
            disabled={loading}
            className="h-4 w-4 rounded border-gray-300"
          />

          <div>
            <p className="text-sm font-medium text-gray-700">
              Salvar cliente para futuros atendimentos
            </p>

            <p className="text-xs text-gray-500">
              Os dados serão salvos no cadastro de clientes.
            </p>
          </div>
        </label>

        <div>
          <label className="mb-2 block text-sm font-medium">Telefone</label>

          <input
            value={form.clientPhone}
            onChange={(event) =>
              handleChange("clientPhone", event.target.value)
            }
            placeholder="(85) 99999-9999"
            className="w-full rounded-lg border px-4 py-3 text-sm outline-none focus:border-black"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Condomínio</label>

          <input
            value={form.condominium}
            onChange={(event) =>
              handleChange("condominium", event.target.value)
            }
            placeholder="Nome do condomínio"
            required
            className="w-full rounded-lg border px-4 py-3 text-sm outline-none focus:border-black"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Casa</label>

          <input
            value={form.houseNumber}
            onChange={(event) =>
              handleChange("houseNumber", event.target.value)
            }
            placeholder="Ex.: 124"
            required
            className="w-full rounded-lg border px-4 py-3 text-sm outline-none focus:border-black"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Data</label>

          <input
            type="date"
            value={form.date}
            onChange={(event) => handleChange("date", event.target.value)}
            required
            className="w-full rounded-lg border px-4 py-3 text-sm outline-none focus:border-black"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Horário</label>

          <input
            type="time"
            value={form.startTime}
            onChange={(event) => handleChange("startTime", event.target.value)}
            required
            className="w-full rounded-lg border px-4 py-3 text-sm outline-none focus:border-black"
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Serviço</label>

        <input
          value={form.service}
          onChange={(event) => handleChange("service", event.target.value)}
          placeholder="Ex.: Troca de disjuntor"
          required
          className="w-full rounded-lg border px-4 py-3 text-sm outline-none focus:border-black"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Observações</label>

        <textarea
          value={form.notes}
          onChange={(event) => handleChange("notes", event.target.value)}
          placeholder="Informações adicionais..."
          rows={4}
          className="w-full resize-none rounded-lg border px-4 py-3 text-sm outline-none focus:border-black"
        />
      </div>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-lg border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Cancelar
          </button>
        )}

        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-black px-4 py-3 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
        >
          {loading ? "Salvando..." : "Agendar atendimento"}
        </button>
      </div>
    </form>
  );
}
