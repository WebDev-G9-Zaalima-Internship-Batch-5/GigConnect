import { LocationData } from "./location.types";

interface ClientAboutData {
  description: string;
  website: string;
  company: string;
  location: LocationData;
  joinDate: string;
}

interface ClientAboutProps {
  profile: ClientAboutData;
  isEditing: boolean;
}

export type { ClientAboutData, ClientAboutProps };
