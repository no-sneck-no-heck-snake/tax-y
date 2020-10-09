import React, { useState } from "react";
import styled from "styled-components";

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
  position: absolute;
  border: 1px solid rgb(255,0,0);
  background-color: rgba(3, 152, 252, 0.5);
`; 

export function MediaViewer({ src, highlights }) {
  return (
    <MediaContainer>
        <img src={src}></img>
        <HighlightContainer>
          { highlights.map(h => <Highlight style={{ 
            top: `${h.y}px`, 
            left: `${h.x}px`,
            height: `${h.height}px`,
            width: `${h.width}px`,
          }}></Highlight>) }
        </HighlightContainer>
    </MediaContainer>
  );
}
