import * as z from "zod";

const passwordSchema = z
  .string()
  .min(8, {
    message: "Password must be at least 8 characters long.",
  })
  .regex(/[a-z]/, {
    message: "Password must contain at least one lowercase letter.",
  })
  .regex(/[A-Z]/, {
    message: "Password must contain at least one uppercase letter.",
  })
  .regex(/[0-9]/, {
    message: "Password must contain at least one number.",
  })
  .regex(/[^a-zA-Z0-9]/, {
    message: "Password must contain at least one special character.",
  })
  .regex(/^[a-zA-Z0-9!@#$%^&*()_+-=\[\]{};:'",.<>?/\\|~`]+$/, {
    message: "Password contains an unsupported character.",
  });

const signUpFormSchema = z.object({
  firstName: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  lastName: z.string().optional(),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: passwordSchema,
  userType: z.enum(["freelancer", "client"] as const),
});

const loginFormSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: passwordSchema,
});

const forgotPasswordSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
});

export {
  passwordSchema,
  signUpFormSchema,
  loginFormSchema,
  forgotPasswordSchema,
};
