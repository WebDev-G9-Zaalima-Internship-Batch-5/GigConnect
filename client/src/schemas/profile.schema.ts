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

export const freelancerProfileSchema = z.object({
  title: z.string().min(5, {
    message: "Title must be at least 5 characters.",
  }),
  bio: z.string().min(100, {
    message: "Bio must be at least 100 characters.",
  }),
  skills: z
    .array(z.string().min(1, "Skill cannot be empty"))
    .min(1, "Please add at least one skill"),
  hourlyRate: z.number().min(0.01, "Hourly rate must be greater than 0"),
  availability: z.enum(["available", "busy", "not_available"], {
    required_error: "Please select your availability",
  }),
  location: z
    .object({
      type: z.literal("Point"),
      coordinates: z.tuple([z.number(), z.number()]),
      address: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      country: z.string().optional(),
      pincode: z.string().optional(),
      displayName: z.string().optional(),
    })
    .superRefine((data, ctx) => {
      if (
        !data.displayName &&
        !data.address &&
        !data.city &&
        !data.state &&
        !data.country &&
        !data.pincode
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please select your location on the map",
          path: ["displayName"],
        });
      }
    }),
  workPreferences: z.object({
    remoteOnly: z.boolean(),
    willingToTravel: z.boolean(),
    maxTravelDistance: z.number().min(0, "Travel distance must be 0 or more"),
  }),
  languages: z
    .array(
      z.object({
        language: z.string().min(1, "Language is required"),
        proficiency: z.enum(["basic", "intermediate", "advanced", "native"], {
          required_error: "Please select a proficiency level",
        }),
      })
    )
    .min(1, "Please add at least one language"),
  experience: z
    .array(
      z.object({
        company: z.string().min(1, "Company name is required"),
        position: z.string().min(1, "Position is required"),
        startDate: z.string().min(1, "Start date is required"),
        endDate: z.string().optional(),
        description: z.string().min(1, "Description is required"),
        isCurrentJob: z.boolean(),
      })
    )
    .optional(),
  education: z
    .array(
      z.object({
        institution: z.string().min(1, "Institution name is required"),
        degree: z.string().min(1, "Degree is required"),
        fieldOfStudy: z.string().min(1, "Field of study is required"),
        startDate: z.string().min(1, "Start date is required"),
        endDate: z.string().optional(),
        isCurrentlyStudying: z.boolean(),
      })
    )
    .optional(),
});

export type CompleteClientProfileFormValues = z.infer<
  typeof clientProfileSchema
>;

export type CompleteFreelancerProfileFormValues = z.infer<
  typeof freelancerProfileSchema
>;
