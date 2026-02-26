import api from "@/lib/api";

export const getElectionResults = (params = {}) => {
    return api.get("/election-result/", { params });
}