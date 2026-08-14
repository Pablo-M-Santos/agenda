import type { Metadata } from "next";

import "./globals.css";

import { AuthProvider } from "@/components/auth/AuthProvider";

export const metadata: Metadata = {
  title: "Agenda Elétrica",
  description: "Sistema de agendamento",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}