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
  const [user, setUser] = useState<User | null>(null);

  return (
    <div className="App">
      <Navbar user={user} setUser={setUser} />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup setUser={setUser} />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route
            path="/Profile"
            element={
              user ? (
                <Profile userData={user} setUser={setUser} />
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
