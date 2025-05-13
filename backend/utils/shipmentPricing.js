// Base pricing table based on service type
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

// Subtotal discount rates (based on the total subtotal value)
const SUBTOTAL_DISCOUNT_RATES = {
  100: 0,
  500: 0.1,
  1000: 0.05,
  2000: 0.04,
  5000: 0.03,
  10000: 0.02,
  20000: 0.01,
  50000: 0.005,
};

// Weight discount rates (based on the weight in kg)
const WEIGHT_DISCOUNT_RATES = {
  1: 0.001,
  2: 0.002,
  3: 0.003,
  4: 0.004,
  5: 0.005,
  6: 0.006,
  7: 0.007,
  8: 0.008,
  9: 0.009,
  10: 0.01,
  11: 0.011,
  12: 0.012,
  13: 0.013,
  14: 0.014,
  15: 0.015,
  16: 0.016,
  17: 0.017,
  18: 0.018,
  19: 0.019,
  20: 0.02,
  21: 0.021,
  22: 0.022,
  23: 0.023,
  24: 0.024,
  25: 0.025,
  26: 0.026,
  27: 0.027,
  28: 0.028,
  29: 0.029,
  30: 0.03,
  31: 0.031,
  32: 0.032,
  33: 0.033,
  34: 0.034,
  35: 0.035,
  36: 0.036,
  37: 0.037,
  38: 0.038,
  39: 0.039,
  40: 0.04,
  41: 0.041,
  42: 0.042,
  43: 0.043,
  44: 0.044,
  45: 0.045,
  46: 0.046,
  47: 0.047,
  48: 0.048,
  49: 0.049,
  50: 0.05, // Above 50 kg, the discount rate is 0.05
};

// Helper function to get the discount rate based on subtotal value
const getDiscountRate = (subTotal) => {
  if (subTotal >= 50000) {
    return SUBTOTAL_DISCOUNT_RATES[50000];
  } else if (subTotal >= 20000) {
    return SUBTOTAL_DISCOUNT_RATES[20000];
  } else if (subTotal >= 10000) {
    return SUBTOTAL_DISCOUNT_RATES[10000];
  } else if (subTotal >= 5000) {
    return SUBTOTAL_DISCOUNT_RATES[5000];
  } else if (subTotal >= 2000) {
    return SUBTOTAL_DISCOUNT_RATES[2000];
  } else if (subTotal >= 1000) {
    return SUBTOTAL_DISCOUNT_RATES[1000];
  } else if (subTotal >= 500) {
    return SUBTOTAL_DISCOUNT_RATES[500];
  } else {
    return SUBTOTAL_DISCOUNT_RATES[100]; // No discount for below 100
  }
};

// Function to calculate base shipping price based on weight and service type
export const calculateBaseShippingPrice = (weightKg, serviceType) => {
  if (typeof weightKg !== "number" || weightKg < 0) {
    throw new Error("Invalid weight");
  }

  if (!BASE_PRICING_TABLE.hasOwnProperty(serviceType)) {
    throw new Error("Invalid service type");
  }

  const ratePerKg = BASE_PRICING_TABLE[serviceType];

  if (!ratePerKg) {
    throw new Error(`Invalid service type: ${serviceType}`);
  }

  const baseShippingPrice = weightKg * ratePerKg;

  return +baseShippingPrice.toFixed(2);
};

// Function to calculate total shipping price including discounts
export const calculatedShippingPrice = (subTotal, weight, serviceType) => {
  if (typeof subTotal !== "number" || subTotal < 0) {
    throw new Error("Invalid subtotal");
  }

  if (typeof weight !== "number" || weight < 0) {
    throw new Error("Invalid weight");
  }

  if (!BASE_PRICING_TABLE.hasOwnProperty(serviceType)) {
    throw new Error("Invalid service type");
  }

  // 1. Calculate base shipping price based on weight and service type
  const basePricePerKg = BASE_PRICING_TABLE[serviceType];
  const baseShippingPrice = basePricePerKg * weight;

  // 2. Apply weight discount
  let weightDiscountRate = WEIGHT_DISCOUNT_RATES[weight];
  if (weight > 50) {
    weightDiscountRate = 0.05;
  }
  const weightDiscountedPrice = baseShippingPrice * weightDiscountRate;

  // 3. Apply subtotal discount
  const subtotalDiscountRate = getDiscountRate(subTotal);
  const subtotalDiscountedPrice = baseShippingPrice * subtotalDiscountRate;

  // 4. Calculate the final shipping price after applying both discounts
  const totalDiscount = weightDiscountedPrice + subtotalDiscountedPrice;
  const totalShippingPrice = baseShippingPrice - totalDiscount;

  return parseFloat(totalShippingPrice.toFixed(2));
};
