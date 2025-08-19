import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Mail } from "lucide-react";
import Navigation from "@/components/Navigation";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";

const VerifyEmail = () => {
  const { resendVerification } = useAuth();
  const [emailSent, setEmailSent] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: resendVerification,
    onSuccess: () => {
      setEmailSent(true);
      toast.success("Verification email sent successfully!");
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || "Failed to send verification email";
      toast.error(errorMessage);
    },
  });

  const handleResendEmail = () => {
    mutate();
  };

  return (
    <div className="min-h-screen bg-gradient-card">
      <Navigation />
      <div className="flex items-center justify-center min-h-screen pt-16 px-4">
        <Card className="w-full max-w-md shadow-elegant">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <Mail className="h-8 w-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">
              {emailSent ? "Check Your Email" : "Verify Your Email"}
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              {emailSent
                ? "We've sent a verification link to your email address. Please check your inbox and click the link to verify your account."
                : "Please verify your email address to get full access to all features."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button
                onClick={handleResendEmail}
                disabled={isPending}
                className="w-full"
              >
                {isPending ? "Sending..." : "Resend Verification Email"}
              </Button>
              <p className="text-sm text-center text-muted-foreground">
                Didn't receive the email? Check your spam folder or request a new verification link.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VerifyEmail;
