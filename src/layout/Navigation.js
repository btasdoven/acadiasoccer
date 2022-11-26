import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link, useLocation } from 'react-router-dom';
import AppNavList from "./AppNavList"

import './Navigation.css'

function Navigator() {
  const location = useLocation();

  return ( 
    <>
      <Navbar.Toggle aria-controls="navbar-nav" />
      <Navbar.Collapse id="navbar-nav" className="justify-content-end">
        <Nav activeKey={location.pathname} className="me-auto">
          <AppNavList navLinkClasses="nav-items d-md-none" />
        </Nav>
      </Navbar.Collapse>
    </>
  );
}

function Navigation({brandOnly}) {
  return (
    <Navbar bg="white" expand="md" collapseOnSelect="true" sticky="top" style={{zIndex: 1000}}>
      <Container fluid>
        <Navbar.Brand as={Link} to="/">ACADIA SOCCER</Navbar.Brand>

        {!brandOnly && <Navigator />}
      </Container>
    </Navbar>
  );
}

export default Navigation;