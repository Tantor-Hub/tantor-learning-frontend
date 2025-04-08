"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function VerifyCodePage() {
  const [code, setCode] = useState("      ");
  const [error, setError] = useState("");
  const router = useRouter();
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim().length !== 6 || code.includes(" ")) {
      setError("Code invalide. Veuillez entrer les 6 chiffres.");
    } else {
      setError("");
      router.push("/recover/success");
    }
  };

  const handleInputChange = (val: string, index: number) => {
    if (/^[0-9]?$/.test(val)) {
      const newCode = code.substring(0, index) + val + code.substring(index + 1);
      setCode(newCode);
      if (val && index < 5) {
        inputsRef.current[index + 1]?.focus();
      }
    }
  };

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  return (
    <div className="max-h-screen grid grid-cols-1 md:grid-cols-2">
      <div className="hidden md:flex items-center justify-center bg-white">
        <div className="text-center p-8">
          <Image src="/kids_studying.svg" alt="kids_studying" width={1000} height={1000} />
          <p className="mt-6 text-blue-700 font-semibold text-lg">
            Accédez à des formations de qualité, où
          </p>
          <p className="mt-6 text-blue-700 font-semibold font-poppins text-lg">que vous soyez.</p>
        </div>
      </div>

      <div className="flex items-center justify-center p-6">
        <form onSubmit={handleVerify} className="w-full max-w-md space-y-6">
          <h2 className="text-center text-2xl font-extrabold poppins text-blue-800">
            TANTOR–LEARNING
          </h2>
          <h3 className="text-center text-md font-bold text-blue-950">
            Entrer le Code de vérification
          </h3>
          <p className="text-center text-sm text-blue-500">
            Nous avons envoyé un code à votre adresse email
          </p>

          <div className="flex justify-center gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <input
                key={i}
                ref={(el) => {
                  inputsRef.current[i] = el;
                }}
                maxLength={1}
                value={code[i]}
                onChange={(e) => handleInputChange(e.target.value, i)}
                className="w-10 h-12 text-center text-xl border rounded-md"
              />
            ))}
          </div>

          {error && <p className="text-red-600 text-sm text-center">{error}</p>}

          <Button
            type="submit"
            className="w-full bg-blue-900 text-white font-poppins hover:bg-blue-900"
          >
            Vérifier
          </Button>

          <p className="text-center text-sm text-gray-500">
            Vous n'avez pas reçu le code ?{" "}
            <a href="#" className="text-blue-600 underline">
              Renvoyer le Code
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
