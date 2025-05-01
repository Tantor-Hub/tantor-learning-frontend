"use client";

import { Pie, PieChart, ResponsiveContainer, Cell, Legend, Sector, Label } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { useEffect, useState } from "react";

const chartData = [
  { name: "done", value: 150, fill: "#979DAC", label: "Terminés" },
  { name: "inProgress", value: 100, fill: "#65A9F0", label: "En cours" },
  { name: "toDo", value: 275, fill: "#1976D2", label: "À faire" },
];

const chartConfig = {
  Terminé: { label: "Terminés", color: "#979DAC" },
  "En cours": { label: "En cours", color: "#65A9F0" },
  "A faire": { label: "À faire", color: "#1976D2" },
} satisfies ChartConfig;

export function SecPieChart() {
  const [innerRadius, setInnerRadius] = useState(50);
  const [outerRadius, setOuterRadius] = useState(120);

  useEffect(() => {
    const handleResize = () => {
      const isSmall = window.innerWidth < 640;
      setInnerRadius(isSmall ? 30 : 50);
      setOuterRadius(isSmall ? 80 : 120);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Card className="flex flex-col h-full min-h-[300px] sm:min-h-[400px]">
      <CardHeader className="flex flex-col">
        <CardTitle className="text-lg sm:text-xl text-[#0466C8] font-semibold">
          Statut des tâches
        </CardTitle>
        <CardDescription className="text-xs font-light">
          Répartition des tâches par statut
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pt-0 pb-0 px-2 sm:px-4">
        <ChartContainer config={chartConfig} className="mx-auto h-full max-w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <ChartTooltip
                cursor={false}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-sm">
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold">{data.label}</span>
                          <span className="text-xs text-muted-foreground">{data.value} tâches</span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                innerRadius={innerRadius}
                outerRadius={outerRadius}
                paddingAngle={2}
                cornerRadius={4}
                label={({ cx, cy, midAngle, innerRadius, outerRadius, index }) => {
                  if (!cx || !cy || !innerRadius || !outerRadius || index === undefined)
                    return null;

                  const RADIAN = Math.PI / 180;
                  const radius = innerRadius + (outerRadius - innerRadius) * 1.2;
                  const x = cx + radius * Math.cos(-midAngle * RADIAN);
                  const y = cy + radius * Math.sin(-midAngle * RADIAN);

                  return (
                    <text
                      x={x}
                      y={y}
                      fill={chartData[index].fill}
                      textAnchor={x > cx ? "start" : "end"}
                      dominantBaseline="central"
                      className="text-[10px] sm:text-xs font-medium"
                    >
                      {chartData[index].label}
                    </text>
                  );
                }}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}

                <Label
                  position="center"
                  content={(props) => {
                    const { viewBox } = props;
                    if (!viewBox) return null;

                    const cx = ("cx" in viewBox ? viewBox.cx : (viewBox as any).width / 2) || 0;
                    const cy = ("cy" in viewBox ? viewBox.cy : (viewBox as any).height / 2) || 0;

                    const total = chartData.reduce((sum, entry) => sum + entry.value, 0);

                    return (
                      <text
                        x={cx}
                        y={cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="fill-foreground"
                      >
                        <tspan x={cx} y={cy - 8} className="text-base font-bold">
                          {total}
                        </tspan>
                        <tspan x={cx} y={cy + 10} className="text-[10px]">
                          tâches
                        </tspan>
                      </text>
                    );
                  }}
                />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
