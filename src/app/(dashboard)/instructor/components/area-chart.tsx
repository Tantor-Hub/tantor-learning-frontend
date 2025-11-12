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
import { useGetPastEventsForInstructorQuery } from "@/lib/apis/events";

const AreaChartComponent = () => {
  const { data: pastEventsData, isLoading } = useGetPastEventsForInstructorQuery();

  // Process past events data to create chart data
  const data = pastEventsData?.data?.rows?.reduce((acc: any[], event: any) => {
    const eventDate = new Date(event.begining_date);
    const dayName = eventDate.toLocaleDateString("fr-FR", { weekday: "short" });

    // Find existing day or create new entry
    const existingDay = acc.find((item) => item.name === dayName);
    if (existingDay) {
      existingDay.uv += event.participantCount || 0;
    } else {
      acc.push({
        name: dayName,
        uv: event.participantCount || 0,
      });
    }

    return acc;
  }, []) || [
    { name: "Lun", uv: 0 },
    { name: "mar", uv: 0 },
    { name: "mer", uv: 0 },
    { name: "jeu", uv: 0 },
    { name: "ven", uv: 0 },
    { name: "sam", uv: 0 },
    { name: "dim", uv: 0 },
  ];

  if (isLoading) {
    return <div className="flex items-center justify-center h-full">Chargement...</div>;
  }

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
              return [value, "présences"];
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
