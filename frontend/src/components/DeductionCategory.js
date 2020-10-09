import { Typography } from "@material-ui/core";
import React from "react";
import { formatFranks } from "../util";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSchool,
  faFile,
  faChild,
  faPoll,
} from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import { getCategoryIcon, getCategoryColor } from "../category";

library.add(faSchool, faChild, faFile, faPoll);

const DeductionEntryContent = styled.div`
  border-left: 2px dashed rgba(0, 0, 0, 0.2);
  margin-bottom: 4px;
  padding: 8px 24px;
  display: flex;
  padding-right: 0;
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

function DeductionEntry({ entry }) {
  return (
    <DeductionEntryContainer>
      <DeductionEntryContent>
        <span style={{ display: "block" }}>{entry.name}</span>
        <span style={{ flexGrow: "1" }}></span>
        <div style={{ whiteSpace: "nowrap" }}>{formatFranks(entry.value)}</div>
      </DeductionEntryContent>
    </DeductionEntryContainer>
  );
}

export function DeductionCategory({ category }) {
  return (
    <>
      <div style={{ display: "flex" }}>
        <Typography
          gutterBottom={true}
          variant="h6"
          style={{ color: category.color }}
        >
          <FontAwesomeIcon
            style={{
              width: "18px",
              marginRight: "16px",
            }}
            icon={["fa", category.icon]}
          />
          {category.displayName}
        </Typography>
        <span style={{ flexGrow: "1" }}></span>
        <Typography variant="h6" noWrap={true}>
          {formatFranks(category.currentDeduction)}
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
