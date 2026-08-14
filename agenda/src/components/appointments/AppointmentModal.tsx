"use client";

import { X } from "lucide-react";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl">
        <div className="sticky top-0 flex items-center justify-between border-b bg-white px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold">
              Novo agendamento
            </h2>

            <p className="text-sm text-gray-500">
              Cadastre um novo atendimento.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
            aria-label="Fechar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <AppointmentForm
            onSuccess={onSuccess}
          />
        </div>
      </div>
    </div>
  );
}