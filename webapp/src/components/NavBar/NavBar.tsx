import { useContext } from 'react';
import { Outlet, useNavigate } from 'react-router-dom'
import { AuthContext } from '../Auth/AuthProvider';
import { Container, Navbar, Nav, Button } from 'react-bootstrap';

export const NavBar = () => {
  const navigate = useNavigate();
  const { isLoggedIn, logout, userType } = useContext(AuthContext);


  const loginLogout = () => {
    if (!isLoggedIn) {
      navigate("login");
    } else {
      logout();
    }
  }

  const isMember = userType == "member";
  const isTrainer = userType == "trainer";
  const isAdmin = userType == "admin";

  return (
    <>
      <Navbar expand="lg" bg="dark" data-bs-theme="dark">
        <Container>
          <Navbar.Brand href="/" className="">Health & Fitness</Navbar.Brand>
          <Navbar.Collapse>
            <Nav className="me-auto">
              <Nav.Link href="/">Home</Nav.Link>
              {isMember && <Nav.Link href="profile">Profile</Nav.Link>}
              {isTrainer && <Nav.Link href="members">Members</Nav.Link>}
              {isLoggedIn && <Nav.Link href="schedule">Schedule</Nav.Link>}
              {(isMember || isAdmin) && <Nav.Link href="billing">Billing</Nav.Link>}
              {isAdmin && <Nav.Link href="rooms">Rooms</Nav.Link>}
            </Nav>
          </Navbar.Collapse>
          <Button type='button' onClick={loginLogout}>
            {isLoggedIn ? "Log out" : "Log in"}
          </Button>
        </Container>
      </Navbar>
      <Outlet />
    </>
  )
}