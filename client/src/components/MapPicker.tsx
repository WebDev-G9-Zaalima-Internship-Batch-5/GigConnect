import React, { useEffect, useCallback } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import L from "leaflet";

// Fix for default marker icons in Next.js
const DefaultIcon = L.icon({
  iconUrl: "/marker-icon.png",
  iconRetinaUrl: "/marker-icon-2x.png",
  shadowUrl: "/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

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
        map.flyTo(position, 13);
      } catch (error) {
        console.error("Error updating map view:", error);
      }
    }
  }, [position, map]);

  return null;
}

const MapPicker: React.FC<MapPickerProps> = ({ onChange, position }) => {
  const defaultCenter: [number, number] = [20, 0];

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
        {position && <Marker position={position} />}
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
