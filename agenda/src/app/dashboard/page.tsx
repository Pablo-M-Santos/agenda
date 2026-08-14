import {
  CalendarDays,
  CheckCircle2,
  Clock,
  Plus,
} from "lucide-react";

import { AppLayout } from "@/components/layout/AppLayout";

export default function DashboardPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">
            Olá! 👋
          </h1>

          <p className="text-sm text-gray-500">
            Aqui está um resumo da sua agenda.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl border bg-white p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">
                Serviços hoje
              </span>

              <CalendarDays className="h-5 w-5 text-gray-400" />
            </div>

            <p className="mt-3 text-3xl font-bold">
              0
            </p>
          </div>

          <div className="rounded-xl border bg-white p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">
                Próximos serviços
              </span>

              <Clock className="h-5 w-5 text-gray-400" />
            </div>

            <p className="mt-3 text-3xl font-bold">
              0
            </p>
          </div>

          <div className="rounded-xl border bg-white p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">
                Concluídos
              </span>

              <CheckCircle2 className="h-5 w-5 text-gray-400" />
            </div>

            <p className="mt-3 text-3xl font-bold">
              0
            </p>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-semibold">
                Próximos atendimentos
              </h2>

              <p className="text-sm text-gray-500">
                Seus próximos serviços aparecerão aqui.
              </p>
            </div>

            <button className="flex items-center justify-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800">
              <Plus className="h-4 w-4" />

              Novo agendamento
            </button>
          </div>

          <div className="flex min-h-40 items-center justify-center">
            <div className="text-center">
              <CalendarDays className="mx-auto h-8 w-8 text-gray-300" />

              <p className="mt-2 text-sm text-gray-500">
                Nenhum atendimento agendado.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}