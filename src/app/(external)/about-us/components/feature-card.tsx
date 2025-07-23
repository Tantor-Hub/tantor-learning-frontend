"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";

export function FeatureCard({
  icon: Icon,
  title,
  description,
  action,
  className,
}: {
  icon: any;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}) {
  const router = useRouter();
  return (
    <Card className={`p-4 m-0 border-none shadow-none ${className}`}>
      <CardContent className="p-0 m-0 w-full text-muted-foreground">
        <Icon size={32} />
        <p className="font-semibold text-foreground py-2">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
        {action && (
          <Button
            variant="outline"
            className="w-full text-primary border-primary mt-2"
            onClick={() => router.push("/trainings")}
          >
            {action}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
