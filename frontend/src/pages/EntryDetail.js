import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom'
import styled from "styled-components";
import useFetch from 'use-http'
import { Save } from "@material-ui/icons"
import { MediaViewer } from "../components/MediaViewer"
import { Grid, Card, FormControl, InputLabel, Select, TextField, Button, CardActions, CardContent } from "@material-ui/core"
import { DOCUMENT_TYPES } from "../Config"

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

export function EntryDetail() { 

  const { entryId } = useParams();

  const { get, response, loading, error } = useFetch()

  const [taxEntry, setTaxEntry] = useState({
    type: "",
    content: []
  });

  useEffect(() => { loadImage() }, []) // componentDidMount

  async function loadImage() {
    console.log(entryId)
    const entry = await get("/entry/" + entryId)
    if (response.ok) setTaxEntry(entry)
  }

  return <>
    { error && `Error! ${JSON.stringify(error)}`}
    { loading && 'Loading...'}
    { (!error && taxEntry) &&
      <Grid container spacing={4}>
        {/* <Grid container item>
          <Button color="primary" component={Link} to="/">Back</Button>
        </Grid> */}
        <Grid container item xs={6}>
          <Card>
            <StyledMediaViewer
                taxEntry={taxEntry}>
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
    const fieldValue = event.target.value;

    if (name === "type") {
      setTaxEntry({
        ...taxEntry,
        [name]: fieldValue,
      });
    } else {

      const fieldValues = taxEntry.content.map(c => ({ name: c.name, value: c.value }));
      const val = fieldValues.find(v => v.name === name);
      if (val) {
        val.value = fieldValue
      }
  
      setTaxEntry({
        ...taxEntry,
        ["content"]: fieldValues
      });
    }
   
  };

  const [fields, setFields] = useState([])
  const handleTypeChange = (event) => {
    const type = DOCUMENT_TYPES.find(t => t.name === event.target.value);
    if (type) {
      setFields(type.fields);
    }

    handleChange(event);
  };

  async function updateEntry() {
    const updatedEntry = await put('/entry/1', taxEntry.id)
  }

  function getEntryValue(name) {
    const field = taxEntry.content.find(f => f.name === name);
    return field ? field.value : "";
  }

  return <BottomActionsCard style={{width: "100%"}}>
  <CardContent>
    <Grid container>
      <FormGridRow container item xs={12}>
        <FormControl fullWidth={true} variant="filled">
          <InputLabel htmlFor="outlined-documentType">Dokumentart</InputLabel>
          <Select
            native
            value={taxEntry.type}
            onChange={handleTypeChange}
            label="Dokumentart"
            inputProps={{
              name: 'type',
              id: 'outlined-documentType',
            }}
          >
            <option aria-label="None" value="" />
            { DOCUMENT_TYPES.map(type => <option value={type.name}>{type.label}</option>) }
          </Select>
        </FormControl>
      </FormGridRow>
      { fields.map(field => <FormGridRow container item xs={12}>
        <FormControl fullWidth={true}>
          <TextField
            label={field.label}
            type={field.type}
            InputLabelProps={{
              shrink: true,
            }}
            name={field.name}
            value={getEntryValue(field.name)} 
            onChange={handleChange}
            variant="outlined"
          />
        </FormControl>
      </FormGridRow>) }
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
