import React from "react";
import { Jumbo } from "../components/Jumbo";
import { Grid } from "@material-ui/core";

export function Home() {
  return (
    <>
      <Grid container spacing={3}>
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
      </Grid>
    </>
  );
}
