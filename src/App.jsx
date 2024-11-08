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
  const [activeView, setActiveView] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (activeView == "edit") return;

    localStorage.setItem("activeView", activeView);
  }, [activeView]);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const storedView = localStorage.getItem("activeView");

    if (token) {
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      const expiryTime = decodedToken.exp * 1000;

      if (decodedToken.role === "USER") {
        setLoading(false);
        return;
      }

      setIsLoggedIn(true);
      setUser(decodedToken.username);

      setTimeout(() => {
        localStorage.removeItem("authToken");
        setIsLoggedIn(false);
        setUser("");
        console.log("Session expired. Token has been removed.");
      }, expiryTime - Date.now());
    }

    if (storedView) {
      setActiveView(storedView);
      if (activeView == null) setActiveView("create");
    }

    setLoading(false);
  }, []);

  if (loading) return <div>Loading...</div>;

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
          element={
            isLoggedIn ? (
              <Dashboard
                user={user}
                activeView={activeView}
                setActiveView={setActiveView}
              />
            ) : (
              <Navigate to="/" />
            )
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
