"use client";
import { Euro } from "lucide-react";
import toast from "react-hot-toast";
import { useCreateCpfPaymentMutation } from "@/lib/apis/student/training-api";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/features/auth/auth-slice";
import { useRouter } from "next/navigation";

interface CPFCardProps {
  sessionId: string;
  cpfLink?: string;
  isSelected: boolean;
  onSelect: () => void; // for UI selection state
}

export function CPFCard({ sessionId, cpfLink, isSelected, onSelect }: CPFCardProps) {
  const router = useRouter();
  const currentUser = useSelector(selectCurrentUser);
  console.log(currentUser?.role);
  const [createCpfPayment] = useCreateCpfPaymentMutation();
  const handleClick = async () => {
    try {
      onSelect();
      toast.loading("Initialisation du paiement CPF...");
      await createCpfPayment({ id_session: sessionId }).unwrap();
      toast.dismiss();
      toast.success("Méthode CPF créée. Ouverture du lien CPF...");
      setTimeout(() => {
        const link = cpfLink || "https://www.moncompteformation.gouv.fr";
        window.open(link, "_blank");
      });
      router.push(`/${currentUser?.role}`);
    } catch (e: any) {
      console.log(e);
      toast.dismiss();
      toast.error(
        e?.message || "Vous avez déjà une méthode de paiement CPF pour cette session de formation."
      );
    }
  };

  return (
    <div
      tabIndex={1}
      className={`flex-1 rounded-lg border-2 p-4 hover:cursor-pointer transition-all duration-200 ${
        isSelected
          ? "border-primary bg-primary/5 text-primary"
          : "border-gray-200 hover:border-gray-300 text-gray-600 hover:text-gray-900"
      }`}
      onClick={handleClick}
    >
      <div className="flex flex-col items-center text-center space-y-2">
        <Euro size={24} />
        <p className="font-semibold">CPF</p>
        <p className="text-xs text-gray-500">Mon Compte Formation</p>
      </div>
    </div>
  );
}
