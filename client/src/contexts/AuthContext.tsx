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
    RegisterPayload,
    LoginPayload,
    User,
  } from "../services/users.service";
  import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
  
  interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
    appLoading: boolean;
  }
  
  const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
    appLoading: true,
  };
  
  interface AuthContextType extends AuthState {
    login: (data: LoginPayload) => Promise<void>;
    register: (data: RegisterPayload) => Promise<void>;
    logout: () => Promise<void>;
    resendVerification: () => Promise<void>;
  }
  
  const AuthContext = createContext<AuthContextType | undefined>(undefined);
  
  export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const queryClient = useQueryClient();
    const [state, setState] = useState<AuthState>(initialState);
  
    const { data, isLoading } = useQuery({
      queryKey: ["currentUser"],
      queryFn: getCurrentUser,
      retry: false,
    });
  
    useEffect(() => {
      if (isLoading) {
        setState((prev) => ({ ...prev, appLoading: true }));
      } else {
        setState((prev) => ({
          ...prev,
          user: data || null,
          isAuthenticated: !!data,
          appLoading: false,
        }));
      }
    }, [data, isLoading]);
  
    const loginMutation = useMutation({
      mutationFn: loginUser,
      onMutate: () => {
        setState((prev) => ({ ...prev, loading: true, error: null }));
      },
      onSuccess: async () => {
        const currentUser = await queryClient.ensureQueryData({
          queryKey: ["currentUser"],
          queryFn: getCurrentUser,
        });
        setState({
          user: currentUser,
          isAuthenticated: true,
          loading: false,
          error: null,
          appLoading: false,
        });
      },
      onError: (err: any) => {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: err?.response?.data?.message || "Login failed",
        }));
      },
    });
  
    const registerMutation = useMutation({
      mutationFn: registerUser,
      onMutate: () => {
        setState((prev) => ({ ...prev, loading: true, error: null }));
      },
      onSuccess: () => {
        setState((prev) => ({
          ...prev,
          user: null,
          isAuthenticated: false,
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
  
    const logoutMutation = useMutation({
      mutationFn: logoutUser,
      onMutate: () => {
        setState((prev) => ({ ...prev, loading: true, error: null }));
      },
      onSuccess: () => {
        setState({
          ...initialState,
          appLoading: false,
        });
        queryClient.removeQueries();
      },
      onError: (err: any) => {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: err?.response?.data?.message || "Logout failed",
        }));
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
            err?.response?.data?.message ||
            "Failed to resend verification email",
        }));
      },
    });
  
    const login = async (data: LoginPayload) => {
      await loginMutation.mutateAsync(data);
    };
  
    const register = async (data: RegisterPayload) => {
      await registerMutation.mutateAsync(data);
    };
  
    const logout = async () => {
      await logoutMutation.mutateAsync();
    };
  
    const resendVerification = async () => {
      await resendVerificationMutation.mutateAsync();
    };
  
    return (
      <AuthContext.Provider
        value={{
          ...state,
          login,
          register,
          logout,
          resendVerification,
        }}
      >
        {children}
      </AuthContext.Provider>
    );
  };
  
  // Hook to use auth
  export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
      throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
  };
  