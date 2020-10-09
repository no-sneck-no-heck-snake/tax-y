import React from "react";
import styled from "styled-components";
import { Grid } from "@material-ui/core";
import numeral from "numeral";
import { SavingProgress } from "./SavingProgress";

const ItemContainer = styled.div``;

const ItemContent = styled(Grid)`
  color: white;
`;

export function SummaryEntry({ item }) {
  let value = <></>;
  if (item.potential) {
    value = (
      <SavingProgress
        value={item.value}
        potential={item.potential}
      ></SavingProgress>
    );
  } else {
    value = numeral(item.value).format("0,0") + " Fr.";
  }
  return (
    <ItemContainer>
      <ItemContent container spacing={2}>
        <Grid item xs={6}>
          {item.name}
        </Grid>
        <Grid
          style={{ display: "flex", justifyContent: "flex-end" }}
          direction="row"
          item
          xs={6}
        >
          {value}
        </Grid>
      </ItemContent>
    </ItemContainer>
  );
}
