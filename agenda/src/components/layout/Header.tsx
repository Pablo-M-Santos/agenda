"use client";

import { LogOut } from "lucide-react";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

import { auth } from "@/lib/firebase/auth";

export function Header() {
  const router = useRouter();

  async function handleLogout() {
    await signOut(auth);

    router.replace("/login");
  }

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6">
      <div>
        <h1 className="font-semibold">Agenda</h1>

        <p className="text-xs text-gray-500">
          Organização dos seus atendimentos
        </p>
      </div>

      <button
        onClick={handleLogout}
        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-gray-100"
      >
        <LogOut className="h-4 w-4" />
        Sair
      </button>
    </header>
  );
}
