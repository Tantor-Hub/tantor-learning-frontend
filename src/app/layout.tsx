import type { Metadata } from "next";
import { ReactNode } from "react";
import { poppins, workSans } from "../../public/fonts";
import { ReduxProvider } from "@/components/provider";
import { Toaster } from "react-hot-toast";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Tantor Learning",
    template: "%s - Tantor Learning",
  },
  description: "Formations certifiantes en ligne et en présentiel, partout en France.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="fr" className={`${poppins.className} ${workSans.className}`}>
      <head>
        <link rel="shortcut icon" href="/tantor-logo.svg" type="image/svg+xml" />
      </head>
      <body className={`${poppins.className} text-base leading-relaxed`}>
        <ReduxProvider>
          {children}
          <Toaster position="bottom-right" />
        </ReduxProvider>
      </body>
    </html>
  );
}
