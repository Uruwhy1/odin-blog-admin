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
      const expiryTime = decodedToken.exp * 1000;

      if (decodedToken.role == "USER") {
        return;
      }

      setIsLoggedIn(true);
      setUser(decodedToken.username);

      const timeout = setTimeout(() => {
        localStorage.removeItem("authToken");
        setIsLoggedIn(false);
        setUser("");
        console.log("Session expired. Token has been removed.");
      }, expiryTime - Date.now());

      return () => clearTimeout(timeout);
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
