import api from "@/lib/api";

export const getESIForecast = (params = {}) => {
    return api.get("/esi-forecast/", { params });
}