"use client";

import { Pie, PieChart, ResponsiveContainer, Cell, Legend, Sector, Label } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { ChartConfig, ChartContainer, ChartTooltip } from "@/components/ui/chart";

const chartData = [
  { name: "done", value: 150, fill: "#979DAC", label: "Terminés" },
  { name: "inProgress", value: 100, fill: "#65A9F0", label: "En cours" },
  { name: "toDo", value: 275, fill: "#1976D2", label: "À faire" },
];

const chartConfig = {
  Terminé: {
    label: "Terminés",
    color: "#979DAC",
  },
  "En cours": {
    label: "En cours",
    color: "#65A9F0",
  },
  "A faire": {
    label: "À faire",
    color: "#1976D2",
  },
} satisfies ChartConfig;

export function SecPieChart() {
  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="flex flex-col">
        <CardTitle className="text-xl text-[#0466C8] font-semibold">Statut des tâches</CardTitle>
        <CardDescription className="text-xs font-light">
          Répartition des tâches par statut
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pt-0 pb-0 px-4">
        <ChartContainer config={chartConfig} className="mx-auto h-full">
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
                innerRadius={40}
                outerRadius={120}
                paddingAngle={2}
                cornerRadius={4}
                label={(labelProps) => {
                  if (
                    !labelProps.cx ||
                    !labelProps.cy ||
                    !labelProps.innerRadius ||
                    !labelProps.outerRadius
                  ) {
                    return null;
                  }

                  const { cx, cy, midAngle, innerRadius, outerRadius, index } = labelProps;
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
                      className="text-xs font-medium"
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
                  content={(labelProps) => {
                    if (!labelProps.viewBox) {
                      return null;
                    }

                    const viewBox = labelProps.viewBox as { cx: number; cy: number };
                    const { cx, cy } = viewBox;

                    const total = chartData.reduce((sum, entry) => sum + entry.value, 0);
                    return (
                      <text
                        x={cx}
                        y={cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="fill-foreground"
                      >
                        <tspan x={cx} y={cy - 10} className="text-lg font-bold text-center">
                          {total}
                        </tspan>
                        <tspan x={cx} y={cy + 10} className="text-xs text-center">
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
