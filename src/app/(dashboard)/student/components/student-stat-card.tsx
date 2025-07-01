import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ReactNode } from "react";

const StatCard = ({
  title,
  icon,
  value,
  description,
  change,
}: {
  title: string;
  icon: ReactNode;
  value: string | number;
  description: string;
  change: string;
}) => {
  return (
    <Card className="gap-0 py-4">
      <CardHeader className="px-4">
        <CardTitle className="flex justify-between items-center">
          <h1 className="text-sm md:text-base">{title}</h1>
          <span>{icon}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 flex gap-2.5 items-center">
        <span className="font-black text-xl md:text-2xl">{value}</span>
        <span
          className={`text-[10px] ${change.includes("↗") ? "text-[#00CBB8]" : "text-[#FF0000]"}`}
        >
          {change}
        </span>
      </CardContent>
      <CardFooter className="px-4">
        <p className="text-[10px] text-[#5C677D]">{description}</p>
      </CardFooter>
    </Card>
  );
};
export default StatCard;
