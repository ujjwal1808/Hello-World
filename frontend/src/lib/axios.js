import axios from "axios";

export const axiosInstance = axios.create({
	baseURL: "http://localhost:8000/api/v1",  // ✅ No need to add api/v1 again later
	withCredentials: true,
  });
  