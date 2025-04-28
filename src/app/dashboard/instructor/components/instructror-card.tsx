import { Instructor } from "../types";

const InstructorCard = ({ instructor }: { instructor: Instructor }) => {
  return (
    <div className="p-2 flex flex-col gap-3 rounded-sm shadow-md">
      <div className="flex gap-2.5 items-center">
        <span className="size-[50px] bg-[#D8D8D8] rounded-full"></span>
        <div className="flex flex-col gap-1.5">
          <h2 className="text-sm font-medium">{instructor.name}</h2>
          <p className="text-xs text-[#979DAC] font-light">{instructor.specialty}</p>
        </div>
      </div>
      <div className="flex gap-9 flex-wrap">
        {[instructor.attendancePercentage, instructor.attendanceScore].map((el, i) => (
          <div className="flex flex-col flex-[1]" key={i}>
            <div className="flex justify-between text-sm font-medium">
              <h3>Presence</h3>
              <span>{i == 0 ? el + "%" : el + "/100"}</span>
            </div>
            <span className={`h-2 rounded-full w-[${el}%] bg-[#0466C8]`}></span>
          </div>
        ))}
      </div>
    </div>
  );
};
export default InstructorCard;
