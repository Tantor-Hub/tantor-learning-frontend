"use client";
import { Loading } from "@/components/shared/loading";
import { useListStudentDocBySessionIdQuery } from "@/lib/apis/student/document-api";

export function BeforeTab({ id_session, id_student }: { id_session: number; id_student: number }) {
  const { data, isLoading } = useListStudentDocBySessionIdQuery({
    id_session: id_session,
    id_student: id_student,
    group: "before",
  });
  if (isLoading) return <Loading />;
  console.log("before", JSON.stringify(data));
  return (
    <div>
      <p>Before Tab</p>
    </div>
  );
}
