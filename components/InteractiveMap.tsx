"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Create custom icon
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [0, -41],
  shadowSize: [41, 41],
});

interface InteractiveMapProps {
  lat: number;
  lng: number;
  zoom: number;
  label: string;
  editable?: boolean;
  onLocationChange?: (lat: number, lng: number) => void;
}

// Component to handle clicks when editable
function LocationPicker({ onLocationChange }: { onLocationChange: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onLocationChange(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function InteractiveMap({
  lat,
  lng,
  zoom,
  label,
  editable = false,
  onLocationChange,
}: InteractiveMapProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-full h-full bg-gray-200 animate-pulse flex items-center justify-center">Loading Map...</div>;
  }

  return (
    <MapContainer
      center={[lat, lng]}
      zoom={zoom}
      scrollWheelZoom={true}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      <Marker position={[lat, lng]} icon={icon}>
        <Tooltip direction="top" permanent className="font-bold text-black">
          {label}
        </Tooltip>
      </Marker>

      {editable && onLocationChange && <LocationPicker onLocationChange={onLocationChange} />}
    </MapContainer>
  );
}
