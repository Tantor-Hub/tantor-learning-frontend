import {
  GraduationCap,
  BookText,
  Users,
  TrendingUp,
  CreditCard,
  SquareUserRound,
} from "lucide-react";
import { PricingCardData } from "../types/index";

export const courseTypes = [
  {
    icon: GraduationCap,
    title: "Formations BAC+3",
    description: "DCG et formations professionnelles",
  },
  {
    icon: BookText,
    title: "Formations BAC+5",
    description: "DCG et masters spécialisés",
  },
  {
    icon: Users,
    title: "Alternance",
    description: "Etudes et expérience professionnelle",
  },
  {
    icon: TrendingUp,
    title: "Formations Continue",
    description: "Pour professionnels en activité",
  },
];

export const registrationSteps = [
  {
    number: 1,
    title: "Inscription en ligne",
    description:
      "Cliquez sur le lien d'inscription et inscrivez-vous directement sur notre plateforme en ligne en quelques clics.",
  },
  {
    number: 2,
    title: "Accès à l'espace Apprenant(e)",
    description:
      "Une fois inscrit, connectez-vous à votre espace personnel pour accéder aux documents nécessaires.",
  },
  {
    number: 3,
    title: "Remplissage et soumission du dossier",
    description:
      "Remplissez le dossier d'inscription, puis soumettez-le pour finaliser votre inscription.",
  },
];

export const accountingCourses = [
  {
    icon: GraduationCap,
    title: "DCG initial",
    description:
      "Formation en présentiel idéale pour les étudiants souhaitant suivre un parcours académique traditionnel.",
    action: "En savoir plus",
  },
  {
    icon: Users,
    title: "DCG Alternance",
    description:
      "Combinez études et expérience professionnelle avec notre formation en alternance.",
    action: "En savoir plus",
  },
  {
    icon: SquareUserRound,
    title: "DCG En ligne",
    description:
      "Suivez votre formation à distance, à votre rythme grâce à notre plateforme en ligne.",
    action: "En savoir plus",
  },
  {
    icon: CreditCard,
    title: "DCG à la Carte",
    description:
      "Personnalisez votre parcours en choisissant les modules qui correspondent à vos objectifs.",
    action: "En savoir plus",
  },
];

export const pricingData: PricingCardData[] = [
  {
    title: "A LA CARTE",
    description: "Votre Formation, votre choix!",
    price: "à partir de 199€",
    features: [
      { text: "Choisissez vos matières" },
      { text: "Formation ultra-flexible" },
      { text: "Payez seulement ce dont vous avez besoin" },
      { text: "Passez uniquement les épreuves souhaitées" },
    ],
    buttonText: "CHOISISSEZ",
    color: "primary",
    useGradient: true,
  },
  {
    title: "ALTERNANCE",
    description: "Apprendre en travaillant, réussir en avançant !",
    price: "8000€",
    features: [
      { text: "Etudiez et travillez en même temps" },
      { text: "Formation 100% financée" },
      { text: "Salaire et diplôme garantis" },
      { text: "Apprenez avec des experts" },
      { text: "Gagnez de l'expérience en entreprise" },
    ],
    buttonText: "GAGNEZ",
    color: "destructive",
    useGradient: false,
  },
  {
    title: "EN LIGNE",
    description: "Se former partout, quand vous voulez !",
    price: "3000€",
    features: [
      { text: "Formez-vous où vous voulez" },
      { text: "Cours accessible 24/7" },
      { text: "Suivi personnalisé garanti" },
      { text: "Révisez à votre rythme" },
      { text: "Réussissez sans contrainte" },
    ],
    buttonText: "MAITRISEZ",
    color: "destructive",
    useGradient: true,
  },
];
