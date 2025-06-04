import { BleManager } from "react-native-ble-plx";

export type ReciboData = {
  pricePerGramUSD: number;
  pricePerGramPEN: number;
  totalUSD: number;
  totalPEN: number;
};

const manager = new BleManager();

/**
 * Genera un buffer ESC/POS para el recibo de texto.
 */
export function generarReciboTexto(data: ReciboData): Uint8Array {
  const { pricePerGramUSD, pricePerGramPEN, totalUSD, totalPEN } = data;

  const ESC = "\x1B";
  const LF = "\x0A";

  let receipt = "";
  receipt += ESC + "@"; // Reset impresora
  receipt += "RECIBO DE CÁLCULO" + LF;
  receipt += "-----------------------------" + LF;
  receipt += `Precio por gramo (USD): ${pricePerGramUSD.toFixed(2)}` + LF;
  receipt += `Precio por gramo (PEN): ${pricePerGramPEN.toFixed(2)}` + LF;
  receipt += `Total en USD: ${totalUSD.toFixed(2)}` + LF;
  receipt += `Total en PEN: ${totalPEN.toFixed(2)}` + LF;
  receipt += "-----------------------------" + LF;
  receipt += LF.repeat(3); // saltos para corte

  return new TextEncoder().encode(receipt);
}

/**
 * Imprime el recibo enviando el buffer ESC/POS a la impresora Bluetooth.
 */
export async function imprimirReciboBLE(
  printerId: string,
  receiptBuffer: Uint8Array,
  setLoading: (loading: boolean) => void
): Promise<void> {
  try {
    setLoading(true);

    const device = await manager.connectToDevice(printerId);
    await device.discoverAllServicesAndCharacteristics();

    const services = await device.services();
    let writableCharacteristic = null;

    for (const service of services) {
      const characteristics = await service.characteristics();
      for (const c of characteristics) {
        if (c.isWritableWithResponse || c.isWritableWithoutResponse) {
          writableCharacteristic = c;
          break;
        }
      }
      if (writableCharacteristic) break;
    }

    if (!writableCharacteristic) {
      throw new Error("No se encontró característica para escritura en la impresora");
    }

    const chunkSize = 20;
    for (let i = 0; i < receiptBuffer.length; i += chunkSize) {
      const chunk = receiptBuffer.slice(i, i + chunkSize);
      await writableCharacteristic.writeWithResponse(Buffer.from(chunk).toString("base64"));
    }

    await device.cancelConnection();
  } catch (error) {
    console.error("Error imprimiendo recibo:", error);
    throw error;
  } finally {
    setLoading(false);
  }
}
