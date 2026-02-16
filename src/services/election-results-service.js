import api from "@/lib/api";

export const getElectionResults = (params = {}) => {
    return api.get("/election-result/", { params });
}

export const addElectionResult = (formData) => {
    return api.post("/election-result/", formData);
}

export const updateElectionResult = (id, formData) => {
    return api.put(`/election-result/${id}/`, formData);
}

export const deleteElectionResult = (id) => api.delete(`/election-result/${id}/`);