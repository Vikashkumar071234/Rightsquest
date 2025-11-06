import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
});

export const getLessons = () => API.get("lessons/");
export const getLessonDetail = (id) => API.get(`lessons/${id}/`);
