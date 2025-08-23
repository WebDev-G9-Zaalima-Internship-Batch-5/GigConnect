import React, { useEffect, useCallback, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import { MapPin } from "lucide-react";
import { renderToString } from "react-dom/server";

// Create a custom marker icon using a Lucide icon
const createMarkerIcon = () => {
  const icon = L.divIcon({
    className: "custom-marker",
    html: `
      <div style="
        color: #2563eb;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
      ">
           ${renderToString(<MapPin size={24} />)}
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  });
  return icon;
};

interface MapPickerProps {
  onChange: (lat: number, lng: number) => void;
  position?: [number, number];
}

// Component to handle map clicks for setting location
function ClickHandler({
  onSelect,
}: {
  onSelect: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click: (e) => {
      try {
        onSelect(e.latlng.lat, e.latlng.lng);
      } catch (error) {
        console.error("Error handling map click:", error);
      }
    },
  });

  return null;
}

// Component to programmatically update the map's view
function MapUpdater({ position }: { position: [number, number] | undefined }) {
  const map = useMap();

  useEffect(() => {
    if (position) {
      try {
        map.flyTo(position, 13, { duration: 0.5 });
      } catch (error) {
        console.error("Error updating map view:", error);
      }
    }
  }, [position, map]);

  return null;
}

const MapPicker: React.FC<MapPickerProps> = ({ onChange, position }) => {
  const defaultCenter: [number, number] = [20, 0];
  const markerRef = useRef<L.Marker | null>(null);
  const markerIcon = createMarkerIcon();

  // Update marker position when it changes
  useEffect(() => {
    if (markerRef.current && position) {
      markerRef.current.setLatLng([position[0], position[1]]);
    }
  }, [position]);

  try {
    return (
      <MapContainer
        center={position || defaultCenter}
        zoom={position ? 13 : 2}
        style={{ height: "100%", width: "100%" }}
        className="z-0"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <ClickHandler onSelect={onChange} />
        <MapUpdater position={position} />
        {position && (
          <Marker
            position={position}
            icon={markerIcon}
            ref={(ref) => {
              if (ref) markerRef.current = ref;
            }}
          />
        )}
      </MapContainer>
    );
  } catch (error) {
    console.error("Error rendering MapPicker:", error);
    return (
      <div className="flex items-center justify-center h-full w-full bg-muted rounded-md">
        <p className="text-muted-foreground">Map unavailable</p>
      </div>
    );
  }
};

export default MapPicker;
