import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const Nav = styled.nav`
  padding: 16px 16px;
  padding-bottom: 0;
`;
const NavContent = styled.section`
  margin: auto;
  max-width: 1200px;
  display: flex;
  align-items: center;
`;

export function Navigation() {
  return (
    <Nav>
      <NavContent>
        <Link to="/">
          <img src="/logo.svg" />
        </Link>
      </NavContent>
    </Nav>
  );
}
