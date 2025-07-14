import { ReactNode } from "react";

export function TrainingLayout({ children }: { children: ReactNode }) {
  return <div className="mx-auto max-w-2xl py-8">{children}</div>;
}
