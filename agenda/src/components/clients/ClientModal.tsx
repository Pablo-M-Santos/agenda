"use client";

import { X } from "lucide-react";

import { ClientForm } from "./ClientForm";

interface ClientModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function ClientModal({
  open,
  onClose,
  onSuccess,
}: ClientModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-xl">
        <div className="sticky top-0 flex items-center justify-between border-b bg-white px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold">
              Novo cliente
            </h2>

            <p className="text-sm text-gray-500">
              Cadastre os dados do cliente.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
            aria-label="Fechar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <ClientForm
            onSuccess={onSuccess}
            onCancel={onClose}
          />
        </div>
      </div>
    </div>
  );
}