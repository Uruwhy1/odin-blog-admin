import { useContext, useEffect } from "react";
import styles from "./ModeButton.module.css";
import ModeContext from "../../contexts/PageModeContext";

const ModeButton = () => {
  const { mode, setMode } = useContext(ModeContext);

  useEffect(() => {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setMode("dark");
    }
  }, [setMode]);

  useEffect(() => {
    document.querySelector(":root").classList.toggle("dark");
  }, [mode]);

  const handleClick = () => {
    if (mode == "dark") setMode("light");
    else setMode("dark");
  };

  return (
    <div
      className={`${styles.container} ${mode === "dark" ? styles.dark : ""}`}
      onClick={handleClick}
    >
      <div className={styles.toggle}></div>
    </div>
  );
};

export default ModeButton;
