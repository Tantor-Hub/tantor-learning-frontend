import { Button } from "@/components/ui/button";
import Image from "next/image";

const stepsData = [
  {
    id: 1,
    icon: "/icons/step1.png",

    title: "Inscrivez-vous",
    description:
      "Créez un compte en quelques secondes et connectez-vous. Peu après, passez à la seconde étape.",
  },
  {
    id: 2,
    icon: "/icons/step2.png",

    title: "Choisissez votre formation",
    description:
      "Accédez au large catalogue de nos formations et choisissez celui qui vous convient le mieux : en présentiel, en ligne ou même les deux.",
  },
  {
    id: 3,
    icon: "/icons/step3.png",
    title: "Apprenez et Progressez",
    description: "Suivez vos cours à votre rythme en trackant votre progrès.",
  },
];

export const features = [
  {
    title: "Financements publics",
    subtitle: "(CPF, OPCO)",
  },
  {
    title: "Paiement par Cartes,",
    subtitle: "ApplePay ou PayPal",
  },
  {
    title: "Abonnements",
    subtitle: "flexibles",
  },
];

const GetStarted = () => {
  return (
    <section>
      <div className="max-w-[1440px] m-auto px-5 md:px-10 mb-10">
        <h2 className="text-center text-2xl md:text-3xl font-bold text-[#023E7D] my-20">
          Démarrez en trois Étapes Simples
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-15">
          {stepsData.map((step) => (
            <div
              key={step.id}
              className="bg-white p-8 rounded-2xl shadow-lg border-t-[2px] border-[#00000008] text-center flex flex-col items-center min-h-60 md:min-h-80"
            >
              <Image
                src={step.icon}
                height={100}
                width={100}
                alt={`step ${step.id} icon`}
                className="size-[100px] relative -top-20"
              />
              <h3 className="text-[24px] font-semibold -mt-10 text-gray-800">{step.title}</h3>
              <p className="text-[#979DAC] mt-2 leading-8">{step.description}</p>
            </div>
          ))}
        </div>
        <div className="flex flex-col md:flex-row max-w-[1200px] mt-7 justify-between gap-5 mx-auto">
          {features.map((feature, id) => (
            <div key={"feature" + id} className="flex gap-8 items-center">
              <picture className="size-[60px] shadow-sm rounded-full flex items-center justify-center">
                <Image
                  src="/icons/feature.svg"
                  height={60}
                  width={60}
                  alt={`feature ${id + 1} icon`}
                  className="size-[20px]"
                />
              </picture>
              <div className="text-[#696984] font-light">
                <p>{feature.title}</p>
                <p>{feature.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-col items-center gap-7 mt-7">
          <p className="font-semibold text-[#0466C8]">
            Prêt à apprendre ? Rejoignez-nous aujourd'hui !{" "}
          </p>
          <Button className="px-[100px] text-[12px] text-white rounded-b-2xl py-3.5 bg-[#0466C8] cursor-pointer">
            S'inscrire
          </Button>
        </div>
      </div>
    </section>
  );
};
export default GetStarted;
