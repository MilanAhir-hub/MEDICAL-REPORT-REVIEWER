import { useQuery } from "@tanstack/react-query";
import { fetchReportAnalysis } from "../api/report.api";

export const useReportAnalysis = (reportId) => {
  return useQuery({
    queryKey: ["report-analysis", reportId],
    queryFn: () => fetchReportAnalysis(reportId),
    enabled: !!reportId
  });
};