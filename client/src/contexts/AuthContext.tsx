import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
  resendVerificationEmail,
  resetPassword as resetPasswordService,
} from "../services/users.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  User,
  LoginPayload,
  RegisterPayload,
  ResetPasswordPayload,
} from "@/types/user.types";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isVerified: boolean;
  isProfileComplete: boolean;
  loading: boolean;
  error: string | null;
  appLoading: boolean;
}

interface AuthContextType extends AuthState {
  login: (data: LoginPayload) => Promise<void>;
  register: (data: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  resendVerification: () => Promise<void>;
  resetPassword: (data: ResetPasswordPayload) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isVerified: false,
  isProfileComplete: false,
  loading: false,
  error: null,
  appLoading: true,
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient();
  const [state, setState] = useState<AuthState>(initialState);

  const { data, isPending } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
    staleTime: 1000 * 60 * 60 * 24,
    gcTime: 1000 * 60 * 60 * 24,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  useEffect(() => {
    setState((prev) => ({
      ...prev,
      user: data?.user || null,
      isAuthenticated: !!data?.user,
      isVerified: data?.user?.isVerified || false,
      isProfileComplete: data?.user?.isProfileComplete || false,
      loading: isPending,
      appLoading: isPending,
      error: data ? null : prev.error,
    }));
  }, [data, isPending]);

  const registerMutation = useMutation({
    mutationFn: registerUser,
    onMutate: () => {
      setState((prev) => ({ ...prev, loading: true, error: null }));
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["currentUser"], data);

      setState((prev) => ({
        ...prev,
        user: data.user,
        isAuthenticated: !!data.user,
        isVerified: data.user.isVerified,
        isProfileComplete: data.user.isProfileComplete,
        loading: false,
        error: null,
      }));
    },
    onError: (err: any) => {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: err?.response?.data?.message || "Registration failed",
      }));
    },
  });

  const loginMutation = useMutation({
    mutationFn: loginUser,
    onMutate: () => {
      setState((prev) => ({ ...prev, loading: true, error: null }));
    },
    onSuccess: async (data) => {
      queryClient.setQueryData(["currentUser"], data);

      setState((prev) => ({
        ...prev,
        user: data.user,
        isAuthenticated: true,
        isVerified: data.user?.isVerified || false,
        isProfileComplete: data.user?.isProfileComplete || false,
        loading: false,
        error: null,
        appLoading: false,
      }));
    },
    onError: (err: any) => {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: err?.response?.data?.message || "Login failed",
      }));
    },
  });

  const logoutMutation = useMutation({
    mutationFn: logoutUser,
    onMutate: () => {
      setState((prev) => ({ ...prev, loading: true, error: null }));
    },
    onSuccess: () => {
      queryClient.clear();
      setState({
        ...initialState,
        appLoading: false,
      });
    },
    onError: (err: any) => {
      queryClient.clear();
      setState({
        ...initialState,
        appLoading: false,
        loading: false,
        error: err?.response?.data?.message || "Logout failed",
      });
    },
  });

  const resendVerificationMutation = useMutation({
    mutationFn: resendVerificationEmail,
    onMutate: () => {
      setState((prev) => ({ ...prev, loading: true, error: null }));
    },
    onSuccess: () => {
      setState((prev) => ({ ...prev, loading: false }));
    },
    onError: (err: any) => {
      setState((prev) => ({
        ...prev,
        loading: false,
        error:
          err?.response?.data?.message || "Failed to resend verification email",
      }));
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: (data: ResetPasswordPayload) => {
      const { confirmPassword, ...resetData } = data;
      return resetPasswordService(resetData);
    },
    onMutate: () => {
      setState((prev) => ({ ...prev, loading: true, error: null }));
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["currentUser"], data);

      setState((prev) => ({
        ...prev,
        user: data.user,
        isAuthenticated: true,
        isVerified: data.user?.isVerified || false,
        isProfileComplete: data.user?.isProfileComplete || false,
        loading: false,
        error: null,
      }));
    },
    onError: (err: any) => {
      queryClient.clear();
      setState({
        ...initialState,
        appLoading: false,
        error: err?.response?.data?.message || "Password reset failed",
      });
    },
  });

  // Ensure we always provide a valid context value
  const value: AuthContextType = {
    ...state,
    login: async (data: LoginPayload) => {
      try {
        await loginMutation.mutateAsync(data);
      } catch (error) {
        throw error;
      }
    },
    register: async (data: RegisterPayload) => {
      try {
        await registerMutation.mutateAsync(data);
      } catch (error) {
        throw error;
      }
    },
    logout: async () => {
      try {
        await logoutMutation.mutateAsync();
      } catch (error) {
        throw error;
      }
    },
    resendVerification: async () => {
      try {
        await resendVerificationMutation.mutateAsync();
      } catch (error) {
        throw error;
      }
    },
    resetPassword: async (data: ResetPasswordPayload) => {
      try {
        await resetPasswordMutation.mutateAsync(data);
      } catch (error) {
        throw error;
      }
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook to use auth
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
