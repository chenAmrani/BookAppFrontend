import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import BootstrapNavbar from "react-bootstrap/Navbar";
import { Link } from "react-router-dom";
import { User } from "../../types";
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "../../constants";

export function Navbar({
  user,
  setUser,
}: {
  user: User;
  setUser: (user: User | null) => void;
  googleSignIn: boolean;
}) {
  const handleLogout = () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    setUser(null);
  };
  return (
    <>
      <BootstrapNavbar bg="dark" data-bs-theme="dark">
        <Container>
          <BootstrapNavbar.Brand>
            <Link to="/">
              <img src="/src/assets/Logo.png" alt="Logo" height="30" />
            </Link>
          </BootstrapNavbar.Brand>
          <Nav className="me-auto">
            {user ? (
              <>
                <Link to="/" onClick={handleLogout}>
                  Logout
                </Link>
                <Link style={{ marginLeft: "20px" }} to="/profile">
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
          </Nav>
        </Container>
      </BootstrapNavbar>
    </>
  );
}
