import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Users, BookOpen, ChevronRight, User } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

// Données fictives pour les sessions du DCG
const dcgSessions = [
  {
    month: "Septembre 2024",
    sessions: [
      {
        id: "s1",
        date: "15 Septembre 2024",
        time: "09:00 - 12:00",
        location: "Campus Principal, Salle B12",
        seats: "5/20 places disponibles",
        instructor: "Prof. Martin Dupont",
        status: "ouverte",
        participants: [
          { name: "Jean Dupont", avatar: "/avatars/1.jpg" },
          { name: "Marie Lambert", avatar: "/avatars/2.jpg" },
          { name: "Pierre Durand", avatar: "/avatars/3.jpg" },
          { name: "Sophie Martin", avatar: "/avatars/4.jpg" },
          { name: "Lucie Petit", avatar: "/avatars/5.jpg" },
        ],
      },
      {
        id: "s2",
        date: "22 Septembre 2024",
        time: "14:00 - 17:00",
        location: "Campus Nord, Salle A05",
        seats: "8/15 places disponibles",
        instructor: "Prof. Sophie Leroy",
        status: "bientôt complet",
        participants: [
          { name: "Thomas Moreau", avatar: "/avatars/6.jpg" },
          { name: "Emma Bernard", avatar: "/avatars/7.jpg" },
          { name: "Nicolas Roux", avatar: "/avatars/8.jpg" },
        ],
      },
    ],
  },
  {
    month: "Novembre 2024",
    sessions: [
      {
        id: "s3",
        date: "10 Novembre 2024",
        time: "10:00 - 13:00",
        location: "En ligne",
        seats: "12/50 places disponibles",
        instructor: "Prof. Jean Moreau",
        status: "ouverte",
        participants: [
          { name: "Alexandre Simon", avatar: "/avatars/9.jpg" },
          { name: "Laura Michel", avatar: "/avatars/10.jpg" },
        ],
      },
    ],
  },
  {
    month: "Décembre 2024",
    sessions: [
      {
        id: "s4",
        date: "05 Décembre 2024",
        time: "13:00 - 16:00",
        location: "Campus Principal, Labo Info 3",
        seats: "3/10 places disponibles",
        instructor: "Prof. Alain Techier",
        status: "complète",
        participants: [
          { name: "Pauline Leroy", avatar: "/avatars/11.jpg" },
          { name: "Julien Petit", avatar: "/avatars/12.jpg" },
          { name: "Camille Bernard", avatar: "/avatars/13.jpg" },
        ],
      },
    ],
  },
];

export default function DCGSessionsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <div className="flex items-center gap-4">
          <BookOpen className="text-blue-600" size={32} />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Diplôme de Comptabilité et Gestion (DCG)
            </h1>
            <p className="text-gray-600 mt-1">Sessions de formation disponibles</p>
          </div>
        </div>
      </header>

      <div className="space-y-12">
        {dcgSessions.map((monthGroup) => (
          <section key={monthGroup.month} className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b">
              <h2 className="text-2xl font-semibold flex items-center">
                <Calendar className="mr-3 text-blue-600" size={24} />
                {monthGroup.month}
              </h2>
            </div>

            <div className="grid gap-6 p-6 md:grid-cols-1 lg:grid-cols-2">
              {monthGroup.sessions.map((session) => (
                <Card key={session.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex justify-between items-start">
                      <span>Session du {session.date}</span>
                      <Badge
                        variant={
                          session.status === "bientôt complet"
                            ? "destructive"
                            : session.status === "complète"
                              ? "secondary"
                              : "default"
                        }
                      >
                        {session.status}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center">
                      <Clock className="mr-3 text-gray-500" size={18} />
                      <span>{session.time}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="mr-3 text-gray-500" size={18} />
                      <span>{session.location}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="mr-3 text-gray-500" size={18} />
                      <span>{session.seats}</span>
                    </div>
                    <div className="pt-2 text-sm text-gray-600">
                      <p>Enseignant: {session.instructor}</p>
                    </div>

                    <Separator className="my-3" />

                    <div>
                      <h4 className="font-medium mb-2 flex items-center">
                        <User className="mr-2" size={16} />
                        Participants ({session.participants.length})
                      </h4>
                      <div className="flex flex-wrap gap-3">
                        {session.participants.map((participant, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={participant.avatar} />
                              <AvatarFallback>
                                {participant.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{participant.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button disabled={session.status === "complète"}>
                      Postuler <ChevronRight className="ml-2" size={16} />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-8 bg-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-medium text-blue-800 mb-3">Information importante</h3>
        <ul className="list-disc list-inside space-y-2 text-blue-900">
          <li>Les sessions marquées "complète" ne peuvent plus accepter de participants</li>
          <li>Vous pouvez voir qui d'autre a rejoint chaque session</li>
          <li>Les sessions en ligne envoient le lien de connexion 24h avant</li>
        </ul>
      </div>
    </div>
  );
}
