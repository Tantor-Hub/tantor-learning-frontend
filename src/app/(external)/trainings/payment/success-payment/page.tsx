import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function SuccessPage() {
  return (
    <div className="container mx-auto flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-green-600">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-green-600"
        >
          <path d="M20 6 9 17l-5-5" />
        </svg>
      </div>
      <p className="mt-4 text-sm text-gray-600">Merveilleux!</p>
      <h1 className="mt-2 text-xl font-semibold text-blue-800">
        Félicitations! Votre paiement a été effectué avec succès
      </h1>
      <div className="mt-10">
        <Link href="/">
          <Button className="bg-blue-900 hover:bg-blue-950 text-white px-6 py-2 rounded">
            Aller au Tableau De Bord
          </Button>
        </Link>
      </div>
    </div>
  );
}
