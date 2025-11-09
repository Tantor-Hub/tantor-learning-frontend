"use client";

import { useEffect, useRef } from "react";
import {
  useGetSecretaryCPFPaymentsQuery,
  useUpdateCPFStatusMutation,
} from "@/lib/apis/payment-method-CPF";
import { PaymentTable } from "./payment-table";
import toast from "react-hot-toast";

const statusMap = {
  pending: "En attente",
  rejected: "Rejeté",
  validated: "Validé",
};

export function CpfTab() {
  const { data: cpfData, isLoading: cpfLoading } = useGetSecretaryCPFPaymentsQuery();
  const [
    updateCPFStatus,
    { isLoading: updateLoading, isSuccess: updateSuccess, isError: updateError },
  ] = useUpdateCPFStatusMutation();
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
    updateCPFStatus({ userId, sessionId, status: status as any });
  };

  if (cpfLoading) return <p>Chargement...</p>;

  const mappedMethods =
    cpfData?.data.map((item) => ({
      id: item.userId + item.sessionId, // Unique id
      id_user: item.userId,
      id_session: item.sessionId,
      status: item.status,
      createdAt: new Date().toISOString(), // Assuming no createdAt in CPFPayment
      user: { firstName: "", lastName: "", email: item.userEmail },
      trainingSession: { title: item.sessionTitle },
    })) || [];

  return mappedMethods.length ? (
    <PaymentTable methods={mappedMethods} type="cpf" onUpdateStatus={handleUpdateStatus} />
  ) : (
    <p>Aucune méthode de paiement CPF.</p>
  );
}
