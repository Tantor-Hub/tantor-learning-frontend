"use client";

import { useEffect, useRef } from "react";
import {
  useGetSecretaryOPCOPaymentsQuery,
  useUpdateOPCOStatusMutation,
} from "@/lib/apis/payment-method-OPCO";
import { PaymentTable } from "./payment-table";
import toast from "react-hot-toast";

const statusMap = {
  pending: "En attente",
  rejected: "Rejeté",
  validated: "Validé",
};

export function OpcoTab() {
  const { data: opcoData, isLoading: opcoLoading } = useGetSecretaryOPCOPaymentsQuery();
  const [
    updateOPCOStatus,
    { isLoading: updateLoading, isSuccess: updateSuccess, isError: updateError },
  ] = useUpdateOPCOStatusMutation();
  const loadingToastId = useRef<string | null>(null);
  const currentStatus = useRef<string | null>(null);

  useEffect(() => {
    if (updateLoading && !loadingToastId.current) {
      loadingToastId.current = toast.loading("Mise à jour en cours...");
    } else if (updateSuccess) {
      if (loadingToastId.current) {
        toast.dismiss(loadingToastId.current);
        loadingToastId.current = null;
      }
      const frenchStatus =
        statusMap[currentStatus.current as keyof typeof statusMap] || currentStatus.current;
      toast.success(`Statut mis à jour à ${frenchStatus}`);
      currentStatus.current = null;
    } else if (updateError) {
      if (loadingToastId.current) {
        toast.dismiss(loadingToastId.current);
        loadingToastId.current = null;
      }
      toast.error("Erreur lors de la mise à jour du statut");
      currentStatus.current = null;
    }
  }, [updateLoading, updateSuccess, updateError]);

  const handleUpdateStatus = (userId: string, sessionId: string, status: string) => {
    currentStatus.current = status;
    updateOPCOStatus({ userId, sessionId, status: status as any });
  };

  if (opcoLoading) return <p>Chargement...</p>;

  const mappedMethods =
    opcoData?.data.map((item) => ({
      id: item.userId + item.sessionId, // Unique id
      id_user: item.userId,
      id_session: item.sessionId,
      status: item.status,
      createdAt: new Date().toISOString(), // Assuming no createdAt in OPCOSPayment
      nom_opco: item.nomOpco,
      user: { firstName: "", lastName: "", email: item.userEmail },
      trainingSession: { title: item.sessionTitle },
    })) || [];

  return mappedMethods.length ? (
    <PaymentTable methods={mappedMethods} type="opco" onUpdateStatus={handleUpdateStatus} />
  ) : (
    <p>Aucune méthode de paiement OPCO.</p>
  );
}
