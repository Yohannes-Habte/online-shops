// --- Base Pricing Table ---
const BASE_PRICING_TABLE = {
  Standard: 5,
  Express: 8,
  Overnight: 12,
  SameDay: 15,
  Economy: 3,
  Freight: 2,
  International: 10,
  TwoDay: 7,
  NextDay: 11,
  Scheduled: 6,
};

// --- Function: Calculate Base Price ---
export const calculateBasePrice = (weightKg, serviceType) => {
  const ratePerKg = BASE_PRICING_TABLE[serviceType];
  if (!ratePerKg) {
    throw new Error(`Invalid service type: ${serviceType}`);
  }
  const price = weightKg * ratePerKg;
  return +price.toFixed(2); 
};
