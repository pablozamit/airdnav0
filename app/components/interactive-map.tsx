"use client"

import { useEffect, useRef } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

// Fix for default markers in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
})

interface Property {
  id: number
  address: string
  type: string
  bedrooms: number
  bathrooms: number
  annualRevenue: number
  adr: number
  occupancyRate: number
  reviews: number
  lastReview: string
  daysTracked: number
  platform: string
  rating: number
  amenities: string[]
  isPinned: boolean
  isBase: boolean
  isTarget: boolean
}

interface InteractiveMapProps {
  properties: Property[]
}

// Mock coordinates for Barcelona properties
const propertyCoordinates = [
  { id: 1, lat: 41.3851, lng: 2.1734, neighborhood: "Eixample" },
  { id: 2, lat: 41.3947, lng: 2.1635, neighborhood: "Eixample" },
  { id: 3, lat: 41.3869, lng: 2.1799, neighborhood: "Born" },
]

// High-performance clusters data
const clusters = [
  {
    name: "Eixample Premium",
    center: [41.39, 2.165] as [number, number],
    avgAdr: 185,
    occupancy: 82,
    properties: 45,
    color: "#10b981", // green
  },
  {
    name: "Gràcia Boutique",
    center: [41.4036, 2.1565] as [number, number],
    avgAdr: 156,
    occupancy: 79,
    properties: 32,
    color: "#3b82f6", // blue
  },
  {
    name: "Born Historic",
    center: [41.3833, 2.1833] as [number, number],
    avgAdr: 134,
    occupancy: 74,
    properties: 28,
    color: "#f59e0b", // yellow
  },
  {
    name: "Barceloneta Beach",
    center: [41.3755, 2.1901] as [number, number],
    avgAdr: 142,
    occupancy: 71,
    properties: 38,
    color: "#06b6d4", // cyan
  },
]

export default function InteractiveMap({ properties }: InteractiveMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    // Initialize map
    const map = L.map(mapRef.current).setView([41.3851, 2.1734], 13)
    mapInstanceRef.current = map

    // Add tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map)

    // Add cluster circles
    clusters.forEach((cluster) => {
      const circle = L.circle(cluster.center, {
        color: cluster.color,
        fillColor: cluster.color,
        fillOpacity: 0.2,
        radius: 800,
        weight: 2,
      }).addTo(map)

      // Cluster popup
      const popupContent = `
        <div class="p-3 min-w-[200px]">
          <h3 class="font-semibold text-lg mb-2">${cluster.name}</h3>
          <div class="space-y-1 text-sm">
            <div class="flex justify-between">
              <span>ADR Promedio:</span>
              <span class="font-medium">€${cluster.avgAdr}</span>
            </div>
            <div class="flex justify-between">
              <span>Ocupación:</span>
              <span class="font-medium">${cluster.occupancy}%</span>
            </div>
            <div class="flex justify-between">
              <span>Propiedades:</span>
              <span class="font-medium">${cluster.properties}</span>
            </div>
          </div>
          <div class="mt-2 pt-2 border-t">
            <span class="inline-block px-2 py-1 text-xs rounded-full" style="background-color: ${cluster.color}20; color: ${cluster.color}">
              Cluster de Alto Rendimiento
            </span>
          </div>
        </div>
      `
      circle.bindPopup(popupContent)
    })

    // Add property markers
    properties.forEach((property) => {
      const coords = propertyCoordinates.find((c) => c.id === property.id)
      if (!coords) return

      // Custom icon based on property status
      let iconColor = "#6b7280" // default gray
      if (property.isTarget)
        iconColor = "#3b82f6" // blue
      else if (property.isBase)
        iconColor = "#10b981" // green
      else if (property.isPinned) iconColor = "#f59e0b" // yellow

      const customIcon = L.divIcon({
        html: `
          <div style="
            background-color: ${iconColor};
            width: 24px;
            height: 24px;
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 12px;
            font-weight: bold;
          ">
            ${property.bedrooms}
          </div>
        `,
        className: "custom-marker",
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      })

      const marker = L.marker([coords.lat, coords.lng], { icon: customIcon }).addTo(map)

      // Property popup
      const popupContent = `
        <div class="p-3 min-w-[250px]">
          <h3 class="font-semibold mb-2">${property.address}</h3>
          <div class="flex gap-2 mb-2">
            <span class="inline-block px-2 py-1 text-xs bg-gray-100 rounded">${property.type}</span>
            ${property.isBase ? '<span class="inline-block px-2 py-1 text-xs bg-green-100 text-green-800 rounded">Base</span>' : ""}
            ${property.isTarget ? '<span class="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">Objetivo</span>' : ""}
            ${property.isPinned ? '<span class="inline-block px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">Fijada</span>' : ""}
          </div>
          <div class="grid grid-cols-2 gap-2 text-sm mb-2">
            <div>
              <span class="text-gray-600">Habitaciones:</span>
              <span class="font-medium ml-1">${property.bedrooms}</span>
            </div>
            <div>
              <span class="text-gray-600">Baños:</span>
              <span class="font-medium ml-1">${property.bathrooms}</span>
            </div>
            <div>
              <span class="text-gray-600">ADR:</span>
              <span class="font-medium ml-1">€${property.adr}</span>
            </div>
            <div>
              <span class="text-gray-600">Ocupación:</span>
              <span class="font-medium ml-1">${property.occupancyRate}%</span>
            </div>
          </div>
          <div class="pt-2 border-t">
            <div class="text-sm text-gray-600">Ingresos anuales:</div>
            <div class="font-semibold text-lg text-green-600">€${property.annualRevenue.toLocaleString()}</div>
          </div>
          <div class="mt-2 text-xs text-gray-500">
            ${property.reviews} reseñas • ${property.rating}⭐ • ${coords.neighborhood}
          </div>
        </div>
      `
      marker.bindPopup(popupContent)
    })

    // Add legend
    const legend = L.control({ position: "bottomright" })
    legend.onAdd = () => {
      const div = L.DomUtil.create("div", "legend")
      div.innerHTML = `
        <div style="
          background: white;
          padding: 12px;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          font-size: 12px;
          line-height: 1.4;
        ">
          <div style="font-weight: bold; margin-bottom: 8px;">Leyenda</div>
          <div style="display: flex; align-items: center; margin-bottom: 4px;">
            <div style="width: 16px; height: 16px; background: #10b981; border-radius: 50%; margin-right: 8px;"></div>
            Comparable Base
          </div>
          <div style="display: flex; align-items: center; margin-bottom: 4px;">
            <div style="width: 16px; height: 16px; background: #3b82f6; border-radius: 50%; margin-right: 8px;"></div>
            Comparable Objetivo
          </div>
          <div style="display: flex; align-items: center; margin-bottom: 4px;">
            <div style="width: 16px; height: 16px; background: #f59e0b; border-radius: 50%; margin-right: 8px;"></div>
            Propiedad Fijada
          </div>
          <div style="display: flex; align-items: center; margin-bottom: 8px;">
            <div style="width: 16px; height: 16px; background: #6b7280; border-radius: 50%; margin-right: 8px;"></div>
            Propiedad Regular
          </div>
          <div style="border-top: 1px solid #e5e7eb; padding-top: 8px; margin-top: 8px;">
            <div style="font-weight: bold; margin-bottom: 4px;">Clusters de Alto Rendimiento</div>
            <div style="display: flex; align-items: center; margin-bottom: 2px;">
              <div style="width: 12px; height: 12px; background: #10b981; margin-right: 6px;"></div>
              Premium (€180+ ADR)
            </div>
            <div style="display: flex; align-items: center; margin-bottom: 2px;">
              <div style="width: 12px; height: 12px; background: #3b82f6; margin-right: 6px;"></div>
              Alto (€150+ ADR)
            </div>
            <div style="display: flex; align-items: center;">
              <div style="width: 12px; height: 12px; background: #f59e0b; margin-right: 6px;"></div>
              Medio (€130+ ADR)
            </div>
          </div>
        </div>
      `
      return div
    }
    legend.addTo(map)

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [properties])

  return <div ref={mapRef} className="h-full w-full rounded-lg" />
}
