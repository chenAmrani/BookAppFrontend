import { useEffect, FormEvent, useRef, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Role, User } from "../../types";
import { ACCESS_TOKEN_KEY, BASE_URL, REFRESH_TOKEN_KEY } from "../../constants";
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

    try {
      const response = await fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.error);
      }

      const userData = await response.json();
      localStorage.setItem(ACCESS_TOKEN_KEY, userData.accessToken!);
      localStorage.setItem(REFRESH_TOKEN_KEY, userData.refreshToken!);
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      setSignedUp(true);
      navigate("/");
    } catch (e) {
      console.log(e);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      alert((e as unknown as any).message);
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
      setSignedUp(true);
    } catch (e) {
      console.log(e);
    }
  };

  const onGoogleLoginError = () => {
    console.log("Google login failed");
  };

  return (
    <div style={{}}>
      <h1 style={{ color: "white", marginBottom: "80px" }}>Signup</h1>
      <div>
        <GoogleLogin
          onSuccess={onGoogleLoginSuccess}
          onError={onGoogleLoginError}
        />
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
