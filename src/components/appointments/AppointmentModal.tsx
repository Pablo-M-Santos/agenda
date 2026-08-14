"use client";

import { CalendarPlus, X } from "lucide-react";

import { AppointmentForm } from "./AppointmentForm";

interface AppointmentModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AppointmentModal({
  open,
  onClose,
  onSuccess,
}: AppointmentModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/[0.08] bg-[#0D1117] shadow-2xl shadow-black/50">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/[0.06] bg-[#0D1117]/95 px-6 py-4 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-blue-400/20 bg-blue-500/10">
              <CalendarPlus className="h-4 w-4 text-blue-400" />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-white">
                Novo agendamento
              </h2>

              <p className="mt-0.5 text-sm text-slate-500">
                Cadastre um novo atendimento.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition hover:bg-white/[0.05] hover:text-white"
            aria-label="Fechar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Formulário */}
        <div className="p-6">
          <AppointmentForm onSuccess={onSuccess} />
        </div>
      </div>
    </div>
  );
}
