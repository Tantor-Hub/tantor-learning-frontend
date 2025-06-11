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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const formSchema = z.object({
  name: z.string().min(3, {
    message: "Veuillez entrer le nom de l'utilisateur",
  }),
  email: z.string().email({
    message: "Veuillez entrer un email valide",
  }),
  userType: z.string().min(1, {
    message: "Veuillez choisir un type d'utilisateur",
  }),
  formation: z.string().min(1, {
    message: "Veuillez sélectionner une formation",
  }),
});
type SupportFormValues = z.infer<typeof formSchema>;

interface NewEventFormProps {
  onCancel: () => void;
}

export default function NewUserForm({ onCancel }: NewEventFormProps) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      userType: "",
      formation: "",
    },
    mode: "onChange",
  });
  const isFormValid = form.formState.isValid;

  const handleSubmit = (data: SupportFormValues) => {
    // console.log(data);
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col text-sm font-normal gap-5"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => {
            return (
              <FormItem className="flex flex-col gap-2.5">
                <FormLabel>Nom et prénom</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    {...field}
                    placeholder="Entrez le nom et le prénom"
                    className="text-sm font-extralight py-5"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => {
            return (
              <FormItem className="flex flex-col gap-2.5">
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Entrez l'email de l'utilisateur"
                    className="text-sm font-extralight py-5"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />

        <FormField
          control={form.control}
          name="userType"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-2.5">
              <FormLabel>Type d'utilisateur</FormLabel>
              <FormControl>
                <RadioGroup
                  value={field.value}
                  onValueChange={field.onChange}
                  className="flex flex-col gap-3.5 px-2.5"
                >
                  <div className="flex items-center space-x-2 ">
                    <RadioGroupItem value="student" id="student" />
                    <Label htmlFor="student" className="font-extralight cursor-pointer">
                      Etudiant
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 ">
                    <RadioGroupItem value="instructor" id="instructor" />
                    <Label htmlFor="instructor" className="font-extralight cursor-pointer">
                      Formateur
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 ">
                    <RadioGroupItem value="secretary" id="secretary" />
                    <Label htmlFor="secretary" className="font-extralight cursor-pointer">
                      Secrétaire
                    </Label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="formation"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-2.5">
              <FormLabel>Formation</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full py-5">
                    <SelectValue placeholder="Sélectionnez le cours" />
                  </SelectTrigger>
                  <SelectContent className="font-extralight">
                    <SelectItem value="DC">DC en ligne</SelectItem>
                    <SelectItem value="comptability">Comptabilite et Audit</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-5 md:gap-10 justify-end md:mt-5">
          <Button
            variant="outline"
            className="!p-5 !px-7 border-[#0466C8] text-[#0466C8] cursor-pointer"
            type="button"
            onClick={onCancel}
          >
            Annuler
          </Button>
          <Button
            type="submit"
            className="!p-5 !px-7 bg-[#0466C8] cursor-pointer"
            disabled={!isFormValid}
          >
            Ajouter l'utilisateur
          </Button>
        </div>
      </form>
    </Form>
  );
}
