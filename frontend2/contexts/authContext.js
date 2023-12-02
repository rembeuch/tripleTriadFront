import React, { createContext, useContext, useState } from 'react';
import { useEffect } from "react";
import { useAccount, useProvider, useSigner } from 'wagmi'


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const { address, isConnected } = useAccount()
    const [authToken, setAuthToken] = useState();
    
    useEffect(() => {
        // Vérifie si nous sommes côté client avant d'accéder à localStorage
        if (typeof window !== 'undefined') {            
            const storedToken = localStorage.getItem('authToken');
            setAuthToken(storedToken);
        }
    }, []); // Modification ici pour que l'effet ne dépende d'aucune variable

    const setToken = (token) => {
        setAuthToken(token);
        if (typeof window !== 'undefined') {            
            localStorage.setItem('authToken', token); // Modification ici pour utiliser le paramètre "token"
        }
    };

    const clearToken = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/v1/logout?token=${authToken}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('logout failed');
            }
        } catch (error) {
            console.error('Error during logout:', error.message);
        }
        setAuthToken(null);
        localStorage.removeItem('authToken');
        window.location.reload();
    };

    return (
        <AuthContext.Provider value={{ authToken, setToken, clearToken }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
