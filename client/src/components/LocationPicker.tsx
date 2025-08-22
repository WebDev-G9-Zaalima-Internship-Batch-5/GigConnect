import React, { useState, useCallback } from "react";
import MapPicker from "./MapPicker";
import LocationSearchBox from "./LocationSearchBox";
import { LocationData } from "@/types/location";
import { Button } from "@/components/ui/button";
import { Locate, Loader2 } from "lucide-react";

interface LocationPickerProps {
  onChange: (location: LocationData) => void;
}

const LocationPicker: React.FC<LocationPickerProps> = ({ onChange }) => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const handleLocationSelect = useCallback(
    (loc: LocationData) => {
      setLocation(loc);
      onChange(loc);
      setLocationError(null);
    },
    [onChange]
  );

  const handleMapClick = useCallback(
    (lat: number, lng: number) => {
      const newLocation: LocationData = {
        type: {
          type: "string",
          enum: ["Point"],
        },
        coordinates: [lng, lat],
        displayName: `${lat.toFixed(5)}, ${lng.toFixed(5)}`,
      };
      setLocation(newLocation);
      onChange(newLocation);
      setLocationError(null);
    },
    [onChange]
  );

  const getCurrentLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      return;
    }

    setIsLocating(true);
    setLocationError(null);

    try {
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
          });
        }
      );

      const { latitude, longitude } = position.coords;

      // Use the coordinates to get address details from reverse geocoding
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch address details");
      }

      const data = await response.json();
      const address = data.address || {};

      const newLocation: LocationData = {
        type: {
          type: "string",
          enum: ["Point"],
        },
        coordinates: [longitude, latitude],
        displayName:
          data.display_name ||
          `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`,
        address: address.road || "",
        city: address.city || address.town || address.village || "",
        state: address.state || "",
        country: address.country || "",
        pincode: address.postcode || "",
      };

      setLocation(newLocation);
      onChange(newLocation);
    } catch (error) {
      console.error("Error getting location:", error);
      setLocationError(
        error instanceof Error ? error.message : "Failed to get your location"
      );
    } finally {
      setIsLocating(false);
    }
  }, [onChange]);

  return (
    <div className="relative h-full w-full">
      <div className="relative z-10 mb-4 flex gap-2">
        <div className="flex-1">
          <LocationSearchBox onSelect={handleLocationSelect} />
        </div>
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={getCurrentLocation}
          disabled={isLocating}
          title="Use current location"
          className="shrink-0"
        >
          {isLocating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Locate className="h-4 w-4" />
          )}
        </Button>
      </div>
      {locationError && (
        <p className="mb-2 text-sm text-red-500">{locationError}</p>
      )}
      <div className="relative z-0 h-[calc(100%-3.5rem)]">
        <MapPicker
          onChange={handleMapClick}
          position={
            location
              ? [location.coordinates[1], location.coordinates[0]]
              : undefined
          }
        />
      </div>
      {location && (
        <p className="mt-2 text-sm text-muted-foreground">
          Selected:{" "}
          <span className="font-mono">
            {location.displayName ||
              `${location.coordinates[1].toFixed(
                5
              )}, ${location.coordinates[0].toFixed(5)}`}
          </span>
        </p>
      )}
    </div>
  );
};

export default LocationPicker;
