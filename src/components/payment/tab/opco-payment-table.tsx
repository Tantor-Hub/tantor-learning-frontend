"use client";

import { useState } from "react";
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
import { UpdateOpcoPaymentModal } from "../update-opco-payment-modal";

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

interface OpcoPaymentTableProps {
  methods: PaymentMethod[];
  onUpdateStatus: (userId: string, sessionId: string, status: string) => void;
  onUpdatePayment?: (id: string) => void;
}

const statusMap: Record<string, string> = {
  pending: "En attente",
  rejected: "Rejeté",
  validated: "Validé",
};

const getBadgeVariant = (status: string) => {
  if (status === "validated") return "default";
  if (status === "rejected") return "destructive";
  return "secondary";
};

export function OpcoPaymentTable({
  methods,
  onUpdateStatus,
  onUpdatePayment,
}: OpcoPaymentTableProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <>
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
          {methods.map((method) => {
            const paymentStatus = statusMap[method.status] || "Inconnu";
            return (
              <TableRow key={method.id}>
                <TableCell>
                  {method.user
                    ? `${method.user.firstName} ${method.user.lastName} ${method.user.email}`
                    : method.id_user}
                </TableCell>
                <TableCell>
                  {method.trainingSession ? method.trainingSession.title : method.id_session}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{method.nom_opco ? "OPCO" : "CPF"}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={getBadgeVariant(method.status)}>{paymentStatus}</Badge>
                </TableCell>
                <TableCell>{new Date(method.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => setSelectedId(method.id)}>
                      Modifier
                    </Button>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Ouvrir le menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() =>
                            onUpdateStatus(method.id_user, method.id_session, "validated")
                          }
                          disabled={method.status === "validated"}
                        >
                          Valider
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            onUpdateStatus(method.id_user, method.id_session, "rejected")
                          }
                          className="text-destructive"
                          disabled={method.status === "rejected"}
                        >
                          Rejeter
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            onUpdateStatus(method.id_user, method.id_session, "pending")
                          }
                          disabled={method.status === "pending"}
                        >
                          Mettre en attente
                        </DropdownMenuItem>
                        {method.nom_opco && (
                          <DropdownMenuItem onClick={() => setSelectedId(method.id)}>
                            Modifier
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      {selectedId && (
        <UpdateOpcoPaymentModal
          id={selectedId}
          open={!!selectedId}
          onClose={() => setSelectedId(null)}
        />
      )}
    </>
  );
}
