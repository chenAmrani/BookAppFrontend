import { FormEvent, useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { User } from "../../types";
import { ACCESS_TOKEN_KEY, BASE_URL } from "../../constants";
import { GoogleLogin /* GoogleOAuthProvider*/ } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";

export function Login({ setUser }: { setUser: (user: User) => void }) {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const navigate = useNavigate();

  //לבדוק לגבי שני אלו
  useEffect(() => {
    console.log(loggedIn);
  }, [loggedIn]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    console.log("userData:", data);
    setUser(data.userData);
    localStorage.setItem(ACCESS_TOKEN_KEY, data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);
    navigate("/");
    setLoggedIn(false);
  };

  const handleLoginError = () => {
    try {
      throw new Error("Login Failed");
    } catch (error) {
      console.error("Error during login:", error);
    }
  };
  return (
    <div style={{}}>
      <h1>Login</h1>

      <GoogleLogin
        onSuccess={(credentialResponse) => {
          console.log(credentialResponse);
          // navigate("/");
        }}
        onError={() => handleLoginError()}
      />

      <Form style={{ maxWidth: "400px" }} onSubmit={handleSubmit}>
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

        <br />
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </div>
  );
}
