"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { jwtDecode } from "jwt-decode";

// 1. Interfaz de usuario actualizada para que coincida con el backend
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  calendar_id: string | null;
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<User | null>
  // 2. Firma de registro actualizada
  register: (name: string, email: string, phone: string, password: string) => Promise<boolean>;
  logout: () => void
  isAuthenticated: boolean
  token: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// URL de la API del backend
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000";

import { useRouter } from "next/navigation";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter(); // Añadir router

  useEffect(() => {
    // 3. Lógica de inicialización mejorada
    try {
      const storedToken = localStorage.getItem("fg_medic_token");
      if (storedToken) {
        // Opcional: verificar la expiración del token aquí
        const decodedToken: any = jwtDecode(storedToken);
        if (decodedToken.exp * 1000 > Date.now()) {
            const storedUser = localStorage.getItem("fg_medic_user");
            if (storedUser) {
                setUser(JSON.parse(storedUser));
                setToken(storedToken);
            }
        } else {
            // El token ha expirado
            localStorage.removeItem("fg_medic_token");
            localStorage.removeItem("fg_medic_user");
        }
      }
    } catch (error) {
        console.error("Failed to initialize auth state:", error);
        localStorage.removeItem("fg_medic_token");
        localStorage.removeItem("fg_medic_user");
    } finally {
        setIsLoading(false);
    }
  }, [])

  // 4. Función de registro conectada al backend
  const register = async (name: string, email: string, phone: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: name, email, telefono: phone, password }),
      });

      if (response.ok) {
        // Opcional: iniciar sesión automáticamente después del registro
        const loggedInUser = await login(email, password);
        return !!loggedInUser;
      }
      
      // Manejar errores de registro (ej: email ya existe)
      const errorData = await response.json();
      console.error("Registration error:", errorData.message);
      return false;

    } catch (error) {
      console.error("[API] Registration error:", error)
      return false
    }
  }

  // 5. Función de login conectada al backend
  const login = async (email: string, password: string): Promise<User | null> => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        const { access_token, user: userData } = data;

        // Guardar estado y persistir en localStorage
        setUser(userData);
        setToken(access_token);
        localStorage.setItem("fg_medic_user", JSON.stringify(userData));
        localStorage.setItem("fg_medic_token", access_token);
        
        return userData;
      }

      return null
    } catch (error) {
      console.error("[API] Login error:", error)
      return null
    }
  }

  // 6. Logout mejorado
  const logout = () => {
    setUser(null)
    setToken(null);
    localStorage.removeItem("fg_medic_user")
    localStorage.removeItem("fg_medic_token")
    router.push('/#inicio'); // Redirigir al inicio
  }

  if (isLoading) {
    return null // O un componente de carga/spinner
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </Auth-Context.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}