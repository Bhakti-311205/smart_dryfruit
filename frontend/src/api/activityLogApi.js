import axiosClient from "./axiosClient";

export const getActivityLogsApi = (page = 1, action = "") =>
    axiosClient.get(`/activity-logs?page=${page}${action ? `&action=${action}` : ""}`);

export const createActivityLogApi = (data) =>
    axiosClient.post("/activity-logs", data);
