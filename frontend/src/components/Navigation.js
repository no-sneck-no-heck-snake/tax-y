import React from "react";
import styled from "styled-components";

const Nav = styled.nav`
  padding: 16px 32px;
`;
const NavContent = styled.section`
  margin: auto;
  max-width: 900px;
`;

export function Navigation() {
  return (
    <Nav>
      <NavContent>
        <img src="/logo.svg" />
      </NavContent>
    </Nav>
  );
}
