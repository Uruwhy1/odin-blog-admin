import PropTypes from "prop-types";
import styles from "./Header.module.css";
import User from "./subcomponents/User";
import NavButtons from "./subcomponents/NavButtons";

const Header = ({ user, activeView, setActiveView }) => {
  return (
    <header className={styles.container}>
      <User user={user} />
      <NavButtons
        role={user}
        setActiveView={setActiveView}
        activeView={activeView}
      />
    </header>
  );
};

Header.propTypes = {
  user: PropTypes.string,
  setActiveView: PropTypes.func,
  activeView: PropTypes.string,
};

export default Header;
