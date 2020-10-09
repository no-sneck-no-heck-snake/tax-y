import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import _CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import styled from "styled-components";

const useStyles = makeStyles({
  root: {
    maxWidth: "100%",
    background: "#E3001B",
    color: "white",
    boxShadow: `
    0 2.8px 3.3px rgba(227,0,27, 0.028),
    0 6.7px 6.9px rgba(227,0,27, 0.044),
    0 12.5px 11.3px rgba(227,0,27, 0.056),
    0 22.3px 17.5px rgba(227,0,27, 0.067),
    0 41.8px 29.4px rgba(227,0,27, 0.074),
    0 100px 71px rgba(227,0,27, 0.07)`,
  },
  media: {
    height: 140,
  },
  content: {
    paddingTop: '0px',
  }
});

const CardMedia = styled(_CardMedia)`
  position: relative;

  &:after {
    height: 100%;
    width: 100%;
    display: block;
    content: "";
    background: linear-gradient(
      0deg,
      rgba(227, 0, 27, 1) 0%,
      rgba(227, 0, 27, 0.1) 100%
    );
    position: absolute;
  }
`;

export function Jumbo({ image, title, children }) {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardActionArea>
        <CardMedia
          className={classes.media}
          image={image}
          title="Contemplative Reptile"
        />
        <CardContent className={classes.content}>
          <Typography gutterBottom variant="h5" component="h2">
            {title}
          </Typography>
          <Typography variant="body2" color="white" component="p">
            {children}
          </Typography>
          <List></List>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
