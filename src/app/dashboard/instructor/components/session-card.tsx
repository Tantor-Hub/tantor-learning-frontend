import { Session } from "../types";

const SessionCard = ({ session }: { session: Session }) => {
  return (
    <div className="flex gap-4 flex-wrap items-center">
      <div className="p-2 border border-[#0353A4] bg-[#D4DAE6] rounded-md flex flex-col text-[#0353A4] text-sm font-medium">
        <span>{session.day}</span>
        <div className="flex">
          <span>{session.timeStart}-</span>
          <span>{session.timeEnd}</span>
        </div>
      </div>
      <div>
        <h2 className="text-sm font-medium">{session.title}</h2>
        <p className="text-xs text-[#979DAC] font-light">{session.room}</p>
      </div>
    </div>
  );
};
export default SessionCard;
