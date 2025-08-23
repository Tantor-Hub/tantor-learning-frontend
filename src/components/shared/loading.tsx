// import { Loader2 } from "lucide-react";

export function Loading({ text }: { text?: string }) {
  return (
    // <div className="flex flex-col items-center justify-center h-[50vh]">
    //   <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
    //   <p className="text-lg font-medium text-gray-700">{text || "Chargement en cours..."}</p>
    // </div>
    <div className="flex flex-col items-center justify-center h-[50vh]">
      <div className="flex items-center justify-center py-12">
        <div
          className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-e-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
          role="status"
        >
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
            {text || "Chargement..."}
          </span>
        </div>
      </div>
    </div>
  );
}
