"use client";
import { Loading } from "@/components/shared/loading";
import { useListStudentDocBySessionIdQuery } from "@/lib/apis/student/document-api";

export function AfterTab({ id_session, id_student }: { id_session: number; id_student: number }) {
  const { data, isLoading } = useListStudentDocBySessionIdQuery({
    id_session: String(id_session),
    id_student: String(id_student),
    group: "after",
  });
  if (isLoading) return <Loading />;
  console.log("after", JSON.stringify(data));
  return <div>After Tab</div>;
}
