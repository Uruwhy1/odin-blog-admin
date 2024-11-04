import PropTypes from "prop-types";
import styles from "./User.module.css";

const User = ({ user }) => {
  return (
    <div className={styles.user}>
      <div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
        <p>Welcome, {user.split(" ")[0]}</p>
      </div>
      <button className={styles.logout}>Logout</button>
    </div>
  );
};

User.propTypes = {
  user: PropTypes.string,
};

export default User;
