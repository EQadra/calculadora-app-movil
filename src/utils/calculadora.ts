const TROY_OUNCE_GRAMS = 31.1034768;


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

  const canCalculateGrams = g > 0;
  const canCalculatePrice = oz > 0 && rate > 0 && pur > 0;

  if (!canCalculatePrice) {
    return {
      pricePerGramUSD: 0,
      pricePerGramPEN: 0,
      totalUSD: 0,
      totalPEN: 0,
      valido: false,
    };
  }

  const pricePerGramUSD = (oz / TROY_OUNCE_GRAMS) * pur * (1 - discount);
  const pricePerGramPEN = pricePerGramUSD * rate;
  const totalUSD = canCalculateGrams ? pricePerGramUSD * g : 0;
  const totalPEN = canCalculateGrams ? pricePerGramPEN * g : 0;

  return {
    pricePerGramUSD,
    pricePerGramPEN,
    totalUSD,
    totalPEN,
    valido: true, // ✅ se activa si el precio por gramo puede calcularse
  };
};
