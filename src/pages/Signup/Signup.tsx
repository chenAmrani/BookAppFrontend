import { useEffect, FormEvent, useRef, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Role, User } from "../../types";
import { BASE_URL } from "../../constants";
import { googleSignin } from "../../utilities/googleSignIn";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";


  export function Signup({ setUser }: { setUser: (user: User) => void }) {
    const [role, setRole] = useState<Role>("reader");
    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [loggedIn, setLoggedIn] = useState<boolean>(false);
    const [signedUp, setSignedUp] = useState<boolean>(false); 
    const avatarRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();
  
    useEffect(() => {
      console.log(loggedIn);
    }, [loggedIn]);
  
    useEffect(() => {
      if (signedUp) {
        setLoggedIn(true); // Auto-login after signing up
      }
    }, [signedUp]);
  

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
  
      if (!avatarRef.current?.files?.[0]) {
        return alert("Please select an avatar");
      }
  
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("role", role);
      formData.append("avatar", avatarRef.current?.files?.[0]);
  
      const response = await fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        body: formData,
      });

      const userData = await response.json();
      setUser(userData);
      setSignedUp(true); 
    };
  
    const onGoogleLoginSuccess = async (credentialResponse: CredentialResponse) => {
      console.log(credentialResponse);
      try {
        const res = await googleSignin(credentialResponse);
        
        const userData = res;
        if (!userData) return;
        const userImage = res.image;
        console.log("userImage: ", userImage);
        
        setUser(userData);
        console.log("the res is: ", res);
        navigate("/");
        setSignedUp(true); 
      } catch (e) {
        console.log(e);
      }
    }
  
    const onGoogleLoginError = () => {
      console.log("Google login failed");
    }

  return (
    <div style={{}}>
      <h1>Signup</h1>
      <div>
        <GoogleLogin onSuccess={onGoogleLoginSuccess} onError={onGoogleLoginError} />
      </div>
      <Form style={{ maxWidth: "400px" }} onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Full name"
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Choose Role</Form.Label>
          <Form.Select
            onChange={(e) => setRole(e.target.value as Role)}
            value={role}
          >
            <option value="reader">Reader</option>
            <option value="author">Author</option>
          </Form.Select>
        </Form.Group>

        <Form.Group controlId="formFile" className="mb-3">
          <Form.Label>Avatar</Form.Label>
          <Form.Control type="file" ref={avatarRef} />
        </Form.Group>

        <br />
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </div>
  );
}
