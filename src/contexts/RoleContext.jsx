import { createContext, useContext, useState, useEffect } from "react";

const RoleContext = createContext();

export const useRole = () => useContext(RoleContext);

export const RoleProvider = ({ children }) => {
  const [role, setRole] = useState(null);

  useEffect(() => {
    const storedRole = sessionStorage.getItem("userRole");
    if (storedRole) {
      setRole(storedRole);
    }
  }, []);
  return (
    <RoleContext.Provider value={{ role, setRole }}>
      {children}
    </RoleContext.Provider>
  );
};
