import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

import { StudentStatsType } from "../type";

const StatCard = ({ stat }: { stat: StudentStatsType }) => {
  return (
    <Card className="gap-0 py-4">
      <CardHeader className="px-4">
        <CardTitle className="flex justify-between items-center">
          <h1 className="text-sm md:text-base">{stat.title}</h1>
          <span>{stat.icon}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 flex gap-2.5 items-center">
        <span className="font-black text-xl md:text-2xl">{stat.value}</span>
        <span
          className={`text-[10px] ${stat.change.includes("↗") ? "text-[#00CBB8]" : "text-[#FF0000]"}`}
        >
          {stat.change}
        </span>
      </CardContent>
      <CardFooter className="px-4">
        <p className="text-[10px] text-[#5C677D]">{stat.description}</p>
      </CardFooter>
    </Card>
  );
};
export default StatCard;
