import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageCard } from "./message-card";
import { messages } from "../data";
import Image from "next/image";
import Link from "next/link";
import { NewMessageAlert } from "./new-message";

export function TabsView() {
  return (
    <Tabs defaultValue="all" className="w-full">
      <TabsList className="grid w-full max-w-[620px] grid-cols-6 mb-4">
        <TabsTrigger value="all">Tous</TabsTrigger>
        <TabsTrigger value="archives">Archives</TabsTrigger>
        <TabsTrigger value="deleted">Supprimés</TabsTrigger>
        <TabsTrigger value="new">Nouveaux</TabsTrigger>
        <TabsTrigger value="send">Envoyés</TabsTrigger>
        <TabsTrigger value="received">Reçus</TabsTrigger>
      </TabsList>
      <TabsContent value="all">
        <div className="flex items-center justify-between">
          <p>1 message(s) non lu</p>
          <NewMessageAlert />
        </div>
        <div className="my-4 grid grid-cols-1 gap-4">
          {messages.map((msg) => (
            <Link key={msg.id} href={`/dashboard/instructor/messages/${msg.id}`}>
              <MessageCard
                key={msg.id}
                name={msg.name}
                role={msg.role}
                title={msg.title}
                message={msg.message}
                isRead={msg.isRead}
              />
            </Link>
          ))}
        </div>
      </TabsContent>
      <TabsContent value="archives">
        <div className="flex flex-col items-center justify-center h-full">
          <h1 className="text-2xl font-bold">Aucun message</h1>
          <p className="text-gray-500">Vous n'avez pas de message dans cette catégorie.</p>
          <p className="text-gray-500">
            Vous pouvez envoyer un message en cliquant sur le bouton ci-dessous.
          </p>
          <Image src="/empty.svg" width={200} height={200} alt="Empty svg" />
          <p>Votre liste de reçus est vide.</p>
        </div>
      </TabsContent>
      <TabsContent value="deleted">
        <div className="flex flex-col items-center justify-center h-full">
          <h1 className="text-2xl font-bold">Aucun message</h1>
          <p className="text-gray-500">Vous n'avez pas de message dans cette catégorie.</p>
          <p className="text-gray-500">
            Vous pouvez envoyer un message en cliquant sur le bouton ci-dessous.
          </p>
          <Image src="/empty.svg" width={200} height={200} alt="Empty svg" />
          <p>Votre liste de reçus est vide.</p>
        </div>
      </TabsContent>

      <TabsContent value="new">
        <div className="flex flex-col items-center justify-center h-full">
          <h1 className="text-2xl font-bold">Aucun message</h1>
          <p className="text-gray-500">Vous n'avez pas de message dans cette catégorie.</p>
          <p className="text-gray-500">
            Vous pouvez envoyer un message en cliquant sur le bouton ci-dessous.
          </p>
          <Image src="/empty.svg" width={200} height={200} alt="Empty svg" />
          <p>Votre liste de reçus est vide.</p>
        </div>
      </TabsContent>
      <TabsContent value="send">
        <div className="flex flex-col items-center justify-center h-full">
          <h1 className="text-2xl font-bold">Aucun message</h1>
          <p className="text-gray-500">Vous n'avez pas de message dans cette catégorie.</p>
          <p className="text-gray-500">
            Vous pouvez envoyer un message en cliquant sur le bouton ci-dessous.
          </p>
          <Image src="/empty.svg" width={200} height={200} alt="Empty svg" />
          <p>Votre liste de reçus est vide.</p>
        </div>
      </TabsContent>
      <TabsContent value="received">
        <div className="flex flex-col items-center justify-center h-full">
          <h1 className="text-2xl font-bold">Aucun message</h1>
          <p className="text-gray-500">Vous n'avez pas de message dans cette catégorie.</p>
          <p className="text-gray-500">
            Vous pouvez envoyer un message en cliquant sur le bouton ci-dessous.
          </p>
          <Image src="/empty.svg" width={200} height={200} alt="Empty svg" />
          <p>Votre liste de reçus est vide.</p>
        </div>
      </TabsContent>
    </Tabs>
  );
}
