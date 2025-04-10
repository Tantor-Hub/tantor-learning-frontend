"use client";
import { useState, useEffect } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
export function CookieMessageAlert() {
  const [showCookieMessage, setShowCookieMessage] = useState(false);

  useEffect(() => {
    // Check if the user has already accepted cookies
    const hasAcceptedCookies = localStorage.getItem("cookiesAccepted");

    // Only show the message if they haven't previously accepted
    if (!hasAcceptedCookies) {
      setShowCookieMessage(true);
    }
  }, []);

  const acceptAll = () => {
    // Save acceptance to localStorage
    localStorage.setItem("cookiesAccepted", "true");
    setShowCookieMessage(false);

    // Here you could also initialize your analytics or tracking scripts
    // console.log("All cookies accepted");
  };

  const continueWithoutAccepting = () => {
    // Save rejection to localStorage so we don't keep asking
    localStorage.setItem("cookiesAccepted", "false");
    setShowCookieMessage(false);

    // console.log("Cookies declined");
  };

  if (!showCookieMessage) {
    return null; // Don't render anything if we shouldn't show the message
  }

  return (
    <Card className="fixed bottom-4 right-5 z-50 w-4/4 md:max-w-3/4 lg:max-w-2/4 backdrop-blur-xl bg-[#FFFFFFCC]">
      <CardContent>
        <h2 className="text-lg font-semibold mb-2">Nous respectons votre vie privée</h2>
        <p className="mb-4 text-gray-600">
          Nous utilisons des cookies pour améliorer votre visite et expérience de navigation. Merci
          de les accepter.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <a href="/privacy-policy" className="text-primary hover:underline mb-2 sm:mb-0">
            Politique de confidentialité
          </a>
          <a href="/learn-more" className="text-primary hover:underline">
            En savoir plus
          </a>
        </div>
        <div className="mt-4 flex flex-col sm:flex-row gap-3 justify-end">
          <Button onClick={continueWithoutAccepting} variant="outline">
            Continuer sans accepter
          </Button>
          <Button onClick={acceptAll}>Accepter tout</Button>
        </div>
      </CardContent>
    </Card>
  );
}
