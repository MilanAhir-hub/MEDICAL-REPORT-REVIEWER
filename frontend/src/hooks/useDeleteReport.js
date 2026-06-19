import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteReportApi } from "../api/report.api";
import { toast } from "react-hot-toast";

export const useDeleteReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteReportApi,
    onSuccess: (data) => {
      toast.success(data?.message || "Report deleted successfully!");
      // Invalidate reports list to trigger reload
      queryClient.invalidateQueries({ queryKey: ["reports-list"] });
    },
    onError: (error) => {
      console.error("Delete report error:", error);
      const errorMessage = error?.response?.data?.message || "Failed to delete report. Please try again.";
      toast.error(errorMessage);
    },
  });
};
