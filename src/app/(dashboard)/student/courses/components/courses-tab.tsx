import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { coursesData } from "../data";
import { CoursesTab } from "../types";

const CourseTab = ({ spec }: { spec: string }) => {
  return (
    <Tabs defaultValue="actifs">
      <div className="overflow-x-auto bg-white p-8 rounded-md shadow-md shadow-gray-300 border-t">
        <div className="flex flex-col mb-5">
          <h2 className="text-[#0466C8] text-[18px] font-semibold mb-2.5">Mes Cours</h2>
          <p>{spec}</p>
        </div>

        <TabsList className="flex w-full min-w-[1000px] mb-4 shadow-md shadow-gray-300 border-t bg-gray-100">
          <TabsTrigger value="actifs" className="flex-[1] py-5 rounded-xl">
            Actifs
          </TabsTrigger>
          <TabsTrigger value="avenir" className="flex-[1] py-5 rounded-xl">
            A venir
          </TabsTrigger>
          <TabsTrigger value="termines" className="flex-[1] py-5 rounded-xl">
            Terminés
          </TabsTrigger>
        </TabsList>
        {(["actifs", "avenir", "termines"] as CoursesTab[]).map((key) => (
          <TabsContent key={key} value={key}>
            <div className="space-y-6 min-w-[1000px]">
              {coursesData[key].length == 0 ? (
                <p className="text-center text-gray-500 mt-4">Aucun Cours</p>
              ) : (
                coursesData[key].map((course, index) => (
                  <div key={index} className="flex flex-col gap-2.5 py-2.5">
                    <h3 className="font-bold text-sm text-gray-900">{course.title}</h3>
                    <p className="text-sm text-gray-600">
                      {course.professor}. Prochaine Session: {course.nextSession.day},{" "}
                      {course.nextSession.time}
                    </p>
                    <p className="text-sm font-medium text-gray-800 ">Progression moyenne</p>
                    <div className="h-2 w-full bg-gray-300 rounded-full">
                      <div
                        className="h-full bg-blue-600 rounded-full"
                        style={{ width: `${course.averageProgress}%` }}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </TabsContent>
        ))}
      </div>
    </Tabs>
  );
};
export default CourseTab;
