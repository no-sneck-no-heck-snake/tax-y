import React from "react";
import { SummaryCard } from "../components/SummaryCard";
import { useFetch } from "use-http";
import { Grid } from "@material-ui/core";
import { DashboardCardSkeleton } from "../components/DashboardCardSkeleton";
import { SummaryEntry } from "../components/SummaryEntry";
import { SavingProgress } from "../components/SavingProgress";

{
  /* <Grid container spacing={3}>
    <Grid item xs={12} md={4}>
      <Jumbo title="Vermögen" image="/images/vermoegen.jpg">
        Verwalte dein Vermögen und lade deine Dokumente hoch
      </Jumbo>
    </Grid>
    <Grid item xs={12} md={4}>
      <Jumbo title="Abzüge" image="/images/abzuege.jpg">
        Verwalte deine Abzüge und lade deine Dokumente hoch
      </Jumbo>
    </Grid>
    <Grid item xs={12} md={4}>
      <Jumbo title="Einkünfte" image="/images/einkuenfte.png">
        Verwalte dein Einkünfte und lade deine Dokumente hoch
      </Jumbo>
    </Grid>
  </Grid> */
}

export function Home() {
  const {
    loading,
    error,
    data = { capital: [], deductions: [], income: [] },
  } = useFetch("/info", { method: "GET" }, []);

  let value;
  let potential;

  data.deductions = data.deductions.map((d) => ({ ...d, potential: 10000 }));

  if (data.deductions.length > 1) {
    value = data.deductions.reduce((a, b) => a.value + b.value, 0);
    potential = data.deductions.reduce((a, b) => a.potential + b.potential, 0);
    console.log(data.deductions);
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <SummaryCard background="#FB3B7F" title="Einkünfte">
          {loading ? (
            <DashboardCardSkeleton />
          ) : (
            data.income.map((d) => <SummaryEntry item={d} />)
          )}
        </SummaryCard>
      </Grid>
      <Grid item xs={12} md={4}>
        <SummaryCard background="rgb(243, 171, 62)" title="Vermögen">
          {loading ? (
            <DashboardCardSkeleton />
          ) : (
            data.capital.map((d) => <SummaryEntry item={d} />)
          )}
        </SummaryCard>
      </Grid>
      <Grid item xs={12} md={4}>
        <SummaryCard
          background="#4452FB"
          title="Abzüge"
          progress={
            data.deductions.length > 1 ? (
              <SavingProgress value={value} potential={potential} />
            ) : (
              <></>
            )
          }
        >
          {loading ? (
            <DashboardCardSkeleton />
          ) : (
            data.deductions.map((d) => <SummaryEntry item={d} />)
          )}
        </SummaryCard>
      </Grid>
    </Grid>
  );
}
