import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode"; 
import { getUserProfile } from "../services/userService"

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);

    const refreshUser = async () => {
        try {
          const data = await getUserProfile();
          setUser(data);
        } catch (err) {
          console.error("Failed to fetch user profile", err);
          logout();
        }
      };

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decode = jwtDecode(token);
                setUser(decode);
            } catch (error) {
                console.error("Token decoding failed:", error);
                localStorage.removeItem("token");
            }
        }
    }, []);

    const login = (token) => {
        localStorage.setItem("token", token);
        const decode = jwtDecode(token);
        setUser(decode);
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, refreshUser }}>{children}</AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
