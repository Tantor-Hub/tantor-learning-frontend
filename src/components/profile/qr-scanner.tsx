"use client";
import { useState, useEffect } from "react";
import { QrReader } from "react-qr-reader";

interface QrScannerProps {
  onScan: (result: string) => void;
  onError: (error: string) => void;
}

export function QrScanner({ onScan, onError }: QrScannerProps) {
  const [scanned, setScanned] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");

  useEffect(() => {
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
      const errorMessage = error?.message || "Unknown error occurred";
      onError(errorMessage);
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
    <div className="flex flex-col items-center gap-4">
      <div className="w-full max-w-md">
        <QrReader onResult={handleResult} constraints={{ facingMode }} className="w-full" />
      </div>
      {scanned && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-md">
          <p className="text-green-800">Scanned: {scanned}</p>
        </div>
      )}
    </div>
  );
}
