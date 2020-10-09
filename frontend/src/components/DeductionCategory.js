import { Typography } from "@material-ui/core";
import React from "react";
import { SavingProgress } from "./SavingProgress";
import { formatFranks } from "../util";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSchool, faFile, faChild } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";

library.add(faSchool, faChild, faFile);

const DeductionEntryContent = styled.div`
  border-left: 2px dashed rgba(0, 0, 0, 0.2);
  margin-bottom: 4px;
  padding: 8px 24px;
  display: flex;
`;

const DeductionEntryContainer = styled.div`
  margin-left: 8px;
  position: relative;
  &:before {
    content: "";
    display: block;
    position: absolute;
    left: -9px;
    width: 12px;
    height: 12px;
    border-radius: 100%;
    background: #cccccc;
    top: 7px;
    border: 4px solid white;
  }
`;

function getCategoryIcon(value) {
  switch (value) {
    case "Ausbildung":
      return "school";
    case "Kinder":
      return "child";
    default:
      return "file";
  }
}

function DeductionEntry({ entry }) {
  return (
    <DeductionEntryContainer>
      <DeductionEntryContent>
        <span style={{ width: "264px", display: "block" }}>{entry.name}</span>
        {formatFranks(entry.value)}
      </DeductionEntryContent>
    </DeductionEntryContainer>
  );
}

export function DeductionCategory({ category }) {
  const icon = getCategoryIcon(category.name);
  return (
    <>
      <div style={{ display: "flex" }}>
        <Typography gutterBottom={true} variant="h6" style={{ width: "300px" }}>
          <FontAwesomeIcon
            style={{
              width: "18px",
              marginRight: "16px",
              color: "rgba(0, 0, 0, 0.2)",
            }}
            icon={["fa", icon]}
          />
          {category.name}
        </Typography>
        <Typography variant="h6">
          {category.maxDeduction ? (
            <SavingProgress
              value={category.currentDeduction}
              potential={category.maxDeduction}
              trailColor={"rgba(0,0,0,0.2)"}
            />
          ) : (
            formatFranks(category.currentDeduction)
          )}
        </Typography>
      </div>
      <div>
        {(category.entries || []).map((e) => (
          <DeductionEntry entry={e} />
        ))}
      </div>
    </>
  );
}
