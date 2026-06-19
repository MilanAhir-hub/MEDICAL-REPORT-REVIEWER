import api from "../utils/axios";

export const fetchReportAnalysis = async (reportId) => {
  const { data } = await api.get(
    `/report/${reportId}`
  );
  return data;
};

//fetch the report list
export const fetchReportsList = async () => {
  const { data } = await api.get("/reports");
  return data;
};

//upload the report

export const uploadReportApi = async (formData) => {
  const response = await api.post(
    "/upload_report",
    formData,
  );

  return response.data;
};

//analyze the report
export const analyzeReportApi = async (reportId) => {
  const response = await api.post("/analyze_report", { reportId });
  return response.data;
};

//delete the report
export const deleteReportApi = async (reportId) => {
  const response = await api.delete(`/reports/${reportId}`);
  return response.data;
};
