"use client";
import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

const data = [
  {
    name: "Janvier",
    pv: 240,
  },
  {
    name: "Février",
    pv: 139,
  },
  {
    name: "Mars",
    pv: 98,
  },
  {
    name: "Avril",
    pv: 390,
  },
  {
    name: "Mai",
    pv: 480,
  },
  {
    name: "Juin",
    pv: 380,
  },
];

export function BarVisual() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        width={500}
        height={300}
        data={data}
        margin={{
          top: 5,
          right: 20,
          left: 20,
          bottom: 5,
        }}
        barSize={12}
      >
        <XAxis
          dataKey="name"
          scale="point"
          padding={{ left: 20, right: 20 }}
          axisLine={false}
          tickLine={false}
          fontSize={12}
        />
        <YAxis axisLine={false} tickLine={false} fontSize={12} />
        <Tooltip />
        <Bar dataKey="pv" fill="#0466C8" background={{ fill: "#eee" }} radius={[6, 6, 6, 6]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
