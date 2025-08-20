import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Mail } from "lucide-react";
import Navigation from "@/components/Navigation";
import { forgotPasswordSchema } from "@/schemas/auth.schema";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { forgotPassword } from "@/services/users.service";

type FormValues = z.infer<typeof forgotPasswordSchema>;

const ForgotPassword = () => {
  const [emailSent, setEmailSent] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (email: string) => forgotPassword(email),
    onSuccess: () => {
      setEmailSent(true);
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || "An error occurred";
      toast.error(errorMessage);
    },
  });

  const onSubmit = (values: FormValues) => {
    mutate(values.email);
  };

  if (emailSent) {
    return (
      <div className="min-h-screen bg-gradient-card">
        <Navigation />
        <div className="flex items-center justify-center min-h-screen pt-16 px-4">
          <Card className="w-full max-w-md shadow-elegant">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">
                Check Your Email
              </CardTitle>
              <CardDescription className="mt-2">
                We've sent a password reset link to your email address.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-6">
                If you don't see the email, please check your spam folder or try
                again.
              </p>
              <Button
                onClick={() => {
                  setEmailSent(false);
                  form.reset();
                }}
                className="w-full"
              >
                Resend Email
              </Button>
              <div className="mt-4 text-center text-sm">
                <span className="text-muted-foreground">
                  Remember your password?{" "}
                </span>
                <Link to="/login" className="text-primary hover:underline">
                  Sign in
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-card">
      <Navigation />
      <div className="flex items-center justify-center min-h-screen pt-16 px-4">
        <Card className="w-full max-w-md shadow-elegant">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">
              Forgot Password
            </CardTitle>
            <CardDescription>
              Enter your email to receive a password reset link
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <FormControl>
                          <Input
                            placeholder="Enter your email"
                            className="pl-10"
                            disabled={isPending}
                            {...field}
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending ? "Sending..." : "Send Reset Link"}
                </Button>

                <div className="text-center text-sm">
                  <span className="text-muted-foreground">
                    Remember your password?{" "}
                  </span>
                  <Link to="/login" className="text-primary hover:underline">
                    Sign in
                  </Link>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;
