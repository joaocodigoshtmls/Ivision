import type { Metadata } from "next";
import "./globals.css";
import { ReactQueryProvider } from "@/components/providers/ReactQueryProvider";
export const metadata: Metadata = { title: "IVision", description: "Conectar e visualizar câmeras." };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (<html lang="pt-BR"><body className="min-h-dvh antialiased">
    <ReactQueryProvider><div className="mx-auto max-w-7xl p-4">{children}</div></ReactQueryProvider>
  </body></html>);
}
