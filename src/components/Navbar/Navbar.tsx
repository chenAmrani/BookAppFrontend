import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import BootstrapNavbar from "react-bootstrap/Navbar";
import { Link } from "react-router-dom";
import { User } from "../../types";
import { MdHome } from "react-icons/md";



export function Navbar({
  user,
  setUser,
}: {
  user: User;
  setUser: (user: User | null) => void;
  googleSignIn: boolean;
}) {

  function handleLogout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  }
  

  const token = localStorage.getItem("accessToken");
      
  return (
    <>
      <BootstrapNavbar bg="dark" data-bs-theme="dark" style={{marginBottom:"-15px"}}>
        <Container>
          <BootstrapNavbar.Brand>
            <h3>
            <Link style={{color:"GrayText"}} to='/'>
            <MdHome
            size={"1.7em"}
            />
              </Link>
              </h3>
            
            
          </BootstrapNavbar.Brand>
          <Nav className="me-auto">
          
          {user || token ?(
              <>
              <Link to="/" onClick={() => handleLogout()}>
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

          
            
          </Nav>
        </Container>
      </BootstrapNavbar>
    </>
  );
}
