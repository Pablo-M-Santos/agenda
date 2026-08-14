"use client";

import { firebaseApp } from "@/lib/firebase/config";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <div>
        <h1 className="text-2xl font-bold">Agenda Elétrica</h1>

        <p className="mt-2 text-gray-500">Firebase conectado ✅</p>

        <p className="mt-1 text-sm text-gray-400">
          Projeto: {firebaseApp.options.projectId}
        </p>
      </div>
    </main>
  );
}
