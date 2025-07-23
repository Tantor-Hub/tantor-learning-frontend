import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check } from "lucide-react";
import { PricingCardData } from "../types/index";

interface PricingCardItemProps {
  cardData: PricingCardData;
  index: number;
  isLast: boolean;
  className?: string;
}

export function PricingCard({ cardData, index, isLast, className }: PricingCardItemProps) {
  const { title, description, price, features, buttonText, color } = cardData;

  const getHeaderClasses = () => {
    if (index === 0) {
      return "text-center m-0 h-52 flex items-center justify-center bg-gradient-to-br from-primary to-primary/70 text-white";
    } else if (isLast) {
      return "text-center m-0 h-52 flex items-center justify-center bg-gradient-to-br from-destructive to-destructive/70 text-white";
    } else {
      return "text-center m-0 h-52 flex items-center justify-center"; // White background for middle card
    }
  };

  const getTitleClasses = () => {
    if (index === 1) {
      // Middle card
      return "text-4xl mb-3 text-destructive";
    }
    return "text-4xl mb-3";
  };

  const getDescriptionClasses = () => {
    if (index === 0) {
      return "mb-6 text-white";
    } else if (isLast) return "mb-6 text-white";
    return "mb-6 text-foreground";
  };

  const getButtonVariant = () => {
    return index === 0 ? "default" : "destructive";
  };

  return (
    <Card
      className={`flex-1 pt-0 overflow-hidden border ${!isLast && index != 0 ? "scale-105" : ""} ${className}`}
    >
      <CardHeader className={getHeaderClasses()}>
        <div>
          <CardTitle className={getTitleClasses()}>{title}</CardTitle>
          <CardDescription className={getDescriptionClasses()}>{description}</CardDescription>
          <CardTitle className={`text-4xl ${isLast || index == 0 ? "text-white" : "text-primary"}`}>
            {price}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2">
              <Check className="text-primary" /> {feature.text}
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button className="w-full" variant={getButtonVariant()}>
          {buttonText}
        </Button>
      </CardFooter>
    </Card>
  );
}
