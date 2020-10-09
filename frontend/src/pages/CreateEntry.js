import React from "react";
import styled from "styled-components";
import useFetch from 'use-http'
import { makeStyles } from '@material-ui/core/styles';
import { MediaViewer } from "../components/MediaViewer"
import { Grid, Card, FormControl, InputLabel, Select } from "@material-ui/core"
import { BASE_URI } from "../Config"

export function CreateEntry() {

  const StyledMediaViewer = styled(MediaViewer)`
      width: 100%;
  `; 

  const { loading, error, data = {} } = useFetch(BASE_URI + "/dummyImage", {}, [])

  const useStyles = makeStyles((theme) => ({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
  }));

  const classes = useStyles();
  const [state, setState] = React.useState({
    age: '',
    name: 'hai',
  });

  const handleChange = (event) => {
    const name = event.target.name;
    setState({
      ...state,
      [name]: event.target.value,
    });
  };

  return <>
    { !loading &&
      <Grid container spacing={4}>
        <Grid container item xs={6}>
          <Card>
            <StyledMediaViewer
                src="https://image.slidesharecdn.com/987fc920-d157-431c-9f02-ce3e44f9e9ff-150806172436-lva1-app6891/95/documentation-plan-example-1-638.jpg?cb=1438881924"
                highlights={ [ { x: 100, y: 300, height: 20, width: 30 } ] }>
              </StyledMediaViewer>
          </Card>
        </Grid>
        <Grid container item xs={6}>
          <Card style={{width: "100%"}}>
            <FormControl fullWidth="true" variant="outlined" className={classes.formControl}>
              <InputLabel htmlFor="outlined-documentType">Dokumentart</InputLabel>
              <Select
                native
                value={state.age}
                onChange={handleChange}
                label="Art"
                inputProps={{
                  name: 'documentType',
                  id: 'outlined-documentType',
                }}
              >
                <option aria-label="None" value="" />
                <option value={10}>Vermögen</option>
                <option value={20}>Abzüge</option>
                <option value={30}>Einkünfte</option>
              </Select>
            </FormControl>
          </Card>
        </Grid>
      </Grid>
  }
  </>;
}
