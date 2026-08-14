import type { Appointment } from "@/types/appointment";

interface Props {
  appointments: Appointment[];
}

export function CondominiumSummary({
  appointments,
}: Props) {
  const counts = appointments.reduce<
    Record<string, number>
  >((accumulator, appointment) => {
    if (
      appointment.status ===
      "CANCELLED"
    ) {
      return accumulator;
    }

    const condominium =
      appointment.condominium;

    accumulator[condominium] =
      (accumulator[condominium] ?? 0) + 1;

    return accumulator;
  }, {});

  const items = Object.entries(counts)
    .sort(([, a], [, b]) => b - a);

  const max = Math.max(
    ...items.map(([, count]) => count),
    1
  );

  return (
    <div className="rounded-xl border bg-white p-5">
      <div>
        <h2 className="font-semibold">
          Por condomínio
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Atendimentos agendados.
        </p>
      </div>

      <div className="mt-6 space-y-4">
        {items.length === 0 ? (
          <p className="text-sm text-gray-500">
            Nenhum atendimento cadastrado.
          </p>
        ) : (
          items.map(
            ([condominium, count]) => (
              <div key={condominium}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-medium">
                    {condominium}
                  </span>

                  <span className="text-gray-500">
                    {count}
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-black"
                    style={{
                      width: `${
                        (count / max) * 100
                      }%`,
                    }}
                  />
                </div>
              </div>
            )
          )
        )}
      </div>
    </div>
  );
}