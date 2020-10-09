import React, {useState} from "react";
import Button from "@material-ui/core/button";
import {Upload} from "./Upload";

export function AddButton() {
    
const [isOpen, setIsOpen] = useState(true);

    return (
        <>
            <Upload>{isOpen ? <p>Toggle me</p> : <></>}</Upload>
            <Button
                onClick={() => setIsOpen(!isOpen)}
                variant="contained"
                color="primary"
            >
                Toggle me
            </Button>
        </>
    );

}