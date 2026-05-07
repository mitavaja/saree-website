import axiosInstance from "./axios.js";

// Get admin dashboard stats (total customers etc.)
export const getStats = async () => {
  const res = await axiosInstance.get("/admin/stats");
  return res.data;
};

