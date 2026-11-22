// src/api/auth.js
import api from "../lib/axios";

export const signup = (payload) =>
  api.post("/auth/signup", payload).then((r) => r.data);

export const login = (payload) =>
  api.post("/auth/login", payload).then((r) => r.data);

export const getMe = () => api.get("/auth/me").then((r) => r.data);

export const logout = () => localStorage.removeItem("token");
