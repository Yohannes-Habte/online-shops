/**
 * Insurance rate tiers based on declared shipment value.
 * Each tier includes a minimum and maximum threshold (inclusive of `min`, exclusive of `max`)
 * and a percentage `rate` applied to the declared value.
 */
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

/**
 * Calculates the insurance fee for a shipment based on the declared value.
 *
 * @param {number} declaredValue - The declared shipment value (base price).
 * @returns {number} - The calculated insurance fee (rounded to 2 decimal places).
 */
export const calculateInsuranceFee = (declaredValue) => {
  if (
    typeof declaredValue !== "number" ||
    isNaN(declaredValue) ||
    declaredValue <= 0
  ) {
    return 0;
  }

  const tier = INSURANCE_FEE_TIERS.find(
    (t) => declaredValue >= t.min && declaredValue < t.max
  );

  if (!tier) {
    console.warn(
      `No insurance tier found for declared value: ${declaredValue}`
    );
    return 0;
  }

  const fee = declaredValue * tier.rate;
  return parseFloat(fee.toFixed(2));
};
