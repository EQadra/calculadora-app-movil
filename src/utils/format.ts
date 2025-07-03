export const formatNumber = (n: number | string | null | undefined): string => {
  const number = Number(n);
  if (isNaN(number)) return "–"; // Devuelve un guión si el número no es válido

  return number.toLocaleString("es-PE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};
