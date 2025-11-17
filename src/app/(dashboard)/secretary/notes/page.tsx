"use client";

import { useState, useEffect } from "react";
import { useGetSecretaryStudentEvaluationStatisticsQuery } from "@/lib/apis/student-evaluations";
import { ISecretaryStatisticsFilters } from "@/types/student-evaluations";
import { useListTrainingQuery } from "@/lib/apis/secretary/training-secretary-api";
import { useListSessionByTrainingIdQuery } from "@/lib/apis/secretary/training-secretary-api";
import { useCourseByIdSessionQuery } from "@/lib/apis/secretary/training-secretary-api";
import { useLazyGetLessonBySessionCourseIdSecretaryAccessQuery } from "@/lib/apis/lessons";
import { useListUserByRoleQuery } from "@/lib/apis/users-api";
import { UserRole } from "@/types/user";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import { Search, Filter, X, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import html2pdf from "html2pdf.js";
import toast from "react-hot-toast";

export default function NotesPage() {
  const [filters, setFilters] = useState<ISecretaryStatisticsFilters>({});
  const [appliedFilters, setAppliedFilters] = useState<ISecretaryStatisticsFilters>({});

  // Fetch trainings
  const { data: trainingsData, isLoading: trainingsLoading } = useListTrainingQuery();
  const trainings = trainingsData?.data || [];

  // Fetch sessions when training is selected
  const { data: sessionsData, isLoading: sessionsLoading } = useListSessionByTrainingIdQuery(
    { trainingId: filters.trainingId! },
    { skip: !filters.trainingId }
  );
  const sessions = sessionsData?.data || [];

  // Fetch courses when session is selected
  const { data: coursesData, isLoading: coursesLoading } = useCourseByIdSessionQuery(
    { sessionId: filters.trainingsessionId! },
    { skip: !filters.trainingsessionId }
  );
  const courses = coursesData?.data?.rows || [];

  // Fetch lessons when course is selected
  const [getLessons, { data: lessonsData, isLoading: lessonsLoading }] =
    useLazyGetLessonBySessionCourseIdSecretaryAccessQuery();
  const lessons = lessonsData?.data?.rows || [];

  // Fetch students
  const { data: studentsData, isLoading: studentsLoading } = useListUserByRoleQuery({
    role: UserRole.STUDENT,
  });
  const allStudents = studentsData?.data || [];

  // Load lessons when course changes
  useEffect(() => {
    if (filters.sessioncoursId) {
      getLessons(filters.sessioncoursId);
    }
  }, [filters.sessioncoursId, getLessons]);

  const { data, isLoading, error } =
    useGetSecretaryStudentEvaluationStatisticsQuery(appliedFilters);

  const students = data?.data?.students || [];
  const statistics = data?.data;

  const handleFilterChange = (key: keyof ISecretaryStatisticsFilters, value: string) => {
    setFilters((prev) => {
      const newFilters: ISecretaryStatisticsFilters = {
        ...prev,
        [key]: value || undefined,
      };

      // Reset dependent filters when parent changes
      if (key === "trainingId") {
        newFilters.trainingsessionId = undefined;
        newFilters.sessioncoursId = undefined;
        newFilters.lessonId = undefined;
      } else if (key === "trainingsessionId") {
        newFilters.sessioncoursId = undefined;
        newFilters.lessonId = undefined;
      } else if (key === "sessioncoursId") {
        newFilters.lessonId = undefined;
      }

      return newFilters;
    });
  };

  const handleApplyFilters = () => {
    setAppliedFilters({ ...filters });
  };

  const handleClearFilters = () => {
    setFilters({});
    setAppliedFilters({});
  };

  const getSelectedTrainingName = () => {
    const training = trainings.find((t) => t.id === filters.trainingId);
    return training?.title || "";
  };

  const getSelectedSessionName = () => {
    const session = sessions.find((s) => s.id === filters.trainingsessionId);
    return session?.title || "";
  };

  const getSelectedCourseName = () => {
    const course = courses.find((c) => c.id === filters.sessioncoursId);
    return course?.title || "";
  };

  const getSelectedLessonName = () => {
    const lesson = lessons.find((l) => l.id === filters.lessonId);
    return lesson?.title || "";
  };

  const getSelectedStudentName = () => {
    const student = allStudents.find((s) => s.id === filters.studentId);
    return student ? `${student.firstName || ""} ${student.lastName || ""}`.trim() : "";
  };

  const handleDownloadPDF = async () => {
    if (students.length === 0) {
      toast.error("Aucune donnée à télécharger");
      return;
    }

    try {
      toast.loading("Génération du PDF en matière...", { id: "pdf-generation" });

      // Get filter names for display based on applied filters
      const appliedTraining = trainings.find((t) => t.id === appliedFilters.trainingId);
      const trainingName = appliedTraining?.title || "";

      const appliedSession = sessions.find((s) => s.id === appliedFilters.trainingsessionId);
      const sessionName = appliedSession?.title || "";

      const appliedCourse = courses.find((c) => c.id === appliedFilters.sessioncoursId);
      const courseName = appliedCourse?.title || "";

      const appliedLesson = lessons.find((l) => l.id === appliedFilters.lessonId);
      const lessonName = appliedLesson?.title || "";

      const appliedStudent = allStudents.find((s) => s.id === appliedFilters.studentId);
      const studentName = appliedStudent
        ? `${appliedStudent.firstName || ""} ${appliedStudent.lastName || ""}`.trim()
        : "";

      // Create HTML content for PDF (only body content, not full HTML document)
      const bodyContent = `
        <style>
          * {
            box-sizing: border-box;
          }
          .pdf-container {
            font-family: Arial, sans-serif;
            padding: 20px;
            color: #333;
            width: 100%;
            overflow: visible;
          }
          h1 {
            color: #1a1a1a;
            border-bottom: 2px solid #333;
            padding-bottom: 10px;
            margin-bottom: 20px;
            font-size: 24px;
          }
          .filters-section {
            background-color: #f5f5f5;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
          }
          .filters-section h2 {
            margin-top: 0;
            font-size: 16px;
            color: #666;
          }
          .filters-section p {
            margin: 5px 0;
            font-size: 14px;
          }
          .statistics {
            display: flex;
            gap: 20px;
            margin-bottom: 20px;
            flex-wrap: wrap;
          }
          .stat-card {
            background-color: #f9f9f9;
            padding: 15px;
            border-radius: 5px;
            border: 1px solid #ddd;
            min-width: 150px;
          }
          .stat-card p {
            margin: 0;
          }
          .stat-label {
            font-size: 12px;
            color: #666;
            margin-bottom: 5px;
          }
          .stat-value {
            font-size: 24px;
            font-weight: bold;
            color: #1a1a1a;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
            border: 1px solid #ddd;
            display: table;
            table-layout: auto;
          }
          th {
            background-color: #333;
            color: white;
            padding: 12px 8px;
            text-align: left;
            font-weight: bold;
            border: 1px solid #444;
            font-size: 12px;
          }
          td {
            padding: 10px 8px;
            border: 1px solid #ddd;
            font-size: 12px;
          }
          tr:nth-child(even) {
            background-color: #f9f9f9;
          }
          tbody tr:hover {
            background-color: #f0f0f0;
          }
          .student-info {
            display: flex;
            align-items: center;
            gap: 10px;
          }
          .student-avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background-color: #e0e0e0;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            color: #666;
            flex-shrink: 0;
          }
          .percentage-bar {
            display: inline-block;
            width: 60px;
            height: 8px;
            background-color: #e0e0e0;
            border-radius: 4px;
            overflow: hidden;
            margin-left: 10px;
            vertical-align: middle;
          }
          .percentage-fill {
            height: 100%;
            background-color: #333;
          }
          .date-info {
            text-align: right;
            color: #666;
            font-size: 12px;
            margin-top: 20px;
          }
        </style>
        <div class="pdf-container">
          <h1>Notes des étudiants</h1>
          
          ${
            Object.keys(appliedFilters).length > 0
              ? `
          <div class="filters-section">
            <h2>Filtres appliqués</h2>
            ${trainingName ? `<p><strong>Formation:</strong> ${trainingName}</p>` : ""}
            ${sessionName ? `<p><strong>Session:</strong> ${sessionName}</p>` : ""}
            ${courseName ? `<p><strong>Matière:</strong> ${courseName}</p>` : ""}
            ${lessonName ? `<p><strong>Leçon:</strong> ${lessonName}</p>` : ""}
            ${studentName ? `<p><strong>Étudiant:</strong> ${studentName}</p>` : ""}
          </div>
          `
              : ""
          }
          
          ${
            statistics
              ? `
          <div class="statistics">
            <div class="stat-card">
              <p class="stat-label">Total des évaluations</p>
              <p class="stat-value">${statistics.totalEvaluations}</p>
            </div>
            <div class="stat-card">
              <p class="stat-label">Points totaux possibles</p>
              <p class="stat-value">${statistics.totalPossiblePoints}</p>
            </div>
            <div class="stat-card">
              <p class="stat-label">Nombre d'étudiants</p>
              <p class="stat-value">${students.length}</p>
            </div>
          </div>
          `
              : ""
          }
          
          <table>
            <thead>
              <tr>
                <th>Étudiant</th>
                <th>Points moyens</th>
                <th>Pourcentage</th>
                <th>Points obtenus</th>
                <th>Points possibles</th>
                <th>Nombre d'évaluations</th>
              </tr>
            </thead>
            <tbody>
              ${students
                .map(
                  (student) => `
                <tr>
                  <td>
                    <div class="student-info">
                      <div class="student-avatar">${student.studentName.charAt(0).toUpperCase()}</div>
                      <div>
                        <div style="font-weight: bold;">${student.studentName}</div>
                        <div style="font-size: 12px; color: #666;">${student.studentEmail}</div>
                      </div>
                    </div>
                  </td>
                  <td>${student.averagePoints.toFixed(2)}</td>
                  <td>
                    ${student.percentage.toFixed(2)}%
                    <div class="percentage-bar">
                      <div class="percentage-fill" style="width: ${Math.min(student.percentage, 100)}%"></div>
                    </div>
                  </td>
                  <td>${student.totalPointsEarned}</td>
                  <td>${student.totalPossiblePoints}</td>
                  <td>${student.evaluationCount}</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
          
          <div class="date-info">
            Généré le ${new Date().toLocaleDateString("fr-FR", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>
      `;

      // Create a temporary div to hold the HTML content
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = bodyContent;
      tempDiv.style.position = "absolute";
      tempDiv.style.left = "-9999px";
      tempDiv.style.top = "0";
      tempDiv.style.width = "210mm"; // A4 width
      tempDiv.style.backgroundColor = "#ffffff";
      tempDiv.style.visibility = "visible";
      tempDiv.style.display = "block";
      document.body.appendChild(tempDiv);

      // Wait for content to render and images to load
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Force a reflow to ensure rendering
      tempDiv.offsetHeight;

      // Generate PDF
      const options = {
        margin: [10, 10, 10, 10] as [number, number, number, number],
        filename: `notes_etudiants_${new Date().toISOString().split("T")[0]}.pdf`,
        image: { type: "jpeg" as const, quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          letterRendering: true,
          logging: false,
          backgroundColor: "#ffffff",
          windowWidth: tempDiv.scrollWidth,
          windowHeight: tempDiv.scrollHeight,
        },
        jsPDF: {
          unit: "mm",
          format: "a4",
          orientation: "portrait" as const,
          compress: true,
        },
      };

      await html2pdf().set(options).from(tempDiv).save();

      // Clean up
      if (tempDiv.parentNode) {
        document.body.removeChild(tempDiv);
      }

      toast.dismiss("pdf-generation");
      toast.success("PDF téléchargé avec succès");
    } catch (error) {
      toast.dismiss("pdf-generation");
      toast.error("Erreur lors de la génération du PDF");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Notes des étudiants</h1>
        {/* {students.length > 0 && (
          <Button onClick={handleDownloadPDF}>
            <Download className="h-4 w-4 mr-2" />
            Télécharger le PDF
          </Button>
        )} */}
      </div>

      {/* Filters Section */}
      <div className="bg-white border rounded-lg p-4 space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-5 w-5" />
          <h2 className="text-lg font-medium">Filtres</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Training Selector */}
          <div>
            <Label htmlFor="trainingId">Formation</Label>
            <Select
              value={filters.trainingId || ""}
              onValueChange={(value) => handleFilterChange("trainingId", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une formation" />
              </SelectTrigger>
              <SelectContent>
                {trainingsLoading ? (
                  <div className="p-2">
                    <Skeleton className="h-4 w-full" />
                  </div>
                ) : trainings.length === 0 ? (
                  <div className="p-2 text-sm text-muted-foreground">Aucune formation trouvée</div>
                ) : (
                  trainings.map((training) => (
                    <SelectItem key={training.id} value={training.id}>
                      {training.title}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            {filters.trainingId && (
              <Badge variant="secondary" className="mt-2">
                {getSelectedTrainingName()}
                <button className="ml-1" onClick={() => handleFilterChange("trainingId", "")}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
          </div>

          {/* Session Selector */}
          <div>
            <Label htmlFor="trainingsessionId">Session</Label>
            <Select
              value={filters.trainingsessionId || ""}
              onValueChange={(value) => handleFilterChange("trainingsessionId", value)}
              disabled={!filters.trainingId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une session" />
              </SelectTrigger>
              <SelectContent>
                {!filters.trainingId ? (
                  <div className="p-2 text-sm text-muted-foreground">
                    Sélectionnez d'abord une formation
                  </div>
                ) : sessionsLoading ? (
                  <div className="p-2">
                    <Skeleton className="h-4 w-full" />
                  </div>
                ) : sessions.length === 0 ? (
                  <div className="p-2 text-sm text-muted-foreground">Aucune session trouvée</div>
                ) : (
                  sessions.map((session) => (
                    <SelectItem key={session.id} value={session.id}>
                      {session.title}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            {filters.trainingsessionId && (
              <Badge variant="secondary" className="mt-2">
                {getSelectedSessionName()}
                <button
                  className="ml-1"
                  onClick={() => handleFilterChange("trainingsessionId", "")}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
          </div>

          {/* Course Selector */}
          <div>
            <Label htmlFor="sessioncoursId">Matière</Label>
            <Select
              value={filters.sessioncoursId || ""}
              onValueChange={(value) => handleFilterChange("sessioncoursId", value)}
              disabled={!filters.trainingsessionId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un Matière" />
              </SelectTrigger>
              <SelectContent>
                {!filters.trainingsessionId ? (
                  <div className="p-2 text-sm text-muted-foreground">
                    Sélectionnez d'abord une session
                  </div>
                ) : coursesLoading ? (
                  <div className="p-2">
                    <Skeleton className="h-4 w-full" />
                  </div>
                ) : courses.length === 0 ? (
                  <div className="p-2 text-sm text-muted-foreground">Aucune Matière trouvé</div>
                ) : (
                  courses.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.title}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            {filters.sessioncoursId && (
              <Badge variant="secondary" className="mt-2">
                {getSelectedCourseName()}
                <button className="ml-1" onClick={() => handleFilterChange("sessioncoursId", "")}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
          </div>

          {/* Lesson Selector */}
          <div>
            <Label htmlFor="lessonId">Leçon</Label>
            <Select
              value={filters.lessonId || ""}
              onValueChange={(value) => handleFilterChange("lessonId", value)}
              disabled={!filters.sessioncoursId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une leçon" />
              </SelectTrigger>
              <SelectContent>
                {!filters.sessioncoursId ? (
                  <div className="p-2 text-sm text-muted-foreground">
                    Sélectionnez d'abord un Matière
                  </div>
                ) : lessonsLoading ? (
                  <div className="p-2">
                    <Skeleton className="h-4 w-full" />
                  </div>
                ) : lessons.length === 0 ? (
                  <div className="p-2 text-sm text-muted-foreground">Aucune leçon trouvée</div>
                ) : (
                  lessons.map((lesson) => (
                    <SelectItem key={lesson.id} value={lesson.id}>
                      {lesson.title}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            {filters.lessonId && (
              <Badge variant="secondary" className="mt-2">
                {getSelectedLessonName()}
                <button className="ml-1" onClick={() => handleFilterChange("lessonId", "")}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
          </div>

          {/* Student Selector */}
          <div>
            <Label htmlFor="studentId">Étudiant</Label>
            <Select
              value={filters.studentId || ""}
              onValueChange={(value) => handleFilterChange("studentId", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un étudiant" />
              </SelectTrigger>
              <SelectContent>
                {studentsLoading ? (
                  <div className="p-2">
                    <Skeleton className="h-4 w-full" />
                  </div>
                ) : allStudents.length === 0 ? (
                  <div className="p-2 text-sm text-muted-foreground">Aucun étudiant trouvé</div>
                ) : (
                  allStudents.map((student) => (
                    <SelectItem key={student.id} value={student.id}>
                      {`${student.firstName || ""} ${student.lastName || ""}`.trim() ||
                        student.email}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            {filters.studentId && (
              <Badge variant="secondary" className="mt-2">
                {getSelectedStudentName() || "Étudiant sélectionné"}
                <button className="ml-1" onClick={() => handleFilterChange("studentId", "")}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleApplyFilters}>
            <Search className="h-4 w-4 mr-2" />
            Appliquer les filtres
          </Button>
          <Button variant="outline" onClick={handleClearFilters}>
            Réinitialiser
          </Button>
        </div>
      </div>

      {/* Statistics Summary */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Total des évaluations</p>
            <p className="text-2xl font-semibold">{statistics.totalEvaluations}</p>
          </div>
          <div className="bg-white border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Points totaux possibles</p>
            <p className="text-2xl font-semibold">{statistics.totalPossiblePoints}</p>
          </div>
          <div className="bg-white border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Nombre d'étudiants</p>
            <p className="text-2xl font-semibold">{students.length}</p>
          </div>
        </div>
      )}

      {/* Students Table */}
      <div className="bg-white border rounded-lg">
        {isLoading ? (
          <div className="p-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Étudiant</TableHead>
                  <TableHead>Points moyens</TableHead>
                  <TableHead>Pourcentage</TableHead>
                  <TableHead>Points obtenus</TableHead>
                  <TableHead>Points possibles</TableHead>
                  <TableHead>Nombre d'évaluations</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-3 w-48" />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-16" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-16" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-16" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-16" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-16" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <p className="text-destructive">Erreur lors du chargement des données</p>
          </div>
        ) : students.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-muted-foreground">
              Aucun étudiant trouvé avec les filtres sélectionnés
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Étudiant</TableHead>
                <TableHead>Points moyens</TableHead>
                <TableHead>Pourcentage</TableHead>
                <TableHead>Points obtenus</TableHead>
                <TableHead>Points possibles</TableHead>
                <TableHead>Nombre d'évaluations</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.studentId}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {student.studentAvatar ? (
                        <Image
                          src={student.studentAvatar}
                          alt={student.studentName}
                          width={40}
                          height={40}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                          <span className="text-sm font-medium">
                            {student.studentName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div>
                        <p className="font-medium">{student.studentName}</p>
                        <p className="text-sm text-muted-foreground">{student.studentEmail}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{student.averagePoints.toFixed(2)}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{student.percentage.toFixed(2)}%</span>
                      <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary"
                          style={{ width: `${Math.min(student.percentage, 100)}%` }}
                        />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{student.totalPointsEarned}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-muted-foreground">{student.totalPossiblePoints}</span>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{student.evaluationCount}</span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
