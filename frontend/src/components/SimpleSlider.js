import React, { Component } from "react";
import Slider from "react-slick";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    marginLeft: 20,
  },
}));

export default class SimpleSlider extends Component {
  render() {
    const settings = {
      className: "center",
      dots: true,
      infinite: true,
      autoplay: true,
      autoplaySpeed: 5000,
      slidesToShow: 1,
      slidesToScroll: 1,
      swipe: true,
    };
    return (
      <div
        className="container"
        style={{ margin: 8, backgroundColor: "white" }}
      >
        <Slider {...settings}>
          <div style={{ marginLeft: 20, textAlign: "center" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <img
                src="/images/bulb.webp"
                width="64"
                style={{ margin: "16px" }}
              />
              <div>
                <h4>Erziehle mehr Abzüge</h4>
                <p>Spare Geld mit einer weitern Einzahlung in die Säule 3a</p>
              </div>
            </div>
          </div>
          <div style={{ marginLeft: 20, textAlign: "center" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <img
                src="/images/bulb.webp"
                width="64"
                style={{ margin: "16px" }}
              />
              <div>
                <h4>Studium?</h4>
                <p>Lade deine Rechnung der Semestergebühren hoch.</p>
              </div>
            </div>
          </div>
        </Slider>
      </div>
    );
  }
}
