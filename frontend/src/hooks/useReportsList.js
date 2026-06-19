import { fetchReportsList } from "../api/report.api";
import { useQuery } from "@tanstack/react-query";

export const useReportsList = () => {
  return useQuery({
    queryKey: ["reports-list"],
    queryFn: fetchReportsList
  });
};