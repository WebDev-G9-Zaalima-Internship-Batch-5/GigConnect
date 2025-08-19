import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
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
    // Public route
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

    //  Unauthenticated Only routes
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

    // Catch-all route
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
          <Sonner />
          <RouterProvider router={router} />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
