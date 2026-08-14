"use client";

import {
  CalendarDays,
  House,
  LogOut,
  Settings,
  Users,
  Zap,
} from "lucide-react";

import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

import { auth } from "@/lib/firebase/auth";

export function Sidebar() {
  const router = useRouter();

  async function handleLogout() {
    await signOut(auth);

    router.replace("/login");
  }

  return (
    <aside className="hidden w-64 shrink-0 border-r bg-white md:flex md:flex-col">
      <div className="flex h-16 items-center gap-2 border-b px-6">
        <Zap className="h-5 w-5" />

        <span className="font-semibold">
          Agenda Elétrica
        </span>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        <button
          onClick={() => router.push("/dashboard")}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-gray-100"
        >
          <House className="h-4 w-4" />

          Dashboard
        </button>

        <button
          onClick={() => router.push("/agendamentos")}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-gray-100"
        >
          <CalendarDays className="h-4 w-4" />

          Agendamentos
        </button>

        <button
          onClick={() => router.push("/clientes")}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-gray-100"
        >
          <Users className="h-4 w-4" />

          Clientes
        </button>
      </nav>

      <div className="border-t p-4">
        <button
          className="mb-1 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-gray-100"
        >
          <Settings className="h-4 w-4" />

          Configurações
        </button>

        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50"
        >
          <LogOut className="h-4 w-4" />

          Sair
        </button>
      </div>
    </aside>
  );
}