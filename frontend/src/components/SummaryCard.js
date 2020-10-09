import React from "react";

import {
  Grid,
  Card as _Card,
  CardContent,
  Typography,
} from "@material-ui/core";
import styled from "styled-components";

const Card = styled(_Card)`
  box-shadow: 0 2.8px 3.3px rgba(0, 0, 0, 0.028),
    0 6.7px 6.9px rgba(0, 0, 0, 0.044), 0 12.5px 11.3px rgba(0, 0, 0, 0.056),
    0 22.3px 17.5px rgba(0, 0, 0, 0.067), 0 41.8px 29.4px rgba(0, 0, 0, 0.074),
    0 100px 71px rgba(0, 0, 0, 0.07) !important;
  margin: 16px 0;
  height: 100%;
`;

const ItemContent = styled(Grid)`
  color: white;
`;

export function SummaryCard({ title, background, children, progress }) {
  return (
    <>
      <Card style={{ background }}>
        <CardContent>
          <Typography
            style={{ marginBottom: "16px", color: "white" }}
            gutterBottom={true}
            variant="h5"
            component="h2"
          >
            {title}
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              {progress ? progress : <></>}
            </div>
          </Typography>
          {/* <ItemContent container spacing={2}>
            <Grid item xs={6}>
              Kategorie
            </Grid>
            <Grid style={{ textAlign: "right" }} item xs={6}>
              Ausschöpfung
            </Grid>
          </ItemContent> */}
          {children}
        </CardContent>
      </Card>
    </>
  );
}
