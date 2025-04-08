"use client";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="text-center p-20 text-red-600">
      <h2>Une erreur est survenue</h2>
      <p>{error.message}</p>
      <button onClick={reset} className="mt-4 underline text-blue-700">
        Réessayer
      </button>
    </div>
  );
}
