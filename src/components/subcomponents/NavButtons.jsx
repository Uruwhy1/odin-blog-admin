import PropTypes from "prop-types";
import styles from "./NavButtons.module.css";

const NavButtons = ({ activeView, setActiveView }) => {
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
          View
        </button>
        <button
          className={`${styles.button}  ${
            activeView === "edit" ? styles.active : styles.unclickable
          }
          }`}
        >
          Edit
        </button>
      </nav>
    </div>
  );
};

NavButtons.propTypes = {
  activeView: PropTypes.string.isRequired,
  setActiveView: PropTypes.func.isRequired,
};

export default NavButtons;
