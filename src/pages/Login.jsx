import { useContext, useState } from "react";
import PropTypes from "prop-types";

import styles from "./Login.module.css";
import { PopupContext } from "../contexts/PopupContext.jsx";

const Login = ({ setIsLoggedIn }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { showPopup } = useContext(PopupContext);

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
        showPopup("Access denied, only authors or admins can enter.", false);
        localStorage.removeItem("authToken");
      }
    } catch (err) {
      showPopup(err.message, false);
      console.error(err.message);
    }
  };

  return (
    <main className={styles.mainContainer}>
      <div className={styles.container}>
        <div className={styles.right}>
          <h2>Log In</h2>
          <form onSubmit={handleSubmit}>
            <div className={styles.item}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id={styles.email}
                name="email"
                placeholder="example@email.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className={styles.item}>
              <label htmlFor="password" id={styles.passwordLabel}>
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="●●●●●●●"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="submit">Submit</button>
          </form>
        </div>
      </div>
    </main>
  );
};

Login.propTypes = {
  setIsLoggedIn: PropTypes.func,
};
export default Login;
