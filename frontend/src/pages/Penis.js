import React from "react";
import { MediaViewer } from "../components/MediaViewer"

export function Penis() {
  return <MediaViewer 
    src="https://image.slidesharecdn.com/987fc920-d157-431c-9f02-ce3e44f9e9ff-150806172436-lva1-app6891/95/documentation-plan-example-1-638.jpg?cb=1438881924"
    highlights={ [ { x: 10, y: 5, height: 20, width: 30 } ] }>
  </MediaViewer>;
}
