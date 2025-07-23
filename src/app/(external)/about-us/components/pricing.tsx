import { PricingCard } from "./pricing-card";
import { pricingData } from "../data";

export function Pricing() {
  return (
    <div className="bg-white py-12">
      <h2 className="text-3xl font-work-sans font-semibold mb-6 text-primary">
        Choisissez votre formation idéale
      </h2>
      <p className="text-muted-foreground mb-12 w-full max-w-lg mx-auto">
        Trouvez la formule qui correspond le mieux à vos besoins, votre rythme et votre budget
      </p>

      <div className="flex flex-col md:flex-row items-center gap-12">
        {pricingData.map((cardData, idx) => (
          <PricingCard
            className={`flex-1 w-full ${idx == 1 && "shadow-red"}`}
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
