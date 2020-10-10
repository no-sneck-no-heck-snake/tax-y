import React, { Component } from "react";
import Slider from "react-slick";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
root: {
    marginLeft: 20,
}
}));

export default class SimpleSlider extends Component {
    render() {
        const settings = {
            className: "center",
            dots: false,
            infinite: true,
            autoPlay: true,
            autoplaySpeed: 500,
            slidesToShow: 1,
            slidesToScroll: 1,
            swipe:true
        };
        return (
            <div className="container" style={{paddingLeft:10, backgroundColor: "rgba(188, 193, 186,0.9)"}}>
                <Slider {...settings}>
                    <div style={{marginLeft: 20,
                             textAlign: "center"}}>
                        <h4>Erziehle mehr Abzüge</h4>
                        <p>Spare Geld mit einer weitern Einzahlung in die Säule 3a</p>
                    </div>
                    <div style={{paddingLeft: 20,
                        textAlign: "center"}}>
                        <h4>Studium?</h4>
                        <p>Lade deine Rechnung der Semestergebühren hoch.</p>
                    </div>
                </Slider>
            </div>
        );
    }
}