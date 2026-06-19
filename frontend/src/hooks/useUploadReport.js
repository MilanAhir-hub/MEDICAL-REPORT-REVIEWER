import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadReportApi } from "../api/report.api";
import { toast } from "react-hot-toast";

export const useUploadReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["uploadReport"],

    mutationFn: uploadReportApi,

    onSuccess: () => {
      toast.success("Report uploaded successfully!");
      // After upload, refresh reports list
      queryClient.invalidateQueries(["reports-list"]);
    },

    onError: (error) => {
      console.error("Upload failed:", error);
      const errorMessage = error?.response?.data?.message || "Failed to upload report. Please try again.";
      toast.error(errorMessage);
    },
  });
};
