import axios from "axios";
import { useAuthStore } from "~/stores/auth";

export const useApi = () => {
    const authStore = useAuthStore();
    return axios.create({
        baseURL: "", // or just omit baseURL, so that calls are relative to the current domain
        headers: {
            Authorization: `Token ${authStore.token}`,
        },
    });
};
