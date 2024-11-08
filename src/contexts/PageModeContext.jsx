import PropTypes from "prop-types";
import { createContext, useState } from "react";

const ModeContext = createContext();

export const ModeProvider = ({ children }) => {
  const [mode, setMode] = useState("light");

  return (
    <ModeContext.Provider value={{ mode, setMode }}>
      {children}
    </ModeContext.Provider>
  );
};

ModeProvider.propTypes = {
  children: PropTypes.element,
};

export default ModeContext;
