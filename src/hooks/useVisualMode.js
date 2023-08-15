import { useState } from "react";

const useVisualMode = (initialState) => {
  const [history, setHistory] = useState([initialState]);
  const mode = history[history.length - 1];

  const transition = (newMode) => {
    setHistory(prev => [...prev, newMode]);
  };

  const back = () => {
    setHistory(prev => [...prev.slice(0, prev.length - 1)]);
  };

  return { mode, transition, back };
};

export default useVisualMode;