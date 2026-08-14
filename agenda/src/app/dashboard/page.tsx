"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { AppLayout } from "@/components/layout/AppLayout";

import { DashboardStats } from "@/components/dashboard/DashboardStats";

import { UpcomingAppointments } from "@/components/dashboard/UpcomingAppointments";

import { CondominiumSummary } from "@/components/dashboard/CondominiumSummary";

import { getAppointments } from "@/services/appointment.service";

import type { Appointment } from "@/types/appointment";

import { dateToString, getDateRange } from "@/utils/appointment";

export default function DashboardPage() {
  const router = useRouter();

  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getAppointments();

        setAppointments(data);
      } catch (error) {
        console.error("Erro ao carregar dashboard:", error);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const today = dateToString(new Date());

  const { start, end } = getDateRange(7);

  const todayAppointments = appointments.filter(
    (appointment) =>
      appointment.date === today && appointment.status !== "CANCELLED",
  );

  const nextSevenDays = appointments.filter(
    (appointment) =>
      appointment.date >= start &&
      appointment.date <= end &&
      appointment.status !== "CANCELLED",
  );

  const completed = appointments.filter(
    (appointment) => appointment.status === "COMPLETED",
  );

  const upcoming = appointments
    .filter(
      (appointment) =>
        appointment.date >= today && appointment.status === "SCHEDULED",
    )
    .sort((a, b) => {
      const dateA = `${a.date} ${a.startTime}`;

      const dateB = `${b.date} ${b.startTime}`;

      return dateA.localeCompare(dateB);
    })
    .slice(0, 5);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>

          <p className="mt-1 text-sm text-gray-500">
            Aqui está um resumo da sua agenda.
          </p>
        </div>

        {loading ? (
          <div className="rounded-xl border bg-white p-12 text-center">
            <p className="text-sm text-gray-500">Carregando agenda...</p>
          </div>
        ) : (
          <>
            <DashboardStats
              today={todayAppointments.length}
              nextSevenDays={nextSevenDays.length}
              completed={completed.length}
            />

            <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
              <UpcomingAppointments
                appointments={upcoming}
                onViewAll={() => router.push("/agendamentos")}
              />

              <CondominiumSummary appointments={nextSevenDays} />
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
}
