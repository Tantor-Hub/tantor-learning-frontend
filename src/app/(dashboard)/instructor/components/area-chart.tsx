"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Lun", uv: 100 },
  { name: "mar", uv: 60 },
  { name: "mer", uv: 70 },
  { name: "jeu", uv: 85 },
  { name: "ven", uv: 90 },
  { name: "sam", uv: 70 },
  { name: "dim", uv: 65 },
];

const AreaChartComponent = () => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#9ecefe" stopOpacity={1} />
            <stop offset="100%" stopColor="#d5e0eb" stopOpacity={1} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip
          formatter={(value, name) => {
            if (name === "uv") {
              return [value, "pres"];
            }
            return [value, name];
          }}
        />
        <Area type="monotone" dataKey="uv" stroke="#2563EB" strokeWidth={2} fill="url(#colorUv)" />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default AreaChartComponent;
