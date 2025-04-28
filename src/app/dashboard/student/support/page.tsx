"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Download, File } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const formSchema = z.object({
  object: z.string().min(1, {
    message: "Veuillez entrer un sujet",
  }),
  message: z.string().min(1, {
    message: "Le message ne doit pas être vide",
  }),
  file: z.any().optional(),
});

type SupportFormValues = z.infer<typeof formSchema>;
export default function Page() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      object: "",
      message: "",
      file: "",
    },
    mode: "onChange",
  });
  const isFormValid = form.formState.isValid;

  const handleSubmit = (data: SupportFormValues) => {
    console.log("====================================");
    console.log(data);
    console.log("====================================");
  };
  return (
    <section className="flex flex-col gap-4">
      <Button className="bg-[#0466C8] py-5 px-10 cursor-pointer w-fit">
        <Download />
        Brochure d’aide
      </Button>

      <div className="bg-white flex flex-col gap-2.5 md:gap-5 p-5">
        <div className="flex flex-col gap-2.5 md:flex-row justify-between">
          <Button
            variant="outline"
            className="border-[#0466C8] text-[#0466C8] cursor-pointer w-fit"
          >
            <ArrowLeft /> Retour
          </Button>
          <p className="text-[#0466C8]  text-2xl">Nouvelle requete</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-5">
            <FormField
              control={form.control}
              name="object"
              render={({ field }) => {
                return (
                  <FormItem className="flex flex-col gap-2">
                    <FormLabel>Sujet</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} className="shadow-sm" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => {
                return (
                  <FormItem className="flex flex-col gap-2">
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={10}
                        {...field}
                        placeholder="Ecrivez votre requete ici .."
                        className="min-h-56 max-h-80 overflow-y-auto resize-none shadow-sm"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <FormField
              control={form.control}
              name="file"
              render={({ field }) => {
                return (
                  <FormItem className="flex justify-end">
                    <FormLabel className="w-fit cursor-pointer">
                      <File /> Attachez une piece jointe
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        {...field}
                        placeholder="Ecrivez votre requete ici .."
                        className="hidden"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <div className="flex gap-5 md:gap-10 justify-end md:mt-5">
              <Button variant="outline" className="border-[#0466C8] text-[#0466C8] cursor-pointer">
                Annuler
              </Button>
              <Button type="submit" className="bg-[#0466C8] cursor-pointer" disabled={!isFormValid}>
                Envoyer
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </section>
  );
}
