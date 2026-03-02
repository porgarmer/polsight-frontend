import api from '@/lib/api'

export const login = (username, password) => {
    return api.post("/auth/login/", { username, password });
}


export async function getMe() {
  const res = await api.get("/auth/me/");
  return res.data;
}

export const logout = () => {
    return api.post("/auth/logout/");
}
