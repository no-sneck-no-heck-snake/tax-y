import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { formatFranks } from "../util";

export function DeductionChart({ data }) {
  const [mounted, setMounted] = useState(false);
  const categories = data.categories.map((category) => ({
    name: category.displayName,
    value: category.maxDeduction || category.currentDeduction,
    color: category.color,
  }));

  const categoriesOuterRadiant = [];

  for (const category of data.categories) {
    if (category.maxDeduction) {
      const value = category.maxDeduction - category.currentDeduction;
      if (value !== 0) {
        categoriesOuterRadiant.push({
          name: category.displayName + " Maximaler Abzug",
          value,
          color: "#cccccc",
        });
      }
    }
    categoriesOuterRadiant.push({
      name: category.displayName + " Abgezogen",
      value: category.currentDeduction,
      color: category.color,
    });
  }

  useEffect(() => setTimeout(() => setMounted(true), 500), [setMounted]);

  return mounted ? (
    <PieChart width={400} height={400} margin={{ left: 50, top: 50 }}>
      <Pie
        data={[...categories]}
        dataKey="value"
        cx={150}
        cy={150}
        outerRadius={45}
        fill="#8884d8"
      >
        {categories.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={entry.color} />
        ))}
      </Pie>
      <Pie
        data={[...categoriesOuterRadiant]}
        dataKey="value"
        cx={150}
        cy={150}
        innerRadius={50}
        outerRadius={67}
        fill="#82ca9d"
        label
        cornerRadius={10}
        paddingAngle={5}
        label={({ value }) => formatFranks(value)}
      >
        {categoriesOuterRadiant.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={entry.color} />
        ))}
      </Pie>
    </PieChart>
  ) : (
    <></>
  );
}
