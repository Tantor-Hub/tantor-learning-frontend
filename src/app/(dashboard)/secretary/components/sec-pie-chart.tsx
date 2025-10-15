"use client";

import { Pie, PieChart, ResponsiveContainer, Cell, Legend, Sector, Label } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { useEffect, useState } from "react";
import { useGetAllUserInSessionsQuery } from "@/lib/apis/user-in-session";

const chartConfig = {
  refusedpayment: { label: "Paiement refusé", color: "#D62828" },
  notpaid: { label: "Non payé", color: "#856404" },
  pending: { label: "En attente", color: "#0C5460" },
  in: { label: "Inscrit", color: "#059669" },
  out: { label: "Sorti", color: "#383D41" },
} satisfies ChartConfig;

export function SecPieChart() {
  const { data, isLoading, error } = useGetAllUserInSessionsQuery();
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

  if (isLoading) {
    return (
      <Card className="flex flex-col h-full min-h-[300px] rounded border shadow-none sm:min-h-[400px]">
        <CardContent className="flex-1 flex items-center justify-center">
          <div className="text-center">Chargement...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="flex flex-col h-full min-h-[300px] rounded border shadow-none sm:min-h-[400px]">
        <CardContent className="flex-1 flex items-center justify-center">
          <div className="text-center text-destructive">Erreur lors du chargement des données.</div>
        </CardContent>
      </Card>
    );
  }

  const chartData = [
    {
      name: "refusedpayment",
      value: data?.data?.filter((u) => u.status === "refusedpayment").length || 0,
      fill: "#D62828",
      label: "Paiement refusé",
    },
    {
      name: "notpaid",
      value: data?.data?.filter((u) => u.status === "notpaid").length || 0,
      fill: "#856404",
      label: "Non payé",
    },
    {
      name: "pending",
      value: data?.data?.filter((u) => u.status === "pending").length || 0,
      fill: "#0C5460",
      label: "En attente",
    },
    {
      name: "in",
      value: data?.data?.filter((u) => u.status === "in").length || 0,
      fill: "#059669",
      label: "Inscrit",
    },
    {
      name: "out",
      value: data?.data?.filter((u) => u.status === "out").length || 0,
      fill: "#383D41",
      label: "Sorti",
    },
  ].filter((item) => item.value > 0);

  return (
    <Card className="flex flex-col h-full min-h-[300px] rounded border shadow-none sm:min-h-[400px]">
      <CardHeader className="flex flex-col">
        <CardTitle className="text-lg sm:text-xl text-[#0466C8] font-semibold">
          Statut des inscriptions
        </CardTitle>
        <CardDescription className="text-xs font-light">
          Répartition des utilisateurs par statut d'inscription
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
                      <div className="rounded border bg-background p-2">
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold">{data.label}</span>
                          <span className="text-xs text-muted-foreground">
                            {data.value} utilisateurs
                          </span>
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
                          utilisateurs
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
