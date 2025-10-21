export function SecScheduleCard({
  time,
  title,
  course,
}: {
  time: string;
  title: string;
  course: string;
}) {
  return (
    <div>
      <div className="flex gap-4">
        <div className="border border-primary rounded-lg px-2.5 py-2 text-primary font-medium text-center text-sm">
          {time}
        </div>
        <div className="flex flex-col">
          <h3 className="text-sm font-medium">{title}</h3>
          <p className="text-muted-foreground text-xs">Matière: {course}</p>
        </div>
      </div>
    </div>
  );
}
