"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MapPin, Navigation, Sparkles } from "lucide-react";
import type L from "leaflet";
import "leaflet/dist/leaflet.css";

// Dynamic imports for react-leaflet components
const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false });
import { useMapEvents } from "react-leaflet"; // Use this directly since it's a hook!

interface Pin {
  id: string;
  lat: number;
  lng: number;
  label: string;
  timestamp: Date;
}

interface WorldMapProps {
  pins: Pin[];
  onAddPin: (lat: number, lng: number, label: string) => void;
}

export function WorldMap({ pins, onAddPin }: WorldMapProps) {
  const [showDialog, setShowDialog] = useState(false);
  const [pendingPin, setPendingPin] = useState<{ lat: number; lng: number } | null>(null);
  const [pinLabel, setPinLabel] = useState("");
  const [isReady, setIsReady] = useState(false);
  const [Leaflet, setLeaflet] = useState<typeof L | null>(null); // Dynamically import Leaflet
  const [customIcon, setCustomIcon] = useState<L.Icon | L.DivIcon | undefined>(undefined);

  useEffect(() => {
    // Dynamically import Leaflet only on the client
    const loadLeaflet = async () => {
      const leafletModule = await import("leaflet"); // Dynamically import Leaflet
      setLeaflet(leafletModule);

      // Create custom icon after Leaflet is loaded
      const icon = new leafletModule.Icon({
        iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      });
      setCustomIcon(icon);
    };
    loadLeaflet();
    setIsReady(true); // Set ready state for client-side rendering
  }, []);

  const handleMapClick = (lat: number, lng: number) => {
    setPendingPin({ lat, lng });
    setShowDialog(true);
    setPinLabel("");
  };

  const handleAddPin = () => {
    if (pendingPin && pinLabel.trim()) {
      onAddPin(pendingPin.lat, pendingPin.lng, pinLabel.trim());
      setShowDialog(false);
      setPendingPin(null);
      setPinLabel("");
    }
  };

  const handleCancel = () => {
    setShowDialog(false);
    setPendingPin(null);
    setPinLabel("");
  };

  const formatCoordinates = (lat: number, lng: number) => {
    return `${lat.toFixed(4)}°, ${lng.toFixed(4)}°`;
  };

  if (!isReady || !Leaflet) {
    return (
        <div className="w-full h-64 sm:h-80 lg:h-96 bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center rounded-xl">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <MapPin className="h-8 w-8 text-white animate-pulse" />
            </div>
            <p className="text-green-700 text-lg font-medium">Loading your world map...</p>
            <p className="text-green-600 text-sm mt-1">Preparing the globe for exploration</p>
          </div>
        </div>
    );
  }

  return (
      <>
        <div className="w-full h-64 sm:h-80 lg:h-96 relative rounded-xl overflow-hidden">
          <MapContainer center={[20, 0]} zoom={2} style={{ height: "100%", width: "100%" }} className="z-0 rounded-xl">
            {/* Tile Layer */}
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Click handler */}
            <MapClickHandler onMapClick={handleMapClick} />

            {/* Pins */}
            {pins.map((pin) => (
                <Marker key={pin.id} position={[pin.lat, pin.lng]} icon={customIcon}>
                  <Popup>
                    <div className="text-center min-w-0 p-2">
                      <div className="flex items-center justify-center mb-2">
                        <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full mr-2"></div>
                        <h3 className="font-semibold text-green-800 text-sm">{pin.label}</h3>
                      </div>
                      <div className="flex items-center justify-center text-xs text-green-600 mb-1">
                        <Navigation className="h-3 w-3 mr-1" />
                        {formatCoordinates(pin.lat, pin.lng)}
                      </div>
                      <p className="text-xs text-green-500 bg-green-50 rounded-full px-2 py-1">
                        {pin.timestamp.toLocaleDateString()}
                      </p>
                    </div>
                  </Popup>
                </Marker>
            ))}
          </MapContainer>
        </div>

        {/* Add Pin Dialog */}
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent className="sm:max-w-md bg-white/95 backdrop-blur-md border border-green-200 shadow-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-3 text-xl">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <span className="bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent font-bold">
                Add New Pin
              </span>
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              {pendingPin && (
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                    <div className="flex items-center space-x-2">
                      <Navigation className="h-4 w-4 text-green-600" />
                      <p className="text-sm font-medium text-green-800">
                        {formatCoordinates(pendingPin.lat, pendingPin.lng)}
                      </p>
                    </div>
                  </div>
              )}
              <div className="space-y-3">
                <Label htmlFor="pin-label" className="text-green-800 font-medium">
                  What makes this place special?
                </Label>
                <Input
                    id="pin-label"
                    placeholder="e.g., Amazing sunset spot, Best coffee in town, Dream destination..."
                    value={pinLabel}
                    onChange={(e) => setPinLabel(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleAddPin();
                    }}
                    className="border-2 border-green-200 focus:border-green-500 rounded-xl px-4 py-3 bg-white/70 backdrop-blur-sm"
                    autoFocus
                />
              </div>
              <div className="flex space-x-3">
                <Button
                    onClick={handleAddPin}
                    disabled={!pinLabel.trim()}
                    className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl py-3 font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Add Pin
                </Button>
                <Button
                    variant="outline"
                    onClick={handleCancel}
                    className="flex-1 border-2 border-green-300 hover:border-green-400 text-green-700 hover:bg-green-50 rounded-xl py-3 font-medium transition-all duration-300"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </>
  );
}

function MapClickHandler({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click: (e) => {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}