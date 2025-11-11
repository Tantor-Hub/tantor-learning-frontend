"use client";
import { useState, useEffect, useRef } from "react";
import { QrReader } from "react-qr-reader";
import { Skeleton } from "@/components/ui/skeleton";

interface QrScannerProps {
  onScan: (result: string) => void;
  onError: (error: string) => void;
}

export function QrScanner({ onScan, onError }: QrScannerProps) {
  const [scanned, setScanned] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");
  const [isVideoReady, setIsVideoReady] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    // Reset video ready state when component mounts
    setIsVideoReady(false);

    // Detect device type and set appropriate camera
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
    setFacingMode(isMobile ? "environment" : "user");

    // Check camera permission
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(() => setHasPermission(true))
      .catch(() => setHasPermission(false));
  }, []);

  // Create and manage our own video stream for display
  useEffect(() => {
    if (hasPermission && videoRef.current) {
      navigator.mediaDevices
        .getUserMedia({
          video: {
            facingMode: facingMode,
          },
        })
        .then((stream) => {
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current
              .play()
              .then(() => {
                setIsVideoReady(true);
              })
              .catch((err) => {
                console.error("Error playing video:", err);
              });
          }
        })
        .catch((err) => {
          console.error("Error getting user media:", err);
          onError(err.message || "Failed to access camera");
        });

      return () => {
        // Cleanup: stop all tracks when component unmounts
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }
      };
    }
  }, [hasPermission, facingMode, onError]);

  const handleResult = (result: any, error: any) => {
    if (result) {
      const text = result?.text;
      if (text && !scanned) {
        // Prevent multiple scans
        setScanned(text);
        onScan(text);
      }
    }
    if (error) {
      // Extract error message from various possible error object structures
      let errorMessage = "";

      if (typeof error === "string") {
        errorMessage = error;
      } else if (error?.message) {
        errorMessage = error.message;
      } else if (error?.name) {
        errorMessage = error.name;
      } else if (error?.toString && error.toString() !== "[object Object]") {
        errorMessage = error.toString();
      } else {
        // If we can't extract a meaningful message, it's likely not a real error
        return;
      }

      // Ignore common non-fatal errors that occur during normal scanning
      const ignoredErrors = [
        "no qr code found",
        "qr code not found",
        "no qr code detected",
        "undefined",
        "[object object]",
        "",
      ];

      const isIgnoredError = ignoredErrors.some((ignored) =>
        errorMessage.toLowerCase().includes(ignored.toLowerCase())
      );

      // Only report actual errors (camera issues, permission problems, etc.)
      if (!isIgnoredError && errorMessage.trim()) {
        // Check if it's a real error (not just "no QR code found")
        const realErrors = [
          "permission",
          "camera",
          "access",
          "denied",
          "notfounderror",
          "notreadableerror",
          "overconstrainederror",
          "securityerror",
          "constraint",
          "devices",
          "notallowed",
        ];

        const isRealError = realErrors.some((realError) =>
          errorMessage.toLowerCase().includes(realError.toLowerCase())
        );

        if (isRealError) {
          onError(errorMessage);
        }
      }
    }
  };

  if (hasPermission === false) {
    return (
      <div className="flex flex-col items-center gap-4 p-4">
        <p className="text-red-600">
          Camera permission denied. Please allow camera access to scan QR codes.
        </p>
      </div>
    );
  }

  if (hasPermission === null) {
    return (
      <div className="flex flex-col items-center gap-4 p-4">
        <p>Requesting camera permission...</p>
      </div>
    );
  }

  return (
    <>
      <style>{`
        .qr-scanner-wrapper {
          position: relative;
          width: 100%;
          height: 100%;
          min-height: 400px;
        }
        .qr-scanner-wrapper > div {
          width: 100% !important;
          height: 100% !important;
        }
        .qr-scanner-wrapper video {
          width: 100% !important;
          height: 100% !important;
          object-fit: cover !important;
          display: block !important;
        }
      `}</style>
      <div className="flex flex-col items-center gap-4 w-full">
        <div className="relative w-full max-w-md aspect-square overflow-hidden rounded-lg border-2 border-gray-300 bg-black">
          {/* Skeleton while video is loading */}
          {!isVideoReady && (
            <div className="absolute inset-0 z-0 flex items-center justify-center">
              <Skeleton className="w-full h-full rounded-lg" />
            </div>
          )}
          {/* Our visible video element */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`absolute inset-0 w-full h-full object-cover z-0 transition-opacity duration-300 ${
              isVideoReady ? "opacity-100" : "opacity-0"
            }`}
            onLoadedData={() => setIsVideoReady(true)}
          />
          {/* QrReader for decoding - hidden but functional */}
          <div
            ref={containerRef}
            className="qr-scanner-wrapper w-full h-full absolute inset-0 opacity-0 pointer-events-none z-0"
          >
            <QrReader
              onResult={handleResult}
              constraints={{
                facingMode,
              }}
            />
          </div>
          {/* Viewfinder overlay */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
            <div className="relative w-64 h-64">
              {/* Corner indicators */}
              <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-green-500 rounded-tl-lg"></div>
              <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-green-500 rounded-tr-lg"></div>
              <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-green-500 rounded-bl-lg"></div>
              <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-green-500 rounded-br-lg"></div>
              {/* Scanning line animation */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-green-500 opacity-75 animate-pulse"></div>
            </div>
          </div>
          {/* Instructions overlay */}
          <div className="absolute bottom-4 left-0 right-0 text-center px-4 z-10">
            <p className="text-white text-sm bg-black/70 px-3 py-2 rounded-md backdrop-blur-sm">
              Alignez le QR code dans le cadre
            </p>
          </div>
        </div>
        {scanned && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-md w-full max-w-md">
            <p className="text-green-800 font-medium">QR Code scanné: {scanned}</p>
          </div>
        )}
      </div>
    </>
  );
}
