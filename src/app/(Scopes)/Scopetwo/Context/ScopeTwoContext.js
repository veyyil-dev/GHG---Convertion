"use client";
import { createContext, useContext, useState } from "react";

const ScopeTwoContext = createContext();

export function ScopeTwoProvider({ children }) {
  const [checkedValuesScopeTwo, setCheckedValuesScopeTwo] = useState([]);
  const [selectedValuesScopeTwo, setSelectedValuesScopeTwo] = useState({});

  return (
    <ScopeTwoContext.Provider
      value={{ checkedValuesScopeTwo, setCheckedValuesScopeTwo, selectedValuesScopeTwo, setSelectedValuesScopeTwo }}
    >
      {children}
    </ScopeTwoContext.Provider>
  );
}

export function useScopeTwo() {
  return useContext(ScopeTwoContext);
}