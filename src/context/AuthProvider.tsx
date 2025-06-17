import React, {
    createContext,
    useState,
    useContext,
    ReactNode,
    useEffect,
  } from "react";
  import AsyncStorage from "@react-native-async-storage/async-storage";
  
  interface User {
    email: string;
    role: string;
    fullName?: string;
    specialty?: string;
    experience?: string;
    location?: string;
    selectedCountry?: string;
  }
  
  interface AuthContextType {
    user: User | null;
    setUser: (user: User | null) => void;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
  }
  
  const AuthContext = createContext<AuthContextType | undefined>(undefined);
  
  export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
  
    const mockUsers: User[] = [
      {
        email: "lawyer@example.com",
        role: "lawyer",
        fullName: "John Doe",
        specialty: "Criminal Law",
        experience: "10 years",
        location: "New York, USA",
        selectedCountry: "USA",
      },
      {
        email: "doctor@example.com",
        role: "doctor",
        fullName: "Jane Smith",
        specialty: "Cardiology",
        experience: "8 years",
        location: "Los Angeles, USA",
        selectedCountry: "USA",
      },
      {
        email: "user@example.com",
        role: "user",
        fullName: "Regular User",
        location: "Chicago, USA",
        selectedCountry: "USA",
      },
    ];
  
    // Función para iniciar sesión
    const login = async (email: string, password: string) => {
      const foundUser = mockUsers.find((user) => user.email === email);
  
      const loggedInUser = foundUser
        ? foundUser
        : {
            email,
            role: "user",
            fullName: "Guest User",
            location: "Unknown",
            selectedCountry: "Unknown",
          };
  
      setUser(loggedInUser);
      await AsyncStorage.setItem("user", JSON.stringify(loggedInUser)); // Guardar en AsyncStorage
    };
  
    // Función para cerrar sesión
    const logout = async () => {
      setUser(null);
      await AsyncStorage.removeItem("user"); // Eliminar usuario de AsyncStorage
    };
  
    // Cargar usuario desde AsyncStorage al iniciar la app
    useEffect(() => {
      const loadUser = async () => {
        try {
          const storedUser = await AsyncStorage.getItem("user");
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          }
        } catch (error) {
          console.error("Error al cargar usuario desde AsyncStorage", error);
        }
      };
      loadUser();
    }, []);
  
    return (
      <AuthContext.Provider value={{ user, setUser, login, logout }}>
        {children}
      </AuthContext.Provider>
    );
  };
  
  // Hook para acceder al contexto de autenticación
  export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
      throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
  };
  
  export default AuthProvider;
  