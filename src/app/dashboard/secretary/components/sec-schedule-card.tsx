import { Schedule } from "../types";

export const SecSingleSchedule = ({ event }: { event: Schedule }) => {
  return (
    <div className="flex gap-4">
      <div className="border border-[#0353A4] rounded-lg px-2.5 py-2 text-[#0353A4] font-medium text-center text-sm">
        {event.time}
      </div>
      <div className="flex flex-col">
        <h3 className="text-sm font-medium">{event.title}</h3>
        <p className="text-gray-400 text-xs">{event.location}</p>
      </div>
    </div>
  );
};
