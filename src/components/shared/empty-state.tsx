import React from "react";
import { BookOpen, Calendar, Database, ShieldUser } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: "BookOpen" | "Calendar" | string;
  title: string;
  description: string;
  className?: string;
}

export function EmptyState({ icon, title, description, className }: EmptyStateProps) {
  const IconComponent =
    icon === "BookOpen"
      ? BookOpen
      : icon === "Database"
        ? Database
        : icon === "ShieldUser"
          ? ShieldUser
          : Calendar;
  return (
    <div className={cn("text-center py-12", className)}>
      <IconComponent className="w-12 h-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
