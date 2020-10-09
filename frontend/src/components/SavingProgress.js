import React from "react";
import { Line } from "rc-progress";
import { formatFranks } from "../util";

export function SavingProgress({ value, potential, trailColor }) {
  const percent = (value / potential) * 100;
  let strokeColor = "#F44336";
  if (percent > 25) {
    strokeColor = "#FF9800";
  }
  if (percent > 50) {
    strokeColor = "#CDDC39";
  }
  if (percent > 75) {
    strokeColor = "#4CAF50";
  }
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ marginRight: "8px" }}>
        {formatFranks(value)} / {formatFranks(potential)}
      </div>
      <div style={{ width: "50px" }}>
        <Line
          strokeWidth="14"
          strokeColor={strokeColor}
          percent={percent}
          trailColor={trailColor || "rgba(255,255,255,0.5)"}
          trailWidth="14"
        ></Line>
      </div>
    </div>
  );
}
