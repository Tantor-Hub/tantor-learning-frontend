import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function StepCard({
  number,
  title,
  description,
}: {
  number: number;
  title: string;
  description: string;
}) {
  return (
    <Card className="border-ring shadow-ring">
      <CardContent className="flex items-center justify-center">
        <div className="bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center">
          {number}
        </div>
      </CardContent>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription className="text-sm">{description}</CardDescription>
      </CardHeader>
    </Card>
  );
}
