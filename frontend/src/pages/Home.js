import React, { useCallback, useState } from "react";
import { SummaryCard } from "../components/SummaryCard";
import { useFetch } from "use-http";
import { Grid } from "@material-ui/core";
import { DashboardCardSkeleton } from "../components/DashboardCardSkeleton";
import { SummaryEntry } from "../components/SummaryEntry";
import {
  Card as _Card,
  CardContent,
  Typography,
  Box,
  Hidden,
} from "@material-ui/core";
import { DeductionCategory } from "../components/DeductionCategory";
import { DeductionChart } from "../components/DeductionChart";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import { SavingProgress } from "../components/SavingProgress";
import { useDropzone } from "react-dropzone";
import styled from "styled-components";
import UploadModal from "../components/UploadModal";
import Alert from "@material-ui/lab/Alert";
import { useHistory } from "react-router-dom";

import { NumberCard } from "../components/NumberCard";
import SimpleSlider from "../components/SimpleSlider";

import { ImportFile } from "../components/ImportFile";

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

const Card = styled(_Card)`
  box-shadow: 0 2.8px 3.3px rgba(0, 0, 0, 0.028),
    0 6.7px 6.9px rgba(0, 0, 0, 0.044), 0 12.5px 11.3px rgba(0, 0, 0, 0.056),
    0 22.3px 17.5px rgba(0, 0, 0, 0.067), 0 41.8px 29.4px rgba(0, 0, 0, 0.074),
    0 100px 71px rgba(0, 0, 0, 0.07) !important;
  margin-bottom: 16px;
`;
export function Home() {
  const {
    loading,
    error,
    data = { capital: [], deductions: [], income: [] },
  } = useFetch("/info", { method: "GET" }, []);

  console.log(data);
  const { post } = useFetch("document");
  const deductions = useFetch("/deductions", { method: "GET" }, []);
  let history = useHistory();

  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const onDrop = useCallback(async (acceptedFiles) => {
    let file = acceptedFiles[0];
    setUploadModalOpen(true);
    let data = new FormData();
    data.append("file", file);
    if (data instanceof FormData) {
      let response = await post("", data);
      setUploadModalOpen(false);
      if (response && response.id) {
        history.push("/entry/" + response.id["$oid"]);
      } else {
        //alert("Error on detecting")
      }
    }
  }, []);

  const { getRootProps, isDragActive } = useDropzone({ onDrop });
  const taxes = useFetch("/calculate-taxes", { method: "GET" }, []);

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
    <div {...getRootProps()} style={{ outline: "none" }}>
      {isDragActive ? (
        <Alert variant="outlined" severity="info">
          Datei hier loslassen
        </Alert>
      ) : (
        <></>
      )}
      <Grid container spacing={4} style={{ marginBottom: "32px" }}>
        <Grid item xs={6} md={3}>
          <NumberCard
            title="Kantonssteuer"
            loading={taxes.loading}
            number={taxes.data && taxes.data.canton}
            background="251, 59, 127"
          ></NumberCard>
        </Grid>
        <Grid item xs={6} md={3}>
          <NumberCard
            title="Gemeindesteuer"
            loading={taxes.loading}
            number={taxes.data && taxes.data.city}
            background="68, 170, 81"
          ></NumberCard>
        </Grid>
        <Grid item xs={6} md={3}>
          <NumberCard
            title="Bundessteuer"
            loading={taxes.loading}
            number={taxes.data && taxes.data.fed}
            background="255, 168, 70"
          ></NumberCard>
        </Grid>
        <Grid item xs={6} md={3}>
          <NumberCard
            title="Total"
            loading={taxes.loading}
            number={taxes.data && taxes.data.total}
            background="83, 113, 227"
          ></NumberCard>
        </Grid>
      </Grid>
      <Card container spacing={3} style={{ marginBottom: 32 }}>
        <Grid item xs={12}>
          <SimpleSlider />
        </Grid>
      </Card>
      <Card>
        <UploadModal
          open={uploadModalOpen}
          setOpen={setUploadModalOpen}
        ></UploadModal>
        <CardContent>
          <Typography gutterBottom={true} variant="h5">
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
          <SummaryCard title="Einkünfte" amount={data.totalIncome}>
            {loading ? (
              <DashboardCardSkeleton />
            ) : (
              data.income.map((d) => <SummaryEntry item={d} />)
            )}
          </SummaryCard>
        </Grid>
        <Grid item xs={12} md={6}>
          <SummaryCard title="Vermögen" amount={data.totalCapital}>
            {loading ? (
              <DashboardCardSkeleton />
            ) : (
              data.capital.map((d) => <SummaryEntry item={d} />)
            )}
          </SummaryCard>
        </Grid>
      </Grid>
      <ImportFile></ImportFile>
    </div>
  );
}
