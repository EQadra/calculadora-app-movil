import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

export type Product = {
  id: number;
  name: string;
  metal_type: string;
  grams: number;
  purity: number | null;
  price_per_gram: number;
  image_path?: string;
};

type ProductContextType = {
  products: Product[];
  fetchAll: () => Promise<void>;
  create: (formData: FormData) => Promise<void>;
  update: (id: number, formData: FormData) => Promise<void>;
  remove: (id: number) => Promise<void>;
};

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  const fetchAll = async () => {
    try {
      const res = await axios.get('/api/products');
      setProducts(res.data);
    } catch (error) {
      console.error('Error al obtener productos:', error);
    }
  };

  const create = async (formData: FormData) => {
    try {
      const res = await axios.post('/api/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setProducts((prev) => [...prev, res.data]);
    } catch (error) {
      console.error('Error al crear producto:', error);
    }
  };

  const update = async (id: number, formData: FormData) => {
    try {
      const res = await axios.post(`/api/products/${id}?_method=PUT`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? res.data : p))
      );
    } catch (error) {
      console.error('Error al actualizar producto:', error);
    }
  };

  const remove = async (id: number) => {
    try {
      await axios.delete(`/api/products/${id}`);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error('Error al eliminar producto:', error);
    }
  };

  return (
    <ProductContext.Provider value={{ products, fetchAll, create, update, remove }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};
