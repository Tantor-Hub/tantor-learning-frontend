"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useLazyGetOPCOPaymentByIdQuery,
  useUpdateOPCOPaymentMutation,
} from "@/lib/apis/payment-method-OPCO";

interface UpdateOpcoPaymentModalProps {
  id: string;
  open: boolean;
  onClose: () => void;
}

export function UpdateOpcoPaymentModal({ id, open, onClose }: UpdateOpcoPaymentModalProps) {
  const [trigger, { data, isLoading }] = useLazyGetOPCOPaymentByIdQuery();
  const [update, { isLoading: updating }] = useUpdateOPCOPaymentMutation();

  const [form, setForm] = useState({
    nom_entreprise: "",
    siren: "",
    nom_responsable: "",
    telephone_responsable: "",
    email_responsable: "",
  });

  useEffect(() => {
    if (open && id) {
      trigger(id);
    }
  }, [open, id, trigger]);

  useEffect(() => {
    if (data?.data) {
      setForm({
        nom_entreprise: data.data.nom_entreprise || "",
        siren: data.data.siren || "",
        nom_responsable: data.data.nom_responsable || "",
        telephone_responsable: data.data.telephone_responsable || "",
        email_responsable: data.data.email_responsable || "",
      });
    }
  }, [data]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const updateData = {
      id,
      ...Object.fromEntries(Object.entries(form).filter(([_, value]) => value.trim() !== "")),
    };
    await update(updateData);
    onClose();
  };

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Modifier le paiement OPCO</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <p>Chargement...</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="nom_entreprise">Nom Entreprise</Label>
              <Input
                id="nom_entreprise"
                value={form.nom_entreprise}
                onChange={(e) => handleChange("nom_entreprise", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="siren">Siren</Label>
              <Input
                id="siren"
                value={form.siren}
                onChange={(e) => handleChange("siren", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="nom_responsable">Nom Responsable</Label>
              <Input
                id="nom_responsable"
                value={form.nom_responsable}
                onChange={(e) => handleChange("nom_responsable", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="telephone_responsable">Téléphone Responsable</Label>
              <Input
                id="telephone_responsable"
                value={form.telephone_responsable}
                onChange={(e) => handleChange("telephone_responsable", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="email_responsable">Email Responsable</Label>
              <Input
                id="email_responsable"
                value={form.email_responsable}
                onChange={(e) => handleChange("email_responsable", e.target.value)}
              />
            </div>
            <Button type="submit" disabled={updating} className="w-full">
              {updating ? "Mise à jour..." : "Mettre à jour"}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
