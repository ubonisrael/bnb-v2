"use client"

import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface MapProps {
  name: string;
  logo: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  description: string;
  hours: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
  latitude: number;
  longitude: number;
}

const Map = ({ name, logo, email, phone, address, city, state, zip, description, hours, latitude, longitude }: MapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (mapRef.current && !mapInstanceRef.current) {
      // Initialize the map
      const map = L.map(mapRef.current).setView(
        [latitude, longitude],
        15
      );

      // Add the OpenStreetMap tiles
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      // Add a marker for the business location
      L.marker([latitude, longitude])
        .addTo(map)
        .bindPopup(`
          <b>${name}</b><br>
          ${address}<br>
          ${city}, ${state} ${zip}
        `)
        .openPopup();

      mapInstanceRef.current = map;

      // Clean up the map when component unmounts
      return () => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }
      };
    }
  }, []);

  return (
    <div ref={mapRef} className="h-96 bg-gray-200 dark:bg-gray-700 w-full rounded-lg overflow-hidden">
      {/* The map will be rendered here */}
    </div>
  );
};

export default Map;
