import React, { useState, useEffect } from 'react';
import { useParams, Link, useHistory } from 'react-router-dom'
import styled from "styled-components";
import useFetch from 'use-http'
import { Save } from "@material-ui/icons"
import { MediaViewer } from "../components/MediaViewer"
import { Grid, Card, FormControl, InputLabel, Select, TextField, Button, CardActions, CardContent, Snackbar, MenuItem, ListItemText, ListItemIcon } from "@material-ui/core"
import { DOCUMENT_TYPES } from "../Config"
import MuiAlert from '@material-ui/lab/Alert';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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

  useEffect(() => { loadEntry() }, []) // componentDidMount

  async function loadEntry() {
    const entry = await get("/entry/" + entryId)
    if (response.ok) {
      entry.id = entryId;
      setTaxEntry(entry);
    }
  }

  return <>
    { error && `Error! ${JSON.stringify(error)}`}
    { loading && 'Loading...'}
    { (!error && taxEntry) &&
      <Grid container spacing={4}>
        {/* <Grid container item>
          <Button color="primary" component={Link} to="/">Back</Button>
        </Grid> */}
        <Grid container item md={6}>
          <Card>
            <StyledMediaViewer
                taxEntry={taxEntry}>
              </StyledMediaViewer>
          </Card>
        </Grid>
        <Grid container item md={6}>
          <CreateEntryForm taxEntry={taxEntry} setTaxEntry={setTaxEntry}></CreateEntryForm>
        </Grid>
      </Grid>
  }
  </>;
}

function CreateEntryForm({ setTaxEntry, taxEntry }) {
  let history = useHistory();

  const { get, put, response, loading, error } = useFetch()
  useEffect(() => {
    updateFields()
  }, [taxEntry]);


  const [deductionCategories, setDeductionCategories] = useState([]);
  useEffect(() => { loadDeductionCategories() }, []) // componentDidMount
  async function loadDeductionCategories() {
    const response = await get("/deduction_categories");
    if (response)
      setDeductionCategories(response.categories)
  }

  const handleChange = (event) => {
    const name = event.target.name;
    const fieldValue = event.target.value;

    if (name === "type" || name == "deductionCategory") {
      setTaxEntry({
        ...taxEntry,
        [name]: fieldValue,
      });
    } else {

      const fieldValues = (taxEntry.content || []).map(c => ({ ...c, name: c.name, value: c.value }));
      const val = fieldValues.find(v => v.name === name);
      if (val) {
        val.value = fieldValue
      } else {
        fieldValues.push({ name, value: fieldValue })
      }
  
      setTaxEntry({
        ...taxEntry,
        ["content"]: fieldValues
      });
    }
  };

  // Sucess Snackbar
  const [successOpen, setOpenSuccess] = React.useState(false);
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSuccess(false);
  };

  // Fileds
  const [fields, setFields] = useState([])
  const handleTypeChange = (event) => {
    handleChange(event);
    updateFields();
  }

  function updateFields() {
    const type = DOCUMENT_TYPES.find(t => t.name === taxEntry.type);
    if (type) {
      setFields(type.fields);
    }
  }

  async function updateEntry() {
    const updatedEntry = await put('/entry/' + taxEntry.id, taxEntry);
    setOpenSuccess(true);
    history.push('/')
  }

  function getEntryValue(name) {
    const field = (taxEntry.content || []).find(f => f.name === name);
    return field ? field.value : "";
  }

  return <><BottomActionsCard style={{width: "100%"}}>
  <CardContent>
    <Grid container>
      <FormGridRow container item xs={12}>
        <FormControl fullWidth={true} variant="filled">
          <InputLabel htmlFor="outlined-documentType">Dokumentart</InputLabel>
          <Select
            value={taxEntry.type}
            onChange={handleTypeChange}
            label="Dokumentart"
            inputProps={{
              name: 'type',
              id: 'outlined-documentType',
            }}
          >
            <MenuItem aria-label="None" value="" />
            { DOCUMENT_TYPES.map(type => <MenuItem value={type.name}>{type.label}</MenuItem>) }
          </Select>
        </FormControl>
      </FormGridRow>
      { taxEntry.type == "bill" &&
        <FormGridRow container item xs={12}>
          <FormControl fullWidth={true} variant="filled">
            <InputLabel htmlFor="outlined-deductionCategory">Abzugsart</InputLabel>
            <Select
              value={taxEntry.deductionCategory ?? ""}
              onChange={handleTypeChange}
              label="Abzugsart"
              inputProps={{
                name: 'deductionCategory',
                id: 'outlined-deductionCategory',
              }}
            >
              <MenuItem aria-label="None" value="" />
              { (deductionCategories || []).map(cat => <MenuItem value={cat.type}>
                <FontAwesomeIcon
                    style={{ marginRight: "5px" }}
                    color={cat.color}
                    icon={["fa", cat.icon]}
                  />
                {cat.displayName}
                </MenuItem>) }
            </Select>
          </FormControl>
        </FormGridRow>
      }
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
    <Button size="large" onClick={(e) => history.push('/')} variant="contained">Zurück</Button>
    <Button
      variant="contained"
      color="primary"
      size="large"
      onClick={(e) => updateEntry()}
      startIcon={<Save />}
    >
      Speichern
    </Button>
  </CardActions>
</BottomActionsCard>
<Snackbar open={successOpen} autoHideDuration={6000} onClose={handleClose}>
  <Alert onClose={handleClose} severity="success">
    Erfolgreich gespeichert!
  </Alert>
</Snackbar>
</>
}

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}
