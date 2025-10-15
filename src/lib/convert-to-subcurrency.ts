export function convertToSubcurrency(amount: number, factor = 100) {
  return Math.round(amount * factor);
}

export function calculateStripeTotal(basePrice: number) {
  const stripeFeePercentage = 0.014; // 1.4%
  const stripeFixedFee = 0.25; // €0.25
  const stripeFee = Number((basePrice * stripeFeePercentage + stripeFixedFee).toFixed(2));
  const totalAmount = Number((basePrice + stripeFee).toFixed(2));
  return { stripeFee, totalAmount };
}
