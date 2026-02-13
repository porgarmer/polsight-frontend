import api from "@/lib/api";

export const getCandidates = () => {
    return api.get("/candidate/");
}

export const createCandidates = (formData) => {
    return api.post("/candidate/", formData);
}

export const updateCandidate = (id, formData) => {
    return api.put(`/candidate/${id}/`, formData);
}

export const deleteCandidate = (id) => api.delete(`/candidate/${id}/`);