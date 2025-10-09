"use client";
import { Building } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { useCreateOpcoPaymentMutation } from "@/lib/apis/student/training-api";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/features/auth/auth-slice";
import { useRouter } from "next/navigation";

interface OPCOCardProps {
  sessionId: string;
  isSelected: boolean;
  onSelect: () => void; // for ui
}

export function OPCOCard({ sessionId, isSelected, onSelect }: OPCOCardProps) {
  const [show, setShow] = useState(false);
  const currentUser = useSelector(selectCurrentUser);
  const router = useRouter();
  const [form, setForm] = useState({
    companyName: "",
    siren: "",
    managerName: "",
    phone: "",
    email: "",
  });
  const [errors, setErrors] = useState({
    companyName: false,
    siren: false,
    managerName: false,
    phone: false,
    email: false,
  });
  const [createOpcoPayment, { isLoading }] = useCreateOpcoPaymentMutation();

  const validate = () => {
    const e = {
      companyName: !form.companyName.trim(),
      siren: !form.siren.trim(),
      managerName: !form.managerName.trim(),
      phone: !form.phone.trim() || !/^[0-9 +-]+$/.test(form.phone),
      email: !form.email.trim() || !/^\S+@\S+\.\S+$/.test(form.email),
    };
    setErrors(e);
    return !Object.values(e).some(Boolean);
  };

  const openForm = () => {
    onSelect();
    setShow(true);
  };

  const submit = async () => {
    if (!validate()) return;
    try {
      await createOpcoPayment({
        id_session: sessionId,
        nom_entreprise: form.companyName,
        siren: form.siren,
        nom_responsable: form.managerName,
        telephone_responsable: form.phone,
        email_responsable: form.email,
      }).unwrap();
      toast.success("Informations OPCO enregistrées");
      setShow(false);
      router.push(`/${currentUser?.role}`);
    } catch (e: any) {
      toast.error(e?.data?.message || "Erreur OPCO");
    }
  };

  return (
    <>
      <div
        tabIndex={0}
        className={`flex-1 rounded-lg border-2 p-4 hover:cursor-pointer transition-all duration-200 ${
          isSelected
            ? "border-primary bg-primary/5 text-primary"
            : "border-gray-200 hover:border-gray-300 text-gray-600 hover:text-gray-900"
        }`}
        onClick={openForm}
      >
        <div className="flex flex-col items-center text-center space-y-2">
          <Building size={24} />
          <p className="font-semibold">OPCO</p>
          <p className="text-xs text-gray-500">Prise en charge employeur</p>
        </div>
      </div>

      <Dialog open={show} onOpenChange={setShow}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Informations employeur</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">Nom de l'entreprise *</Label>
              <Input
                id="companyName"
                value={form.companyName}
                onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                className={errors.companyName ? "border-red-500" : ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="siren">Numéro SIREN (9 chiffres) *</Label>
              <Input
                id="siren"
                value={form.siren}
                onChange={(e) => setForm({ ...form, siren: e.target.value })}
                className={errors.siren ? "border-red-500" : ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="managerName">Responsable formation *</Label>
              <Input
                id="managerName"
                value={form.managerName}
                onChange={(e) => setForm({ ...form, managerName: e.target.value })}
                className={errors.managerName ? "border-red-500" : ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone *</Label>
              <Input
                id="phone"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className={errors.phone ? "border-red-500" : ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={errors.email ? "border-red-500" : ""}
              />
            </div>
            <Button onClick={submit} disabled={isLoading} className="w-full mt-2">
              {isLoading ? "Envoi..." : "Soumettre la demande OPCO"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
