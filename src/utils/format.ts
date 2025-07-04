export const formatNumber = (
  n: number | string | null | undefined
): string => {
  const number = Number(n);
  if (isNaN(number)) return "–";

  const formatter = new Intl.NumberFormat("es-ES", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    useGrouping: true,
  });

  return formatter.format(number).replace(/\u00A0/g, " "); // reemplaza espacio no separable por espacio normal
};
