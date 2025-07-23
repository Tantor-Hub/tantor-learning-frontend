import { ReactNode } from "react";
import type { Metadata } from "next";
import { poppins, workSans } from "../../public/fonts";
import { ReduxProvider } from "@/components/provider";
import { Toaster } from "react-hot-toast";
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
      <head>
        <link rel="shortcut icon" href="/tantor-logo.svg" type="image/svg+xml" />
      </head>
      <body className={poppins.className}>
        <ReduxProvider>
          {children}
          <Toaster position="top-center" />
        </ReduxProvider>
      </body>
    </html>
  );
}
