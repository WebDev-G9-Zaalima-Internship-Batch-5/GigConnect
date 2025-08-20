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
import ClientProfile from "./pages/ClientProfile";
import FreelancerProfile from "./pages/FreelancerProfile";
import FindWork from "./pages/FindWork";
import FindTalent from "./pages/FindTalent";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./contexts/AuthContext";
import AuthLayout from "./components/AuthLayout";

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
      path: "/client-profile",
      element: <ClientProfile />,
    },
    {
      path: "/freelancer-profile",
      element: <FreelancerProfile />,
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
      path: "/client-dashboard",
      element: (
        <AuthLayout authentication={true}>
          <ClientDashboard />
        </AuthLayout>
      ),
    },
    {
      path: "/freelancer-dashboard",
      element: (
        <AuthLayout authentication={true}>
          <FreelancerDashboard />
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
