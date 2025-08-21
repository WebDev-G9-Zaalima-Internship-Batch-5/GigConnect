import React, { useState, useCallback } from "react";
import MapPicker from "./MapPicker";
import LocationSearchBox from "./LocationSearchBox";
import { LocationData } from "@/types/location";

interface LocationPickerProps {
  onChange: (location: LocationData) => void;
}

const LocationPicker: React.FC<LocationPickerProps> = ({ onChange }) => {
  const [location, setLocation] = useState<LocationData | null>(null);

  const handleLocationSelect = useCallback(
    (loc: LocationData) => {
      setLocation(loc);
      onChange(loc);
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
    },
    [onChange]
  );

  return (
    <div className="relative h-full w-full">
      <div className="relative z-10 mb-4">
        <LocationSearchBox onSelect={handleLocationSelect} />
      </div>
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
