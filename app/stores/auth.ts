import type {
    User,
    LoginPayload,
    RegisterPayload,
} from "../../shared/types/user";

export const useAuthStore = defineStore("auth", () => {
    const user = ref<User | null>(null);

    const isAuthenticated = computed(() => user.value !== null);

    async function login(email: string, password: string) {
        const payload: LoginPayload = { email, password };
        const data = await $fetch<User>("/api/auth/login", {
            method: "POST",
            body: payload,
        });
        user.value = data;
        return data;
    }

    async function register(payload: RegisterPayload) {
        const data = await $fetch<User>("/api/auth/register", {
            method: "POST",
            body: payload,
        });
        user.value = data;
        return data;
    }

    async function logout() {
        await $fetch("/api/auth/logout", { method: "POST" });
        user.value = null;
    }

    async function fetchMe() {
        try {
            const data = await $fetch<User>("/api/auth/me");
            user.value = data;
        } catch {
            user.value = null;
        }
    }

    return {
        user,
        isAuthenticated,
        login,
        register,
        logout,
        fetchMe,
    };
});
