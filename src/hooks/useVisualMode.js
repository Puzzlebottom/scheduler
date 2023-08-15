import { useState } from "react";

const useVisualMode = (initialState) => {
  const [history, setHistory] = useState([initialState]);
  const mode = history[history.length - 1];

  const transition = (newMode, willReplace = false) => {
    setHistory((prev) => {
      const history = willReplace ? prev.slice(0, prev.length - 1) : prev;
      return [...history, newMode];
    });
  };

  const back = () => {
    if (history.length > 1) {
      setHistory(prev => [...prev.slice(0, prev.length - 1)]);
    }
  };

  return { mode, transition, back };
};

export default useVisualMode;