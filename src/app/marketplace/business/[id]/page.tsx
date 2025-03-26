"use client"

import { useState } from "react"
import Image from "next/image"
import { MapPin, Phone, Clock, Star, ChevronLeft, Heart, Share, MessageCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function BusinessPage({ params }: { params: { id: string } }) {
  const [date, setDate] = useState<Date | undefined>(new Date())

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Button variant="ghost" className="mb-4 gap-1">
        <ChevronLeft className="h-4 w-4" />
        Back to search
      </Button>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="relative mb-6 h-64 overflow-hidden rounded-lg sm:h-80 md:h-96">
            <Image src="/placeholder.svg" alt="Salon" fill className="object-cover" />
            <div className="absolute bottom-4 right-4 flex gap-2">
              <Button variant="secondary" size="sm" className="gap-1">
                <Share className="h-4 w-4" />
                Share
              </Button>
              <Button variant="secondary" size="sm" className="gap-1">
                <Heart className="h-4 w-4" />
                Save
              </Button>
            </div>
          </div>

          <div className="mb-6">
            <h1 className="text-3xl font-bold">Elegant Touch Salon & Spa</h1>
            <div className="mt-2 flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-1">
                <Star className="h-5 w-5 fill-primary text-primary" />
                <span className="font-medium">4.8</span>
                <span className="text-muted-foreground">(245 reviews)</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <MapPin className="h-5 w-5" />
                123 Main St, New York, NY 10001
              </div>
            </div>
          </div>

          <Tabs defaultValue="about">
            <TabsList className="mb-6">
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="services">Services</TabsTrigger>
              <TabsTrigger value="staff">Staff</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>

            <TabsContent value="about" className="space-y-6">
              <Card className="shadow-card">
                <CardContent className="p-6">
                  <h3 className="mb-4 text-xl font-semibold">About Elegant Touch</h3>
                  <p className="text-muted-foreground">
                    Elegant Touch Salon & Spa is a premier beauty destination offering a wide range of services to help
                    you look and feel your best. Our team of experienced professionals is dedicated to providing
                    exceptional service in a relaxing and welcoming environment.
                  </p>
                  <div className="mt-6 grid gap-4 sm:grid-cols-3">
                    <div className="flex items-start gap-2">
                      <Clock className="mt-0.5 h-5 w-5 text-muted-foreground" />
                      <div>
                        <h4 className="font-medium">Business Hours</h4>
                        <p className="text-sm text-muted-foreground">
                          Mon-Fri: 9:00 AM - 7:00 PM
                          <br />
                          Sat: 9:00 AM - 6:00 PM
                          <br />
                          Sun: 10:00 AM - 4:00 PM
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Phone className="mt-0.5 h-5 w-5 text-muted-foreground" />
                      <div>
                        <h4 className="font-medium">Contact</h4>
                        <p className="text-sm text-muted-foreground">
                          (555) 123-4567
                          <br />
                          info@eleganttouch.com
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="mt-0.5 h-5 w-5 text-muted-foreground" />
                      <div>
                        <h4 className="font-medium">Location</h4>
                        <p className="text-sm text-muted-foreground">
                          123 Main Street
                          <br />
                          New York, NY 10001
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardContent className="p-6">
                  <h3 className="mb-4 text-xl font-semibold">Photo Gallery</h3>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div key={i} className="relative aspect-square overflow-hidden rounded-md">
                        <Image
                          src="/placeholder.svg"
                          alt={`Salon image ${i + 1}`}
                          fill
                          className="object-cover transition-transform hover:scale-105"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="services" className="space-y-6">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Our Services</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="mb-4 text-lg font-semibold">Hair Services</h3>
                      <div className="space-y-4">
                        {[
                          { name: "Women's Haircut & Style", price: "$65", duration: "60 min" },
                          { name: "Men's Haircut", price: "$45", duration: "45 min" },
                          { name: "Blow Dry & Style", price: "$50", duration: "45 min" },
                          { name: "Hair Coloring", price: "$120+", duration: "120 min" },
                          { name: "Highlights", price: "$150+", duration: "150 min" },
                        ].map((service, i) => (
                          <div key={i} className="flex items-center justify-between rounded-lg border p-4">
                            <div>
                              <div className="font-medium">{service.name}</div>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Clock className="h-4 w-4" />
                                {service.duration}
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="text-lg font-semibold">{service.price}</div>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button>Book</Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                  <DialogHeader>
                                    <DialogTitle>Book Appointment</DialogTitle>
                                    <DialogDescription>
                                      Select a date and time for your {service.name}
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="grid gap-4 py-4">
                                    <CalendarComponent
                                      mode="single"
                                      selected={date}
                                      onSelect={setDate}
                                      className="rounded-md border"
                                    />
                                    <Select>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select time" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="9:00">9:00 AM</SelectItem>
                                        <SelectItem value="10:00">10:00 AM</SelectItem>
                                        <SelectItem value="11:00">11:00 AM</SelectItem>
                                        <SelectItem value="12:00">12:00 PM</SelectItem>
                                        <SelectItem value="13:00">1:00 PM</SelectItem>
                                        <SelectItem value="14:00">2:00 PM</SelectItem>
                                        <SelectItem value="15:00">3:00 PM</SelectItem>
                                        <SelectItem value="16:00">4:00 PM</SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <Select>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select stylist" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="emma">Emma Johnson</SelectItem>
                                        <SelectItem value="michael">Michael Smith</SelectItem>
                                        <SelectItem value="sophia">Sophia Lee</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <DialogFooter>
                                    <Button type="submit">Confirm Booking</Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="mb-4 text-lg font-semibold">Nail Services</h3>
                      <div className="space-y-4">
                        {[
                          { name: "Manicure", price: "$40", duration: "45 min" },
                          { name: "Pedicure", price: "$55", duration: "60 min" },
                          { name: "Gel Manicure", price: "$60", duration: "60 min" },
                          { name: "Nail Art", price: "$15+", duration: "30 min" },
                        ].map((service, i) => (
                          <div key={i} className="flex items-center justify-between rounded-lg border p-4">
                            <div>
                              <div className="font-medium">{service.name}</div>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Clock className="h-4 w-4" />
                                {service.duration}
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="text-lg font-semibold">{service.price}</div>
                              <Button>Book</Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="staff" className="space-y-6">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Our Team</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {[
                      {
                        name: "Emma Johnson",
                        role: "Senior Hair Stylist",
                        bio: "With over 10 years of experience, Emma specializes in cutting-edge haircuts and color techniques.",
                      },
                      {
                        name: "Michael Smith",
                        role: "Barber",
                        bio: "Michael is known for his precision cuts and traditional barbering techniques with a modern twist.",
                      },
                      {
                        name: "Sophia Lee",
                        role: "Nail Technician",
                        bio: "Sophia creates stunning nail art and provides meticulous nail care services.",
                      },
                      {
                        name: "David Wilson",
                        role: "Massage Therapist",
                        bio: "David is certified in multiple massage techniques to help you relax and rejuvenate.",
                      },
                      {
                        name: "Olivia Brown",
                        role: "Esthetician",
                        bio: "Olivia is passionate about skincare and helping clients achieve their best skin.",
                      },
                      {
                        name: "James Taylor",
                        role: "Hair Colorist",
                        bio: "James is a color specialist known for creating beautiful, natural-looking hair color.",
                      },
                    ].map((staff, i) => (
                      <Card key={i} className="overflow-hidden shadow-card">
                        <div className="relative h-64">
                          <Image src="/placeholder.svg" alt={staff.name} fill className="object-cover" />
                        </div>
                        <CardContent className="p-4">
                          <h3 className="text-lg font-semibold">{staff.name}</h3>
                          <Badge variant="outline" className="mb-2 mt-1">
                            {staff.role}
                          </Badge>
                          <p className="text-sm text-muted-foreground">{staff.bio}</p>
                          <Button className="mt-4 w-full">Book with {staff.name.split(" ")[0]}</Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="space-y-6">
              <Card className="shadow-card">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Customer Reviews</CardTitle>
                  <div className="flex items-center gap-2">
                    <div className="text-2xl font-bold">4.8</div>
                    <div className="flex">
                      {Array(5)
                        .fill(null)
                        .map((_, i) => (
                          <Star
                            key={i}
                            className={`h-5 w-5 ${i < 4 ? "fill-primary text-primary" : "fill-muted text-muted-foreground"}`}
                          />
                        ))}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {[
                      {
                        name: "Sarah M.",
                        date: "2 weeks ago",
                        rating: 5,
                        comment:
                          "Absolutely loved my experience at Elegant Touch! Emma did an amazing job with my hair color and the atmosphere was so relaxing. Will definitely be back!",
                      },
                      {
                        name: "John D.",
                        date: "1 month ago",
                        rating: 4,
                        comment:
                          "Great service and professional staff. Michael gave me one of the best haircuts I've had. The only reason for 4 stars is that I had to wait a bit past my appointment time.",
                      },
                      {
                        name: "Rebecca L.",
                        date: "3 weeks ago",
                        rating: 5,
                        comment:
                          "Sophia did my nails and they look absolutely stunning! The salon is clean, modern, and everyone is so friendly. Highly recommend!",
                      },
                      {
                        name: "Thomas W.",
                        date: "2 months ago",
                        rating: 5,
                        comment:
                          "Had a fantastic massage with David. The whole experience from booking to checkout was seamless. This is now my go-to place for relaxation.",
                      },
                    ].map((review, i) => (
                      <div key={i} className="rounded-lg border p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src="/placeholder.svg" alt={review.name} />
                              <AvatarFallback>{review.name[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{review.name}</div>
                              <div className="text-xs text-muted-foreground">{review.date}</div>
                            </div>
                          </div>
                          <div className="flex">
                            {Array(5)
                              .fill(null)
                              .map((_, j) => (
                                <Star
                                  key={j}
                                  className={`h-4 w-4 ${j < review.rating ? "fill-primary text-primary" : "fill-muted text-muted-foreground"}`}
                                />
                              ))}
                          </div>
                        </div>
                        <p className="mt-3 text-sm text-muted-foreground">{review.comment}</p>
                      </div>
                    ))}
                    <Button variant="outline" className="w-full">
                      Load More Reviews
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <Card className="sticky top-6 shadow-card">
            <CardHeader>
              <CardTitle>Book an Appointment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <CalendarComponent mode="single" selected={date} onSelect={setDate} className="rounded-md border" />
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select service" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="haircut">Haircut & Style</SelectItem>
                  <SelectItem value="color">Hair Coloring</SelectItem>
                  <SelectItem value="manicure">Manicure</SelectItem>
                  <SelectItem value="pedicure">Pedicure</SelectItem>
                  <SelectItem value="facial">Facial Treatment</SelectItem>
                  <SelectItem value="massage">Massage</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="9:00">9:00 AM</SelectItem>
                  <SelectItem value="10:00">10:00 AM</SelectItem>
                  <SelectItem value="11:00">11:00 AM</SelectItem>
                  <SelectItem value="12:00">12:00 PM</SelectItem>
                  <SelectItem value="13:00">1:00 PM</SelectItem>
                  <SelectItem value="14:00">2:00 PM</SelectItem>
                  <SelectItem value="15:00">3:00 PM</SelectItem>
                  <SelectItem value="16:00">4:00 PM</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select staff member (Optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any Available</SelectItem>
                  <SelectItem value="emma">Emma Johnson</SelectItem>
                  <SelectItem value="michael">Michael Smith</SelectItem>
                  <SelectItem value="sophia">Sophia Lee</SelectItem>
                  <SelectItem value="david">David Wilson</SelectItem>
                </SelectContent>
              </Select>
              <Button className="w-full">Book Now</Button>
              <div className="flex items-center justify-center gap-4 pt-2">
                <Button variant="outline" size="sm" className="gap-1">
                  <MessageCircle className="h-4 w-4" />
                  Chat
                </Button>
                <Button variant="outline" size="sm" className="gap-1">
                  <Phone className="h-4 w-4" />
                  Call
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

