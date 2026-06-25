import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [permission, setPermission] = useState(null);

  useEffect(() => {
    const storedToken = sessionStorage.getItem("token");
    const storedPermission = sessionStorage.getItem("Permission");

    if (storedToken) {
      setToken(storedToken);
    }

    if (storedPermission) {
      setPermission(storedPermission);
    }
  }, []);

  const login = (newToken) => {
    sessionStorage.setItem("token", newToken);
    setToken(newToken);
  };

  const setUserPermission = (newPermission) => {
    sessionStorage.setItem("Permission", newPermission);
    setPermission(newPermission);
  };

  const logout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("Permission");

    setToken(null);
    setPermission(null);
  };

  const isLoggedIn = !!token;
  
  return (
    <AuthContext.Provider
      value={{
        token,
        permission,
        isLoggedIn,
        login,
        logout,
        setUserPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}