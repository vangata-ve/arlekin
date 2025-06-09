"use client"

import { Button } from "@/components/ui/button"
import { MapPin, Trash2, Calendar, Globe, Navigation } from "lucide-react"

interface Pin {
  id: string
  lat: number
  lng: number
  label: string
  timestamp: Date
}

interface PinListProps {
  pins: Pin[]
  onDeletePin: (pinId: string) => void
}

export function PinList({ pins, onDeletePin }: PinListProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date)
  }

  const formatCoordinates = (lat: number, lng: number) => {
    return `${lat.toFixed(2)}°, ${lng.toFixed(2)}°`
  }

  const getLocationInfo = (lat: number, lng: number) => {
    if (lat > 35 && lat < 70 && lng > -10 && lng < 40)
      return { name: "Europe", emoji: "🇪🇺", color: "from-green-500 to-emerald-500" }
    if (lat > 25 && lat < 50 && lng > -125 && lng < -65)
      return { name: "North America", emoji: "🇺🇸", color: "from-emerald-500 to-teal-500" }
    if (lat > -35 && lat < 35 && lng > -20 && lng < 50)
      return { name: "Africa", emoji: "🌍", color: "from-teal-500 to-green-500" }
    if (lat > -45 && lat < 35 && lng > 60 && lng < 150)
      return { name: "Asia", emoji: "🌏", color: "from-green-500 to-lime-500" }
    if (lat > -50 && lat < -10 && lng > 110 && lng < 180)
      return { name: "Australia", emoji: "🇦🇺", color: "from-lime-500 to-emerald-500" }
    if (lat > -60 && lat < 15 && lng > -85 && lng < -35)
      return { name: "South America", emoji: "🌎", color: "from-emerald-500 to-green-500" }
    return { name: "Ocean", emoji: "🌊", color: "from-teal-500 to-cyan-500" }
  }

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-green-200 h-fit overflow-hidden">
      <div className="p-6 border-b border-green-100 bg-gradient-to-r from-green-50 to-emerald-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <MapPin className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-green-800">My Pins</h3>
              <p className="text-xs text-green-600">{pins.length} saved locations</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {pins.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Globe className="h-8 w-8 text-green-400" />
            </div>
            <p className="text-green-700 text-lg font-medium mb-2">No pins yet</p>
            <p className="text-green-600 text-sm">Start exploring by clicking on the map</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
            {pins
              .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
              .map((pin, index) => {
                const locationInfo = getLocationInfo(pin.lat, pin.lng)
                return (
                  <div
                    key={pin.id}
                    className="group relative bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-green-100 hover:border-green-200 hover:bg-white/80 transition-all duration-300 hover:shadow-lg"
                  >
                    {/* Gradient accent */}
                    <div
                      className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${locationInfo.color} rounded-l-xl`}
                    ></div>

                    <div className="flex items-start justify-between ml-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start space-x-3">
                          <div
                            className={`w-10 h-10 bg-gradient-to-r ${locationInfo.color} rounded-xl flex items-center justify-center flex-shrink-0 shadow-md`}
                          >
                            <MapPin className="h-5 w-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-green-800 text-sm leading-tight mb-3 break-words">
                              {pin.label}
                            </p>

                            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <div className="flex items-center space-x-1 text-xs bg-green-50 rounded-full px-2 py-1">
                                  <span className="text-sm">{locationInfo.emoji}</span>
                                  <span className="text-green-700 font-medium">{locationInfo.name}</span>
                                </div>
                              </div>

                              <div className="flex items-center space-x-2 text-xs text-green-600">
                                <Navigation className="h-3 w-3 flex-shrink-0" />
                                <span className="font-mono">{formatCoordinates(pin.lat, pin.lng)}</span>
                              </div>

                              <div className="flex items-center space-x-2 text-xs text-green-600">
                                <Calendar className="h-3 w-3 flex-shrink-0" />
                                <span>{formatDate(pin.timestamp)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDeletePin(pin.id)}
                        className="text-green-400 hover:text-red-600 hover:bg-red-50 ml-3 opacity-0 group-hover:opacity-100 transition-all duration-300 flex-shrink-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )
              })}
          </div>
        )}
      </div>
    </div>
  )
}
