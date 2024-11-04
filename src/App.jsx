import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import PopupContext from "./contexts/PopupContext";

import "./variables.css";
import "./App.css";
import "./reset.css";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (token) {
      const decodedToken = JSON.parse(atob(token.split(".")[1])); // Decode payload
      if (decodedToken.role == "ADMIN") {
        setIsLoggedIn(true);
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
          element={isLoggedIn ? <Dashboard /> : <Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
};

export default App;
