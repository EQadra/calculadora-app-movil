// utils/calculadora.ts

export type ValoresEntrada = {
  pricePerOz: string;
  exchangeRate: string;
  purity: string;
  grams: string;
  discountPercentage: string;
};

export type ValoresCalculados = {
  pricePerGramUSD: number;
  pricePerGramPEN: number;
  totalUSD: number;
  totalPEN: number;
  valido: boolean;
};

export const calcularValores = ({
  pricePerOz,
  exchangeRate,
  purity,
  grams,
  discountPercentage,
}: ValoresEntrada): ValoresCalculados => {
  const parse = (val: string) => parseFloat(val.replace(",", ".")) || 0;

  const oz = parse(pricePerOz);
  const rate = parse(exchangeRate);
  const pur = parse(purity);
  const g = parse(grams);
  const discount = parse(discountPercentage) / 100;

  if (oz <= 0 || rate <= 0 || pur <= 0) {
    return {
      pricePerGramUSD: 0,
      pricePerGramPEN: 0,
      totalUSD: 0,
      totalPEN: 0,
      valido: false,
    };
  }

  const pricePerGramUSD = (oz / 31.1035) * pur * (1 - discount);
  const pricePerGramPEN = pricePerGramUSD * rate;
  const totalUSD = pricePerGramUSD * g;
  const totalPEN = totalUSD * rate;

  return {
    pricePerGramUSD,
    pricePerGramPEN,
    totalUSD,
    totalPEN,
    valido: true,
  };
};
