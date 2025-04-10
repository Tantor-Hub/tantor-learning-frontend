import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Locate, Mail, MapPin, Phone } from "lucide-react";

const contactInfo = {
  title: "Besoin de plus d'informations ?",
  description:
    "Notre équipe est à votre disposition pour répondre à toutes vos questions concernant nos formations, le processus d'admission ou l'alternance. N'hésitez pas à nous contacter !",
  details: [
    {
      type: "Téléphone",
      icon: <Phone className="text-[#33415C] h-full w-auto" />,
      value: "+33 4 28 35 05 60",
    },
    {
      type: "Email",
      icon: <Mail className="text-[#33415C] h-full w-auto" />,
      value: "contact@tantor.fr",
    },
    {
      type: "Adresse",
      icon: <MapPin className="text-[#33415C] h-full w-auto" />,
      value: "48 rue du bret, 38090 Villefontaine",
    },
  ],
};

const NewsLetter = () => {
  return (
    <div className="max-w-[1440px] m-auto px-5 md:px-10 py-16 flex flex-col md:flex-row justify-between gap-5">
      <div className="max-w-[430px] text-white flex flex-col gap-3.5 flex-[2/3]">
        <h2 className="text-[25px] font-semibold">{contactInfo.title}</h2>
        <p className="text-[14px]">{contactInfo.description}</p>
        {contactInfo.details.map((detail, i) => (
          <div key={detail.type} className="flex items-center gap-2 p-2">
            <picture className="h-8 w-8 p-2.5 rounded-full bg-white flex items-center justify-center">
              {detail.icon}
            </picture>
            <div className="text-[14px] flex flex-col">
              <span>{detail.type}</span>
              <span>{detail.value}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-[28px] p-10 bg-white md:min-w-[350px]">
        <div>
          <h2 className="text-[25px] font-semibold">Inscrivez-vous à notre newsletter</h2>
          <p className="text-[#5C677D] text-[14px]">
            Restez informés de nos actualités, événements et nouvelles formations
          </p>
        </div>
        <form>
          <div className="pb-5">
            <label htmlFor="name" className="text-[#001233] text-[14px] font-medium mb-2.5">
              Nom complet
            </label>
            <Input type="text" placeholder="Votre nom" className="rounded-2xl" />
          </div>
          <div className="pb-5">
            <label htmlFor="name" className="text-[#001233] text-[14px] font-medium mb-2.5">
              Nom complet
            </label>
            <Input type="text" placeholder="Votre nom" className="rounded-2xl" />
          </div>
          <Button className="rounded-[12px] w-full text-[12px] font-light">S'inscrire</Button>
        </form>
      </div>
    </div>
  );
};
export default NewsLetter;
