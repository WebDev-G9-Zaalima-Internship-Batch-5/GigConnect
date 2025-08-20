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
import ClientDashboard from "./pages/ClientDashboard";
import FreelancerDashboard from "./pages/FreelancerDashboard";
import Profile from "./pages/Profile";
import FindWork from "./pages/FindWork";
import FindTalent from "./pages/FindTalent";
import NotFound from "./pages/NotFound";
import CompleteProfile from "./pages/CompleteProfile";
import { AuthProvider } from "./contexts/AuthContext";
import AuthLayout from "./components/AuthLayout";
import Dashboard from "./pages/Dashboard";

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
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner position="top-center" />
          <RouterProvider router={router} />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
