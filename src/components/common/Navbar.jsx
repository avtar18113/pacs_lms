import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Navbar, Nav, Dropdown, Container } from 'react-bootstrap';

const CustomNavbar = ({ user, onLogout }) => {
  const location = useLocation();

  const handleLogout = () => {
    onLogout();
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold d-flex align-items-center">
          <i className="bi bi-mortarboard-fill me-2"></i>
          LearnHub
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {user && (
              <Nav.Link 
                as={Link} 
                to="/dashboard" 
                active={location.pathname === '/dashboard'}
              >
                <i className="bi bi-speedometer2 me-1"></i>
                Dashboard
              </Nav.Link>
            )}
          </Nav>
          
          <Nav>
            {user ? (
              <Dropdown align="end">
                <Dropdown.Toggle 
                  as={Nav.Link} 
                  className="d-flex align-items-center"
                  id="user-dropdown"
                >
                  <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-2" 
                       style={{ width: '32px', height: '32px' }}>
                    <span className="text-white fw-bold small">
                      {user.full_name ? user.full_name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  {user.full_name || user.email}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.ItemText className="small text-muted">
                    Role: <span className="text-capitalize">{user.user_type}</span>
                  </Dropdown.ItemText>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={handleLogout}>
                    <i className="bi bi-box-arrow-right me-2"></i>
                    Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">
                  <i className="bi bi-box-arrow-in-right me-1"></i>
                  Login
                </Nav.Link>
                <Nav.Link as={Link} to="/register">
                  <i className="bi bi-person-plus me-1"></i>
                  Register
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;