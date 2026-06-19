//it shares the status of the authentication towards whole page

import { createContext, useState, useEffect, useContext } from "react";
import api from "../utils/axios";

const authContext = createContext(); // create context

// authProvider code
const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState(false);

    const checkAuth = async () => {
        try {
            setLoading(true);
            const response = await api.get('/auth/me');
            console.log("User authenticated:", response.data.user);
            setUser(response.data.user);
            setStatus(true);
        } catch (error) {
            console.log("Not authenticated or error:", error);
            setUser(null);
            setStatus(false); 
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []); // [] means run only once

    // Expose refetchUser so Login/Signup can call it after successful auth
    const refetchUser = () => {
        checkAuth();
    };

    // Logout function
    const logout = async () => {
        try {
            await api.post('/auth/logout');
        } catch (error) {
            console.log("Logout error:", error);
        } finally {
            // Clear user state regardless of API call success
            setUser(null);
            setStatus(false);
        }
    };

    return (
        <authContext.Provider value={{ user, setUser, refetchUser, logout, status, loading }}>
            {children}
        </authContext.Provider>
    )
}

// Custom hook to use auth context
export const useAuth = () => useContext(authContext);

export default AuthProvider;
