import { Metadata } from "next";
import Features from "./components/features";
import { GetStarted } from "./components/get-started";
import Hero from "./components/hero";
import Learn from "./components/learn";
import Partners from "./components/partner";
import Teaching from "./components/teaching";

export const metadata: Metadata = {
  title: "Page d'acceuil",
};

export default function Page() {
  return (
    <main className="flex flex-col">
      <Hero />
      <Partners />
      <Learn />
      <Features />
      <Teaching />
      <GetStarted />
    </main>
  );
}
