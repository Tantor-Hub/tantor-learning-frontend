import { useSelector } from "react-redux";
import { selectSelectedSessionId } from "@/features/dashboard/dashboard-slice";

export const useSelectedSession = () => {
  const selectedSessionId = useSelector(selectSelectedSessionId);
  return selectedSessionId;
};
