"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

interface PaymentMethod {
  id: string;
  id_user: string;
  id_session: string;
  status: string;
  createdAt: string;
  nom_opco?: string;
  user?: {
    firstName: string;
    lastName: string;
    email: string;
  };
  trainingSession?: {
    title: string;
  };
}

interface PaymentTableProps {
  methods: PaymentMethod[];
  type: "cpf" | "opco" | "all";
  onUpdateStatus: (userId: string, sessionId: string, status: string) => void;
}

export function PaymentTable({ methods, type, onUpdateStatus }: PaymentTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Utilisateur</TableHead>
          <TableHead>Session</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead>Créé</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {methods.map((method) => (
          <TableRow key={method.id}>
            <TableCell>
              {method.user
                ? `${method.user.firstName} ${method.user.lastName} (${method.user.email})`
                : method.id_user}
            </TableCell>
            <TableCell>
              {method.trainingSession ? method.trainingSession.title : method.id_session}
            </TableCell>
            <TableCell>
              <Badge variant="outline">{method.nom_opco ? "OPCO" : "CPF"}</Badge>
            </TableCell>
            <TableCell>
              <Badge
                variant={
                  method.status === "validated"
                    ? "default"
                    : method.status === "rejected"
                      ? "destructive"
                      : "secondary"
                }
              >
                {method.status === "pending"
                  ? "En attente"
                  : method.status === "validated"
                    ? "Validé"
                    : method.status === "rejected"
                      ? "Rejeté"
                      : "Inconnu"}
              </Badge>
            </TableCell>
            <TableCell>{new Date(method.createdAt).toLocaleDateString()}</TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Ouvrir le menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => onUpdateStatus(method.id_user, method.id_session, "validated")}
                    disabled={method.status === "validated"}
                  >
                    Valider
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onUpdateStatus(method.id_user, method.id_session, "rejected")}
                    className="text-destructive"
                    disabled={method.status === "rejected"}
                  >
                    Rejeter
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onUpdateStatus(method.id_user, method.id_session, "pending")}
                    disabled={method.status === "pending"}
                  >
                    Mettre en attente
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
