import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

import "./variables.css";
import "./App.css";
import "./reset.css";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (token) {
      const decodedToken = JSON.parse(atob(token.split(".")[1])); // Decode payload
      if (decodedToken.role == "ADMIN") {
        setIsLoggedIn(true);
        setUser(decodedToken.username);
      }
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            isLoggedIn ? (
              <Navigate to="/dashboard" />
            ) : (
              <Login setIsLoggedIn={setIsLoggedIn} />
            )
          }
        />

        <Route
          path="/dashboard"
          element={isLoggedIn ? <Dashboard user={user} /> : <Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
};

export default App;
