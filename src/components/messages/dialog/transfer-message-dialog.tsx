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
import { Loader2, Forward } from "lucide-react";
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
import { useEffect, useState } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLazyListUserByRoleQuery } from "@/lib/apis/users-api";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/features/auth/auth-slice";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IUser, UserRole } from "@/types/user";

const transferFormSchema = z.object({
  recipientId: z.array(z.string()).min(1, "Au moins un destinataire est requis"),
  subject: z
    .string()
    .min(1, "Le sujet est requis")
    .max(100, "Le sujet ne doit pas dépasser 100 caractères"),
  content: z
    .string()
    .min(1, "Le message est requis")
    .max(1000, "Le message ne doit pas dépasser 1000 caractères"),
  piece_joint: z.array(z.any()).optional(),
});

interface TransferMessageDialogProps {
  messageId: string;
  originalSubject: string;
  originalContent: string;
}

export function TransferMessageDialog({
  messageId,
  originalSubject,
  originalContent,
}: TransferMessageDialogProps) {
  const [createMessage, { isLoading }] = useCreateMessageMutation();
  const currentUser = useSelector(selectCurrentUser);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [openRecipients, setOpenRecipients] = useState(false);
  const [users, setUsers] = useState<IUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<IUser[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole | "all">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [trigger] = useLazyListUserByRoleQuery();

  const form = useForm<z.infer<typeof transferFormSchema>>({
    resolver: zodResolver(transferFormSchema),
    defaultValues: {
      recipientId: [],
      subject: `Fwd: ${originalSubject}`,
      content: `--- Message transféré ---\n\n${originalContent}`,
      piece_joint: [],
    },
    mode: "onChange",
  });

  // fetch users when popover is opened within dialog
  useEffect(() => {
    if (dialogOpen && openRecipients && users.length === 0) {
      setIsLoadingUsers(true);
      trigger({ role: selectedRole })
        .unwrap()
        .then((result: any) => {
          const list = (result?.data || []).filter((u: IUser) => u.id !== currentUser?.id);
          setUsers(list);
          setIsLoadingUsers(false);
        })
        .catch(() => {
          setUsers([]);
          setIsLoadingUsers(false);
        });
    }
  }, [dialogOpen, openRecipients, users.length, trigger, currentUser?.id, selectedRole]);

  // filter users by search
  useEffect(() => {
    if (users.length > 0) {
      const filtered = users.filter((u) =>
        `${u.firstName || ""} ${u.lastName || ""}`.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers([]);
    }
  }, [searchTerm, users]);

  const onSubmit = async (values: z.infer<typeof transferFormSchema>) => {
    try {
      const payload: any = {
        subject: values.subject,
        content: values.content,
        id_user_receiver: values.recipientId,
        is_forwarded_from: messageId,
      };

      if (values.piece_joint && values.piece_joint.length > 0) {
        const piece_jointe = await Promise.all(
          values.piece_joint.map(async (file: File) => {
            // Implement file upload logic here
            return file.name;
          })
        );
        payload.piece_jointe = piece_jointe;
      }

      await createMessage(payload).unwrap();
      toast.success("Message transféré");
      form.reset();
    } catch {
      toast.error("Une erreur est survenue");
    }
  };

  const isFormValid = form.formState.isValid;

  return (
    <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <AlertDialogTrigger asChild>
        <Button variant={"outline"}>
          <Forward /> Transférer
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle>Transférer le message</AlertDialogTitle>
          <AlertDialogDescription>
            Transférez ce message à un autre destinataire.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Role filter */}
            <div>
              <FormLabel>Rôle des destinataires</FormLabel>
              <Select
                value={selectedRole}
                onValueChange={(value: UserRole | "all") => {
                  setSelectedRole(value);
                  setUsers([]);
                  setFilteredUsers([]);
                  setSearchTerm("");
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionner un rôle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Rôles</SelectLabel>
                    <SelectItem value="all">Tous les utilisateurs</SelectItem>
                    <SelectItem value={UserRole.STUDENT}>Étudiants</SelectItem>
                    <SelectItem value={UserRole.INSTRUCTOR}>Formateurs</SelectItem>
                    <SelectItem value={UserRole.SECRETARY}>Secrétaires</SelectItem>
                    <SelectItem value={UserRole.ADMIN}>Administrateurs</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Recipients multi-select */}
            <FormField
              control={form.control}
              name="recipientId"
              render={() => (
                <FormItem>
                  <FormLabel>Destinataires</FormLabel>
                  <Popover open={openRecipients} onOpenChange={setOpenRecipients}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-between">
                        {form.getValues("recipientId").length > 0
                          ? `${form.getValues("recipientId").length} sélectionné(s)`
                          : "Sélectionner des utilisateurs"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[400px] p-0">
                      <Command>
                        <div className="flex items-center gap-2 p-2">
                          <Search className="h-4 w-4 text-muted-foreground" />
                          <CommandInput
                            placeholder="Rechercher..."
                            value={searchTerm}
                            onValueChange={setSearchTerm}
                          />
                        </div>
                        {isLoadingUsers ? (
                          <div className="p-4 text-sm text-muted-foreground">Chargement...</div>
                        ) : (
                          <CommandGroup>
                            {filteredUsers.length === 0 && (
                              <CommandEmpty>Aucun utilisateur</CommandEmpty>
                            )}
                            {filteredUsers.map((user) => {
                              const selected = form.getValues("recipientId").includes(user.id);
                              return (
                                <CommandItem
                                  key={user.id}
                                  value={`${user.firstName || ""} ${user.lastName || ""}`}
                                  onSelect={() => {
                                    const current = new Set(form.getValues("recipientId"));
                                    if (current.has(user.id)) {
                                      current.delete(user.id);
                                    } else {
                                      current.add(user.id);
                                    }
                                    form.setValue("recipientId", Array.from(current), {
                                      shouldValidate: true,
                                    });
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      selected ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                  {user.firstName} {user.lastName}
                                </CommandItem>
                              );
                            })}
                          </CommandGroup>
                        )}
                      </Command>
                    </PopoverContent>
                  </Popover>
                  {/* Chips */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {form.getValues("recipientId").map((id) => {
                      const u = users.find((x) => x.id === id);
                      if (!u) return null;
                      return (
                        <span
                          key={id}
                          className="inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs"
                        >
                          {u.firstName} {u.lastName}
                          <button
                            type="button"
                            onClick={() => {
                              const next = form
                                .getValues("recipientId")
                                .filter((rid) => rid !== id);
                              form.setValue("recipientId", next, { shouldValidate: true });
                            }}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      );
                    })}
                  </div>
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
                }}
              >
                Annuler
              </AlertDialogCancel>
              <Button
                type="submit"
                disabled={!isFormValid || form.formState.isSubmitting || isLoading}
              >
                {isLoading ? <Loader2 className="animate-spin" /> : "Transférer"}
              </Button>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
