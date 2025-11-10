import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import LocationPicker from "@/components/LocationPicker";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { createGigWithAttachments } from "@/services/gigs.service";

const jobFormSchema = z
  .object({
    // --- Core Gig Details ---
    title: z.string().min(5, "Title must be at least 5 characters"),
    description: z
      .string()
      .min(20, "Description must be at least 20 characters"),
    category: z.string().min(1, "Category is required"),
    subCategory: z.string().optional(),

    // Assuming skills are input as a comma-separated string (we'll transform on submit)
    skillsRequired: z.string().min(1, "At least one skill is required"),

    experienceLevel: z.enum(["entry", "intermediate", "expert"]),

    // --- Budget ---
    budget: z.object({
      type: z.enum(["fixed", "hourly"]),
      amount: z.number().min(1, "Amount must be greater than 0"),
      currency: z.string().default("USD"),
    }),

    duration: z.string().min(1, "Duration is required"),
    expectedStartDate: z.string().min(1, "Expected start date is required"),

    // --- Location (GeoJSON Point) ---
    location: z
      .object({
        type: z.literal("Point"),
        coordinates: z.tuple([z.number(), z.number()]), // [lng, lat]
        address: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        country: z.string().optional(),
        pincode: z.string().optional(),
        displayName: z.string().optional(),
      })
      .optional(),

    // --- Flags ---
    isUrgent: z.boolean().default(false),
    isFeatured: z.boolean().default(false),
    isRemote: z.boolean().default(false),

    // --- Deliverables and Requirements (transform on submit) ---
    requirements: z.string().min(1, "At least one requirement is needed."),
    deliverables: z.string().min(1, "At least one deliverable is needed."),

    // Attachments are often file inputs, represented here as an optional array of strings (URLs/IDs)
    attachments: z.array(z.string()).optional(),

    deadline: z.string().optional(), // Use string for date input
  })
  .refine((data) => data.isRemote || !!data.location, {
    message: "Location is required when gig is not remote.",
    path: ["location"],
  });

type JobFormValues = z.infer<typeof jobFormSchema>;

export function PostJobModal() {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const form = useForm<JobFormValues>({
    resolver: zodResolver(jobFormSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      subCategory: "",
      skillsRequired: "",
      experienceLevel: "intermediate",
      budget: {
        type: "fixed",
        amount: 0,
        currency: "USD",
      },
      duration: "1 month",
      expectedStartDate: "",
      isRemote: false,
      isUrgent: false,
      isFeatured: false,
      requirements: "",
      deliverables: "",
      deadline: "",
      attachments: [],
    },
  });

  const onSubmit = async (data: JobFormValues) => {
    try {
      setIsSubmitting(true);

      // Format the data for the API
      const skills = data.skillsRequired
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const requirements = data.requirements
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);

      const deliverables = data.deliverables
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);

      // Build multipart FormData
      const fd = new FormData();
      fd.append("title", data.title);
      fd.append("description", data.description);
      fd.append("category", data.category);
      if (data.subCategory) fd.append("subCategory", data.subCategory);
      // send skills as a comma-separated string (server parses it)
      fd.append("skillsRequired", data.skillsRequired);
      fd.append("experienceLevel", data.experienceLevel);
      fd.append("budget", JSON.stringify(data.budget));
      fd.append("duration", data.duration);
      fd.append("expectedStartDate", data.expectedStartDate);
      if (!data.isRemote && data.location) {
        fd.append("location", JSON.stringify(data.location));
      }
      if (data.deadline) fd.append("deadline", data.deadline);
      fd.append("isUrgent", String(data.isUrgent));
      fd.append("isFeatured", String(data.isFeatured));
      // send textareas as newline-separated strings (server splits)
      fd.append("requirements", data.requirements);
      fd.append("deliverables", data.deliverables);
      // append files one by one
      files.forEach((file) => fd.append("attachments", file));

      const response = await createGigWithAttachments(fd);
      console.log("Gig created:", response);

      toast.success("gig posted successfully!");
      setOpen(false);
      form.reset();
      setFiles([]);
    } catch (error) {
      console.error("Error posting gig:", error);
      toast.error("Failed to post gig. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="hero" className="gap-2">
          <Plus className="h-4 w-4" />
          Post New Gig
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] p-0 overflow-hidden flex flex-col" aria-describedby="Post a new Gig">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <DialogTitle>Post a New Gig</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
              id="job-form"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Gig Title */}
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>
                        Gig Title <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Build a website" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Description */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>
                        Gig Description{" "}
                        <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe the gig in detail..."
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Category */}
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Category <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Web Development" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Subcategory */}
                <FormField
                  control={form.control}
                  name="subCategory"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subcategory (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., React, Node.js" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Skills Required */}
                <FormField
                  control={form.control}
                  name="skillsRequired"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>
                        Required Skills (comma separated){" "}
                        <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., React, Node.js, TypeScript"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Experience Level */}
                <FormField
                  control={form.control}
                  name="experienceLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Experience Level{" "}
                        <span className="text-destructive">*</span>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select experience level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="entry">Entry Level</SelectItem>
                          <SelectItem value="intermediate">
                            Intermediate
                          </SelectItem>
                          <SelectItem value="expert">Expert</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Project Complexity removed per server schema */}

                {/* Budget Type */}
                <FormField
                  control={form.control}
                  name="budget.type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Budget Type <span className="text-destructive">*</span>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select budget type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="fixed">Fixed Price</SelectItem>
                          <SelectItem value="hourly">Hourly Rate</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Budget Amount */}
                <FormField
                  control={form.control}
                  name="budget.amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Budget Amount{" "}
                        <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-2.5 text-muted-foreground">
                            $
                          </span>
                          <Input
                            type="number"
                            placeholder="e.g., 1000"
                            className="pl-8"
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

                {/* Duration */}
                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Project Duration{" "}
                        <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 2 months" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Remote Toggle */}
                <FormField
                  control={form.control}
                  name="isRemote"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2 md:col-span-2">
                      <FormControl>
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            field.onChange(checked);
                            if (checked) {
                              form.setValue("location", undefined, {
                                shouldValidate: true,
                              });
                            }
                          }}
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                      </FormControl>
                      <FormLabel className="!mt-0">
                        This is a remote gig
                      </FormLabel>
                    </FormItem>
                  )}
                />

                {/* Location Picker (required when not remote) */}
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => {
                    const remote = form.watch("isRemote");
                    return (
                      <FormItem className="md:col-span-2">
                        <FormLabel>
                          Location <span className="text-destructive">*</span>{" "}
                          <span className="text-muted-foreground text-xs">
                            (required if not remote)
                          </span>
                        </FormLabel>
                        <div
                          className={`relative ${
                            remote ? "pointer-events-none opacity-60" : ""
                          }`}
                        >
                          <div className="h-64 md:h-80">
                            <LocationPicker
                              onChange={(loc) => field.onChange(loc)}
                              onError={() => field.onChange(undefined)}
                            />
                          </div>
                          {remote && (
                            <div
                              className="absolute inset-0 bg-background/40 rounded-md"
                              aria-hidden="true"
                            />
                          )}
                        </div>
                        {field.value && (
                          <p className="text-sm text-muted-foreground mt-2">
                            📍{" "}
                            {field.value.address ||
                              (field.value.city && field.value.state
                                ? `${field.value.city}, ${field.value.state}`
                                : field.value.displayName ||
                                  "Location selected")}
                          </p>
                        )}
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />

                {/* Expected Start Date */}
                <FormField
                  control={form.control}
                  name="expectedStartDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Expected Start Date{" "}
                        <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                          min={new Date().toISOString().split("T")[0]}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Deadline */}
                <FormField
                  control={form.control}
                  name="deadline"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Application Deadline</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          min={new Date().toISOString().split("T")[0]}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Additional Options */}
                <div className="md:col-span-2 space-y-4 pt-2">
                  <FormField
                    control={form.control}
                    name="isUrgent"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={(e) => field.onChange(e.target.checked)}
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                          />
                        </FormControl>
                        <FormLabel className="!mt-0">Mark as Urgent</FormLabel>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="isFeatured"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={(e) => field.onChange(e.target.checked)}
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                          />
                        </FormControl>
                        <FormLabel className="!mt-0">
                          Feature this gig (additional cost)
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                </div>

                {/* Preferred Freelancer Location removed per server schema */}

                {/* Deliverables */}
                <FormField
                  control={form.control}
                  name="deliverables"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>
                        Expected Deliverables (one per line){" "}
                        <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={`- Complete source code\n- Documentation\n- Deployment instructions`}
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* File Upload for Attachments (max total 5MB) */}
                <FormField
                  control={form.control}
                  name="attachments"
                  render={() => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>
                        Attachments (Optional)
                        <span className="block text-xs text-muted-foreground">
                          Max total size 5MB. You can add files one by one.
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          onChange={(e) => {
                            const selected = Array.from(e.target.files || []);
                            if (selected.length === 0) return;
                            // compute new total size
                            const newList = [...files, ...selected];
                            const total = newList.reduce(
                              (acc, f) => acc + f.size,
                              0
                            );
                            const MAX = 5 * 1024 * 1024;
                            if (total > MAX) {
                              toast.error(
                                "Total attachment size exceeds 5MB. File not added."
                              );
                              // reset input value so same file can be chosen again later
                              if (e.target) e.target.value = "";
                              return;
                            }
                            // dedupe by name+size+lastModified
                            const key = (f: File) =>
                              `${f.name}-${f.size}-${f.lastModified}`;
                            const dedupedMap = new Map<string, File>();
                            [...files, ...selected].forEach((f) =>
                              dedupedMap.set(key(f), f)
                            );
                            const next = Array.from(dedupedMap.values());
                            setFiles(next);
                          }}
                        />
                      </FormControl>
                      {/* List files */}
                      {files.length > 0 && (
                        <ul className="mt-2 space-y-2 text-sm">
                          {files.map((f, idx) => (
                            <li
                              key={`${f.name}-${f.lastModified}`}
                              className="flex items-center justify-between rounded-md border p-2"
                            >
                              <span className="truncate mr-3">
                                {f.name}{" "}
                                <span className="text-muted-foreground">
                                  ({(f.size / 1024).toFixed(1)} KB)
                                </span>
                              </span>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  const next = files.filter(
                                    (_, i) => i !== idx
                                  );
                                  setFiles(next);
                                }}
                              >
                                Remove
                              </Button>
                            </li>
                          ))}
                          <li className="text-muted-foreground">
                            Total:{" "}
                            {(
                              files.reduce((a, f) => a + f.size, 0) / 1024
                            ).toFixed(1)}{" "}
                            KB
                          </li>
                        </ul>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Requirements */}
                <FormField
                  control={form.control}
                  name="requirements"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>
                        Requirements (one per line){" "}
                        <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={`- Minimum 3 years experience\n- Portfolio required\n- Available for meetings`}
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </form>
          </Form>
        </div>
        <div className="px-6 py-4 border-t flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" form="job-form" disabled={isSubmitting}>
            {isSubmitting ? "Posting..." : "Post Gig"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
