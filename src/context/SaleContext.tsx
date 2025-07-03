import React, { createContext, useContext, useState } from "react";

type AperturaCaja = {
  oroInicial: number;
  efectivoInicial: number;
  fecha: string;
};

type CierreCaja = {
  oroFinal: number;
  efectivoFinal: number;
};

type Transaccion = {
  id: string;
  hora: string;
  gramos: number;
  precioGramo: number;
  totalPEN: number;
};

type CajaContextType = {
  apertura: AperturaCaja | null;
  cierre: CierreCaja | null;
  transacciones: Transaccion[];
  abrirCaja: (data: AperturaCaja) => void;
  cerrarCaja: (data: CierreCaja) => void;
  agregarTransaccion: (tx: Transaccion) => void;
  limpiarCaja: () => void;
};

const CajaContext = createContext<CajaContextType | undefined>(undefined);

export const useCaja = () => {
  const context = useContext(CajaContext);
  if (!context) throw new Error("useCaja debe usarse dentro de un CajaProvider");
  return context;
};

export const CajaProvider = ({ children }: { children: React.ReactNode }) => {
  const [apertura, setApertura] = useState<AperturaCaja | null>(null);
  const [cierre, setCierre] = useState<CierreCaja | null>(null);
  const [transacciones, setTransacciones] = useState<Transaccion[]>([]);

  const abrirCaja = (data: AperturaCaja) => {
    setApertura(data);
    setTransacciones([]);
    setCierre(null);
  };

  const cerrarCaja = (data: CierreCaja) => {
    setCierre(data);
  };

  const agregarTransaccion = (tx: Transaccion) => {
    setTransacciones((prev) => [...prev, tx]);
  };

  const limpiarCaja = () => {
    setApertura(null);
    setTransacciones([]);
    setCierre(null);
  };

  return (
    <CajaContext.Provider
      value={{
        apertura,
        cierre,
        transacciones,
        abrirCaja,
        cerrarCaja,
        agregarTransaccion,
        limpiarCaja,
      }}
    >
      {children}
    </CajaContext.Provider>
  );
};
