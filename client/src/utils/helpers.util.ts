import { LocationData } from "@/types/location.types";

export const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
};

export function getLocationName(location: LocationData) {
  if (!location) return "";
  if (location.displayName) return location.displayName.trim();

  let address = "";
  if (location.city) address += location.city?.trim();
  if (location.state)
    address += !address
      ? location.state?.trim()
      : ", " + location.state?.trim();
  if (location.country)
    address += !address
      ? location.country?.trim()
      : ", " + location.country?.trim();

  if (!address && location.pincode) address += location.pincode?.trim();

  if (!address)
    return `${location.coordinates[1].toFixed(
      2
    )}, ${location.coordinates[0].toFixed(2)}`;

  return address;
}

export function formatMongoDate(mongoDate: string | Date): string {
  const date = new Date(mongoDate);

  if (isNaN(date.getTime())) {
    return "Invalid";
  }

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  return new Intl.DateTimeFormat("en-US", options).format(date);
}
