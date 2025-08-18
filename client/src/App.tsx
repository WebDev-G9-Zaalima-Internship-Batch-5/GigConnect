import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public route (accessible by anyone) */}
            <Route path="/" element={<Home />} />

            {/* Auth restricted routes (unauthenticated only) */}
            <Route
              path="/login"
              element={
                <AuthLayout authentication={false}>
                  <Login />
                </AuthLayout>
              }
            />
            <Route
              path="/signup"
              element={
                <AuthLayout authentication={false}>
                  <Signup />
                </AuthLayout>
              }
            />

            {/* Protected routes (authenticated only) */}
            <Route
              path="/find-work"
              element={
                <AuthLayout>
                  <FindWork />
                </AuthLayout>
              }
            />
            <Route
              path="/find-talent"
              element={
                <AuthLayout>
                  <FindTalent />
                </AuthLayout>
              }
            />
            <Route
              path="/client-dashboard"
              element={
                <AuthLayout>
                  <ClientDashboard />
                </AuthLayout>
              }
            />
            <Route
              path="/freelancer-dashboard"
              element={
                <AuthLayout>
                  <FreelancerDashboard />
                </AuthLayout>
              }
            />
            <Route
              path="/client-profile"
              element={
                <AuthLayout>
                  <ClientProfile />
                </AuthLayout>
              }
            />
            <Route
              path="/freelancer-profile"
              element={
                <AuthLayout>
                  <FreelancerProfile />
                </AuthLayout>
              }
            />

            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
