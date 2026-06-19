import { useMutation, useQueryClient } from "@tanstack/react-query";
import { analyzeReportApi } from "../api/report.api";
import { toast } from "react-hot-toast";
//toast will showing the message of the things happen in the background

export const useAnalyzeReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: analyzeReportApi,
    onSuccess: (data, reportId) => {
      console.log("Analysis successful:", data);
      toast.success(data?.message || "Report analyzed successfully!");
      
      // Invalidate the reports list
      queryClient.invalidateQueries({ queryKey: ["reports-list"] });
      
      // Invalidate the specific report analysis query
      queryClient.invalidateQueries({ queryKey: ["report-analysis", reportId] });
    },
    onError: (error) => {
      console.error("Analysis error:", error);
      const errorMessage = error?.response?.data?.message || "Failed to analyze report. Please try again.";
      toast.error(errorMessage);
    },
  });
};
