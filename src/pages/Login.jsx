import { useState } from "react";
import PropTypes from "prop-types";

const Login = ({ setIsLoggedIn }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/users/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      if (!response.ok) {
        throw new Error("Login failed. Please check your credentials.");
      }

      const data = await response.json();

      localStorage.setItem("authToken", data.token);
      const decodedToken = JSON.parse(atob(data.token.split(".")[1]));

      if (decodedToken.role !== "USER") {
        setIsLoggedIn(true);
        window.location.href = "/dashboard";
      } else {
        setError(
          "Access denied. Only authors and admins can access this site."
        );
        localStorage.removeItem("authToken");
      }
    } catch (err) {
      console.error(err.message);
      setError(err.message);
    }
  };

  return (
    <div>
      <h1>Admin Login</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

Login.propTypes = {
  setIsLoggedIn: PropTypes.func,
};
export default Login;
