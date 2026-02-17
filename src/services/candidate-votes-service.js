import api from '@/lib/api'

export const getCandidateVoteData = (params = {}) => {
    return api.get("/candidate-data/", { params });
}

export const addCandidateVoteData = (formData) => {
    return api.post("/candidate-data/", formData);
}

export const updateCandidateVoteData = (id, formData) => {
    return api.put(`/candidate-data/${id}/`, formData);
}

export const deleteCandidateVoteData = (id) => api.delete(`/candidate-data/${id}/`);