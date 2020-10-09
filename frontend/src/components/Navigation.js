import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";

const Nav = styled.nav`
  padding: 16px 32px;
`;
const NavContent = styled.section`
  margin: auto;
  max-width: 1200px;
  display: flex;
  align-items: center;
`;

const Spacer = styled.span`
  flex-grow: 1;
`;

const NavItem = styled(Link)`
  text-decoration: none;
`;

export function Navigation() {
  return (
    <Nav>
      <NavContent>
        <Link to="/">
          <img src="/logo.svg" />
        </Link>
        <Spacer />
      </NavContent>
    </Nav>
  );
}
