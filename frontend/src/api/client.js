import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const client = axios.create({ baseURL: API_BASE });

export const getFilterOptions = () => client.get("/filters").then((r) => r.data);

export const getStats = (params) => client.get("/stats", { params }).then((r) => r.data);

export const getData = (params) => client.get("/data", { params }).then((r) => r.data);

export default client;
