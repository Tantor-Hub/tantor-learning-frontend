"use client";
import * as animationData from "./payment-success.json";
import { useLottie } from "lottie-react";

export function LottieSuccessView() {
  const defaultOptions = {
    animationData: animationData,
    loop: true,
  };

  const { View } = useLottie(defaultOptions);

  return (
    <div className="fixed inset-0 w-full h-full z-[9999]">
      <div className="w-full h-full flex justify-center items-center">
        <div className="w-full max-w-2xl h-auto aspect-video">{View}</div>
      </div>
    </div>
  );
}
