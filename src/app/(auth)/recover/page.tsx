"use client";

import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function RecoverPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Veuillez entrer une adresse email valide.");
    } else {
      setError("");
      // here , will Handle form submission
    }
  };

  return (
    <div className="max-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Left side illustration */}
      <div className="hidden md:flex items-center justify-center bg-white">
        <div className="text-center p-8">
          <Image src="/kids_studying.svg" alt="kids_studying" width={1000} height={1000} />
          <p className="mt-6 text-blue-700 font-semibold text-lg">
            Accédez à des formations de qualité, où
          </p>
          <p className="mt-6 text-blue-700 font-semibold font-poppins text-lg">que vous soyez.</p>
        </div>
      </div>

      {/* Right side form */}
      <div className="flex items-center justify-center p-6">
        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-5">
          <h2 className="text-center text-2xl font-extrabold poppins text-blue-800">
            TANTOR–LEARNING
          </h2>
          <div className="space-y-1">
            <h3 className="text-center text-md font-bold text-blue-950">Mot de passe oublié</h3>
            <h5 className="text-center text-sm text-blue-500">
              Entrez votre adresse e-mail pour réinitialiser votre compte
            </h5>
          </div>

          <div className="flex justify-center">
            <div>
              <Image
                src="/lock-icon.svg"
                alt="lock"
                width={60}
                height={70}
                className="object-contain"
              />
            </div>
          </div>

          <div>
            <h5 className="block text-sm font-poppins font-medium  text-blue-950">
              Entrer votre addresse mail
            </h5>
            <div className="mt-2">
              <Input
                type="email"
                placeholder="joedoe@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-900 text-white font-poppins hover:bg-blue-900"
          >
            Continuer
          </Button>

          <div className="flex items-center gap-2">
            <div className="flex-grow h-px bg-gray-300" />
            <span className="text-gray-400 text-sm">OU</span>
            <div className="flex-grow h-px bg-gray-300" />
          </div>

          <Button
            variant="outline"
            className="w-full border-blue-900 text-blue-900 font-poppins hover:bg-blue-50"
          >
            Annuler
          </Button>
        </form>
      </div>
    </div>
  );
}
