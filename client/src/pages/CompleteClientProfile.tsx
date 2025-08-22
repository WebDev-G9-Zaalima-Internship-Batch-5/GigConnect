import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import React, {
  Suspense,
  useState,
  useCallback,
  useRef,
  useEffect,
} from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  DollarSign,
  Globe,
  Mail,
  MapPin,
  Loader2,
} from "lucide-react";
import { clientProfileSchema } from "@/schemas/profile.schema";
import { LocationData } from "@/types/location";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { completeClientProfile } from "@/services/profile.service";
import { toast } from "sonner";

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

const currencies = ["INR", "USD", "EUR", "GBP", "CAD", "AUD"];

const formSchema = clientProfileSchema;

export type CompleteClientProfileFormValues = z.infer<typeof formSchema>;

// Lazy load the LocationPicker with better error handling
const LocationPicker = React.lazy(() =>
  import("../components/LocationPicker").catch(() => ({
    default: () => (
      <div className="flex items-center justify-center h-64 border rounded-md bg-muted">
        <p className="text-muted-foreground">Map component unavailable</p>
      </div>
    ),
  }))
);

const LocationErrorBoundary = React.lazy(async () => {
  try {
    const module = await import("../components/LocationErrorBoundary");
    return { default: module.default };
  } catch {
    return {
      default: class ErrorFallback extends React.Component<{
        children: React.ReactNode;
      }> {
        static getDerivedStateFromError() {
          return { hasError: true };
        }

        state = { hasError: false };

        componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
          console.error("Error in fallback boundary:", error, errorInfo);
        }

        render() {
          return this.props.children;
        }
      },
    };
  }
});

const CompleteClientProfile = () => {
  const { user, isProfileComplete } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (isProfileComplete) {
      navigate("/profile");
    }
  }, [isProfileComplete, navigate]);

  const queryClient = useQueryClient();
  const [location, setLocation] = useState<LocationData | null>(null);
  const [mapError, setMapError] = useState(false);
  const locationPickerRef = useRef<HTMLDivElement>(null);

  const completeClientProfileMutation = useMutation({
    mutationFn: completeClientProfile,
    onSuccess: async (data) => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
    onError: (err: any) => {
      const message =
        err?.response?.data?.message ??
        err?.message ??
        "Failed to save profile.";
      toast.error(message);
    },
  });

  const form = useForm<CompleteClientProfileFormValues>({
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
        currency: "INR",
      },
      communicationPreferences: {
        emailNotifications: true,
        smsNotifications: false,
        projectUpdates: true,
        promotionalEmails: true,
      },
    },
  });

  const handleLocationChange = useCallback((loc: LocationData) => {
    setLocation(loc);
  }, []);

  const onSubmit = async (data: CompleteClientProfileFormValues) => {
    try {
      if (!location) {
        form.setError("root", { message: "Location is required" });
        if (locationPickerRef.current) {
          locationPickerRef.current.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
        return;
      }

      const profileData: CompleteClientProfileFormValues & {
        location: LocationData;
      } = {
        ...data,
        location: {
          type: "Point",
          coordinates: location.coordinates,
          address: location.address,
          city: location.city,
          state: location.state,
          country: location.country,
          pincode: location.pincode,
        },
      };

      try {
        await completeClientProfileMutation.mutateAsync(profileData);
      } catch (err: any) {
        console.error("Error saving profile:", err);
      }
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  // Loading component for Suspense
  const MapLoadingFallback = () => (
    <div className="flex items-center justify-center h-64 border rounded-md bg-muted">
      <Loader2 className="h-6 w-6 animate-spin" />
      <span className="ml-2">Loading map...</span>
    </div>
  );

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

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
                        <FormLabel className="flex items-center gap-2">
                          <Globe className="h-4 w-4" />
                          Company Website (Optional)
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="https://example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Location Picker with Error Boundary */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Business Location
                    </Label>
                    <div
                      className="h-64 w-full rounded-md border overflow-hidden"
                      ref={locationPickerRef}
                    >
                      {!mapError ? (
                        <Suspense fallback={<MapLoadingFallback />}>
                          <LocationErrorBoundary>
                            <LocationPicker onChange={handleLocationChange} />
                          </LocationErrorBoundary>
                        </Suspense>
                      ) : (
                        <div className="flex items-center justify-center h-full bg-muted">
                          <div className="text-center">
                            <p className="text-muted-foreground mb-2">
                              Map temporarily unavailable
                            </p>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => setMapError(false)}
                            >
                              Try Again
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                    {form.formState.errors.root && (
                      <p className="text-sm text-red-500">
                        {form.formState.errors.root.message}
                      </p>
                    )}
                    {location?.coordinates && (
                      <p className="text-sm text-muted-foreground">
                        Selected: {location.coordinates.join(", ")}
                      </p>
                    )}
                  </div>

                  <FormField
                    control={form.control}
                    name="businessType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
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
                          value={field.value}
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
                                value={field.value ?? ""}
                                className="pl-7"
                                onChange={(e) =>
                                  field.onChange(Number(e.target.value))
                                }
                                onBlur={field.onBlur}
                                name={field.name}
                                ref={field.ref}
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
                                value={field.value ?? ""}
                                onChange={(e) =>
                                  field.onChange(Number(e.target.value))
                                }
                                onBlur={field.onBlur}
                                name={field.name}
                                ref={field.ref}
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
                            value={field.value}
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
                  <Button
                    type="submit"
                    disabled={completeClientProfileMutation.isPending}
                  >
                    {completeClientProfileMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Complete Profile"
                    )}
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
