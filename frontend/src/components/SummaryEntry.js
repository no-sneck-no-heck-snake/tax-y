import React from "react";
import styled from "styled-components";
import { Grid } from "@material-ui/core";
import { SavingProgress } from "./SavingProgress";
import { formatFranks } from "../util";
import { Link } from "react-router-dom";

const ItemContainer = styled.div``;

const ItemContent = styled(Grid)`
`;

const DetailLink = styled(Link)`
    text-decoration: none;
    color: rgba(0, 0, 0, 0.87);
    &:hover {
      color: rgba(0, 0, 0, 0.6);;
    }
`;

export function SummaryEntry({ item }) {
  let value = <></>;
  if (item.maxDeduction) {
    value = (
      <SavingProgress
        value={item.value}
        potential={item.maxDeduction}
      ></SavingProgress>
    );
  } else {
    value = formatFranks(item.value);
  }
  return (
    <DetailLink to={`/entry/${item.id}`}>
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
    </DetailLink>
  );
}
