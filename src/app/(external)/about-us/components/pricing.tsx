import { PricingCard } from "./pricing-card";
import { pricingData } from "../data";

export function Pricing() {
  return (
    <div>
      <h2 className="text-primary font-bold text-4xl mb-4">Choisissez votre formation idéale</h2>
      <p className="text-foreground leading-11 mb-4">
        Trouvez la formule qui correspond le mieux à vos besoins, votre rythme et votre budget
      </p>

      <div className="flex flex-col md:flex-row items-center gap-6">
        {pricingData.map((cardData, idx) => (
          <PricingCard
            className="flex-1 w-full"
            key={idx}
            cardData={cardData}
            index={idx}
            isLast={idx === pricingData.length - 1}
          />
        ))}
      </div>
    </div>
  );
}
