// utils/generarReciboEscPos.ts
import EscPosEncoder from "esc-pos-encoder";
import { ValoresCalculados } from "./calculadora";

function format(n: number): string {
  return n.toLocaleString("es-PE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function generarReciboEscPos({
  pricePerGramUSD,
  pricePerGramPEN,
  totalUSD,
  totalPEN,
}: ValoresCalculados): Uint8Array {
  const now = new Date().toLocaleString("es-PE");

  const encoder = new EscPosEncoder();
  const result = encoder
    .initialize()
    .align("center")
    .text("===== BMG Electronics =====")
    .newline()
    .text("Av Rafael Escardo 1143, San Miguel")
    .newline()
    .text("Tel: 912 184 269")
    .newline()
    .text(now)
    .newline()
    .text("----------------------------")
    .align("left")
    .text(`Precio x gramo (USD): ${format(pricePerGramUSD)}`)
    .newline()
    .text(`Precio x gramo (PEN): ${format(pricePerGramPEN)}`)
    .newline()
    .bold(true)
    .text(`Total USD: ${format(totalUSD)}`)
    .newline()
    .text(`Total PEN: ${format(totalPEN)}`)
    .bold(false)
    .newline()
    .text("----------------------------")
    .align("center")
    .text("Gracias por su compra")
    .newline()
    .newline()
    .cut()
    .encode();

  return result;
}
