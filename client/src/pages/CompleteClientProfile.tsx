import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Building2, DollarSign, Globe, Info, Mail, Phone } from "lucide-react";

const businessTypes = [
  { value: "individual", label: "Individual" },
  { value: "startup", label: "Startup" },
  { value: "small_business", label: "Small Business" },
  { value: "enterprise", label: "Enterprise" },
];

const industryTypes = [
  "Technology",
  "Finance",
  "Healthcare",
  "Education",
  "Retail",
  "Manufacturing",
  "Real Estate",
  "Entertainment",
  "Other",
];

const currencies = ["USD", "EUR", "GBP", "INR", "CAD", "AUD"];

const formSchema = z.object({
  companyName: z.string().min(2, {
    message: "Company name must be at least 2 characters.",
  }),
  companyWebsite: z.string().url({
    message: "Please enter a valid URL.",
  }).optional(),
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

type FormValues = z.infer<typeof formSchema>;

const CompleteClientProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: "",
      companyWebsite: "",
      businessType: "individual",
      industryType: "",
      description: "",
      preferredBudgetRange: {
        min: 100,
        max: 1000,
        currency: "USD",
      },
      communicationPreferences: {
        emailNotifications: true,
        smsNotifications: false,
        projectUpdates: true,
        promotionalEmails: true,
      },
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      setIsSubmitting(true);
      // TODO: Call API to save client profile
      console.log("Submitting client profile:", data);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      navigate("/dashboard");
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Complete Your Client Profile</CardTitle>
            <CardDescription>
              Please provide your business information to get started with
              GigConnect.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                {/* Company Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">
                    <Building2 className="inline-block mr-2 h-5 w-5" />
                    Company Information
                  </h3>

                  <FormField
                    control={form.control}
                    name="companyName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your company name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="companyWebsite"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Website</FormLabel>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <Globe className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <Input
                            placeholder="https://example.com"
                            className="pl-10"
                            {...field}
                          />
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="businessType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Business Type</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select business type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {businessTypes.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                  {type.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="industryType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Industry</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select industry" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {industryTypes.map((type) => (
                                <SelectItem key={type} value={type}>
                                  {type}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>About Your Business</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Tell us about your business, projects, and what you're looking for..."
                            className="min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Minimum 50 characters. Describe your business and what
                          kind of freelancers you're looking for.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Budget Preferences */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">
                    <DollarSign className="inline-block mr-2 h-5 w-5" />
                    Budget Preferences
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="preferredBudgetRange.min"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Minimum Budget</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <span className="absolute left-3 top-2 text-muted-foreground">
                                $
                              </span>
                              <Input
                                type="number"
                                min="0"
                                className="pl-7"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(Number(e.target.value))
                                }
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="preferredBudgetRange.max"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Maximum Budget</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <span className="absolute left-3 top-2 text-muted-foreground">
                                $
                              </span>
                              <Input
                                type="number"
                                min="0"
                                className="pl-7"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(Number(e.target.value))
                                }
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="preferredBudgetRange.currency"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Currency</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select currency" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {currencies.map((currency) => (
                                <SelectItem key={currency} value={currency}>
                                  {currency}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Communication Preferences */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">
                    <Mail className="inline-block mr-2 h-5 w-5" />
                    Communication Preferences
                  </h3>

                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="communicationPreferences.emailNotifications"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Email Notifications
                            </FormLabel>
                            <FormDescription>
                              Receive important account notifications via email
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="communicationPreferences.smsNotifications"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              SMS Notifications
                            </FormLabel>
                            <FormDescription>
                              Receive important notifications via SMS
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="communicationPreferences.projectUpdates"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Project Updates
                            </FormLabel>
                            <FormDescription>
                              Get updates about your active projects
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="communicationPreferences.promotionalEmails"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Promotional Emails
                            </FormLabel>
                            <FormDescription>
                              Receive newsletters and promotional offers
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-4">
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : "Complete Profile"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CompleteClientProfile;
