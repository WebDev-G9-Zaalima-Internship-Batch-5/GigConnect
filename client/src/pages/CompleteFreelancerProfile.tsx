import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useCallback, useRef, useEffect } from "react";
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
  Briefcase,
  DollarSign,
  Globe,
  GraduationCap,
  Languages,
  Loader,
  MapPin,
  Plus,
  Trash2,
  User,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  CompleteFreelancerProfileFormValues,
  freelancerProfileSchema,
} from "@/schemas/profile.schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import LocationPicker from "@/components/LocationPicker";
import { LocationData } from "@/types/location";
import { completeFreelancerProfile } from "@/services/profile.service";
import { FieldErrors } from "react-hook-form";

const AVAILABILITY_OPTIONS = [
  { value: "available", label: "Available" },
  { value: "busy", label: "Busy" },
  { value: "not_available", label: "Not Available" },
] as const;

const PROFICIENCY_LEVELS = [
  { value: "basic", label: "Basic" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
  { value: "native", label: "Native" },
] as const;

const CompleteFreelancerProfile = () => {
  const { user, isProfileComplete } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (isProfileComplete) {
      navigate("/dashboard", { replace: true });
    }
  }, [isProfileComplete, navigate]);

  const form = useForm<CompleteFreelancerProfileFormValues>({
    resolver: zodResolver(freelancerProfileSchema),
    mode: "onChange",
    defaultValues: {
      title: "",
      bio: "",
      skills: [],
      hourlyRate: undefined,
      availability: "available",
      location: {
        type: "Point",
        coordinates: [0, 0],
        address: "",
        city: "",
        state: "",
        country: "",
        pincode: "",
        displayName: "",
      },
      workPreferences: {
        remoteOnly: false,
        willingToTravel: true,
        maxTravelDistance: 10,
      },
      languages: [
        {
          language: "English",
          proficiency: "intermediate",
        },
      ],
      experience: [],
      education: [],
    },
  });

  const {
    fields: experienceFields,
    append: appendExperience,
    remove: removeExperience,
  } = useFieldArray({
    control: form.control,
    name: "experience",
  });

  const {
    fields: educationFields,
    append: appendEducation,
    remove: removeEducation,
  } = useFieldArray({
    control: form.control,
    name: "education",
  });

  const {
    fields: languageFields,
    append: appendLanguage,
    remove: removeLanguage,
  } = useFieldArray({
    control: form.control,
    name: "languages",
  });

  const [skillsInput, setSkillsInput] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "," || e.key === "Enter") {
      e.preventDefault();
      const newSkill = skillsInput.trim();
      if (newSkill && !form.getValues("skills").includes(newSkill)) {
        form.setValue("skills", [...form.getValues("skills"), newSkill], {
          shouldValidate: true,
        });
      }
      setSkillsInput("");
    }
  };

  const handleLocationSelect = useCallback(
    (selectedLocation: LocationData) => {
      form.setValue(
        "location",
        {
          type: "Point",
          coordinates: selectedLocation.coordinates,
          address: selectedLocation.address,
          city: selectedLocation.city,
          state: selectedLocation.state,
          country: selectedLocation.country,
          pincode: selectedLocation.pincode,
          displayName: selectedLocation.displayName,
        },
        { shouldValidate: true }
      );
    },
    [form]
  );

  const completeFreelancerProfileMutation = useMutation({
    mutationFn: completeFreelancerProfile,
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      toast.success("Profile completed successfully!");
    },
    onError: (err: any) => {
      const message =
        err?.response?.data?.message ?? err?.message ?? "An error occurred";
      toast.error(message);
    },
  });

  const onSubmit = async (data: CompleteFreelancerProfileFormValues) => {
    if (!data.location.displayName) {
      form.setError("location", {
        type: "manual",
        message: "Please select your location on the map",
      });
      toast.error("Please select your location");
      return;
    }

    try {
      await completeFreelancerProfileMutation.mutateAsync(data);
    } catch (error) {
      console.error("Error submitting profile:", error);
    }
  };

  const onFormError = (
    errors: FieldErrors<CompleteFreelancerProfileFormValues>
  ) => {
    const firstError = Object.keys(
      errors
    )[0] as keyof CompleteFreelancerProfileFormValues;

    if (firstError) {
      if (firstError === "location") {
        const locationElement = document.getElementById("location-card");
        locationElement?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
        return;
      }

      const field = document.querySelector(`[name="${firstError}"]`);
      if (field) {
        field.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="space-y-2 mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight">
            Complete Your Freelancer Profile
          </h1>
          <p className="text-muted-foreground">
            Fill in your details to help clients find and hire you
          </p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, onFormError)}
            className="space-y-8"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  <span>Basic Information</span>
                </CardTitle>
                <CardDescription>
                  Tell us about yourself and your professional background
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Professional Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. Senior Web Developer"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Your professional title or tagline
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bio</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell us about yourself, your experience, and your skills..."
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Minimum 100 characters. Describe your professional
                        background and expertise.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="skills"
                    render={({ field }) => {
                      return (
                        <FormItem>
                          <FormLabel>Skills</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="e.g. React, Node.js, UI/UX Design"
                                value={skillsInput}
                                onChange={(e) => setSkillsInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                              />
                              {field.value?.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {field.value.map((skill, index) => (
                                    <Badge
                                      key={index}
                                      variant="secondary"
                                      className="flex items-center gap-1"
                                    >
                                      {skill}
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const newSkills = field.value.filter(
                                            (_, i) => i !== index
                                          );
                                          field.onChange(newSkills);
                                        }}
                                        className="ml-1 hover:text-destructive"
                                        aria-label={`Remove ${skill}`}
                                      >
                                        <X className="h-3 w-3" />
                                      </button>
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>
                          </FormControl>
                          <FormDescription>
                            Enter your skills and press Enter or Comma to add
                            them.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="hourlyRate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hourly Rate (USD)</FormLabel>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              placeholder="0.00"
                              className="pl-9"
                              {...field}
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value === ""
                                    ? null
                                    : Number(e.target.value)
                                )
                              }
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="availability"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Availability</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your availability" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {AVAILABILITY_OPTIONS.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Location Card */}
            <Card id="location-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  <span>Location</span>
                </CardTitle>
                <CardDescription>
                  Let clients know where you're located
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="h-64 w-full rounded-md border overflow-hidden">
                    <LocationPicker onChange={handleLocationSelect} />
                  </div>
                  <FormField
                    control={form.control}
                    name="location"
                    render={() => (
                      <FormItem>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {form.watch("location.displayName") && (
                    <p className="text-sm text-muted-foreground">
                      {form.watch("location.displayName")}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Work Preferences Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  <span>Work Preferences</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="workPreferences.remoteOnly"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Open to Remote Work Only
                        </FormLabel>
                        <FormDescription>
                          Only show me remote job opportunities
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={(checked) => {
                            field.onChange(checked);
                            if (checked) {
                              form.setValue(
                                "workPreferences.willingToTravel",
                                false
                              );
                            }
                          }}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="workPreferences.willingToTravel"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Willing to Travel
                        </FormLabel>
                        <FormDescription>
                          I'm open to on-site work that requires travel
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={(checked) => {
                            field.onChange(checked);
                            if (checked) {
                              form.setValue(
                                "workPreferences.remoteOnly",
                                false
                              );
                            }
                            if (!checked) {
                              form.setValue(
                                "workPreferences.maxTravelDistance",
                                10
                              );
                            }
                          }}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {form.watch("workPreferences.willingToTravel") && (
                  <FormField
                    control={form.control}
                    name="workPreferences.maxTravelDistance"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Maximum Travel Distance (km)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            placeholder="10"
                            {...field}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value === ""
                                  ? null
                                  : Number(e.target.value)
                              )
                            }
                          />
                        </FormControl>
                        <FormDescription>
                          Maximum distance you're willing to travel for work
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </CardContent>
            </Card>

            {/* Languages Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Languages className="h-5 w-5" />
                  <span>Languages</span>
                </CardTitle>
                <CardDescription>
                  List the languages you're proficient in
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {languageFields.map((field, index) => (
                  <div
                    key={field.id}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end"
                  >
                    <FormField
                      control={form.control}
                      name={`languages.${index}.language`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={index > 0 ? "sr-only" : ""}>
                            Language
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., English, Spanish, French"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex gap-2">
                      <FormField
                        control={form.control}
                        name={`languages.${index}.proficiency`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel className={index > 0 ? "sr-only" : ""}>
                              Proficiency
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select proficiency" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {PROFICIENCY_LEVELS.map((level) => (
                                  <SelectItem
                                    key={level.value}
                                    value={level.value}
                                  >
                                    {level.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {index > 0 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="h-10 w-10"
                          onClick={() => {
                            if (languageFields.length > 1) {
                              removeLanguage(index);
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Remove language</span>
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() =>
                    appendLanguage({
                      language: "",
                      proficiency: "intermediate",
                    })
                  }
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Language
                </Button>
              </CardContent>
            </Card>

            {/* Experience Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  <span>Work Experience</span>
                </CardTitle>
                <CardDescription>
                  Add your professional work experience
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {experienceFields.map((field, index) => (
                  <div
                    key={field.id}
                    className="space-y-4 border rounded-lg p-4 relative"
                  >
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium">Experience {index + 1}</h4>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => removeExperience(index)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                        <span className="sr-only">Remove experience</span>
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name={`experience.${index}.company`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Company</FormLabel>
                            <FormControl>
                              <Input placeholder="Company name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`experience.${index}.position`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Position</FormLabel>
                            <FormControl>
                              <Input placeholder="Your position" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name={`experience.${index}.startDate`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Start Date</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {!form.watch(`experience.${index}.isCurrentJob`) ? (
                        <FormField
                          control={form.control}
                          name={`experience.${index}.endDate`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>End Date</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      ) : null}
                    </div>
                    <FormField
                      control={form.control}
                      name={`experience.${index}.isCurrentJob`}
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md p-2">
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>I currently work here</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`experience.${index}.description`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe your role and responsibilities"
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() =>
                    appendExperience({
                      company: "",
                      position: "",
                      startDate: "",
                      description: "",
                      isCurrentJob: false,
                    })
                  }
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Experience
                </Button>
              </CardContent>
            </Card>

            {/* Education Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  <span>Education</span>
                </CardTitle>
                <CardDescription>
                  Add your educational background
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {educationFields.map((field, index) => (
                  <div
                    key={field.id}
                    className="space-y-4 border rounded-lg p-4 relative"
                  >
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium">Education {index + 1}</h4>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => removeEducation(index)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                        <span className="sr-only">Remove education</span>
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name={`education.${index}.institution`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Institution</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="School/University name"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`education.${index}.degree`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Degree</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g., Bachelor's in Computer Science"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name={`education.${index}.fieldOfStudy`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Field of Study</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., Computer Science"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name={`education.${index}.startDate`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Start Date</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {!form.watch(`education.${index}.isCurrentlyStudying`) ? (
                        <FormField
                          control={form.control}
                          name={`education.${index}.endDate`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>End Date</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      ) : null}
                    </div>
                    <FormField
                      control={form.control}
                      name={`education.${index}.isCurrentlyStudying`}
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md p-2">
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>I currently study here</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() =>
                    appendEducation({
                      institution: "",
                      degree: "",
                      fieldOfStudy: "",
                      startDate: "",
                      isCurrentlyStudying: false,
                    })
                  }
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Education
                </Button>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-4">
              <Button
                type="submit"
                disabled={completeFreelancerProfileMutation.isPending}
              >
                {completeFreelancerProfileMutation.isPending ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Complete Profile"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CompleteFreelancerProfile;
