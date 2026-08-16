import type { Appointment } from "@/types/appointment";

interface Props {
  appointments: Appointment[];
}

export function CondominiumSummary({ appointments }: Props) {
  const counts = appointments.reduce<Record<string, number>>(
    (accumulator, appointment) => {
      if (appointment.status === "CANCELLED") {
        return accumulator;
      }

      const condominium = appointment.condominium;

      accumulator[condominium] = (accumulator[condominium] ?? 0) + 1;

      return accumulator;
    },
    {},
  );

  const items = Object.entries(counts).sort(([, a], [, b]) => b - a);

  const max = Math.max(...items.map(([, count]) => count), 1);

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-[#0D1117] p-5 shadow-sm">
      <div>
        <h2 className="font-semibold text-slate-200">Por condomínio</h2>

        <p className="mt-1 text-sm text-slate-600">Atendimentos agendados.</p>
      </div>

      <div className="mt-6 space-y-5">
        {items.length === 0 ? (
          <div className="flex min-h-24 items-center justify-center rounded-xl border border-white/[0.05] bg-[#080B10]">
            <p className="text-sm text-slate-600">
              Nenhum atendimento cadastrado.
            </p>
          </div>
        ) : (
          items.map(([condominium, count]) => (
            <div key={condominium}>
              <div className="mb-2 flex items-center justify-between gap-4 text-sm">
                <span className="truncate font-medium text-slate-300">
                  {condominium}
                </span>

                <span className="shrink-0 rounded-lg border border-blue-400/10 bg-blue-400/[0.05] px-2 py-0.5 text-xs font-semibold text-blue-400">
                  {count}
                </span>
              </div>

              <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.05]">
                <div
                  className="h-full rounded-full bg-blue-500 transition-all duration-500"
                  style={{
                    width: `${(count / max) * 100}%`,
                  }}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
