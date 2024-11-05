import PropTypes from "prop-types";
import { createContext, useState } from "react";

const LoadingContext = createContext();

export const LoadingProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  return (
    <LoadingContext.Provider
      value={{ loading, fadeOut, setFadeOut, setLoading }}
    >
      {children}
    </LoadingContext.Provider>
  );
};

LoadingProvider.propTypes = {
  children: PropTypes.element,
};

export default LoadingContext;
