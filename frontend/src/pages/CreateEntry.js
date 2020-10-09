import React, { useState, useEffect } from 'react';
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

export function CreateEntry() { 

  const [image, setImage] = useState(null)
  const { get, response, loading, error } = useFetch()

  const [newEntry, setNewEntry] = useState({
    documentType: "",
    value: 0
  });

  useEffect(() => { loadImage() }, []) // componentDidMount

  async function loadImage() {
    const initialImage = await get("/entry/1")
    if (response.ok) setImage(initialImage)
  }

  return <>
    { image &&
      <Grid container spacing={4}>
        <Grid container item xs={6}>
          <Card>
            <StyledMediaViewer
                image={image}>
              </StyledMediaViewer>
          </Card>
        </Grid>
        <Grid container item xs={6}>
          <CreateEntryForm newEntry={newEntry} setNewEntry={setNewEntry}></CreateEntryForm>
        </Grid>
      </Grid>
  }
  </>;
}

function CreateEntryForm({ setNewEntry, newEntry }) {

  const handleChange = (event) => {
    const name = event.target.name;
    setNewEntry({
      ...newEntry,
      [name]: event.target.value,
    });
  };

  return <BottomActionsCard style={{width: "100%"}}>
  <CardContent>
    <Grid container>
      <FormGridRow container item xs={12}>
        <FormControl fullWidth={true} variant="filled">
          <InputLabel htmlFor="outlined-documentType">Dokumentart</InputLabel>
          <Select
            native
            value={newEntry.documentType}
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
            value={newEntry.value} onChange={handleChange}
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
      startIcon={<Save />}
    >
      Save
    </Button>
  </CardActions>
</BottomActionsCard>
}
