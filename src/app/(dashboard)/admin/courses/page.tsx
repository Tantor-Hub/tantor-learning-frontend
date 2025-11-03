import { CourseTab } from "./course-tab";

export default function Page() {
  return (
    <div>
      <h2 className="text-primary text-xl font-semibold mb-3">Matières</h2>
      <p className="mb-8 font-light">
        Liste de toutes les matières disponibles dans la plateforme.
      </p>
      <div className="overflow-x-auto my-4 rounded-md bg-white">
        <div>
          <div className="min-w-[1000px]">
            <CourseTab />
          </div>
        </div>
      </div>
    </div>
  );
}
