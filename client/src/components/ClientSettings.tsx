import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

export default function ClientSettings() {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    email: "john.mitchell@example.com",
    phone: "+1 (555) 123-4567",
    notifications: {
      email: true,
      sms: true,
      newsletter: true,
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSaving(false);
    toast({
      title: "Settings saved",
      description: "Your settings have been updated successfully.",
    });
  };

  const handleNotificationChange = (
    key: keyof typeof formData.notifications
  ) => {
    setFormData((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: !prev.notifications[key],
      },
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Contact Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="mt-2"
              disabled={isSaving}
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              className="mt-2"
              disabled={isSaving}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Email Notifications</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="email-notifications"
              checked={formData.notifications.email}
              onChange={() => handleNotificationChange("email")}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              disabled={isSaving}
            />
            <Label htmlFor="email-notifications" className="font-normal">
              Email notifications
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="sms-notifications"
              checked={formData.notifications.sms}
              onChange={() => handleNotificationChange("sms")}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              disabled={isSaving}
            />
            <Label htmlFor="sms-notifications" className="font-normal">
              SMS notifications
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="newsletter"
              checked={formData.notifications.newsletter}
              onChange={() => handleNotificationChange("newsletter")}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              disabled={isSaving}
            />
            <Label htmlFor="newsletter" className="font-normal">
              Newsletter and updates
            </Label>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
