import Image from "next/image";

const EventViewer = () => {
  return (
    <div className="flex-[1] border shadow-md p-5 flex flex-col gap-5 rounded-[8px]">
      <div>
        <h2 className="text-[#0466C8] text-base md:text-xl">Evenement du jour</h2>
        <p className="text-sm">0 evenements programmes </p>
      </div>
      <div className="flex flex-col gap-5 items-center">
        <Image src="/icons/calendar-03.svg" height={120} width={120} alt="calendar icon" />
        <p className="text-sm">Aucun evenement </p>
        <p className="text-sm text-[#ACACAC] text-center max-w-[240px]">
          Aucun evenement programmes pour cette date
        </p>
      </div>
    </div>
  );
};
export default EventViewer;
