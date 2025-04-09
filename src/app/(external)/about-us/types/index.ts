export interface PricingFeature {
  text: string;
}

export interface PricingCardData {
  title: string;
  description: string;
  price: string;
  features: PricingFeature[];
  buttonText: string;
  color: string;
  useGradient?: boolean;
}
