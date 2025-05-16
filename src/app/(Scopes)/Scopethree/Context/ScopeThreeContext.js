"use client";

import { createContext, useContext, useState } from "react";

const ScopeThreeContext = createContext();

export function ScopeThreeProvider({ children }) {
  const [checkedValuesScopeThree, setCheckedValuesScopeThree] = useState([]);
  const [selectedValuesScopeThree, setSelectedValuesScopeThree] = useState({});

  return (
    <ScopeThreeContext.Provider
      value={{
        checkedValuesScopeThree,
        selectedValuesScopeThree,
        setCheckedValuesScopeThree,
        setSelectedValuesScopeThree,
      }}
    >
      {children}
    </ScopeThreeContext.Provider>
  );
}

export function useScopeThree() {
  return useContext(ScopeThreeContext);
}
