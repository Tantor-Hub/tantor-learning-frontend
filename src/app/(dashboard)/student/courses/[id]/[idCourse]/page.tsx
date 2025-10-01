"use client";
import { useParams, useRouter } from "next/navigation";
import { useGetCoursesByIdQuery } from "@/lib/apis/student/training-api";
import { Loading } from "@/components/shared/loading";
import {
  BookOpen,
  User,
  Calendar,
  Clock,
  Download,
  FileText,
  CheckCircle,
  GraduationCap,
  Globe,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Page() {
  const router = useRouter();
  const params = useParams();
  const courseId = params.idCourse as string;
  const { data: course, isLoading } = useGetCoursesByIdQuery(
    { id_cours: courseId },
    { skip: !courseId }
  );

  if (isLoading) return <Loading />;

  if (!course?.data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Cours introuvable</h2>
          <p>Le cours demandé n'a pas pu être chargé.</p>
        </div>
      </div>
    );
  }

  const courseData = course.data;

  return (
    <div className="min-h-screen">
      <div className="space-y-4">
        {/* Section En-tête */}
        <div className="overflow-hidden border rounded-md p-4">
          <div className="space-y-4">
            <Button variant="outline" onClick={() => router.back()}>
              <ChevronLeft /> Retour
            </Button>
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-full bg-primary-foreground">
                <GraduationCap className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h2 className="heading-one mb-2 text-primary">{courseData.Title.title}</h2>
                <p className="text-muted-foreground text-sm">{courseData.Title.description}</p>
              </div>
            </div>

            {courseData.is_published && (
              <div className="flex items-center gap-2 mt-4">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-green-300">Cours publié</span>
              </div>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contenu principal */}
          <div className="lg:col-span-2 space-y-8">
            {/* Chapitres du cours */}
            <div className="rounded-md border overflow-hidden">
              <div className="px-8 py-6 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <BookOpen className="h-6 w-6 text-blue-600" />
                  <h2 className="truncate font-semibold text-xl">Contenu du cours</h2>
                </div>
                <p className="text-gray-600 mt-2 text-sm">
                  {courseData.Chapitres.length} chapitres disponibles
                </p>
              </div>

              <div className="divide-y divide-gray-100">
                {courseData.Chapitres.map((chapitre, index) => (
                  <div key={chapitre.id} className="p-8">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold text-sm">{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="truncate font-semibold text-xl text-gray-800 mb-4">
                          {chapitre.chapitre}
                        </h3>
                        <div className="space-y-3">
                          {chapitre.paragraphes.map((paragraphe, pIndex) => (
                            <div
                              key={pIndex}
                              className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                              <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                              <p className="text-gray-700 leading-relaxed">{paragraphe}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section Documents */}
            {courseData.Documents && courseData.Documents.length > 0 && (
              <div className="rounded-md border overflow-hidden">
                <div className="px-8 py-6 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <FileText className="h-6 w-6 text-green-600" />
                    <h2 className="truncate font-semibold text-xl">Ressources du cours</h2>
                  </div>
                </div>

                <div className="p-8">
                  <div className="grid gap-4">
                    {courseData.Documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-red-100 rounded">
                            <FileText className="h-5 w-5 text-red-600" />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-800">{doc.file_name}</h3>
                            <p className="text-sm text-gray-500 capitalize">
                              Document {doc.type.toLowerCase()}
                            </p>
                          </div>
                        </div>
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <Download className="h-4 w-4" />
                          Télécharger
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Barre latérale */}
          <div className="space-y-4">
            {/* Carte d'information du cours */}
            <div className="rounded-md border overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                <h3 className="heading-one">Informations du cours</h3>
              </div>

              <div className="p-4 space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <User className="h-5 w-5 text-gray-500 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Formateur</p>
                    <p className="font-medium text-gray-800">
                      {courseData.CreatedBy.firstName} {courseData.CreatedBy.lastName}
                    </p>
                    <p className="text-sm text-gray-500">{courseData.CreatedBy.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-gray-500 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Période de session</p>
                    <p className="font-medium text-gray-800">{courseData.Session.designation}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-gray-500 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Durée</p>
                    <p className="font-medium text-gray-800">{courseData.Session.duree}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Globe className="h-5 w-5 text-gray-500 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Format</p>
                    <p className="font-medium text-gray-800 capitalize">
                      {courseData.Session.type_formation}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Statistiques rapides */}
            <div className="bg-white rounded-md border p-4">
              <h3 className="truncate font-semibold text-xl mb-4">Statistiques rapides</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Chapitres</span>
                  <span className="font-medium">{courseData.Chapitres.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Documents</span>
                  <span className="font-medium">{courseData.Documents?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Statut</span>
                  <span
                    className={`font-medium ${courseData.is_published ? "text-green-600" : "text-yellow-600"}`}
                  >
                    {courseData.is_published ? "Publié" : "Brouillon"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
