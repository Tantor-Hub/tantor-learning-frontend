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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useAddMutation } from "@/lib/apis/admin/user-api";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(3, {
    message: "Le nom doit contenir au moins 3 caractères",
  }),
  email: z.string().email({
    message: "Veuillez entrer un email valide",
  }),
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .regex(/[A-Z]/, "Doit contenir au moins une majuscule")
    .regex(/[0-9]/, "Doit contenir au moins un chiffre")
    .regex(/[^A-Za-z0-9]/, "Doit contenir au moins un caractère spécial"),
  phone: z
    .string()
    .regex(/^\+?[0-9\s]{10,}$/, {
      message: "Numéro de téléphone invalide (minimum 10 chiffres)",
    })
    .optional()
    .or(z.literal("")), // Permet une chaîne vide
  userType: z.string().min(1, {
    message: "Veuillez choisir un type d'utilisateur",
  }),
});

type SupportFormValues = z.infer<typeof formSchema>;

interface NewEventFormProps {
  onCancel: () => void;
}

// Définition des rôles disponibles avec leurs IDs correspondants
const AVAILABLE_ROLES = [
  { id: 2, value: "secretary", label: "Secrétaire" },
  { id: 3, value: "instructor", label: "Formateur" },
];

export default function NewUserForm({ onCancel }: NewEventFormProps) {
  const [addUser, { isLoading }] = useAddMutation();
  const form = useForm<SupportFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      phone: "",
      userType: "",
    },
    mode: "onChange",
  });

  const isFormValid = form.formState.isValid;

  const handleSubmit = async (data: SupportFormValues) => {
    try {
      const names = data.name.split(" ");
      const selectedRole = AVAILABLE_ROLES.find((role) => role.value === data.userType);

      const userData = {
        fs_name: names[0] || "",
        ls_name: names[1] || names[0] || "",
        password: data.password,
        nick_name: names[1] || names[0] || "",
        email: data.email,
        id_role: selectedRole?.id || 3, // Par défaut Formateur si non trouvé
        phone: data.phone || "",
      };

      const p = await addUser(userData).unwrap();
      console.log(p);
      toast.success("Utilisateur créé");
      form.reset();
    } catch (error) {
      toast.error("Erreur lors de la création");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block text-sm font-medium text-gray-700">
                  Nom complet
                </FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Jean Dupont" className="h-12" />
                </FormControl>
                <FormMessage className="text-xs text-red-500" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block text-sm font-medium text-gray-700">Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    placeholder="jean.dupont@example.com"
                    className="h-12"
                  />
                </FormControl>
                <FormMessage className="text-xs text-red-500" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block text-sm font-medium text-gray-700">
                  Mot de passe
                </FormLabel>
                <FormControl>
                  <Input {...field} type="password" placeholder="••••••••" className="h-12" />
                </FormControl>
                <FormMessage className="text-xs text-red-500">
                  {form.formState.errors.password?.message}
                </FormMessage>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block text-sm font-medium text-gray-700">
                  Téléphone (optionnel)
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="tel"
                    placeholder="+33 6 12 34 56 78"
                    className="h-12"
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage className="text-xs text-red-500" />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="userType"
          render={({ field }) => (
            <FormItem className="space-y-4">
              <FormLabel className="block text-sm font-medium text-gray-700">
                Type d'utilisateur
              </FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="flex flex-col space-y-2"
                >
                  {AVAILABLE_ROLES.map((item) => (
                    <div key={item.value} className="flex items-center space-x-3">
                      <RadioGroupItem value={item.value} id={item.value} />
                      <Label htmlFor={item.value} className="font-normal cursor-pointer">
                        {item.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage className="text-xs text-red-500" />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-4 pt-4">
          <Button variant="outline" type="button" onClick={onCancel} className="px-6 py-3">
            Annuler
          </Button>
          <Button
            type="submit"
            disabled={!isFormValid || isLoading}
            className="px-6 py-3 bg-[#0466C8] hover:bg-[#0356A6]"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Création en cours...
              </>
            ) : (
              "Ajouter l'utilisateur"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
