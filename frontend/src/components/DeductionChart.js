import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { getCategoryColor } from "../category";
import { formatFranks } from "../util";

export function DeductionChart({ data }) {
  const categories = data.categories.map((category) => ({
    name: category.displayName,
    value: category.maxDeduction || category.currentDeduction,
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

  return (
    <ResponsiveContainer width="80%" height={250}>
      <PieChart
        width={300}
        height={300}
      >
        <Pie
          data={categories}
          dataKey="value"
          cx={100}
          cy={100}
          outerRadius={30}
          fill="#8884d8"
        >
          {categories.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={getCategoryColor(entry.name)} />
          ))}
        </Pie>
        <Pie
          data={categoriesOuterRadiant}
          dataKey="value"
          cx={100}
          cy={100}
          innerRadius={35}
          outerRadius={45}
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
    </ResponsiveContainer>
  );
}
