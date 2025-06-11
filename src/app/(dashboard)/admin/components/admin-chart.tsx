"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const chartData = [
  { day: "lun", connexion: 80 },
  { day: "mar", connexion: 110 },
  { day: "mer", connexion: 130 },
  { day: "jeu", connexion: 135 },
  { day: "ven", connexion: 160 },
  { day: "sam", connexion: 95 },
  { day: "dim", connexion: 145 },
];

export function AdminChart() {
  return (
    <Card className="text-sm">
      <CardHeader>
        <CardTitle className="text-xl pb-1.5 text-[#0466C8] font-semibold">
          Activité des utilisateurs
        </CardTitle>
        <CardDescription className="text-xs font-light">
          nombre des connections par jours durant les 7 derniers jours{" "}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-40 md:h-80 w-full text-[10px] md:text-xs">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{
                top: 20,
                right: 0,
                left: 0,
                bottom: 10,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" tickLine={true} axisLine={true} tickMargin={8} />
              <YAxis
                tickLine={true}
                axisLine={true}
                tickMargin={8}
                domain={[0, "dataMax + 20"]}
                label={{
                  value: "Nombre de connexions",
                  angle: -90,
                  position: "insideLeft",
                  style: { textAnchor: "middle" },
                }}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white p-1 px-2 border border-gray-200 shadow-md rounded">
                        <p className="font-medium text-xs">{`${payload[0].payload.day}`}</p>
                        <p className="text-xs text-emerald-600">{`Connexions: ${payload[0].value}`}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Line
                type="monotone"
                dataKey="connexion"
                stroke="#00bfa5"
                strokeWidth={3}
                dot={{ stroke: "#00bfa5", strokeWidth: 2, r: 4, fill: "white" }}
                activeDot={{ r: 6, fill: "#00bfa5" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
