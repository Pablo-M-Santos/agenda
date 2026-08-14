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
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Dados do cliente */}
      <div>
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-white">Dados do cliente</h3>

          <p className="mt-1 text-xs text-slate-600">
            Informe quem será atendido.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {/* Cliente */}
          <div>
            <label
              htmlFor="client-name"
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              Cliente
            </label>

            <input
              id="client-name"
              value={form.clientName}
              onChange={(event) =>
                handleChange("clientName", event.target.value)
              }
              placeholder="Nome do cliente"
              required
              disabled={loading}
              className="w-full rounded-xl border border-white/[0.08] bg-[#080B10] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 hover:border-white/[0.12] focus:border-blue-500/60 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          {/* Telefone */}
          <div>
            <label
              htmlFor="client-phone"
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              Telefone
            </label>

            <input
              id="client-phone"
              value={form.clientPhone}
              onChange={(event) =>
                handleChange("clientPhone", event.target.value)
              }
              placeholder="(85) 99999-9999"
              disabled={loading}
              className="w-full rounded-xl border border-white/[0.08] bg-[#080B10] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 hover:border-white/[0.12] focus:border-blue-500/60 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
        </div>

        {/* Salvar cliente */}
        <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-xl border border-blue-500/10 bg-blue-500/[0.04] p-4 transition hover:border-blue-500/20 hover:bg-blue-500/[0.06]">
          <input
            type="checkbox"
            checked={saveAsClient}
            onChange={(event) => setSaveAsClient(event.target.checked)}
            disabled={loading}
            className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border-white/20 bg-[#080B10] accent-blue-500"
          />

          <div>
            <p className="text-sm font-medium text-slate-200">
              Salvar cliente para futuros atendimentos
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-600">
              Os dados serão salvos no cadastro de clientes para facilitar
              próximos agendamentos.
            </p>
          </div>
        </label>
      </div>

      {/* Local do atendimento */}
      <div>
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-white">
            Local do atendimento
          </h3>

          <p className="mt-1 text-xs text-slate-600">
            Informe onde o serviço será realizado.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-[1fr_160px]">
          {/* Condomínio */}
          <div>
            <label
              htmlFor="condominium"
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              Condomínio
            </label>

            <input
              id="condominium"
              value={form.condominium}
              onChange={(event) =>
                handleChange("condominium", event.target.value)
              }
              placeholder="Nome do condomínio"
              required
              disabled={loading}
              className="w-full rounded-xl border border-white/[0.08] bg-[#080B10] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 hover:border-white/[0.12] focus:border-blue-500/60 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          {/* Casa */}
          <div>
            <label
              htmlFor="house-number"
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              Casa
            </label>

            <input
              id="house-number"
              value={form.houseNumber}
              onChange={(event) =>
                handleChange("houseNumber", event.target.value)
              }
              placeholder="Ex.: 124"
              required
              disabled={loading}
              className="w-full rounded-xl border border-white/[0.08] bg-[#080B10] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 hover:border-white/[0.12] focus:border-blue-500/60 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
        </div>
      </div>

      {/* Agendamento */}
      <div>
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-white">Agendamento</h3>

          <p className="mt-1 text-xs text-slate-600">
            Defina quando o atendimento será realizado.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {/* Data */}
          <div>
            <label
              htmlFor="appointment-date"
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              Data
            </label>

            <input
              id="appointment-date"
              type="date"
              value={form.date}
              onChange={(event) => handleChange("date", event.target.value)}
              required
              disabled={loading}
              className="w-full rounded-xl border border-white/[0.08] bg-[#080B10] px-4 py-3 text-sm text-white outline-none transition hover:border-white/[0.12] focus:border-blue-500/60 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          {/* Horário */}
          <div>
            <label
              htmlFor="appointment-time"
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              Horário
            </label>

            <input
              id="appointment-time"
              type="time"
              value={form.startTime}
              onChange={(event) =>
                handleChange("startTime", event.target.value)
              }
              required
              disabled={loading}
              className="w-full rounded-xl border border-white/[0.08] bg-[#080B10] px-4 py-3 text-sm text-white outline-none transition hover:border-white/[0.12] focus:border-blue-500/60 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
        </div>
      </div>

      {/* Serviço */}
      <div>
        <label
          htmlFor="service"
          className="mb-2 block text-sm font-medium text-slate-300"
        >
          Serviço
        </label>

        <input
          id="service"
          value={form.service}
          onChange={(event) => handleChange("service", event.target.value)}
          placeholder="Ex.: Troca de disjuntor"
          required
          disabled={loading}
          className="w-full rounded-xl border border-white/[0.08] bg-[#080B10] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 hover:border-white/[0.12] focus:border-blue-500/60 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>

      {/* Observações */}
      <div>
        <label
          htmlFor="notes"
          className="mb-2 block text-sm font-medium text-slate-300"
        >
          Observações
        </label>

        <textarea
          id="notes"
          value={form.notes}
          onChange={(event) => handleChange("notes", event.target.value)}
          placeholder="Informações adicionais sobre o atendimento..."
          rows={4}
          disabled={loading}
          className="w-full resize-none rounded-xl border border-white/[0.08] bg-[#080B10] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 hover:border-white/[0.12] focus:border-blue-500/60 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>

      {/* Ações */}
      <div className="flex flex-col-reverse gap-3 border-t border-white/[0.06] pt-5 sm:flex-row sm:justify-end">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-xl border border-white/[0.08] bg-[#080B10] px-4 py-3 text-sm font-medium text-slate-400 transition hover:border-white/[0.12] hover:bg-white/[0.03] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancelar
          </button>
        )}

        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/10 transition hover:bg-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Salvando..." : "Agendar atendimento"}
        </button>
      </div>
    </form>
  );
}
