// import React from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { ITraining } from "@/types/secretary/training-secretary";

// interface TrainingSummaryProps {
//   formation: ITraining;
// }

// const TrainingSummary: React.FC<TrainingSummaryProps> = ({ formation }) => {
//   const totalDuration = 10;
//   // formation.seances?.reduce((total, seance) => total + (seance.duree || 0), 0) || 0;

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Résumé</CardTitle>
//       </CardHeader>
//       <CardContent className="space-y-4">
//         <div className="flex justify-between">
//           <span className="text-gray-600">Prix</span>
//           <span className="font-semibold text-xl text-blue-600">{formation.prix}€</span>
//         </div>
//         <div className="flex justify-between">
//           <span className="text-gray-600">Séances</span>
//           <span className="font-medium">{formation.seances?.length || 0}</span>
//         </div>
//         <div className="flex justify-between">
//           <span className="text-gray-600">Durée totale</span>
//           <span className="font-medium">{totalDuration} min</span>
//         </div>
//         <div className="flex justify-between">
//           <span className="text-gray-600">Statut</span>
//           <Badge variant={formation.status === 1 ? "default" : "secondary"}>
//             {formation.status === 1 ? "Actif" : "Inactif"}
//           </Badge>
//         </div>
//         <div className="pt-4 border-t">
//           <span className="text-gray-600 text-sm">Créée le</span>
//           <p className="font-medium">{new Date(formation.createdAt).toLocaleDateString("fr-FR")}</p>
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

// export default TrainingSummary;
