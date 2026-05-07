import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

export const getAboutAPI = () => API.get("/about");
export const saveAboutAPI = (data) => API.post("/about/save", data);