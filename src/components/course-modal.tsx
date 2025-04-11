"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface CourseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CourseModal({ isOpen, onClose }: CourseModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative max-h-[90vh] w-full max-w-3xl overflow-auto rounded-lg bg-white p-6">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          x
        </button>

        <h2 className="text-xl font-bold">
          Diplôme Supérieur de Comptabilité et de Gestion (DSCG)
        </h2>

        <div className="mt-4 flex flex-wrap gap-2">
          <Badge variant="outline" className="rounded-full bg-blue-50 text-blue-700">
            Comptabilité et Finance
          </Badge>
          <Badge variant="outline" className="rounded-full bg-blue-50 text-blue-700">
            Bac+5
          </Badge>
          <Badge variant="outline" className="rounded-full bg-green-50 text-green-700">
            RNCP35044
          </Badge>
          <Badge variant="outline" className="rounded-full bg-yellow-50 text-yellow-700">
            Valide jusqu&apos;au 31-08-2026
          </Badge>
        </div>

        <div className="mt-6">
          <h3 className="font-semibold">Description</h3>
          <p className="mt-2 text-sm text-gray-600">
            Le Diplôme de Comptabilité et de Gestion (DSCG) est un diplôme d&apos;État de niveau
            licence (Bac+3) qui constitue la première étape du cursus d&apos;expertise comptable. Il
            permet d&apos;acquérir les compétences en comptabilité, gestion, finance et droit des
            affaires.
          </p>
        </div>

        <div className="mt-6">
          <h3 className="font-semibold">Objectifs</h3>
          <ul className="mt-2 list-inside list-disc text-sm text-gray-600">
            <li>Expertise en contrôle finance</li>
            <li>Analyse et contrôle de gestion</li>
            <li>Maîtrise du droit des affaires</li>
            <li>Audit des métiers de la compta, du droit et de la gestion</li>
          </ul>
        </div>

        <div className="mt-6">
          <h3 className="font-semibold">Prérequis</h3>
          <ul className="mt-2 list-inside list-disc text-sm text-gray-600">
            <li>Être titulaire d&apos;un DCG ou équivalent comptable</li>
            <li>Admission possible après BTS CG ou DUT GEA</li>
          </ul>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <h3 className="font-semibold">Alternance</h3>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <div className="rounded bg-gray-100 p-2 text-center text-sm">
                <p className="font-medium">En Ligne</p>
              </div>
              <div className="rounded bg-gray-100 p-2 text-center text-sm">
                <p className="font-medium">À la carte</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold">Durée</h3>
            <div className="mt-2 rounded bg-gray-100 p-2 text-center text-sm">
              <p className="font-medium">2 ans</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold">Tarif</h3>
            <div className="mt-2 rounded bg-gray-100 p-2 text-center text-sm">
              <p className="font-medium">1990€</p>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="font-semibold">Options de financement</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            <Badge className="bg-gray-100 text-gray-700">OPCO</Badge>
            <Badge className="bg-gray-100 text-gray-700">Finance Travail</Badge>
            <Badge className="bg-gray-100 text-gray-700">Finance Travail</Badge>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="font-semibold">Métiers accessibles</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            <Badge className="bg-gray-100 text-gray-700">Assistant comptable</Badge>
            <Badge className="bg-gray-100 text-gray-700">Analyste financier</Badge>
            <Badge className="bg-gray-100 text-gray-700">Responsable paie</Badge>
            <Badge className="bg-gray-100 text-gray-700">Assistant paie</Badge>
            <Badge className="bg-gray-100 text-gray-700">
              Collaborateur en cabinet d&apos;expertise comptable
            </Badge>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="font-semibold">Programme</h3>
          <Accordion type="single" collapsible className="mt-2">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-sm">UE1 Fondamentaux du droit</AccordionTrigger>
              <AccordionContent className="text-sm text-gray-600">
                Contenu du module UE1 Fondamentaux du droit
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-sm">
                UE2 Droit des sociétés et des groupements d&apos;affaires
              </AccordionTrigger>
              <AccordionContent className="text-sm text-gray-600">
                Contenu du module UE2 Droit des sociétés et des groupements d&apos;affaires
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger className="text-sm">UE3 Droit social</AccordionTrigger>
              <AccordionContent className="text-sm text-gray-600">
                Contenu du module UE3 Droit social
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger className="text-sm">UE4 Droit fiscal</AccordionTrigger>
              <AccordionContent className="text-sm text-gray-600">
                Contenu du module UE4 Droit fiscal
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5">
              <AccordionTrigger className="text-sm">UE5 Économie contemporaine</AccordionTrigger>
              <AccordionContent className="text-sm text-gray-600">
                Contenu du module UE5 Économie contemporaine
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-6">
              <AccordionTrigger className="text-sm">UE6 Finance d&apos;entreprise</AccordionTrigger>
              <AccordionContent className="text-sm text-gray-600">
                Contenu du module UE6 Finance d&apos;entreprise
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-7">
              <AccordionTrigger className="text-sm">UE7 Management</AccordionTrigger>
              <AccordionContent className="text-sm text-gray-600">
                Contenu du module UE7 Management
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-8">
              <AccordionTrigger className="text-sm">
                UE8 Systèmes d&apos;information et de gestion
              </AccordionTrigger>
              <AccordionContent className="text-sm text-gray-600">
                Contenu du module UE8 Systèmes d&apos;information et de gestion
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-9">
              <AccordionTrigger className="text-sm">UE9 Comptabilité</AccordionTrigger>
              <AccordionContent className="text-sm text-gray-600">
                Contenu du module UE9 Comptabilité
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-10">
              <AccordionTrigger className="text-sm">UE10 Comptabilité approfondie</AccordionTrigger>
              <AccordionContent className="text-sm text-gray-600">
                Contenu du module UE10 Comptabilité approfondie
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-11">
              <AccordionTrigger className="text-sm">UE11 Contrôle de gestion</AccordionTrigger>
              <AccordionContent className="text-sm text-gray-600">
                Contenu du module UE11 Contrôle de gestion
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-12">
              <AccordionTrigger className="text-sm">UE12 Anglais des affaires</AccordionTrigger>
              <AccordionContent className="text-sm text-gray-600">
                Contenu du module UE12 Anglais des affaires
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-13">
              <AccordionTrigger className="text-sm">
                UE13 Communication professionnelle
              </AccordionTrigger>
              <AccordionContent className="text-sm text-gray-600">
                Contenu du module UE13 Communication professionnelle
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-14">
              <AccordionTrigger className="text-sm">UE14 Professionnalisation</AccordionTrigger>
              <AccordionContent className="text-sm text-gray-600">
                Contenu du module UE14 Professionnalisation
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <div className="mt-8 flex justify-center">
          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
            S&apos;inscrire
          </Button>
        </div>
      </div>
    </div>
  );
}
