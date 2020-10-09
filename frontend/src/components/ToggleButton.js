import React, { useState } from "react";
import Button from "@material-ui/core/button";
import styled from "styled-components";

const Container = styled.div`
  font-size: 34px;
`;

const SecondContainer = styled(Container)`
  color: red;

`;

export function ToggleButton() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      <SecondContainer>{isOpen ? <p>Toggle me</p> : <></>}</SecondContainer>
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
