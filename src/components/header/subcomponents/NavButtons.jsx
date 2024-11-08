import PropTypes from "prop-types";
import styles from "./NavButtons.module.css";

const NavButtons = ({ activeView, setActiveView }) => {
  const token = localStorage.getItem("authToken");
  const decodedToken = JSON.parse(atob(token.split(".")[1]));
  return (
    <div className={styles.container}>
      <nav>
        <button
          onClick={() => setActiveView("create")}
          className={`${styles.button} ${
            activeView === "create" ? styles.active : ""
          }`}
        >
          Create
        </button>
        <button
          onClick={() => setActiveView("view")}
          className={`${styles.button} ${
            activeView === "view" ? styles.active : ""
          }`}
        >
          Posts
        </button>

        {decodedToken.role === "ADMIN" ? (
          <button
            onClick={() => setActiveView("user")}
            className={`${styles.button} ${
              activeView === "user" ? styles.active : ""
            }`}
          >
            Users
          </button>
        ) : (
          ""
        )}
      </nav>
    </div>
  );
};

NavButtons.propTypes = {
  activeView: PropTypes.string.isRequired,
  setActiveView: PropTypes.func.isRequired,
};

export default NavButtons;
