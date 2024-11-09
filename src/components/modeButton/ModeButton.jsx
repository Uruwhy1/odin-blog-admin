import { useContext, useEffect } from "react";
import styles from "./ModeButton.module.css";
import ModeContext from "../../contexts/PageModeContext";

const ModeButton = () => {
  const { mode, setMode } = useContext(ModeContext);

  useEffect(() => {
    const storedMode = localStorage.getItem("mode");
    if (storedMode) {
      setMode(storedMode);
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setMode("dark");
    } else {
      setMode("light");
    }
  }, []);

  useEffect(() => {
    document.querySelector(":root").classList.toggle("dark", mode === "dark");
  }, [mode]);

  const handleClick = () => {
    setMode(mode === "dark" ? "light" : "dark");
    localStorage.setItem("mode", mode === "dark" ? "light" : "dark");
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
