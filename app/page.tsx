"use client"

import { useState, useEffect } from "react"
import { WorldMap } from "@/components/world-map"
import { PinList } from "@/components/pin-list"
import { Button } from "@/components/ui/button"
import { MapPin, List, X, Globe } from "lucide-react"

interface Pin {
  id: string
  lat: number
  lng: number
  label: string
  timestamp: Date
}

export default function HomePage() {
  const [pins, setPins] = useState<Pin[]>([])
  const [showPinList, setShowPinList] = useState(false)

  // Load pins from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedPins = localStorage.getItem("worldpins");
      if (savedPins) {
        type StoredPin = Omit<Pin, "timestamp"> & { timestamp: string };
        setPins(
            (JSON.parse(savedPins) as StoredPin[]).map((pin) => ({
              ...pin,
              timestamp: new Date(pin.timestamp),
            }))
        );
      }
    }
  }, []);


  const handleAddPin = (lat: number, lng: number, label: string) => {
    const newPin: Pin = {
      id: Date.now().toString(),
      lat,
      lng,
      label,
      timestamp: new Date(),
    }

    const updatedPins = [...pins, newPin]
    setPins(updatedPins)
    localStorage.setItem("worldpins", JSON.stringify(updatedPins))
  }

  const handleDeletePin = (pinId: string) => {
    const updatedPins = pins.filter((pin) => pin.id !== pinId)
    setPins(updatedPins)
    localStorage.setItem("worldpins", JSON.stringify(updatedPins))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-green-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent">
                  Arlekin
                </h1>
                <p className="text-xs text-green-600 font-medium">Discover & Save Places</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPinList(!showPinList)}
                className="lg:hidden border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300"
              >
                {showPinList ? <X className="h-4 w-4" /> : <List className="h-4 w-4" />}
                <span className="ml-2 hidden sm:inline">{showPinList ? "Close" : "Pins"}</span>
                {pins.length > 0 && (
                  <span className="ml-2 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 text-xs rounded-full px-2 py-1 font-medium">
                    {pins.length}
                  </span>
                )}
              </Button>

              <div className="hidden lg:flex items-center space-x-2">
                <Globe className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-700 font-medium">{pins.length} pins saved</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-green-700 via-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">
            Explore the World, One Pin at a Time
          </h2>
          <p className="text-lg text-green-700 max-w-2xl mx-auto leading-relaxed">
            Mark your favorite places, dream destinations, and memorable locations on an interactive world map. Build
            your personal collection of special places around the globe.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl h-full mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="w-full h-full flex flex-col justify-around items-center gap-8">
          {/* Map Section */}
          <div className="w-full lg:col-span-3">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-green-200 overflow-hidden">
              <div className="p-6 border-b border-green-100 bg-gradient-to-r from-green-50 to-emerald-50">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                    <Globe className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-green-800">Interactive World Map</h3>
                </div>
                <p className="text-green-700">
                  Click anywhere on the map to add a pin. Each pin represents a special place in your journey.
                </p>
              </div>
              <WorldMap pins={pins} onAddPin={handleAddPin} />
            </div>
          </div>

          {/* Pin List Section - Desktop */}
          <div className="hidden w-full h-full lg:block lg:col-span-1">
            <PinList pins={pins} onDeletePin={handleDeletePin} />
          </div>
        </div>

        {/* Pin List Section - Mobile Overlay */}
        {showPinList && (
          <div
            className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowPinList(false)}
          >
            <div
              className="absolute right-0 top-0 h-full w-full max-w-sm bg-white shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                      <MapPin className="h-4 w-4 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-green-800">My Pins</h3>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPinList(false)}
                    className="text-green-600 hover:bg-green-100"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="h-full overflow-y-auto pb-20">
                <PinList pins={pins} onDeletePin={handleDeletePin} />
              </div>
            </div>
          </div>
        )}

        {/* Stats Section */}
        {pins.length > 0 && (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-green-200 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <p className="text-2xl font-bold text-green-800">{pins.length}</p>
              <p className="text-green-600 text-sm font-medium">Total Pins</p>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-green-200 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Globe className="h-6 w-6 text-white" />
              </div>
              <p className="text-2xl font-bold text-green-800">
                {
                  new Set(
                    pins.map((pin) => {
                      const { lat, lng } = pin
                      if (lat > 35 && lat < 70 && lng > -10 && lng < 40) return "Europe"
                      if (lat > 25 && lat < 50 && lng > -125 && lng < -65) return "North America"
                      if (lat > -35 && lat < 35 && lng > -20 && lng < 50) return "Africa"
                      if (lat > -45 && lat < 35 && lng > 60 && lng < 150) return "Asia"
                      if (lat > -50 && lat < -10 && lng > 110 && lng < 180) return "Australia"
                      if (lat > -60 && lat < 15 && lng > -85 && lng < -35) return "South America"
                      return "Other"
                    }),
                  ).size
                }
              </p>
              <p className="text-green-600 text-sm font-medium">Regions Visited</p>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-green-200 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <p className="text-2xl font-bold text-green-800">
                {pins.length > 0
                  ? Math.round(
                      (Date.now() - Math.min(...pins.map((p) => p.timestamp.getTime()))) / (1000 * 60 * 60 * 24),
                    )
                  : 0}
              </p>
              <p className="text-green-600 text-sm font-medium">Days Exploring</p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
