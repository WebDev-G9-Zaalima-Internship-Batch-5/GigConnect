import * as z from "zod";

export const clientProfileSchema = z.object({
  companyName: z.string().min(2, {
    message: "Company name must be at least 2 characters.",
  }),
  companyWebsite: z
    .string()
    .url({
      message: "Please enter a valid URL.",
    })
    .optional()
    .or(z.literal("")),
  businessType: z.enum([
    "individual",
    "startup",
    "small_business",
    "enterprise",
  ]),
  industryType: z.string().min(1, {
    message: "Please select an industry type.",
  }),
  description: z.string().min(50, {
    message: "Description must be at least 50 characters.",
  }),
  preferredBudgetRange: z.object({
    min: z.number().min(0, "Minimum budget must be 0 or more"),
    max: z.number().min(0, "Maximum budget must be 0 or more"),
    currency: z.string(),
  }),
  communicationPreferences: z.object({
    emailNotifications: z.boolean(),
    smsNotifications: z.boolean(),
    projectUpdates: z.boolean(),
    promotionalEmails: z.boolean(),
  }),
});