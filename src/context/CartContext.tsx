import React, { createContext, useContext, useState } from "react";

type CartContextType = {
  cartVisible: boolean;
  setCartVisible: (visible: boolean) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartVisible, setCartVisible] = useState(false);

  return (
    <CartContext.Provider value={{ cartVisible, setCartVisible }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
