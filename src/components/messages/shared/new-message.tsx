"use client";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Loader2, Paperclip, Plus, Search, X } from "lucide-react";
import { useCreateMessageMutation } from "@/lib/apis/common/chat-api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { usePublicListUsersQuery } from "@/lib/apis/users-api";
import { Loading } from "@/components/shared/loading";

const messageFormSchema = z.object({
  subject: z
    .string()
    .min(1, "Le sujet est requis")
    .max(100, "Le sujet ne doit pas dépasser 100 caractères"),
  content: z
    .string()
    .min(1, "Le message est requis")
    .max(1000, "Le message ne doit pas dépasser 1000 caractères"),
  recipientId: z.string().min(1, "Le destinataire est requis"),
  attachment: z.any().optional(),
});

interface User {
  id: number;
  fs_name: string;
  ls_name: string;
  avatar: string | null;
}

export function NewMessageAlert() {
  const { data: usersData, isLoading: isLoadingUsers } = usePublicListUsersQuery();
  const [createMessage, { isLoading }] = useCreateMessageMutation();
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);

  const form = useForm<z.infer<typeof messageFormSchema>>({
    resolver: zodResolver(messageFormSchema),
    defaultValues: {
      subject: "",
      content: "",
      recipientId: "",
    },
    mode: "onChange",
  });

  // Filter users based on search term
  useEffect(() => {
    if (usersData?.data?.rows) {
      const filtered = usersData.data.rows.filter((user: User) =>
        `${user.fs_name} ${user.ls_name}`.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, usersData]);

  const onSubmit = async (values: z.infer<typeof messageFormSchema>) => {
    try {
      await createMessage({
        subject: values.subject,
        content: values.content,
        id_user_receiver: values.recipientId,
      }).unwrap();
      toast.success("Message envoyé", {
        description: "Message envoyé avec succès",
      });
      form.reset();
    } catch {
      toast.error(`Un erreur est survenu`, {
        description: `Nous n'avons pas pu envoye le message`,
      });
    }
  };

  const isFormValid = form.formState.isValid;

  if (isLoadingUsers) return null;

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="lg">
          <Plus className="mr-2 h-4 w-4" /> Nouveau Message
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle>Nouveau Message</AlertDialogTitle>
          <AlertDialogDescription>
            Sélectionnez un destinataire et composez votre message.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Recipient Field */}
            <FormField
              control={form.control}
              name="recipientId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Destinataire</FormLabel>
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-full justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value && usersData?.data?.rows
                            ? usersData.data.rows.find(
                                (user: User) => user.id.toString() === field.value
                              )?.fs_name +
                              " " +
                              usersData.data.rows.find(
                                (user: User) => user.id.toString() === field.value
                              )?.ls_name
                            : "Sélectionner un destinataire"}
                          <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput
                          placeholder="Rechercher un destinataire..."
                          onValueChange={(search) => setSearchTerm(search)}
                        />
                        <CommandEmpty>Aucun destinataire trouvé.</CommandEmpty>
                        <CommandGroup className="max-h-60 overflow-y-auto">
                          {filteredUsers.map((user: User) => (
                            <CommandItem
                              value={user.id.toString()}
                              key={user.id}
                              onSelect={() => {
                                form.setValue("recipientId", user.id.toString());
                                setOpen(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  user.id.toString() === field.value ? "opacity-100" : "opacity-0"
                                )}
                              />
                              <div className="flex flex-col">
                                <span>
                                  {user.fs_name} {user.ls_name}
                                </span>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sujet</FormLabel>
                  <FormControl>
                    <Input placeholder="Entrez le sujet" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Écrivez votre message ici..." {...field} rows={5} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <AlertDialogFooter>
              <AlertDialogCancel
                type="button"
                onClick={() => {
                  form.reset();
                  setSearchTerm("");
                }}
              >
                Annuler
              </AlertDialogCancel>
              <Button
                type="submit"
                disabled={!isFormValid || form.formState.isSubmitting || isLoading}
              >
                {isLoading ? <Loader2 className="animate-spin" /> : "Envoyer"}
              </Button>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
