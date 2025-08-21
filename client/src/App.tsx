import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Profile from "./pages/Profile";
import FindWork from "./pages/FindWork";
import FindTalent from "./pages/FindTalent";
import NotFound from "./pages/NotFound";
import CompleteProfile from "./pages/CompleteProfile";
import { AuthProvider } from "./contexts/AuthContext";
import AuthLayout from "./components/AuthLayout";
import Dashboard from "./pages/Dashboard";
import React from "react";

// Error Boundary Component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center p-8">
            <h1 className="text-2xl font-bold text-destructive mb-4">
              Something went wrong
            </h1>
            <p className="text-muted-foreground mb-4">
              {this.state.error?.message || "An unexpected error occurred"}
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: undefined });
                window.location.reload();
              }}
              className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Error element for router
const RouterErrorElement = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="text-center p-8">
      <h1 className="text-2xl font-bold text-destructive mb-4">Page Error</h1>
      <p className="text-muted-foreground mb-4">
        There was an error loading this page.
      </p>
      <button
        onClick={() => (window.location.href = "/")}
        className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
      >
        Go Home
      </button>
    </div>
  </div>
);

const queryClient = new QueryClient();

const App = () => {
  const router = createBrowserRouter([
    // Public routes
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/find-work",
      element: <FindWork />,
    },
    {
      path: "/find-talent",
      element: <FindTalent />,
    },
    {
      path: "/profile/:id?",
      element: <Profile />,
    },

    // Unauthenticated Only routes
    {
      path: "/login",
      element: (
        <AuthLayout authentication={false}>
          <Login />
        </AuthLayout>
      ),
    },
    {
      path: "/signup",
      element: (
        <AuthLayout authentication={false}>
          <Signup />
        </AuthLayout>
      ),
    },
    {
      path: "/forgot-password",
      element: (
        <AuthLayout authentication={false}>
          <ForgotPassword />
        </AuthLayout>
      ),
    },
    {
      path: "/reset-password",
      element: (
        <AuthLayout authentication={false}>
          <ResetPassword />
        </AuthLayout>
      ),
    },

    // Authenticated Only routes
    {
      path: "/dashboard",
      element: (
        <AuthLayout authentication={true}>
          <Dashboard />
        </AuthLayout>
      ),
    },
    {
      path: "/complete-profile",
      element: (
        <AuthLayout authentication={true}>
          <CompleteProfile />
        </AuthLayout>
      ),
    },

    // 404 route
    {
      path: "*",
      element: <NotFound />,
    },
  ]);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner position="top-center" />
            <RouterProvider router={router} />
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
