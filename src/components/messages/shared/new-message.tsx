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
import { Loader2, Plus, Search } from "lucide-react";
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
import { toast } from "react-hot-toast";
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
import { useLazyListUserByRoleQuery } from "@/lib/apis/users-api";
import { IUser } from "@/types/user";
import { UserListSkeleton } from "@/components/skeletons/user-list-skeleton";
import { useSelector } from "react-redux";
import { selectToken, selectCurrentUser } from "@/features/auth/auth-slice";
const messageFormSchema = z.object({
  subject: z
    .string()
    .min(1, "Le sujet est requis")
    .max(100, "Le sujet ne doit pas dépasser 100 caractères"),
  content: z
    .string()
    .min(1, "Le message est requis")
    .max(1000, "Le message ne doit pas dépasser 1000 caractères"),
  recipientId: z.array(z.string()).min(1, "Au moins un destinataire est requis"),
  piece_joint: z.array(z.any()).optional(),
});

interface User {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  avatar?: string | null;
}

export function MessageAlert() {
  const token = useSelector(selectToken);
  const currentUser = useSelector(selectCurrentUser);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);

  const form = useForm<z.infer<typeof messageFormSchema>>({
    resolver: zodResolver(messageFormSchema),
    defaultValues: {
      subject: "",
      content: "",
      recipientId: [],
      piece_joint: [],
    },
    mode: "onChange",
  });

  // Fetch users only when popover is opened
  const [trigger, { data, isFetching }] = useLazyListUserByRoleQuery();

  useEffect(() => {
    if (dialogOpen && open && users.length === 0) {
      setIsLoadingUsers(true);
      trigger({ role: "all" })
        .unwrap()
        .then((result: any) => {
          if (result.data) {
            const filtered = result.data.filter((user: User) => user.id !== currentUser?.id);
            setUsers(filtered);
          }
          setIsLoadingUsers(false);
        })
        .catch(() => {
          setUsers([]);
          setIsLoadingUsers(false);
        });
    }
  }, [dialogOpen, open, users.length, trigger, currentUser?.id]);

  // Filter users based on search term
  useEffect(() => {
    if (users.length > 0) {
      const filtered = users.filter((user: User) =>
        `${user.firstName || ""} ${user.lastName || ""}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);

  const onSubmit = async (values: z.infer<typeof messageFormSchema>) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("subject", values.subject);
      formData.append("content", values.content);
      values.recipientId.forEach((id) => {
        formData.append("id_user_receiver[]", id);
      });

      if (values.piece_joint && values.piece_joint.length > 0) {
        values.piece_joint.forEach((file: File) => {
          formData.append("files", file);
        });
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/chat/create`, {
        method: "POST",
        body: formData,
        headers: {
          "x-connexion-tantor": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      toast.success("Message envoyé");
      form.reset();
      setSearchTerm("");
      setOpen(false);
    } catch {
      toast.error(`Une erreur est survenue`);
    } finally {
      setIsLoading(false);
      setDialogOpen(false);
    }
  };

  const isFormValid = form.formState.isValid;

  return (
    <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <AlertDialogTrigger asChild>
        <Button>
          <Plus /> Nouveau Message
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
                          {field.value && users.length > 0
                            ? field.value.length > 0
                              ? field.value
                                  .map((id: string) => {
                                    const user = users.find(
                                      (user: User) => user.id.toString() === id
                                    );
                                    return `${user?.lastName || ""} ${user?.firstName || ""}`.trim();
                                  })
                                  .join(", ")
                              : "Sélectionner un destinataire"
                            : "Sélectionner un destinataire"}
                          <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      {isLoadingUsers ? (
                        <UserListSkeleton />
                      ) : (
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
                                onSelect={(value) => {
                                  const currentRecipients = form.getValues("recipientId") || [];
                                  if (currentRecipients.includes(value)) {
                                    form.setValue(
                                      "recipientId",
                                      currentRecipients.filter((id) => id !== value)
                                    );
                                  } else {
                                    form.setValue("recipientId", [...currentRecipients, value]);
                                  }
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    form.getValues("recipientId").includes(user.id.toString())
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                <div className="flex flex-col">
                                  <span>
                                    {user.firstName || ""} {user.lastName || ""}
                                  </span>
                                </div>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </Command>
                      )}
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

            <FormField
              control={form.control}
              name="piece_joint"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pièces jointes (optionnel)</FormLabel>
                  <FormControl>
                    <input
                      type="file"
                      multiple
                      onChange={(e) => {
                        const files = e.target.files;
                        if (files) {
                          form.setValue("piece_joint", Array.from(files));
                        }
                      }}
                    />
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
                  setDialogOpen(false);
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
