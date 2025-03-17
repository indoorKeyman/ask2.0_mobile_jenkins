import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [memberIndex, setMemberIndex] = useState(null);

  useEffect(() => {
    // 세션 스토리지에서 토큰 확인
    const token = sessionStorage.getItem("accessToken");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const logout = () => {
    sessionStorage.removeItem("accessToken");
    setIsLoggedIn(false);
    setMemberIndex(null);
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, setIsLoggedIn, memberIndex, setMemberIndex, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthContext;
