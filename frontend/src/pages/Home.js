import React from "react";
import { SummaryCard } from "../components/SummaryCard";
import { useFetch } from "use-http";
import { Grid } from "@material-ui/core";
import { DashboardCardSkeleton } from "../components/DashboardCardSkeleton";
import { SummaryEntry } from "../components/SummaryEntry";
import { Card, CardContent, Typography, Box, Hidden } from "@material-ui/core";
import { DeductionCategory } from "../components/DeductionCategory";
import { DeductionChart } from "../components/DeductionChart";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";

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
  const deductions = useFetch("/deductions", { method: "GET" }, []);

  if (error) {
    return (
      <Typography
        variant="h2"
        style={{
          textAlign: "center",
          color: "rgba(0,0,0,0.5)",
          paddingTop: "64px",
          fontWeight: 200,
        }}
      >
        <FontAwesomeIcon color="red" icon={faExclamationCircle} />
        <br />
        Benjamin went wrong :(
      </Typography>
    );
  }

  return (
    <>
      <Card>
        <CardContent>
          <Typography gutterBottom={true} variant="h3">
            Abzüge
          </Typography>
          <Grid container spacing={2}>
            <Box clone order={{ xs: 2, md: 1 }}>
              <Grid item xs={12} md={6}>
                {deductions.loading ? (
                  <DashboardCardSkeleton />
                ) : (
                  (deductions.data.categories || []).map((c) => (
                    <DeductionCategory category={c}></DeductionCategory>
                  ))
                )}
              </Grid>
            </Box>
            <Box clone order={{ xs: 1, md: 2 }}>
              <Grid
                item
                xs={12}
                md={6}
                style={{ display: "flex", justifyContent: "center" }}
              >
                {deductions.loading ? (
                  <></>
                ) : (
                  <>
                    <Hidden mdDown>
                      <span style={{ flexGrow: "1" }}></span>
                    </Hidden>
                    <DeductionChart data={deductions.data}></DeductionChart>
                  </>
                )}
              </Grid>
            </Box>
          </Grid>
        </CardContent>
      </Card>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <SummaryCard background="#FB3B7F" title="Einkünfte">
            {loading ? (
              <DashboardCardSkeleton />
            ) : (
              data.income.map((d) => <SummaryEntry item={d} />)
            )}
          </SummaryCard>
        </Grid>
        <Grid item xs={12} md={6}>
          <SummaryCard background="rgb(243, 171, 62)" title="Vermögen">
            {loading ? (
              <DashboardCardSkeleton />
            ) : (
              data.capital.map((d) => <SummaryEntry item={d} />)
            )}
          </SummaryCard>
        </Grid>
      </Grid>
    </>
  );
}
