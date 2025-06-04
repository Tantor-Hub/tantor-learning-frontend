"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Mail, MapPin, Phone } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useSubscribeNewsLetterMutation } from "@/lib/apis/public-api";
import { toast } from "sonner";
import { subscribeNewsLetterSchema, SubscribeNewsLetterSchemaFormValues } from "@/lib/validators";

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
      value: "infos@tantor.com",
    },
    {
      type: "Adresse",
      icon: <MapPin className="text-[#33415C] h-full w-auto" />,
      value: "France, Paris",
    },
  ],
};

export default function NewsLetter() {
  const [handleSubscribeNewsLetter, { isLoading }] = useSubscribeNewsLetterMutation();
  const form = useForm<SubscribeNewsLetterSchemaFormValues>({
    resolver: zodResolver(subscribeNewsLetterSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: SubscribeNewsLetterSchemaFormValues) => {
    try {
      const response = await handleSubscribeNewsLetter({
        user_email: values.email,
      }).unwrap();
      toast.success("Ajouté à la liste de diffusion", {
        description:
          "Vous recevrez régulièrement des mises à jour de notre part dans votre boîte mail.",
      });
      if (response.status !== 201) {
        toast.error("Erreur", {
          description: "Une erreur s'est produite. Veuillez réessayer.",
        });
      }
    } catch (error) {
      toast.error("Échec de l'abonnement", {
        description:
          "Impossible de vous abonner pour le moment. Vérifiez votre connexion ou réessayez plus tard.",
      });
      // console.error("Subscription error:", error);
    }
  };

  const isFormValid = form.formState.isValid;

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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#001233] text-[14px] font-medium">
                    Addresse Mail
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Votre Address Mail" className="rounded-2xl" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="rounded-[12px] w-full text-[12px] font-light"
              disabled={!isFormValid || isLoading} // Désactivé si le formulaire n'est pas valide
            >
              {isLoading ? <Loader2 className="animate-spin" /> : "S'inscrire"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
