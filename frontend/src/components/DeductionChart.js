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
    <ResponsiveContainer width="100%" height={250}>
      <PieChart
        margin={{ top: -80, left: 0, bottom: 0, right: 0 }}
        width={400}
        height={400}
      >
        <Pie
          data={categories}
          dataKey="value"
          cx={200}
          cy={200}
          outerRadius={60}
          fill="#8884d8"
        >
          {categories.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={getCategoryColor(entry.name)} />
          ))}
        </Pie>
        <Pie
          data={categoriesOuterRadiant}
          dataKey="value"
          cx={200}
          cy={200}
          innerRadius={70}
          outerRadius={90}
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
