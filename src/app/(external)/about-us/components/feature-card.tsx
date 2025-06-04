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
    <Card className={className}>
      <CardContent>
        <Icon size={40} />
      </CardContent>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      {action && (
        <CardFooter>
          <Button variant="outline" className="w-full" onClick={() => router.push("/trainings")}>
            {action}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
