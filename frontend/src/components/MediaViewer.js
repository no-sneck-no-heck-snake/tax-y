import { Tooltip } from "@material-ui/core";
import React, { useState } from "react";
import styled from "styled-components";
import { BASE_URI } from "../Config"

const MediaContainer = styled.div`
  position: relative;
`;

const HighlightContainer = styled.div`
  top: 0;
  left: 0;
  position: absolute;
  width: 100%;
  height: 100%;
`;

const Highlight = styled.div`
  cursor: pointer;
  position: absolute;
  border: 1px solid rgb(255,0,0);
  background-color: rgba(3, 152, 252, 0.5);
`; 

export function MediaViewer({ taxEntry }) {
  return (
    <MediaContainer>
        <img style={{ width: "100%"}} src={ BASE_URI + "/" + taxEntry.file}></img>
        <HighlightContainer>
          { taxEntry.content.map(h => <Tooltip key={h.name} title={`${h.name}:${h.value}`}><Highlight style={{ 
            top: `${(100 / taxEntry.height) * (h.top - 5)}%`, 
            left: `${(100 / taxEntry.width) * (h.left - 5)}%`,
            height: `${(100 / taxEntry.height) * h.height}%`,
            width: `${(100 / taxEntry.width) * h.width}%`,
          }}></Highlight></Tooltip>) }
        </HighlightContainer>
    </MediaContainer>
  );
}
