// import React from "react";
// import { Button } from "@/components/ui/button";
// import { ArrowLeft, Plus } from "lucide-react";
// import TrainingTabs from "./TrainingTab";
// import TrainingSummary from "./TrainingSummary";
// import { ISession, ITraining, ITrainingByIdResponse } from "@/types/secretary/training-secretary";
// import SessionForm from "./SessionForm";

// interface TrainingDetailsProps {
//   session: ITrainingByIdResponse | null;
//   onBack: () => void;
//   refetchFormations: () => void;
// }

// const TrainingDetails: React.FC<TrainingDetailsProps> = ({
//   session,
//   onBack,
//   refetchFormations,
// }) => {
//   const [showSessionModal, setShowSessionModal] = React.useState(false);

//   if (!session) return null;

//   return (
//     <div className="space-y-6">
//       <div className="flex flex-col gap-4">
//         <div className="flex items-center justify-between">
//           <Button variant="outline" onClick={onBack}>
//             <ArrowLeft /> Retour à la liste
//           </Button>

//           <SessionForm
//             open={showSessionModal}
//             onOpenChange={setShowSessionModal}
//             training={session}
//             onSuccess={() => {
//               setShowSessionModal(false);
//               refetchFormations();
//             }}
//           >
//             Ajouter une session
//           </SessionForm>
//         </div>
//         <div className="flex-1">
//           <div className="flex justify-between items-center">
//             <div>
//               <h1 className="text-3xl font-bold text-gray-900">{formation.titre}</h1>
//               <p className="text-gray-600">{formation.sous_titre}</p>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="grid gap-6 md:grid-cols-3">
//         <div className="md:col-span-2">
//           <TrainingTabs formation={formation} refetchFormations={refetchFormations} />
//         </div>
//         <div>
//           <TrainingSummary formation={formation} />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TrainingDetails;
