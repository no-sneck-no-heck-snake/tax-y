import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom'
import styled from "styled-components";
import useFetch from 'use-http'
import { Save } from "@material-ui/icons"
import { MediaViewer } from "../components/MediaViewer"
import { Grid, Card, FormControl, InputLabel, Select, TextField, Button, CardActions, CardContent } from "@material-ui/core"

const FormGridRow = styled(Grid)`
  padding: 10px 0px;
`
const BottomActionsCard = styled(Card)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

const StyledMediaViewer = styled(MediaViewer)`
  width: 100%;
`;

export function EntryDetail({  }) { 

  const { entryId } = useParams();

  const [image, setImage] = useState(null)
  const { get, response, loading, error } = useFetch()

  const [taxEntry, setTaxEntry] = useState({
    documentType: "",
    value: 0
  });

  useEffect(() => { loadImage() }, []) // componentDidMount

  async function loadImage() {
    const initialImage = await get("/entry/" + entryId)
    if (response.ok) setImage(initialImage)
  }

  return <>
    { image &&
      <Grid container spacing={4}>
        {/* <Grid container item>
          <Button color="primary" component={Link} to="/">Back</Button>
        </Grid> */}
        <Grid container item xs={6}>
          <Card>
            <StyledMediaViewer
                image={image}>
              </StyledMediaViewer>
          </Card>
        </Grid>
        <Grid container item xs={6}>
          <CreateEntryForm taxEntry={taxEntry} setTaxEntry={setTaxEntry}></CreateEntryForm>
        </Grid>
      </Grid>
  }
  </>;
}

function CreateEntryForm({ setTaxEntry, taxEntry }) {

  const { put, response, loading, error } = useFetch()

  const handleChange = (event) => {
    const name = event.target.name;
    setTaxEntry({
      ...taxEntry,
      [name]: event.target.value,
    });
  };

  async function updateEntry() {
    const updatedEntry = await put('/entry/1', entry.id)
  }

  return <BottomActionsCard style={{width: "100%"}}>
  <CardContent>
    <Grid container>
      <FormGridRow container item xs={12}>
        <FormControl fullWidth={true} variant="filled">
          <InputLabel htmlFor="outlined-documentType">Dokumentart</InputLabel>
          <Select
            native
            value={taxEntry.documentType}
            onChange={handleChange}
            label="Dokumentart"
            inputProps={{
              name: 'documentType',
              id: 'outlined-documentType',
            }}
          >
            <option aria-label="None" value="" />
            <option value={"capital"}>Vermögen</option>
            <option value={"deductions"}>Abzüge</option>
            <option value={"income"}>Einkünfte</option>
          </Select>
        </FormControl>
      </FormGridRow>
      <FormGridRow container item xs={12}>
        <FormControl fullWidth={true}>
          <TextField
            id="filled-number"
            label="Betrag"
            type="number"
            InputLabelProps={{
              shrink: true,
            }}
            name="value"
            value={taxEntry.value} onChange={handleChange}
            variant="outlined"
          />
        </FormControl>
      </FormGridRow>
    </Grid>
  </CardContent>
  <CardActions style={{ justifyContent: 'flex-end' }}>
    <Button
      variant="contained"
      color="primary"
      size="large"
      onClick={(e) => updateEntry()}
      startIcon={<Save />}
    >
      Save
    </Button>
  </CardActions>
</BottomActionsCard>
}
