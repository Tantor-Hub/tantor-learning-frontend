import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Users, Edit, Trash2 } from "lucide-react";
import EmptyState from "./EmptyState";
import { ISession } from "@/types/secretary/training-secretary";

interface SessionListProps {
  sessions: ISession[];
}

const SessionList: React.FC<SessionListProps> = ({ sessions }) => {
  console.error("sessions", sessions);
  return null;
  return (
    <div className="space-y-4">
      {sessions.map((session: ISession) => (
        <Card key={session.id}>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h4 className="font-semibold text-lg">{session.designation}</h4>
                <p className="text-gray-600 mt-1">{session.description}</p>
                <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
                  {/* <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(session.duree).toLocaleDateString("fr-FR")}
                  </div> */}
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {session.date_session_debut} - {session.date_session_fin}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {session.duree} min
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  <Edit className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {sessions.length === 0 && (
        <EmptyState
          icon="Calendar"
          title="Aucune séance"
          description="Ajoutez des séances pour structurer votre formation."
        />
      )}
    </div>
  );
};

export default SessionList;
