import { ReactNode } from "react";
import type { Metadata } from "next";
import { poppins, workSans } from "../../public/fonts";
import { ReduxProvider } from "@/components/provider";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "TanTor Learning | Formations en ligne certifiantes partout en France",
  description:
    "Accédez à des formations professionnelles de qualité avec TanTor Learning. Formations en ligne ou en présentiel, bibliothèque numérique, suivi personnalisé et certification officielle. Une plateforme complète pour apprendre, progresser et réussir.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="fr" className={`${poppins.className} ${workSans.className}`}>
      <body className={poppins.className}>
        <ReduxProvider>
          {children}
          <Toaster position="top-right" richColors />
        </ReduxProvider>
      </body>
    </html>
  );
}
