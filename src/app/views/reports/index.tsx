import React from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
  } from "../../components/Card"; // correcto
  import { Badge } from "../../components/Badge";
  import { DataTable } from "../../components/Data-DataTable";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, PieChart, Pie, Cell } from "recharts";

const ventasPorHora = [
  { hora: "09:00", total: 450 },
  { hora: "10:00", total: 900 },
  { hora: "11:00", total: 750 },
  { hora: "12:00", total: 1200 },
  { hora: "13:00", total: 1100 },
  { hora: "14:00", total: 800 },
  { hora: "15:00", total: 1300 },
];

const metales = [
  { tipo: "Oro", valor: 70 },
  { tipo: "Plata", valor: 30 },
];

const colores = ["#facc15", "#a3a3a3"];

const clientes = ["Carlos R.", "Lucía G.", "Miguel A.", "Ana T.", "David S."];

const transacciones = [
  { hora: "10:05", gramos: 12, precio: 220.5, total: 2646 },
  { hora: "11:30", gramos: 8.5, precio: 215.3, total: 1829.05 },
  { hora: "13:45", gramos: 15, precio: 218.0, total: 3270 },
];

export default function Dashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      {/* Tarjetas resumen */}
      <Card>
        <CardHeader><CardTitle>Total Vendido (PEN)</CardTitle></CardHeader>
        <CardContent><p className="text-2xl font-bold">S/ 12,450.00</p></CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Transacciones de Hoy</CardTitle></CardHeader>
        <CardContent><p className="text-2xl font-bold">3</p></CardContent>
      </Card>

      {/* Gráfico de barras */}
      <Card>
        <CardHeader><CardTitle>Ventas por Hora</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={ventasPorHora}>
              <XAxis dataKey="hora" />
              <YAxis />
              <Bar dataKey="total" fill="#2563eb" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Gráfico de pie */}
      <Card>
        <CardHeader><CardTitle>Distribución de Metales</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={metales}
                dataKey="valor"
                nameKey="tipo"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {metales.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colores[index % colores.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Clientes recientes */}
      <Card>
        <CardHeader><CardTitle>Clientes Recientes</CardTitle></CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {clientes.map((cliente, i) => (
            <Badge key={i} variant="outline">{cliente}</Badge>
          ))}
        </CardContent>
      </Card>

      {/* Tabla de transacciones */}
      <Card>
        <CardHeader><CardTitle>Transacciones</CardTitle></CardHeader>
        <CardContent>
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b">
                <th className="py-2 px-3">Hora</th>
                <th className="py-2 px-3">Gramos</th>
                <th className="py-2 px-3">Precio/gramo</th>
                <th className="py-2 px-3">Total PEN</th>
              </tr>
            </thead>
            <tbody>
              {transacciones.map((t, i) => (
                <tr key={i} className="border-b">
                  <td className="py-2 px-3">{t.hora}</td>
                  <td className="py-2 px-3">{t.gramos}</td>
                  <td className="py-2 px-3">S/ {t.precio}</td>
                  <td className="py-2 px-3 font-semibold">S/ {t.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}