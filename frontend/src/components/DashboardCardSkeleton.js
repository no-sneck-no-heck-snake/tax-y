import React from "react";
import { Grid } from "@material-ui/core";
import Skeleton from "react-loading-skeleton";

export function DashboardCardSkeleton() {
  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <Skeleton />
        </Grid>
        <Grid item xs={2}></Grid>
        <Grid item xs={4}>
          <Skeleton />
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <Skeleton />
        </Grid>
        <Grid item xs={3}></Grid>
        <Grid item xs={3}>
          <Skeleton />
        </Grid>
      </Grid>
    </>
  );
}
