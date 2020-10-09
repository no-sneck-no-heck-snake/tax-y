import React from "react";
import { Line } from "rc-progress";
import numeral from "numeral";

export function SavingProgress({ value, potential }) {
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
    <div style={{ display: "flex", alignItems: "center" }}>
      <div style={{ marginRight: "8px", fontSize: "12px" }}>
        {numeral(value).format("0,0") + " Fr."} /{" "}
        {numeral(potential).format("0,0") + " Fr."}
      </div>
      <div style={{ width: "50px" }}>
        <Line
          strokeWidth="14"
          strokeColor={strokeColor}
          percent={percent}
          trailColor="white"
          trailWidth="14"
        ></Line>
      </div>
    </div>
  );
}
