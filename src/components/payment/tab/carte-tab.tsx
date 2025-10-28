"use client";

import { useGetSecretaryCardPaymentsQuery } from "@/lib/apis/payment-method-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function CarteTab() {
  const { data: cardData, isLoading: cardLoading } = useGetSecretaryCardPaymentsQuery();

  if (cardLoading) return <p>Chargement...</p>;

  if (!cardData?.data || cardData.data.length === 0) {
    return <p>Aucune paiement par carte.</p>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Paiements par Carte</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Séance</TableHead>
                <TableHead>Statut Paiement</TableHead>
                <TableHead>ID Stripe</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cardData.data.map((payment) => (
                <TableRow key={payment.stripePaymentId}>
                  <TableCell>{payment.userEmail}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{payment.sessionTitle}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={payment.paymentStatus === "succeeded" ? "default" : "secondary"}
                    >
                      {payment.paymentStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>{payment.stripePaymentId}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
