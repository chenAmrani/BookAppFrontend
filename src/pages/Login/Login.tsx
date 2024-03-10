import { FormEvent, useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { User } from "../../types";
import { ACCESS_TOKEN_KEY, BASE_URL, REFRESH_TOKEN_KEY } from "../../constants";
import { useNavigate } from "react-router-dom";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { googleSignin } from "../../utilities/googleSignIn";


export function Login({ setUser }: { setUser: (user: User) => void }) {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    if(error!==null){
    console.log(error);
    alert(error);
  }
  }, [error]);


  useEffect(() => {
    console.log(loggedIn);
  }, [loggedIn]);

  
  
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try{
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    
    setUser(data.userData);
    localStorage.setItem(ACCESS_TOKEN_KEY, data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);
    setError(null);
    navigate("/");
    setLoggedIn(false);
    setError(null);
    }catch (error) {
      console.log("Error logging in:", error);
      setError("Invalid username or password");
    }
  
    
  };


  const onGoogleLoginSuccess = async (
    credentialResponse: CredentialResponse
  ) => {
    console.log(credentialResponse);
    try {
      const res = await googleSignin(credentialResponse);
      console.log("the res is: ", res);
      if (res == null) return;
      localStorage.setItem(ACCESS_TOKEN_KEY, res.accessToken!);
      localStorage.setItem(REFRESH_TOKEN_KEY, res.refreshToken!);
      const userData = res.userData;
      setUser(userData);
      console.log("the res is: ", res);
      navigate("/");
      setLoggedIn(true);
    } catch (e) {
      console.log(e);
    }
  };

  const onGoogleLoginError = () => {
    console.log("Google login failed");
  };


  return (
    <div style={{}}>
      <h1>Login</h1>
      <div style={{width:""}}>
        <GoogleLogin
          onSuccess={onGoogleLoginSuccess}
          onError={onGoogleLoginError}
        />
      </div>
     

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

        <br/>
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </div>
  );
}
