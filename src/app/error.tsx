"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon, WifiOffIcon, RefreshCwIcon, AlertTriangleIcon } from "lucide-react";

export default function Page({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();
  const [isOnline, setIsOnline] = useState(true);
  const [errorType, setErrorType] = useState<"connection" | "general">("general");

  useEffect(() => {
    // Vérifier la connexion internet
    const checkConnection = () => {
      setIsOnline(navigator.onLine);
    };

    // Déterminer le type d'erreur
    const determineErrorType = () => {
      const errorMessage = error?.message?.toLowerCase() || "";
      const isNetworkError =
        errorMessage.includes("network") ||
        errorMessage.includes("fetch") ||
        errorMessage.includes("connection") ||
        errorMessage.includes("timeout") ||
        !navigator.onLine;

      setErrorType(isNetworkError ? "connection" : "general");
    };

    checkConnection();
    determineErrorType();

    // Écouter les changements de connexion
    window.addEventListener("online", checkConnection);
    window.addEventListener("offline", checkConnection);

    return () => {
      window.removeEventListener("online", checkConnection);
      window.removeEventListener("offline", checkConnection);
    };
  }, [error]);

  const getErrorContent = () => {
    if (!isOnline || errorType === "connection") {
      return {
        title: "Problème de connexion",
        description:
          "Votre connexion internet semble être interrompue. Vérifiez votre connexion et réessayez.",
        icon: <WifiOffIcon className="w-16 h-16 text-red-500 mb-4" />,
      };
    }

    return {
      title: "Quelque chose s'est mal passé",
      description:
        "Une erreur inattendue s'est produite. Notre équipe a été notifiée et travaille à résoudre le problème.",
      icon: <AlertTriangleIcon className="w-16 h-16 text-yellow-500 mb-4" />,
    };
  };

  const handleRetry = () => {
    // Si c'est un problème de connexion, attendre un moment avant de retry
    if (!isOnline || errorType === "connection") {
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } else {
      reset();
    }
  };

  const { title, description, icon } = getErrorContent();

  return (
    <>
      <Header />
      <div className="flex flex-col items-center justify-center min-h-[60vh] py-12">
        <div className="max-w-[505px] flex flex-col items-center text-center gap-[16px] md:gap-[28px] pb-[25px] md:pb-[50px]">
          {/* Icône d'erreur */}
          {icon}

          {/* Titre avec gradient comme la page 404 */}
          <h1 className="text-2xl font-black bg-gradient-to-b from-desctructive to-red-500 bg-clip-text text-transparent">
            {title}
          </h1>

          {/* Description */}
          <p className="font-light text-muted-foreground text-base">{description}</p>

          {/* Statut de connexion */}
          <div className="flex items-center gap-2 text-sm">
            <div className={`w-2 h-2 rounded-full ${isOnline ? "bg-green-500" : "bg-red-500"}`} />
            <span className="text-muted-foreground">
              {isOnline ? "Connexion active" : "Hors ligne"}
            </span>
          </div>

          {/* Détails de l'erreur en développement */}
          {process.env.NODE_ENV === "development" && error && (
            <details className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-left w-full max-w-md">
              <summary className="cursor-pointer text-sm font-medium text-muted-foreground">
                Détails de l'erreur (dev)
              </summary>
              <pre className="mt-2 text-xs text-red-600 dark:text-red-400 overflow-auto">
                {error.message}
                {error.digest && `\nDigest: ${error.digest}`}
              </pre>
            </details>
          )}
        </div>

        {/* Boutons d'action */}
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <Button
            size="lg"
            onClick={handleRetry}
            disabled={!isOnline && errorType === "connection"}
          >
            {errorType === "connection" ? "Vérifier la connexion" : "Réessayer"}
            <RefreshCwIcon className="w-4 h-4 mr-2" />
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="border-primary text-primary"
            onClick={() => router.push("/")}
          >
            Retour à l'accueil
            <ArrowRightIcon className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {/* Message d'aide supplémentaire */}
        <div className="mt-8 text-center text-sm text-muted-foreground max-w-md">
          {errorType === "connection" ? (
            <p>
              💡 <strong>Conseil :</strong> Vérifiez votre Wi-Fi, données mobiles, ou contactez
              votre fournisseur d'accès internet.
            </p>
          ) : (
            <p>
              Si le problème persiste, n'hésitez pas à{" "}
              <a
                target="_blank"
                href="mailto:supporttantorlearning@gmail.com"
                className="hover:underline transition-colors text-primary"
              >
                nous contacter
              </a>
              .
            </p>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
