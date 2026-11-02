// stores/useAuthStore.ts
import { create } from "zustand";

interface AuthFormData {
  fullname: string;
  phonenumber: string;
}

interface AuthState {
  step: "form" | "otp";
  formData: AuthFormData | null;
  otp: string;
  endTime: number | null;
  loading: boolean;
  setStep: (step: "form" | "otp") => void;
  setFormData: (data: AuthFormData) => void;
  setOtp: (otp: string) => void;
  setEndTime: (time: number | null) => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  step: "form",
  formData: null,
  otp: "",
  endTime: null,
  loading: false,
  setStep: (step) => set({ step }),
  setFormData: (data) => set({ formData: data }),
  setOtp: (otp) => set({ otp }),
  setEndTime: (time) => set({ endTime: time }),
  setLoading: (loading) => set({ loading }),
  reset: () =>
    set({
      step: "form",
      formData: null,
      otp: "",
      endTime: null,
      loading: false,
    }),
}));
