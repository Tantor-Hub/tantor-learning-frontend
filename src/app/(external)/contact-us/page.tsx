"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Phone, Mail, MapPin } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { contactUsFormSchema } from "@/lib/validators/form-schema";
import type { ContactUsFormValues } from "@/lib/validators/form-schema";

export default function ContactUs() {
  // Initialize the form with useForm hook
  const form = useForm<ContactUsFormValues>({
    resolver: zodResolver(contactUsFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  // Form submission handler
  function onSubmit(values: ContactUsFormValues) {
    // console.log(values);
    // Add your form submission logic here
  }

  return (
    <main className="max-w-[1440px] m-auto px-5 md:px-10">
      <div className="my-16 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column - Contact Information */}
        <div>
          <h1 className="text-4xl text-primary font-bold mb-6">Besoin de plus d'informations ?</h1>
          <p className="leading-8">
            Notre équipe est à votre disposition pour répondre à toutes vos questions concernant nos
            formations, le processus d'admission ou l'alternance. N'hésitez pas à nous contacter !
          </p>
          <div className="flex gap-4 items-center mt-6">
            <div className="bg-primary rounded-full w-12 h-12 text-white flex items-center justify-center">
              <Phone size={22} />
            </div>
            <div>
              <h3 className="font-bold">Téléphone</h3>
              <p>+33 4 28 35 05 60</p>
            </div>
          </div>
          <div className="flex gap-4 items-center mt-6">
            <div className="bg-primary rounded-full w-12 h-12 text-white flex items-center justify-center">
              <Mail size={22} />
            </div>
            <div>
              <h3 className="font-bold">Email</h3>
              <p>contact@tantor.fr</p>
            </div>
          </div>
          <div className="flex gap-4 items-center mt-6">
            <div className="bg-primary rounded-full w-12 h-12 text-white flex items-center justify-center">
              <MapPin size={22} />
            </div>
            <div>
              <h3 className="font-bold">Adresse</h3>
              <p>48 rue du bret, 38090 Villefontaine</p>
            </div>
          </div>
        </div>

        {/* Right Column - Contact Form */}
        <div>
          <h2 className="text-4xl font-bold mb-6">Prenez Contact avec Nous</h2>
          <p className="leading-8 mb-6">
            Vous avez une question, un projet de formation ou besoin d'un accompagnement
            personnalisé ? Notre équipe est à votre écoute pour vous guider.
          </p>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Nom Complet <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Votre nom complet" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Votre adresse mail <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="exemple@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Objet <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Sujet de votre message" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Votre Message <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Écrivez votre message ici..."
                        className="min-h-32"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="mt-4"
                disabled={!form.formState.isDirty || Object.keys(form.formState.errors).length > 0}
              >
                Envoyer
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </main>
  );
}
