//=========================================================================
// Helper functions for order calculations and status history updates
//=========================================================================

// 1. Helper function to calculate shop commission
export const calculateShopCommission = (grandTotal) =>
  parseFloat((grandTotal * 0.01).toFixed(2));

// 2. Helper function to  const calculateTax = (subTotal) => subTotal * 0.02;
export const calculateTaxAmount = (subTotal) =>
  parseFloat((subTotal * 0.02).toFixed(2));

// 3. Helper function to calculate shipping fee
export const calculateShippingFee = (subTotal) => {
  if (typeof subTotal !== "number" || subTotal < 0) return 0;

  return subTotal <= 100
    ? 50
    : subTotal < 500
    ? parseFloat((subTotal * 0.1).toFixed(2))
    : subTotal < 1000
    ? parseFloat((subTotal * 0.05).toFixed(2))
    : subTotal < 2000
    ? parseFloat((subTotal * 0.04).toFixed(2))
    : parseFloat((subTotal * 0.04).toFixed(2));
};

// 4. Helper function for discount calculation
export const calculateDiscount = (subTotal) => {
  if (typeof subTotal !== "number" || subTotal < 0) return 0;

  // Validate input: Ensure subTotal is a positive number or can be converted into a valid number
  const parsedSubTotal = parseFloat(subTotal);

  if (isNaN(parsedSubTotal) || parsedSubTotal < 0) {
    throw new Error("Invalid subTotal. Please provide a positive number.");
  }

  // Discount tiers (threshold and discount values)
  const discountTiers = [
    { threshold: 10000, discount: 0.05 },
    { threshold: 4000, discount: 0.04 },
    { threshold: 2000, discount: 0.03 },
    { threshold: 1000, discount: 0.02 },
    { threshold: 500, discount: 0.01 },
    { threshold: 250, discount: 0.005 },
  ];

  // Loop through the discount tiers to find the appropriate discount
  for (const { threshold, discount } of discountTiers) {
    if (parsedSubTotal >= threshold) {
      const discountAmount = parsedSubTotal * discount;
      return parseFloat(discountAmount.toFixed(2)); // Round to 2 decimal places
    }
  }

  // No discount if subTotal is below the first threshold
  return 0;
};

// 5. Helper function to calculate the grand total
export const calculateGrandTotal = (subtotal, tax, shippingFee, discount) => {
  if (
    typeof subtotal !== "number" ||
    typeof tax !== "number" ||
    typeof shippingFee !== "number" ||
    typeof discount !== "number"
  ) {
    throw new Error("Invalid input: All inputs must be numbers.");
  }

  return parseFloat((subtotal + tax + shippingFee - discount).toFixed(2));
};

// 6. Helper function to push status history for update shop orders
export const addToStatusHistory = (order, status) => {
  order.statusHistory.push({
    status,
    changedAt: new Date(),
    message: `Your order is ${status} at ${new Date().toLocaleString()}`,
  });
};
