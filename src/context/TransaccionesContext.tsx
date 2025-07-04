// context/TransaccionesContext.tsx

import React, { createContext, useContext, useState } from "react";

export interface Transaccion {
  id: string;
  hora: string;
  gramos: number;
  precioGramo: number;
  totalPEN: number;
}

interface TransaccionesContextType {
  transacciones: Transaccion[];
  agregarTransaccion: (t: Transaccion) => void;
}

const TransaccionesContext = createContext<TransaccionesContextType | undefined>(undefined);

export const useTransacciones = () => {
  const context = useContext(TransaccionesContext);
  if (!context) {
    throw new Error("useTransacciones debe usarse dentro de un TransaccionesProvider");
  }
  return context;
};

export const TransaccionesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transacciones, setTransacciones] = useState<Transaccion[]>([]);

  const agregarTransaccion = (t: Transaccion) => {
    setTransacciones((prev) => [...prev, t]);
  };

  return (
    <TransaccionesContext.Provider value={{ transacciones, agregarTransaccion }}>
      {children}
    </TransaccionesContext.Provider>
  );
};
