import React, { useState, useCallback, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { LocationData } from "@/types/location.types";

export interface Suggestion {
  display_name: string;
  lat: string;
  lon: string;
  address?: {
    road?: string;
    city?: string;
    state?: string;
    country?: string;
    postcode?: string;
    house_number?: string;
    suburb?: string;
  };
}

interface LocationSearchBoxProps {
  onSelect: (location: Omit<LocationData, "type">) => void;
}

// Debounce hook
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const LocationSearchBox: React.FC<LocationSearchBoxProps> = ({ onSelect }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Suggestion[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const debouncedQuery = useDebounce(query, 1000);

  const search = useCallback(async (q: string) => {
    if (q.length < 3) {
      setResults([]);
      return;
    }

    try {
      setIsLoading(true);
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          q
        )}&limit=5&addressdetails=1`
      );

      if (!res.ok) {
        throw new Error("Search failed");
      }

      const data = await res.json();
      setResults(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Location search error:", error);
      setResults([]);
    } finally {
      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
      setIsLoading(false);
    }
  }, []);

  // Trigger search when debounced query changes
  useEffect(() => {
    search(debouncedQuery);
  }, [debouncedQuery, search]);

  const handleSelect = useCallback(
    (suggestion: Suggestion) => {
      try {
        const lat = parseFloat(suggestion.lat);
        const lng = parseFloat(suggestion.lon);
        const address = suggestion.address;

        if (isNaN(lat) || isNaN(lng)) {
          console.error("Invalid coordinates:", suggestion.lat, suggestion.lon);
          return;
        }

        const locationData: Omit<LocationData, "type"> = {
          coordinates: [lng, lat], // Note: GeoJSON uses [longitude, latitude]
          displayName: suggestion.display_name,
          address: address?.road || "",
          city: address?.city || "",
          state: address?.state || "",
          country: address?.country || "",
          pincode: address?.postcode || "",
        };

        onSelect(locationData);
        setResults([]);
        setQuery(suggestion.display_name);
      } catch (error) {
        console.error("Error selecting location:", error);
      }
    },
    [onSelect]
  );

  // Custom blur handler to detect clicks outside the entire component
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [containerRef]);

  return (
    <div className="relative w-full" ref={containerRef}>
      <Input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setIsFocused(true)}
        placeholder="Search for a location..."
        className="w-full"
        disabled={isLoading}
      />

      {isLoading && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
        </div>
      )}

      {results.length > 0 && isFocused && (
        <Card className="absolute bg-background border w-full max-h-60 overflow-y-auto z-50 mt-1">
          <ul>
            {results.map((result, index) => (
              <li
                key={`${result.lat}-${result.lon}-${index}`}
                className="p-2 hover:bg-accent cursor-pointer text-sm border-b last:border-b-0"
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleSelect(result);
                }}
              >
                <div className="truncate" title={result.display_name}>
                  {result.display_name}
                </div>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {query.length >= 3 && results.length === 0 && !isLoading && isFocused && (
        <Card className="absolute bg-background border w-full z-50 mt-1">
          <div className="p-2 text-sm text-muted-foreground">
            No locations found
          </div>
        </Card>
      )}
    </div>
  );
};

export default LocationSearchBox;
