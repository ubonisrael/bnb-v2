import Link from "next/link"
import Image from "next/image"
import { Search, MapPin, Star, Filter, Scissors, SpadeIcon as Spa, Paintbrush, Heart } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function MarketplacePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1>Find Beauty & Wellness Services</h1>
          <p className="text-muted-foreground">Discover and book the best beauty and wellness services in your area.</p>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <Input placeholder="Search for services, businesses, or treatments..." className="pl-10 py-6 text-base" />
        </div>
        <div className="relative sm:w-64">
          <MapPin className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <Input placeholder="Location" className="pl-10 py-6 text-base" />
        </div>
        <Button className="py-6 px-8 text-base">Search</Button>
      </div>

      <div className="mt-8">
        <Tabs defaultValue="all">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <TabsList className="mb-4 sm:mb-0">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="hair">Hair</TabsTrigger>
              <TabsTrigger value="nails">Nails</TabsTrigger>
              <TabsTrigger value="skin">Skin</TabsTrigger>
              <TabsTrigger value="massage">Massage</TabsTrigger>
              <TabsTrigger value="spa">Spa</TabsTrigger>
            </TabsList>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </div>
          <TabsContent value="all" className="mt-6">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 9 }).map((_, i) => (
                <Card key={i} className="overflow-hidden shadow-card">
                  <div className="relative">
                    <Image
                      src="/placeholder.svg"
                      alt="Salon"
                      width={400}
                      height={250}
                      className="h-48 w-full object-cover"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-2 h-8 w-8 rounded-full bg-white/80 text-muted-foreground hover:bg-white hover:text-primary"
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                    <div className="absolute bottom-2 left-2">
                      <Badge className="bg-white text-foreground">
                        {["Hair Salon", "Nail Salon", "Spa & Wellness", "Barber Shop"][i % 4]}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">
                        {
                          [
                            "Elegant Touch",
                            "Style Studio",
                            "Serenity Spa",
                            "Modern Cuts",
                            "Beauty Bar",
                            "Wellness Center",
                            "Hair Haven",
                            "Nail Artistry",
                            "Relaxation Retreat",
                          ][i % 9]
                        }
                      </h3>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-primary text-primary" />
                        <span className="text-sm font-medium">{(4 + (i % 10) / 10).toFixed(1)}</span>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      {
                        [
                          "New York",
                          "Los Angeles",
                          "Chicago",
                          "Miami",
                          "San Francisco",
                          "Seattle",
                          "Boston",
                          "Austin",
                          "Denver",
                        ][i % 9]
                      }
                    </div>
                    <div className="mt-4">
                      <div className="flex flex-wrap gap-2">
                        {[
                          { icon: Scissors, label: "Haircut" },
                          { icon: Paintbrush, label: "Coloring" },
                          { icon: Spa, label: "Treatments" },
                        ].map((service, j) => (
                          <Badge key={j} variant="outline" className="flex items-center gap-1 py-1">
                            <service.icon className="h-3 w-3" />
                            {service.label}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t p-4">
                    <Button asChild className="w-full">
                      <Link href={`/marketplace/business/${i}`}>View & Book</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="hair" className="mt-6">
            {/* Similar grid for hair services */}
          </TabsContent>
          <TabsContent value="nails" className="mt-6">
            {/* Similar grid for nail services */}
          </TabsContent>
          <TabsContent value="skin" className="mt-6">
            {/* Similar grid for skin services */}
          </TabsContent>
          <TabsContent value="massage" className="mt-6">
            {/* Similar grid for massage services */}
          </TabsContent>
          <TabsContent value="spa" className="mt-6">
            {/* Similar grid for spa services */}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

