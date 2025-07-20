"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import {
  Filter,
  TrendingUp,
  Calendar,
  DollarSign,
  Star,
  Bed,
  Bath,
  Pin,
  Target,
  BarChart3,
  Calculator,
  Search,
  Globe,
  ChevronDown,
  Eye,
  CheckCircle2,
  TrendingDown,
} from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import dynamic from "next/dynamic"

// Dynamic import to avoid SSR issues with Leaflet
const InteractiveMap = dynamic(() => import("./components/interactive-map"), {
  ssr: false,
  loading: () => (
    <div className="h-[500px] bg-slate-100 rounded-lg flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-slate-600">Cargando mapa...</p>
      </div>
    </div>
  ),
})

// Mock data for demonstration
const mockProperties = [
  {
    id: 1,
    address: "Calle Mayor 123, Barcelona",
    type: "Apartamento",
    bedrooms: 2,
    bathrooms: 1,
    annualRevenue: 45000,
    adr: 125,
    occupancyRate: 78,
    reviews: 156,
    lastReview: "2024-01-15",
    daysTracked: 365,
    platform: "Airbnb + Vrbo",
    rating: 4.8,
    amenities: ["Wifi", "Cocina", "Aire acondicionado"],
    isPinned: false,
    isBase: false,
    isTarget: false,
  },
  {
    id: 2,
    address: "Passeig de Gràcia 45, Barcelona",
    type: "Apartamento",
    bedrooms: 3,
    bathrooms: 2,
    annualRevenue: 68000,
    adr: 185,
    occupancyRate: 82,
    reviews: 243,
    lastReview: "2024-01-18",
    daysTracked: 420,
    platform: "Airbnb",
    rating: 4.9,
    amenities: ["Wifi", "Cocina", "Aire acondicionado", "Balcón"],
    isPinned: false,
    isBase: false,
    isTarget: false,
  },
  {
    id: 3,
    address: "Carrer del Rec 78, Barcelona",
    type: "Loft",
    bedrooms: 1,
    bathrooms: 1,
    annualRevenue: 38000,
    adr: 110,
    occupancyRate: 75,
    reviews: 89,
    lastReview: "2024-01-12",
    daysTracked: 280,
    platform: "Vrbo",
    rating: 4.6,
    amenities: ["Wifi", "Cocina"],
    isPinned: false,
    isBase: false,
    isTarget: false,
  },
]

export default function VacationRentalAnalytics() {
  const [properties, setProperties] = useState(mockProperties)
  const [selectedMarket, setSelectedMarket] = useState("barcelona")
  const [filters, setFilters] = useState({
    bedrooms: [1, 5],
    bathrooms: [1, 3],
    minReviews: 20,
    minDaysTracked: 250,
    platform: "all",
    propertyType: "all",
  })
  const [activeTab, setActiveTab] = useState("guide")

  const pinnedProperties = properties.filter((p) => p.isPinned)
  const baseProperty = properties.find((p) => p.isBase)
  const targetProperty = properties.find((p) => p.isTarget)

  const togglePin = (id: number) => {
    setProperties((props) => props.map((p) => (p.id === id ? { ...p, isPinned: !p.isPinned } : p)))
  }

  const setAsBase = (id: number) => {
    setProperties((props) =>
      props.map((p) => ({
        ...p,
        isBase: p.id === id,
        isPinned: p.id === id ? true : p.isPinned,
      })),
    )
  }

  const setAsTarget = (id: number) => {
    setProperties((props) =>
      props.map((p) => ({
        ...p,
        isTarget: p.id === id,
        isPinned: p.id === id ? true : p.isPinned,
      })),
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-slate-900">RentalAnalytics Pro</h1>
            </div>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              Plataforma de Análisis de Inversiones
            </Badge>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm">
              <Globe className="w-4 h-4 mr-2" />
              Mercados Globales
            </Button>
            <Button size="sm">
              <Calculator className="w-4 h-4 mr-2" />
              Calculadora ROI
            </Button>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Sidebar - Filtros Avanzados */}
        <div className="w-80 bg-white border-r border-slate-200 overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Filter className="w-5 h-5 text-slate-600" />
              <h2 className="text-lg font-semibold text-slate-900">Filtros Profesionales</h2>
            </div>

            <div className="space-y-6">
              {/* Búsqueda de Mercado */}
              <div>
                <Label className="text-sm font-medium text-slate-700">Mercado Objetivo</Label>
                <div className="mt-2 relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <Input placeholder="Buscar ciudad o dirección..." className="pl-10" />
                </div>
              </div>

              <Separator />

              {/* Filtros Básicos */}
              <Collapsible defaultOpen>
                <CollapsibleTrigger className="flex items-center justify-between w-full text-left">
                  <h3 className="font-medium text-slate-900">Características Básicas</h3>
                  <ChevronDown className="w-4 h-4" />
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-4 space-y-4">
                  <div>
                    <Label className="text-sm text-slate-600">
                      Habitaciones: {filters.bedrooms[0]} - {filters.bedrooms[1]}
                    </Label>
                    <Slider
                      value={filters.bedrooms}
                      onValueChange={(value) => setFilters((f) => ({ ...f, bedrooms: value }))}
                      max={10}
                      min={1}
                      step={1}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label className="text-sm text-slate-600">
                      Baños: {filters.bathrooms[0]} - {filters.bathrooms[1]}
                    </Label>
                    <Slider
                      value={filters.bathrooms}
                      onValueChange={(value) => setFilters((f) => ({ ...f, bathrooms: value }))}
                      max={5}
                      min={1}
                      step={1}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label className="text-sm text-slate-600">Tipo de Propiedad</Label>
                    <Select
                      value={filters.propertyType}
                      onValueChange={(value) => setFilters((f) => ({ ...f, propertyType: value }))}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos los tipos</SelectItem>
                        <SelectItem value="apartment">Apartamento</SelectItem>
                        <SelectItem value="house">Casa</SelectItem>
                        <SelectItem value="loft">Loft</SelectItem>
                        <SelectItem value="villa">Villa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              <Separator />

              {/* Filtros de Fiabilidad */}
              <Collapsible defaultOpen>
                <CollapsibleTrigger className="flex items-center justify-between w-full text-left">
                  <h3 className="font-medium text-slate-900">Filtros de Fiabilidad</h3>
                  <ChevronDown className="w-4 h-4" />
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-4 space-y-4">
                  <div>
                    <Label className="text-sm text-slate-600">Mínimo de Reseñas: {filters.minReviews}</Label>
                    <Slider
                      value={[filters.minReviews]}
                      onValueChange={(value) => setFilters((f) => ({ ...f, minReviews: value[0] }))}
                      max={500}
                      min={0}
                      step={10}
                      className="mt-2"
                    />
                    <p className="text-xs text-slate-500 mt-1">Filtra propiedades sin historial suficiente</p>
                  </div>
                  <div>
                    <Label className="text-sm text-slate-600">Días Mínimos Rastreados: {filters.minDaysTracked}</Label>
                    <Slider
                      value={[filters.minDaysTracked]}
                      onValueChange={(value) => setFilters((f) => ({ ...f, minDaysTracked: value[0] }))}
                      max={730}
                      min={30}
                      step={30}
                      className="mt-2"
                    />
                    <p className="text-xs text-slate-500 mt-1">Evita proyecciones basadas en temporadas parciales</p>
                  </div>
                  <div>
                    <Label className="text-sm text-slate-600">Plataforma</Label>
                    <Select
                      value={filters.platform}
                      onValueChange={(value) => setFilters((f) => ({ ...f, platform: value }))}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas las plataformas</SelectItem>
                        <SelectItem value="airbnb">Solo Airbnb</SelectItem>
                        <SelectItem value="vrbo">Solo Vrbo</SelectItem>
                        <SelectItem value="both">Airbnb + Vrbo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              <Button className="w-full" size="lg">
                <Search className="w-4 h-4 mr-2" />
                Aplicar Filtros
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <div className="border-b border-slate-200 px-6 py-3">
              <TabsList className="grid w-full max-w-3xl grid-cols-5">
                <TabsTrigger value="guide">Guía de Uso</TabsTrigger>
                <TabsTrigger value="explorer">Explorador</TabsTrigger>
                <TabsTrigger value="comparables">Comp-Finder</TabsTrigger>
                <TabsTrigger value="workbench">Workbench</TabsTrigger>
                <TabsTrigger value="calculator">Calculadora</TabsTrigger>
              </TabsList>
            </div>

            <div className="flex-1 overflow-y-auto">
              <TabsContent value="guide" className="p-6">
                <div className="max-w-4xl mx-auto space-y-8">
                  {/* Header */}
                  <div className="text-center space-y-4">
                    <h1 className="text-4xl font-bold text-slate-900">RentalAnalytics Pro</h1>
                    <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                      La plataforma de análisis más avanzada para inversiones en alquileres vacacionales. Diseñada para
                      inversores profesionales que buscan datos de calidad, no estimaciones genéricas.
                    </p>
                    <div className="flex justify-center gap-4">
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800 px-4 py-2">
                        Análisis Profesional
                      </Badge>
                      <Badge variant="secondary" className="bg-green-100 text-green-800 px-4 py-2">
                        Datos de Alta Calidad
                      </Badge>
                      <Badge variant="secondary" className="bg-purple-100 text-purple-800 px-4 py-2">
                        ROI Optimizado
                      </Badge>
                    </div>
                  </div>

                  <Separator />

                  {/* Filosofía */}
                  <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-blue-900">
                        <Target className="w-6 h-6" />
                        Nuestra Filosofía: Calidad sobre Cantidad
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-blue-800 space-y-3">
                      <p className="text-lg font-medium">
                        ❌ <strong>NO somos otro "rentalizer" genérico</strong> que te da una estimación promedio sin
                        contexto.
                      </p>
                      <p className="text-lg font-medium">
                        ✅ <strong>SÍ somos una herramienta analítica</strong> que te convierte en un experto en datos
                        de Airbnb.
                      </p>
                      <div className="bg-white/50 p-4 rounded-lg mt-4">
                        <p className="font-medium text-blue-900">El Problema con las Estimaciones Genéricas:</p>
                        <ul className="mt-2 space-y-1 text-sm">
                          <li>• Incluyen propiedades inactivas o con datos insuficientes</li>
                          <li>• Promedian propiedades mediocres con las de alto rendimiento</li>
                          <li>• No consideran la calidad del historial de datos</li>
                          <li>• Te dan una cifra sin enseñarte cómo llegaron a ella</li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Metodología */}
                  <div className="space-y-6">
                    <h2 className="text-3xl font-bold text-slate-900 text-center">
                      Metodología de Análisis Profesional
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card className="border-green-200">
                        <CardHeader className="bg-green-50">
                          <CardTitle className="text-green-900 flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5" />
                            1. Identificación de Comparables
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4 space-y-3">
                          <p className="text-sm text-slate-700">
                            <strong>Objetivo:</strong> Encontrar propiedades similares con datos confiables
                          </p>
                          <div className="space-y-2">
                            <div className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                              <div>
                                <p className="font-medium text-sm">Filtros Básicos</p>
                                <p className="text-xs text-slate-600">Habitaciones, baños, tipo de propiedad</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                              <div>
                                <p className="font-medium text-sm">Filtros de Fiabilidad</p>
                                <p className="text-xs text-slate-600">
                                  Mínimo de reseñas, días rastreados, actividad reciente
                                </p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-blue-200">
                        <CardHeader className="bg-blue-50">
                          <CardTitle className="text-blue-900 flex items-center gap-2">
                            <Filter className="w-5 h-5" />
                            2. Depuración de Calidad
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4 space-y-3">
                          <p className="text-sm text-slate-700">
                            <strong>Objetivo:</strong> Eliminar propiedades con datos poco confiables
                          </p>
                          <div className="space-y-2">
                            <div className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                              <div>
                                <p className="font-medium text-sm">Historial Suficiente</p>
                                <p className="text-xs text-slate-600">
                                  Mínimo 250 días de datos para evitar sesgos estacionales
                                </p>
                              </div>
                            </div>
                            <div className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                              <div>
                                <p className="font-medium text-sm">Actividad Reciente</p>
                                <p className="text-xs text-slate-600">
                                  Última reseña reciente para confirmar operatividad
                                </p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-purple-200">
                        <CardHeader className="bg-purple-50">
                          <CardTitle className="text-purple-900 flex items-center gap-2">
                            <Target className="w-5 h-5" />
                            3. Selección Estratégica
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4 space-y-3">
                          <p className="text-sm text-slate-700">
                            <strong>Objetivo:</strong> Definir tu rango de rendimiento objetivo
                          </p>
                          <div className="space-y-2">
                            <div className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                              <div>
                                <p className="font-medium text-sm">Comparable Base</p>
                                <p className="text-xs text-slate-600">
                                  El rendimiento mínimo aceptable (promedio del segmento)
                                </p>
                              </div>
                            </div>
                            <div className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                              <div>
                                <p className="font-medium text-sm">Comparable Objetivo</p>
                                <p className="text-xs text-slate-600">
                                  El mejor rendimiento alcanzable (top performers)
                                </p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-orange-200">
                        <CardHeader className="bg-orange-50">
                          <CardTitle className="text-orange-900 flex items-center gap-2">
                            <Calculator className="w-5 h-5" />
                            4. Análisis Financiero
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4 space-y-3">
                          <p className="text-sm text-slate-700">
                            <strong>Objetivo:</strong> Calcular ROI basado en datos reales
                          </p>
                          <div className="space-y-2">
                            <div className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                              <div>
                                <p className="font-medium text-sm">Escenarios Múltiples</p>
                                <p className="text-xs text-slate-600">
                                  Conservador, base y optimista según tus comparables
                                </p>
                              </div>
                            </div>
                            <div className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                              <div>
                                <p className="font-medium text-sm">Métricas Profesionales</p>
                                <p className="text-xs text-slate-600">ROI, Cap Rate, Cash Flow, Payback Period</p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  <Separator />

                  {/* Guía de Uso Paso a Paso */}
                  <div className="space-y-6">
                    <h2 className="text-3xl font-bold text-slate-900 text-center">Guía de Uso Paso a Paso</h2>

                    <div className="space-y-6">
                      {/* Paso 1 */}
                      <Card className="border-l-4 border-l-blue-500">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                              1
                            </div>
                            Explorador de Mercado: Identifica Oportunidades
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-semibold text-slate-900 mb-2">🗺️ Mapa Interactivo</h4>
                              <ul className="text-sm text-slate-700 space-y-1">
                                <li>• Explora mercados globalmente</li>
                                <li>• Identifica clusters de alto rendimiento</li>
                                <li>• Visualiza propiedades por categoría</li>
                                <li>• Compara barrios y zonas</li>
                              </ul>
                            </div>
                            <div>
                              <h4 className="font-semibold text-slate-900 mb-2">📊 Métricas del Mercado</h4>
                              <ul className="text-sm text-slate-700 space-y-1">
                                <li>• ADR promedio del mercado</li>
                                <li>• Tasa de ocupación general</li>
                                <li>• Número de propiedades activas</li>
                                <li>• Ingresos anuales estimados</li>
                              </ul>
                            </div>
                          </div>
                          <div className="bg-blue-50 p-4 rounded-lg">
                            <p className="text-sm text-blue-800">
                              <strong>💡 Tip Profesional:</strong> Busca clusters verdes en el mapa - representan zonas
                              con ADR superior a €180 y alta ocupación.
                            </p>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Paso 2 */}
                      <Card className="border-l-4 border-l-green-500">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">
                              2
                            </div>
                            Comp-Finder: Encuentra Propiedades Comparables
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-semibold text-slate-900 mb-2">🔍 Filtros Básicos</h4>
                              <ul className="text-sm text-slate-700 space-y-1">
                                <li>
                                  • <strong>Habitaciones y baños:</strong> Ajusta según tu propiedad objetivo
                                </li>
                                <li>
                                  • <strong>Tipo de propiedad:</strong> Apartamento, casa, loft, villa
                                </li>
                                <li>
                                  • <strong>Ubicación:</strong> Radio de búsqueda personalizable
                                </li>
                              </ul>
                            </div>
                            <div>
                              <h4 className="font-semibold text-slate-900 mb-2">⚡ Filtros de Fiabilidad (CRÍTICOS)</h4>
                              <ul className="text-sm text-slate-700 space-y-1">
                                <li>
                                  • <strong>Mínimo de reseñas:</strong> Recomendado &gt;50 para datos sólidos
                                </li>
                                <li>
                                  • <strong>Días rastreados:</strong> Mínimo 250 días (evita sesgos estacionales)
                                </li>
                                <li>
                                  • <strong>Actividad reciente:</strong> Última reseña &lt;90 días
                                </li>
                                <li>
                                  • <strong>Plataforma:</strong> Solo Airbnb, solo Vrbo, o ambas
                                </li>
                              </ul>
                            </div>
                          </div>
                          <div className="bg-green-50 p-4 rounded-lg">
                            <p className="text-sm text-green-800">
                              <strong>⚠️ Regla de Oro:</strong> Es mejor tener 10 comparables de alta calidad que 100 con
                              datos dudosos. Los filtros de fiabilidad son tu mejor herramienta para evitar proyecciones
                              infladas.
                            </p>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Paso 3 */}
                      <Card className="border-l-4 border-l-purple-500">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold">
                              3
                            </div>
                            Selección y Fijado de Propiedades
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                                <Pin className="w-4 h-4" />
                                Fijar Propiedades
                              </h4>
                              <p className="text-sm text-slate-700">
                                Selecciona las propiedades más relevantes para tu análisis. Puedes fijar hasta 10
                                propiedades para comparación detallada.
                              </p>
                            </div>
                            <div className="bg-green-50 p-4 rounded-lg">
                              <h4 className="font-semibold text-green-900 mb-2">📊 Comparable Base</h4>
                              <p className="text-sm text-green-800">
                                La propiedad que representa el rendimiento promedio aceptable. Tu inversión debería
                                superar este nivel mínimo.
                              </p>
                            </div>
                            <div className="bg-blue-50 p-4 rounded-lg">
                              <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                                <Target className="w-4 h-4" />
                                Comparable Objetivo
                              </h4>
                              <p className="text-sm text-blue-800">
                                La propiedad de mejor rendimiento. Representa tu potencial máximo si optimizas precios,
                                amenidades y gestión.
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Paso 4 */}
                      <Card className="border-l-4 border-l-orange-500">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold">
                              4
                            </div>
                            Workbench: Análisis Comparativo Detallado
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-3">
                            <h4 className="font-semibold text-slate-900">📋 Tabla Comparativa</h4>
                            <p className="text-sm text-slate-700">
                              Analiza lado a lado todas las propiedades que has fijado. La tabla incluye:
                            </p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                              <div className="bg-slate-50 p-2 rounded">
                                <strong>Ingresos Anuales</strong>
                                <br />
                                <span className="text-slate-600">Métrica principal de rendimiento</span>
                              </div>
                              <div className="bg-slate-50 p-2 rounded">
                                <strong>ADR (Tarifa Promedio)</strong>
                                <br />
                                <span className="text-slate-600">Precio por noche promedio</span>
                              </div>
                              <div className="bg-slate-50 p-2 rounded">
                                <strong>Tasa de Ocupación</strong>
                                <br />
                                <span className="text-slate-600">% de noches ocupadas</span>
                              </div>
                              <div className="bg-slate-50 p-2 rounded">
                                <strong>Calidad de Datos</strong>
                                <br />
                                <span className="text-slate-600">Reseñas y días rastreados</span>
                              </div>
                            </div>
                          </div>
                          <div className="bg-orange-50 p-4 rounded-lg">
                            <p className="text-sm text-orange-800">
                              <strong>🎯 Objetivo del Workbench:</strong> Posicionar tu inversión potencial dentro del
                              espectro de rendimiento. ¿Puedes alcanzar el nivel del comparable objetivo? ¿Qué necesitas
                              cambiar?
                            </p>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Paso 5 */}
                      <Card className="border-l-4 border-l-red-500">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center font-bold">
                              5
                            </div>
                            Calculadora de Inversión: ROI Basado en Datos Reales
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-semibold text-slate-900 mb-2">💰 Datos de Entrada</h4>
                              <ul className="text-sm text-slate-700 space-y-1">
                                <li>
                                  • <strong>Precio de compra:</strong> Costo total de adquisición
                                </li>
                                <li>
                                  • <strong>Gastos de compra:</strong> Notaría, impuestos, comisiones
                                </li>
                                <li>
                                  • <strong>Renovación:</strong> Mobiliario y mejoras necesarias
                                </li>
                                <li>
                                  • <strong>Gastos operativos:</strong> Limpieza, mantenimiento, gestión
                                </li>
                              </ul>
                            </div>
                            <div>
                              <h4 className="font-semibold text-slate-900 mb-2">📊 Métricas Calculadas</h4>
                              <ul className="text-sm text-slate-700 space-y-1">
                                <li>
                                  • <strong>ROI Anual:</strong> Retorno sobre inversión
                                </li>
                                <li>
                                  • <strong>Cash Flow Mensual:</strong> Flujo de caja neto
                                </li>
                                <li>
                                  • <strong>Cap Rate:</strong> Tasa de capitalización
                                </li>
                                <li>
                                  • <strong>Payback Period:</strong> Tiempo de recuperación
                                </li>
                              </ul>
                            </div>
                          </div>
                          <div className="bg-red-50 p-4 rounded-lg">
                            <p className="text-sm text-red-800">
                              <strong>🚀 Ventaja Clave:</strong> Los ingresos proyectados se importan directamente de tu
                              comparable objetivo, no de un promedio genérico. Esto te da un escenario optimista pero
                              realista.
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  <Separator />

                  {/* Casos de Uso */}
                  <div className="space-y-6">
                    <h2 className="text-3xl font-bold text-slate-900 text-center">Casos de Uso Profesionales</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                        <CardHeader>
                          <CardTitle className="text-blue-900 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5" />
                            Para Inversores Inmobiliarios
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-blue-800">
                          <div className="space-y-2">
                            <h4 className="font-semibold">🔍 Due Diligence Exhaustivo</h4>
                            <p className="text-sm">
                              Evita las trampas de proyecciones infladas. Analiza solo propiedades con historial sólido
                              y datos verificables antes de tomar decisiones de inversión.
                            </p>
                          </div>
                          <div className="space-y-2">
                            <h4 className="font-semibold">📈 Identificación de Oportunidades</h4>
                            <p className="text-sm">
                              Encuentra mercados y propiedades subestimadas comparando con los top performers de cada
                              zona. Identifica el verdadero potencial de cada inversión.
                            </p>
                          </div>
                          <div className="space-y-2">
                            <h4 className="font-semibold">💼 Presentaciones a Inversores</h4>
                            <p className="text-sm">
                              Genera reportes profesionales con datos sólidos para presentar a socios, bancos o
                              inversores. Demuestra el potencial real con comparables verificados.
                            </p>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                        <CardHeader>
                          <CardTitle className="text-green-900 flex items-center gap-2">
                            <Star className="w-5 h-5" />
                            Para Anfitriones y Gestores
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-green-800">
                          <div className="space-y-2">
                            <h4 className="font-semibold">🎯 Estrategia de Precios</h4>
                            <p className="text-sm">
                              No compitas con el promedio del mercado. Identifica a los top performers de tu zona y
                              analiza qué los hace exitosos para replicar su estrategia.
                            </p>
                          </div>
                          <div className="space-y-2">
                            <h4 className="font-semibold">🏆 Análisis Competitivo</h4>
                            <p className="text-sm">
                              Descubre quién es tu verdadera competencia de alto rendimiento. Analiza sus amenidades,
                              precios y estrategias para superarlos.
                            </p>
                          </div>
                          <div className="space-y-2">
                            <h4 className="font-semibold">📊 Optimización de Portfolio</h4>
                            <p className="text-sm">
                              Si gestionas múltiples propiedades, identifica cuáles están por debajo de su potencial y
                              qué cambios necesitas hacer para mejorar su rendimiento.
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  <Separator />

                  {/* Diferenciadores */}
                  <Card className="bg-gradient-to-r from-slate-900 to-slate-800 text-white">
                    <CardHeader>
                      <CardTitle className="text-2xl text-center">¿Por Qué RentalAnalytics Pro es Diferente?</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-red-300">❌ Herramientas Tradicionales</h3>
                          <ul className="space-y-2 text-sm text-slate-300">
                            <li>• Te dan una cifra sin explicación</li>
                            <li>• Incluyen propiedades inactivas</li>
                            <li>• Promedian datos de baja calidad</li>
                            <li>• No consideran la estacionalidad</li>
                            <li>• Estimaciones genéricas por zona</li>
                            <li>• No puedes verificar los datos</li>
                          </ul>
                        </div>
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-green-300">✅ RentalAnalytics Pro</h3>
                          <ul className="space-y-2 text-sm text-slate-300">
                            <li>• Te enseña cómo analizar los datos</li>
                            <li>• Filtros rigurosos de calidad</li>
                            <li>• Solo propiedades con historial sólido</li>
                            <li>• Mínimo 250 días de datos</li>
                            <li>• Comparables específicos y verificables</li>
                            <li>• Transparencia total en la metodología</li>
                          </ul>
                        </div>
                      </div>
                      <div className="text-center pt-4 border-t border-slate-700">
                        <p className="text-lg font-medium text-slate-200">
                          "No te damos un pez, te enseñamos a pescar en el océano de datos de Airbnb"
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* CTA */}
                  <div className="text-center space-y-4">
                    <h3 className="text-2xl font-bold text-slate-900">
                      ¿Listo para Convertirte en un Analista Experto?
                    </h3>
                    <p className="text-slate-600 max-w-2xl mx-auto">
                      Comienza explorando el mercado, identifica propiedades comparables de calidad, y toma decisiones
                      de inversión basadas en datos reales, no en estimaciones genéricas.
                    </p>
                    <div className="flex justify-center gap-4">
                      <Button
                        size="lg"
                        onClick={() => setActiveTab("explorer")}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Globe className="w-5 h-5 mr-2" />
                        Explorar Mercados
                      </Button>
                      <Button size="lg" variant="outline" onClick={() => setActiveTab("comparables")}>
                        <Search className="w-5 h-5 mr-2" />
                        Buscar Comparables
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="explorer" className="p-6 h-full">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
                  {/* Mapa Placeholder */}
                  <div className="lg:col-span-2">
                    <Card className="h-full">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Globe className="w-5 h-5" />
                          Mapa Interactivo de Mercados
                        </CardTitle>
                        <CardDescription>
                          Explora clusters de propiedades de alto rendimiento globalmente
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="h-[500px] p-0">
                        <InteractiveMap properties={properties} />
                      </CardContent>
                    </Card>
                  </div>

                  {/* Métricas del Mercado */}
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Barcelona, España</CardTitle>
                        <CardDescription>Métricas del mercado seleccionado</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-600">ADR Promedio</span>
                          <span className="font-semibold">€142</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-600">Ocupación</span>
                          <span className="font-semibold">76%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-600">Ingresos Anuales</span>
                          <span className="font-semibold">€39,500</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-600">Propiedades Activas</span>
                          <span className="font-semibold">2,847</span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Clusters de Alto Rendimiento</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                            <div>
                              <p className="font-medium text-green-900">Eixample</p>
                              <p className="text-sm text-green-700">€185 ADR • 82% Ocupación</p>
                            </div>
                            <TrendingUp className="w-5 h-5 text-green-600" />
                          </div>
                          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                            <div>
                              <p className="font-medium text-blue-900">Gràcia</p>
                              <p className="text-sm text-blue-700">€156 ADR • 79% Ocupación</p>
                            </div>
                            <TrendingUp className="w-5 h-5 text-blue-600" />
                          </div>
                          <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                            <div>
                              <p className="font-medium text-yellow-900">Born</p>
                              <p className="text-sm text-yellow-700">€134 ADR • 74% Ocupación</p>
                            </div>
                            <TrendingDown className="w-5 h-5 text-yellow-600" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="comparables" className="p-6">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900">Comp-Finder Inteligente</h2>
                      <p className="text-slate-600">Identifica propiedades comparables de alta calidad</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{properties.length} propiedades encontradas</Badge>
                      <Badge variant="secondary">{pinnedProperties.length} seleccionadas</Badge>
                    </div>
                  </div>

                  {/* Lista de Propiedades Comparables */}
                  <div className="space-y-4">
                    {properties.map((property) => (
                      <Card
                        key={property.id}
                        className={`transition-all ${property.isPinned ? "ring-2 ring-blue-500" : ""}`}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-3">
                                <h3 className="font-semibold text-slate-900">{property.address}</h3>
                                <Badge variant="outline">{property.type}</Badge>
                                {property.isBase && <Badge className="bg-green-100 text-green-800">Base</Badge>}
                                {property.isTarget && <Badge className="bg-blue-100 text-blue-800">Objetivo</Badge>}
                              </div>

                              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-4">
                                <div className="flex items-center gap-2">
                                  <Bed className="w-4 h-4 text-slate-500" />
                                  <span className="text-sm">{property.bedrooms} hab</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Bath className="w-4 h-4 text-slate-500" />
                                  <span className="text-sm">{property.bathrooms} baños</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <DollarSign className="w-4 h-4 text-slate-500" />
                                  <span className="text-sm font-medium">€{property.adr}/noche</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <TrendingUp className="w-4 h-4 text-slate-500" />
                                  <span className="text-sm">{property.occupancyRate}% ocupación</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Star className="w-4 h-4 text-yellow-500" />
                                  <span className="text-sm">
                                    {property.rating} ({property.reviews})
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Calendar className="w-4 h-4 text-slate-500" />
                                  <span className="text-sm">{property.daysTracked}d</span>
                                </div>
                              </div>

                              <div className="flex items-center gap-4 text-sm text-slate-600">
                                <div className="flex items-center gap-1">
                                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                                  <span>Última reseña: {property.lastReview}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Eye className="w-4 h-4 text-blue-500" />
                                  <span>{property.platform}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <TrendingUp className="w-4 h-4 text-green-500" />
                                  <span className="font-medium">€{property.annualRevenue.toLocaleString()}/año</span>
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-col gap-2 ml-4">
                              <Button
                                variant={property.isPinned ? "default" : "outline"}
                                size="sm"
                                onClick={() => togglePin(property.id)}
                              >
                                <Pin className="w-4 h-4 mr-1" />
                                {property.isPinned ? "Fijada" : "Fijar"}
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setAsBase(property.id)}
                                className={property.isBase ? "bg-green-50 border-green-200" : ""}
                              >
                                Base
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setAsTarget(property.id)}
                                className={property.isTarget ? "bg-blue-50 border-blue-200" : ""}
                              >
                                <Target className="w-4 h-4 mr-1" />
                                Objetivo
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="workbench" className="p-6">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">Workbench de Comparación</h2>
                    <p className="text-slate-600">Análisis cara a cara de propiedades seleccionadas</p>
                  </div>

                  {pinnedProperties.length === 0 ? (
                    <Card>
                      <CardContent className="p-12 text-center">
                        <Pin className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-slate-900 mb-2">No hay propiedades seleccionadas</h3>
                        <p className="text-slate-600 mb-4">
                          Ve al Comp-Finder y fija algunas propiedades para compararlas aquí
                        </p>
                        <Button onClick={() => setActiveTab("comparables")}>Ir al Comp-Finder</Button>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card>
                      <CardHeader>
                        <CardTitle>Tabla Comparativa</CardTitle>
                        <CardDescription>
                          Análisis detallado de {pinnedProperties.length} propiedades seleccionadas
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b">
                                <th className="text-left p-3 font-medium">Propiedad</th>
                                <th className="text-left p-3 font-medium">Tipo</th>
                                <th className="text-left p-3 font-medium">Ingresos Anuales</th>
                                <th className="text-left p-3 font-medium">ADR</th>
                                <th className="text-left p-3 font-medium">Ocupación</th>
                                <th className="text-left p-3 font-medium">Reseñas</th>
                                <th className="text-left p-3 font-medium">Días Rastreados</th>
                              </tr>
                            </thead>
                            <tbody>
                              {pinnedProperties.map((property) => (
                                <tr key={property.id} className="border-b hover:bg-slate-50">
                                  <td className="p-3">
                                    <div>
                                      <p className="font-medium">{property.address}</p>
                                      <div className="flex gap-1 mt-1">
                                        {property.isBase && (
                                          <Badge variant="secondary" className="text-xs">
                                            Base
                                          </Badge>
                                        )}
                                        {property.isTarget && (
                                          <Badge variant="secondary" className="text-xs">
                                            Objetivo
                                          </Badge>
                                        )}
                                      </div>
                                    </div>
                                  </td>
                                  <td className="p-3">{property.type}</td>
                                  <td className="p-3 font-semibold">€{property.annualRevenue.toLocaleString()}</td>
                                  <td className="p-3">€{property.adr}</td>
                                  <td className="p-3">{property.occupancyRate}%</td>
                                  <td className="p-3">{property.reviews}</td>
                                  <td className="p-3">{property.daysTracked}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="calculator" className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Calculator className="w-5 h-5" />
                        Calculadora de Inversión
                      </CardTitle>
                      <CardDescription>Basada en datos de tu comparable objetivo seleccionado</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label>Precio de Compra (€)</Label>
                        <Input type="number" placeholder="450000" className="mt-1" />
                      </div>
                      <div>
                        <Label>Gastos de Compra (€)</Label>
                        <Input type="number" placeholder="45000" className="mt-1" />
                      </div>
                      <div>
                        <Label>Renovación/Mobiliario (€)</Label>
                        <Input type="number" placeholder="25000" className="mt-1" />
                      </div>
                      <div>
                        <Label>Ingresos Anuales Proyectados</Label>
                        <div className="mt-1 p-3 bg-blue-50 rounded-lg">
                          <p className="text-sm text-blue-700">
                            {targetProperty
                              ? `€${targetProperty.annualRevenue.toLocaleString()} (basado en comparable objetivo)`
                              : "Selecciona un comparable objetivo para importar datos"}
                          </p>
                        </div>
                      </div>
                      <div>
                        <Label>Gastos Operativos Anuales (€)</Label>
                        <Input type="number" placeholder="12000" className="mt-1" />
                      </div>
                      <Button className="w-full" size="lg">
                        Calcular ROI y Cash Flow
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Resultados del Análisis</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-green-50 rounded-lg">
                          <p className="text-sm text-green-700">ROI Anual</p>
                          <p className="text-2xl font-bold text-green-900">12.4%</p>
                        </div>
                        <div className="p-4 bg-blue-50 rounded-lg">
                          <p className="text-sm text-blue-700">Cash Flow Mensual</p>
                          <p className="text-2xl font-bold text-blue-900">€2,850</p>
                        </div>
                        <div className="p-4 bg-purple-50 rounded-lg">
                          <p className="text-sm text-purple-700">Cap Rate</p>
                          <p className="text-2xl font-bold text-purple-900">8.2%</p>
                        </div>
                        <div className="p-4 bg-orange-50 rounded-lg">
                          <p className="text-sm text-orange-700">Payback</p>
                          <p className="text-2xl font-bold text-orange-900">8.1 años</p>
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <h4 className="font-medium mb-3">Escenarios de Rendimiento</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center p-2 bg-red-50 rounded">
                            <span className="text-sm">Escenario Conservador (-20%)</span>
                            <span className="font-medium text-red-700">€54,400/año</span>
                          </div>
                          <div className="flex justify-between items-center p-2 bg-yellow-50 rounded">
                            <span className="text-sm">Escenario Base (promedio)</span>
                            <span className="font-medium text-yellow-700">€68,000/año</span>
                          </div>
                          <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                            <span className="text-sm">Escenario Objetivo (+15%)</span>
                            <span className="font-medium text-green-700">€78,200/año</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
