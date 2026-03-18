interface ToastState {
    show: boolean;
    message: string;
    color: string;
    timeout: number;
    position: "top-center" | "top-right" | "bottom-center" | "bottom-right";
}

const toastState = reactive<ToastState>({
    show: false,
    message: "",
    color: "success",
    timeout: 3000,
    position: "top-center",
});

export function useToast() {
    function toast(
        message: string,
        color = "success",
        timeout = 3000,
        position: ToastState["position"] = "top-center",
    ) {
        toastState.show = false;
        nextTick(() => {
            toastState.message = message;
            toastState.color = color;
            toastState.timeout = timeout;
            toastState.position = position;
            toastState.show = true;
        });
    }

    function success(message: string) {
        toast(message, "success");
    }

    function error(message: string) {
        toast(message, "error");
    }

    function info(message: string) {
        toast(message, "info");
    }

    return {
        state: toastState,
        toast,
        success,
        error,
        info,
    };
}
