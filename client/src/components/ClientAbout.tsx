import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ClientAboutProps } from "@/types/clientProfile.types";
import { formatMongoDate, getLocationName } from "@/utils/helpers.util";
import { Calendar, Globe, Globe2, MapPin } from "lucide-react";

export default function ClientAbout({ profile, isEditing }: ClientAboutProps) {
  if (isEditing) {
    return (
      <div className="space-y-4">
        <div>
          <Label htmlFor="company">Company Name</Label>
          <Input id="company" value={profile.company} className="mt-2" />
        </div>
        <div>
          <Label htmlFor="description">Company Description</Label>
          <Textarea
            id="description"
            value={profile.description}
            rows={4}
            className="mt-2"
          />
        </div>
        <div>
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            value={profile.website}
            className="mt-2"
            placeholder="https://example.com"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="font-semibold text-2xl text-primary">
            {profile.company}
          </h4>
        </div>
      </div>
      <div>
        <h4 className="font-medium mb-2">Company Description</h4>
        <p className="text-muted-foreground break-all">{profile.description}</p>
      </div>

      {profile.website && (
        <div>
          <h4 className="font-medium">Website</h4>
          <a
            href={profile.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline break-all"
          >
            {profile.website.replace(/^https?:\/\//, "")}
          </a>
        </div>
      )}

      <div>
        <div className="flex flex-col text-muted-foreground">
          <div className="flex items-center justify-start">
            <MapPin className="h-4 w-4 mr-2" />
            <span>{getLocationName(profile.location)}</span>
          </div>
          <div className="flex items-center justify-start">
            <Calendar className="h-4 w-4 mr-2" />
            <span>Joined {formatMongoDate(profile.joinDate)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
