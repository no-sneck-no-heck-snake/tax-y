import React from "react";
import CountUp from "react-countup";

import { Card as _Card, CardContent, Typography } from "@material-ui/core";
import styled from "styled-components";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { formatFranks } from "../util";

const getBoxShadow = (rgb) => `0 2.8px 3.3px rgba(${rgb}, 0.028),
    0 6.7px 6.9px rgba(${rgb}, 0.044), 0 12.5px 11.3px rgba(${rgb}, 0.056),
    0 22.3px 17.5px rgba(${rgb}, 0.067), 0 41.8px 29.4px rgba(${rgb}, 0.074),
    0 100px 71px rgba(${rgb}, 0.07)
`;

const Card = styled(_Card)`
  margin: 16px 0;
  height: 100%;
  width: 100%;
`;
const Count = styled(CountUp)`
  color: white;
  font-size: 32px;
`;

export function NumberCard({ title, background, loading, number }) {
  return (
    <>
      <Card
        style={{
          background: `rgb(${background})`,
          boxShadow: getBoxShadow(background),
        }}
        background={background}
      >
        <CardContent style={{ display: "flex", flexDirection: "column" }}>
          <Typography
            style={{ marginBottom: "16px", color: "white" }}
            variant="h7"
          >
            {title}
          </Typography>

          {loading ? (
            <SkeletonTheme color="rgba(255,255,255,0.2)" highlightColor="rgba(255,255,255,0.1)">
              <Skeleton height={40} width={80} />
            </SkeletonTheme>
          ) : (
            <Count formattingFn={formatFranks} end={number} />
          )}
        </CardContent>
      </Card>
    </>
  );
}
