import { useState } from "react";
import "./App.css";
import { Navbar } from "./components/Navbar/Navbar";
import { Navigate, Route, Routes } from "react-router-dom";
import { Signup } from "./pages/Signup/Signup";
import { Home } from "./pages/Home/Home";
import { User } from "./types";
import { Login } from "./pages/Login/Login";
import Profile from "./pages/Profile/Profile";

function App() {
  const [user, setUser] = useState<User | null>(localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")!) : null);

  return (
    <div className="App bg-dark">
      <Navbar user={user} setUser={setUser} googleSignIn={false} />
      <main>
        <Routes>
          <Route path="/" element={<Home user={user} />} />
          <Route path="/signup" element={<Signup setUser={setUser} />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route
            path="/Profile"
            element={
              user ? (
                <Profile user={user} setUser={setUser} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
