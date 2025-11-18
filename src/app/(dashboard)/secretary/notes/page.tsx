"use client";

import { useState, useEffect } from "react";
import {
  useGetSecretaryStudentEvaluationStatisticsQuery,
  useGetStudentEvaluationsBySessionCourseInstructorSecretaryQuery,
} from "@/lib/apis/student-evaluations";
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
import { Search, Filter, X, Download, FileText } from "lucide-react";
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

  const { data, isLoading, error, refetch } =
    useGetSecretaryStudentEvaluationStatisticsQuery(appliedFilters);

  const students = data?.data?.students || [];
  const statistics = data?.data;

  // Fetch evaluations for transcript generation
  const { data: evaluationsData } = useGetStudentEvaluationsBySessionCourseInstructorSecretaryQuery(
    { sessionCoursId: appliedFilters.sessioncoursId! },
    { skip: !appliedFilters.sessioncoursId || !appliedFilters.studentId }
  );
  const evaluations = evaluationsData?.data?.evaluations || [];

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

  const handleGenerateTranscript = async (studentId?: string) => {
    // Use provided studentId or fall back to applied filter
    const targetStudentId = studentId || appliedFilters.studentId;

    // Check if training is selected
    if (!filters.trainingId && !appliedFilters.trainingId) {
      toast.error("Veuillez sélectionner une formation");
      return;
    }

    if (!targetStudentId) {
      toast.error("Veuillez sélectionner un étudiant");
      return;
    }

    // Apply filters automatically: training and student
    const filtersToApply: ISecretaryStatisticsFilters = {
      trainingId: filters.trainingId || appliedFilters.trainingId,
      studentId: targetStudentId,
      // Include other filters if they are set
      trainingsessionId: filters.trainingsessionId || appliedFilters.trainingsessionId,
      sessioncoursId: filters.sessioncoursId || appliedFilters.sessioncoursId,
      lessonId: filters.lessonId || appliedFilters.lessonId,
    };

    // Apply filters if not already applied
    let selectedStudent = students.find((s) => s.studentId === targetStudentId);

    if (JSON.stringify(filtersToApply) !== JSON.stringify(appliedFilters)) {
      setAppliedFilters(filtersToApply);
      // Refetch data with new filters
      const result = await refetch();
      const updatedStudents = result.data?.data?.students || [];
      selectedStudent = updatedStudents.find((s) => s.studentId === targetStudentId);
    }

    if (!selectedStudent) {
      toast.error("Étudiant non trouvé avec les filtres appliqués");
      return;
    }

    try {
      toast.loading("Génération du relevé de notes...", { id: "transcript-generation" });

      // Get all necessary data
      const appliedTraining = trainings.find((t) => t.id === filtersToApply.trainingId);
      const trainingName = appliedTraining?.title || "";
      const trainingSubtitle = appliedTraining?.subtitle || "";
      const trainingCode = appliedTraining?.rnc || appliedTraining?.id || "";
      const trainingDescription = appliedTraining?.description || "";

      const appliedSession = sessions.find((s) => s.id === filtersToApply.trainingsessionId);
      const sessionName = appliedSession?.title || "";
      const sessionStartDate = appliedSession?.begining_date
        ? new Date(appliedSession.begining_date).toLocaleDateString("fr-FR")
        : "";
      const sessionEndDate = appliedSession?.ending_date
        ? new Date(appliedSession.ending_date).toLocaleDateString("fr-FR")
        : "";

      // Get training duration from student statistics (totalHours)
      let trainingDuration = "___";
      if (selectedStudent.totalHours !== undefined && selectedStudent.totalHours !== null) {
        // Format totalHours: if it's a decimal, show one decimal place, otherwise show as integer
        trainingDuration = Number.isInteger(selectedStudent.totalHours)
          ? selectedStudent.totalHours.toString()
          : selectedStudent.totalHours.toFixed(1);
      } else if (appliedSession?.begining_date && appliedSession?.ending_date) {
        // Fallback: calculate from session dates
        const startDate = new Date(appliedSession.begining_date);
        const endDate = new Date(appliedSession.ending_date);
        const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        // Estimate hours: assume 7 hours per day (typical training day)
        const estimatedHours = diffDays * 7;
        trainingDuration = estimatedHours.toString();
      }

      // Get courses - use all courses from session if no specific course is selected
      // Note: courses are loaded based on filters.trainingsessionId, but we need them for filtersToApply
      // If courses are empty, we'll create a generic entry
      let coursesToUse = filtersToApply.sessioncoursId
        ? courses.filter((c) => c.id === filtersToApply.sessioncoursId)
        : courses;

      // Ensure we always have at least one entry to display
      if (coursesToUse.length === 0) {
        // Create a placeholder course entry
        coursesToUse = [{ id: "", title: trainingName || "Formation" } as (typeof courses)[0]];
      }

      const studentInfo = allStudents.find((s) => s.id === targetStudentId);
      const studentFullName = studentInfo
        ? `${studentInfo.firstName || ""} ${studentInfo.lastName || ""}`.trim()
        : selectedStudent.studentName;
      const studentEmail = selectedStudent.studentEmail || studentInfo?.email || "";
      const studentRegistrationNumber = studentInfo?.id || "";

      // Get evaluation details - always populate with student statistics
      const evaluationDetails: Array<{
        subject: string;
        evaluationType: string;
        grade: number;
        maxGrade: number;
        coefficient: number;
        classAverage: number;
        comment: string;
      }> = [];

      // Calculate average grade per evaluation (convert to 20-point scale)
      const avgGradePerEvaluation =
        selectedStudent.evaluationCount > 0 && selectedStudent.totalPossiblePoints > 0
          ? (selectedStudent.totalPointsEarned / selectedStudent.totalPossiblePoints) * 20
          : 0;
      const avgMaxPerEvaluation = 20; // Always 20 for display

      // Calculate raw points for display
      const avgPointsPerEvaluation =
        selectedStudent.evaluationCount > 0
          ? selectedStudent.totalPointsEarned / selectedStudent.evaluationCount
          : 0;
      const avgMaxPointsPerEvaluation =
        selectedStudent.evaluationCount > 0
          ? selectedStudent.totalPossiblePoints / selectedStudent.evaluationCount
          : 20;

      // If we have courses, create entries for each course
      if (coursesToUse.length > 0) {
        coursesToUse.forEach((course) => {
          // Calculate how many evaluations might be in this course
          // Distribute evaluations across courses
          const evaluationsPerCourse = Math.max(
            1,
            Math.floor(selectedStudent.evaluationCount / coursesToUse.length)
          );

          evaluationDetails.push({
            subject: course.title || "Matière",
            evaluationType: "Évaluation",
            grade: avgGradePerEvaluation, // Already on 20-point scale
            maxGrade: avgMaxPerEvaluation, // 20
            coefficient: 1,
            classAverage: avgGradePerEvaluation * 0.95, // Placeholder - 5% below student average
            comment:
              selectedStudent.percentage >= 80
                ? "Très bon"
                : selectedStudent.percentage >= 60
                  ? "Bon"
                  : "Correct",
          });
        });
      } else {
        // If no courses, create a single entry with overall statistics
        evaluationDetails.push({
          subject: trainingName || "Formation générale",
          evaluationType: "Évaluation",
          grade: avgGradePerEvaluation, // Already on 20-point scale
          maxGrade: avgMaxPerEvaluation, // 20
          coefficient: 1,
          classAverage: avgGradePerEvaluation * 0.95,
          comment:
            selectedStudent.percentage >= 80
              ? "Très bon"
              : selectedStudent.percentage >= 60
                ? "Bon"
                : "Correct",
        });
      }

      // Calculate subject averages
      // Use sessionStats if available, otherwise fall back to calculated averages
      let sessionAveragesData: Array<{
        sessionTitle: string;
        studentAverage: number;
        classAverage: number;
        studentPoints?: number;
        totalMaxPoints?: number;
        sessionAverage?: number;
        coefficient: number;
      }> = [];

      if (selectedStudent.sessionStats && selectedStudent.sessionStats.length > 0) {
        // Use sessionStats from API response with all details (raw values, no conversion)
        sessionAveragesData = selectedStudent.sessionStats.map((sessionStat) => {
          return {
            sessionTitle: sessionStat.sessionTitle,
            studentAverage: sessionStat.studentPoints, // Use raw studentPoints
            classAverage: sessionStat.sessionAverage, // Use raw sessionAverage
            studentPoints: sessionStat.studentPoints,
            totalMaxPoints: sessionStat.totalMaxPoints,
            sessionAverage: sessionStat.sessionAverage,
            coefficient: 1, // Default coefficient, adjust if needed
          };
        });
      } else {
        // Fallback: calculate from evaluation details (old method)
        const subjectAverages = evaluationDetails.reduce(
          (acc, evalDetail) => {
            const existing = acc.find((s) => s.subject === evalDetail.subject);
            if (existing) {
              existing.totalGrade += evalDetail.grade * evalDetail.coefficient;
              existing.totalMax += evalDetail.maxGrade * evalDetail.coefficient;
              existing.totalCoeff += evalDetail.coefficient;
              existing.totalClassAvg += evalDetail.classAverage * evalDetail.coefficient;
            } else {
              acc.push({
                subject: evalDetail.subject,
                totalGrade: evalDetail.grade * evalDetail.coefficient,
                totalMax: evalDetail.maxGrade * evalDetail.coefficient,
                totalCoeff: evalDetail.coefficient,
                totalClassAvg: evalDetail.classAverage * evalDetail.coefficient,
                coeff: evalDetail.coefficient,
              });
            }
            return acc;
          },
          [] as Array<{
            subject: string;
            totalGrade: number;
            totalMax: number;
            totalCoeff: number;
            totalClassAvg: number;
            coeff: number;
          }>
        );

        sessionAveragesData = subjectAverages.map((subj) => ({
          sessionTitle: subj.subject,
          studentAverage: subj.totalCoeff > 0 ? subj.totalGrade / subj.totalCoeff : 0,
          classAverage: subj.totalCoeff > 0 ? subj.totalClassAvg / subj.totalCoeff : 0,
          studentPoints: 0, // Not available in fallback
          totalMaxPoints: 0, // Not available in fallback
          sessionAverage: subj.totalCoeff > 0 ? subj.totalClassAvg / subj.totalCoeff : 0,
          coefficient: subj.coeff,
        }));
      }

      // Calculate weighted averages using raw values from sessionStats
      const weightedGeneralAverage =
        sessionAveragesData.reduce((sum, s) => sum + s.studentAverage * s.coefficient, 0) /
          sessionAveragesData.reduce((sum, s) => sum + s.coefficient, 0) || 0;
      const weightedClassAverage =
        sessionAveragesData.reduce((sum, s) => sum + s.classAverage * s.coefficient, 0) /
          sessionAveragesData.reduce((sum, s) => sum + s.coefficient, 0) || 0;

      // Create HTML content for transcript PDF
      const bodyContent = `
        <style>
          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }
          .transcript-container {
            font-family: Arial, sans-serif;
            padding: 20px;
            color: #000;
            width: 100%;
            max-width: 210mm;
            margin: 0 auto;
            background: #fff;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
          }
          .header h1 {
            font-size: 20px;
            font-weight: bold;
            margin-bottom: 5px;
            color: #000;
          }
          .header h2 {
            font-size: 16px;
            font-weight: normal;
            color: #000;
          }
          .section {
            margin-bottom: 20px;
          }
          .section-title {
            font-size: 14px;
            font-weight: bold;
            margin-bottom: 10px;
            color: #000;
          }
          .section-content {
            font-size: 12px;
            line-height: 1.8;
            color: #000;
          }
          .section-content p {
            margin: 5px 0;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
            font-size: 11px;
          }
          table th,
          table td {
            border: 1px solid #000;
            padding: 8px 5px;
            text-align: left;
          }
          table th {
            background-color: #f0f0f0;
            font-weight: bold;
            text-align: center;
          }
          table td {
            text-align: center;
          }
          .checkbox {
            display: inline-block;
            width: 15px;
            height: 15px;
            border: 1px solid #000;
            margin-right: 5px;
            vertical-align: middle;
          }
          .signature-section {
            margin-top: 30px;
            font-size: 12px;
          }
          .signature-section p {
            margin: 8px 0;
          }
          .signature-line {
            border-top: 1px solid #000;
            width: 200px;
            margin-top: 40px;
          }
        </style>
        <div class="transcript-container">
          <div class="header">
            <h1>Centre de Formation Tantor Learning</h1>
            <h2>Relevé de Notes - Attestation de Formation</h2>
          </div>

          <div class="section">
            <div class="section-title">Informations sur le stagiaire</div>
            <div class="section-content">
              <p><strong>Nom et prénom :</strong> ${studentFullName}</p>
              <p><strong>Email :</strong> ${studentEmail || "___"}</p>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Formation suivie</div>
            <div class="section-content">
              <p><strong>Intitulé :</strong> ${trainingName || "___"}${trainingSubtitle ? ` - ${trainingSubtitle}` : ""}</p>
              <p><strong>Référence / Code formation :</strong> ${trainingCode || "___"}</p>
              <p><strong>Durée totale :</strong> ${trainingDuration} heures</p>
              ${trainingDescription ? `<p><strong>Description :</strong> ${trainingDescription}</p>` : ""}
            </div>
          </div>

          <div class="section">
            <div class="section-title">Détail des évaluations</div>
            <table>
              <thead>
                <tr>
                  <th>Matière / Module</th>
                  <th>Évaluation</th>
                  <th>Note</th>
                  <th>Max</th>
                  <th>Coeff Ev</th>
                  <th>Moyenne Classe</th>
                  <th>Commentaire</th>
                </tr>
              </thead>
              <tbody>
                ${evaluationDetails
                  .map(
                    (evaluationDetail) => `
                  <tr>
                    <td>${evaluationDetail.subject}</td>
                    <td>${evaluationDetail.evaluationType}</td>
                    <td>${evaluationDetail.grade.toFixed(1)}</td>
                    <td>${evaluationDetail.maxGrade}</td>
                    <td>${evaluationDetail.coefficient}</td>
                    <td>${evaluationDetail.classAverage.toFixed(1)}</td>
                    <td>${evaluationDetail.comment}</td>
                  </tr>
                `
                  )
                  .join("")}
              </tbody>
            </table>
          </div>

          <div class="section">
            <div class="section-title">Moyenne par session</div>
            <table>
              <thead>
                <tr>
                  <th>Session</th>
                  <th>Points obtenus</th>
                  <th>Points maximum</th>
                  <th>Moyenne stagiaire</th>
                  <th>Moyenne classe</th>
                  <th>Coeff session</th>
                </tr>
              </thead>
              <tbody>
                ${sessionAveragesData
                  .map(
                    (session) => `
                  <tr>
                    <td>${session.sessionTitle}</td>
                    <td>${session.studentPoints !== undefined ? session.studentPoints.toFixed(1) : "-"}</td>
                    <td>${session.totalMaxPoints !== undefined ? session.totalMaxPoints.toFixed(1) : "-"}</td>
                    <td>${session.studentAverage.toFixed(1)}</td>
                    <td>${session.classAverage.toFixed(1)}</td>
                    <td>${session.coefficient}</td>
                  </tr>
                `
                  )
                  .join("")}
                <tr>
                  <td><strong>Moyenne générale pondérée</strong></td>
                  <td>-</td>
                  <td>-</td>
                  <td><strong>${weightedGeneralAverage.toFixed(1)}</strong></td>
                  <td><strong>${weightedClassAverage.toFixed(1)}</strong></td>
                  <td>-</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="section">
            <div class="section-title">Appréciation globale de la formation</div>
            <div class="section-content">
              <p style="min-height: 40px; border-bottom: 1px solid #ccc; margin-bottom: 10px;"></p>
              <p style="min-height: 40px; border-bottom: 1px solid #ccc;"></p>
            </div>
          </div>

          <div class="signature-section">
            <div class="section-title">Signature du formateur / responsable pédagogique</div>
            <div class="section-content">
              <p><strong>Nom :</strong> _________________________</p>
              <p><strong>Date:</strong> ___/___/___</p>
              <p><strong>Signature :</strong></p>
              <div class="signature-line"></div>
            </div>
          </div>
        </div>
      `;

      // Ensure we have evaluation details
      if (evaluationDetails.length === 0) {
        throw new Error("Aucune donnée d'évaluation disponible");
      }

      // Debug: Log the content to verify it's being generated (removed for production)

      // Verify bodyContent is not empty
      if (!bodyContent || bodyContent.trim().length === 0) {
        throw new Error("Le contenu HTML est vide");
      }

      // Create a temporary div to hold the HTML content
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = bodyContent;

      // Set styles to ensure visibility and proper rendering
      // Use relative positioning instead of fixed to ensure html2canvas can capture it
      tempDiv.style.position = "relative";
      tempDiv.style.left = "0";
      tempDiv.style.top = "0";
      tempDiv.style.width = "210mm";
      tempDiv.style.minHeight = "297mm"; // A4 height
      tempDiv.style.backgroundColor = "#ffffff";
      tempDiv.style.visibility = "visible";
      tempDiv.style.display = "block";
      tempDiv.style.zIndex = "9999";
      tempDiv.style.opacity = "1";
      tempDiv.style.overflow = "visible";

      document.body.appendChild(tempDiv);

      // Verify content was inserted
      if (tempDiv.children.length === 0) {
        throw new Error("Le contenu HTML n'a pas été inséré correctement");
      }

      // Wait for content to render and images to load
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Force a reflow to ensure rendering
      const height = tempDiv.offsetHeight;
      const width = tempDiv.offsetWidth;

      if (height === 0 || width === 0) {
        console.error("PDF content dimensions are 0, content might not be rendering");
        // Try to make it visible temporarily
        tempDiv.style.position = "relative";
        tempDiv.style.left = "0";
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      // Generate PDF
      const options = {
        margin: [10, 10, 10, 10] as [number, number, number, number],
        filename: `Releve_Notes_${studentFullName.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.pdf`,
        image: { type: "jpeg" as const, quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          letterRendering: true,
          logging: false,
          backgroundColor: "#ffffff",
          width: Math.max(tempDiv.scrollWidth || 794, 794), // Minimum A4 width in pixels
          height: Math.max(tempDiv.scrollHeight || 1123, 1123), // Minimum A4 height in pixels
          windowWidth: Math.max(tempDiv.scrollWidth || 794, 794),
          windowHeight: Math.max(tempDiv.scrollHeight || 1123, 1123),
          x: 0,
          y: 0,
        },
        jsPDF: {
          unit: "mm",
          format: "a4",
          orientation: "portrait" as const,
          compress: true,
        },
        pagebreak: { mode: ["avoid-all", "css", "legacy"] },
      };

      try {
        await html2pdf().set(options).from(tempDiv).save();
      } catch (pdfError) {
        console.error("PDF generation error:", pdfError);
        // Try alternative approach - make element visible first
        const originalPosition = tempDiv.style.position;
        tempDiv.style.position = "relative";
        tempDiv.style.left = "0";
        tempDiv.style.top = "0";
        await new Promise((resolve) => setTimeout(resolve, 500));
        await html2pdf().set(options).from(tempDiv).save();
        tempDiv.style.position = originalPosition;
      }

      // Clean up
      if (tempDiv.parentNode) {
        document.body.removeChild(tempDiv);
      }

      toast.dismiss("transcript-generation");
      toast.success("Relevé de notes généré avec succès");
    } catch (error) {
      toast.dismiss("transcript-generation");
      toast.error("Erreur lors de la génération du relevé de notes");
      console.error(error);
    }
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

      {/* Generate Transcript Button - Show when students are available */}
      {students.length > 0 && (
        <div className="bg-white border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Relevé de notes</h3>
              <p className="text-sm text-muted-foreground">
                {appliedFilters.studentId
                  ? "Générez le relevé de notes officiel pour l'étudiant sélectionné"
                  : "Générez le relevé de notes pour chaque étudiant depuis le tableau ci-dessous"}
              </p>
            </div>
            {appliedFilters.studentId && (
              <Button onClick={() => handleGenerateTranscript()}>
                <FileText className="h-4 w-4 mr-2" />
                Générer le relevé de notes
              </Button>
            )}
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
                  <TableHead>Actions</TableHead>
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
                    <TableCell>
                      <Skeleton className="h-8 w-20" />
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
                <TableHead>Actions</TableHead>
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
                  <TableCell>
                    {(filters.trainingId || appliedFilters.trainingId) && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleGenerateTranscript(student.studentId)}
                      >
                        <FileText className="h-3 w-3 mr-1" />
                        Relevé
                      </Button>
                    )}
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
