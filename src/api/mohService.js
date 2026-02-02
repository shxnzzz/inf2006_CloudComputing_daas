import { api } from "./client";

export const getMeta = async () => {
  const res = await api.get("/meta", {});
  return JSON.parse(res.data.body || JSON.stringify(res.data));
};

export const postTrend = async (payload) => {
  const res = await api.post("/trend", payload);
  return JSON.parse(res.data.body || JSON.stringify(res.data));
};

export const postOutliers = async (payload) => {
  const res = await api.post("/outliers", payload);
  return JSON.parse(res.data.body || JSON.stringify(res.data));
};

export const postCompare = async (payload) => {
  const res = await api.post("/compare", payload);
  return JSON.parse(res.data.body || JSON.stringify(res.data));
};
