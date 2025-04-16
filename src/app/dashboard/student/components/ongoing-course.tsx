import { Button } from "@/components/ui/button";
import { OngoingCourseTypes } from "../type";

const OngoingCourse = ({ ongoing }: { ongoing: OngoingCourseTypes }) => {
  return (
    <div className="p-4 flex flex-col gap-y-1.5 md:flex-row justify-between bg-white my-4">
      <div className="flex flex-col md:flex-row gap-5 items-center">
        <picture className="bg-[#D4DAE6] rounded-full size-8 border border-[#0466C8] text-[#0466C8] flex justify-center items-center">
          {ongoing.type}
        </picture>
        <div>
          <h3 className="text-[#0466C8] font-medium text-center">{ongoing.title}</h3>
          <p className="text-xs text-[#979DAC] text-center font-light">{ongoing.subtitle}</p>
        </div>
      </div>
      <Button className="p-5 bg-[#0466C8] w-52 md:w-auto mx-auto md:mx-0 cursor-pointer">
        Rejoindre
      </Button>
    </div>
  );
};
export default OngoingCourse;
