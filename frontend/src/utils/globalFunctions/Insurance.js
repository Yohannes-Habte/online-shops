const INSURANCE_FEE_TIERS = [
  { min: 0, max: 50.01, rate: 0.1 },
  { min: 50.01, max: 200.01, rate: 0.15 },
  { min: 200.01, max: 400.01, rate: 0.2 },
  { min: 400.01, max: 600.01, rate: 0.25 },
  { min: 600.01, max: 800.01, rate: 0.3 },
  { min: 800.01, max: 1000.01, rate: 0.35 },
  { min: 1000.01, max: 2000.01, rate: 0.4 },
  { min: 2000.01, max: 4000.01, rate: 0.45 },
  { min: 4000.01, max: 5000.01, rate: 0.5 },
  { min: 5000.01, max: 10000.01, rate: 0.55 },
  { min: 10000.01, max: Infinity, rate: 0.6 },
];

const InsuranceFee = (basePrice) => {
  if (typeof basePrice !== "number" || isNaN(basePrice) || basePrice <= 0) {
    return 0;
  }

  const tier = INSURANCE_FEE_TIERS.find(
    (t) => basePrice >= t.min && basePrice < t.max
  );

  if (!tier) {
    console.warn(`No insurance tier found for declared value: ${basePrice}`);
    return 0;
  }

  const fee = basePrice * tier.rate;
  return parseFloat(fee.toFixed(2));
};

export default InsuranceFee;
