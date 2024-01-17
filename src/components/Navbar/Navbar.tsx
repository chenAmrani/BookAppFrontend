import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import BootstrapNavbar from "react-bootstrap/Navbar";
import { Link } from "react-router-dom";
import { User } from "../../types";

export function Navbar({
  user,
  setUser,
}: {
  user: User;
  setUser: (user: User | null) => void;
}) {
  return (
    <>
      <BootstrapNavbar bg="dark" data-bs-theme="dark">
        <Container>
          <BootstrapNavbar.Brand>
            <Link to='/'><img
                src="/src/assets/Logo.png"  
                alt="Logo"
                height="30"
              /></Link>
            
            
          </BootstrapNavbar.Brand>
          <Nav className="me-auto">
          {user ? (
              <>
              <Link to="/" onClick={() => setUser(null)}>
              Logout
              </Link>
              <Link style={{marginLeft:"20px"}} to="/profile">
              Profile
              </Link>
              </>
            ) : (
              <>
                <Link className="nav-link" to="login">
                  Login
                </Link>

                <Link className="nav-link" to="signup">
                  Signup
                </Link>
              </>
            )}
            {/* <Nav.Link>Features</Nav.Link> */}
            {/* <Nav.Link>Pricing</Nav.Link> */}
          </Nav>
        </Container>
      </BootstrapNavbar>
    </>
  );
}
