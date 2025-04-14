import React from 'react'
import Image from 'next/image'
import { Search, Star, Clock, MapPin, ChevronRight } from 'lucide-react'

const services = [
    {
        name: "Braids/single plaits (no extensions)",
        description: "a long-lasting protective style lifestyle partings instead of box partings are available upon request",
        price: 30
    },
    {
        name: "Cornrows into Twists/Braids",
        description: "this is a twist on basic flat braids a great way to keep hair out of your face but still have the 'hang time' of braids/twists.",
        price: 35
    },
    {
        name: "Twists w/o extensions",
        description: "twist size is determined by the size of the individual sections/partings. clients can request the use of extension to match their natural ...",
        price: 45
    }
]

const reviews = [
    {
        id: 1,
        name: "John Doe",
        initial: "J",
        date: "Sat, 13 Apr 2024 at 16:21",
        rating: 5,
        comment: "Brilliant...Always brilliant!"
    },
    {
        id: 2,
        name: "Jane Doe",
        initial: "J",
        date: "Sat, 13 Apr 2024 at 16:21",
        rating: 5,
        comment: "Lovely environment, super friendly staff, and great products and service. Can't wait til I come back"
    }
]

const openingHours = [
    { day: "Monday", hours: "10:00 - 14:30" },
    { day: "Tuesday", hours: "10:00 - 14:30" },
    { day: "Wednesday", hours: "10:00 - 14:30" },
    { day: "Thursday", hours: "10:00 - 14:30" },
    { day: "Friday", hours: "10:00 - 14:30" },
    { day: "Saturday", hours: "10:00 - 14:30" }
]

const HairBySharon = () => {
    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <header className="flex items-center justify-between p-6">
                <div className="text-2xl font-serif">Hairbyshxron</div>
                <div className="flex items-center gap-2 rounded-full bg-gray-100 p-2 pr-4">
                    <input type="text" placeholder="Location" className="ml-2 border-r border-gray-200 bg-transparent px-2 outline-none" />
                    <input type="text" placeholder="Date" className="border-r border-gray-200 bg-transparent px-2 outline-none" />
                    <input type="text" placeholder="Time" className="bg-transparent px-2 outline-none" />
                    <Search className="h-5 w-5 text-gray-500" />
                </div>
            </header>

            {/* Gallery */}
            <div className="mb-12 flex gap-4 overflow-x-auto px-6">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="relative h-64 w-80 flex-shrink-0 overflow-hidden rounded-3xl">
                        <Image
                            src={`/hair-${i}.jpg`}
                            alt={`Gallery ${i}`}
                            fill
                            className="object-cover"
                        />
                    </div>
                ))}
            </div>

            <div className="mx-auto max-w-7xl px-6">
                <div className="grid grid-cols-12 gap-8">
                    {/* Profile Card */}
                    <div className="col-span-3">
                        <div className="rounded-3xl bg-white p-6 shadow-card">
                            <div className="mb-4">
                                <h2 className="flex items-center gap-2 text-xl font-bold">
                                    Hairbyshxron
                                    <span className="text-blue-500">•</span>
                                </h2>
                                <div className="flex items-center gap-1">
                                    <div className="flex text-yellow-400">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star key={star} className="h-4 w-4 fill-current" />
                                        ))}
                                    </div>
                                    <span className="text-sm text-gray-500">(107)</span>
                                </div>
                            </div>

                            <button className="mb-4 w-full rounded-lg bg-black py-3 text-white">
                                Book Now
                            </button>

                            <div className="space-y-2 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4" />
                                    <span>Opened now</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4" />
                                    <span>123, Manchester Dummy, Address</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Services Section */}
                    <div className="col-span-9">
                        <section className="mb-12">
                            <h2 className="mb-6 text-xl font-bold">Services</h2>
                            <div className="mb-6 flex gap-2">
                                <button className="rounded-full bg-gray-100 px-4 py-2 text-sm">Make Up</button>
                                <button className="rounded-full bg-gray-100 px-4 py-2 text-sm">Locs</button>
                            </div>
                            <div className="space-y-4">
                                {services.map((service, index) => (
                                    <div
                                        key={index}
                                        className="flex items-start justify-between rounded-2xl border border-gray-200 p-6"
                                    >
                                        <div>
                                            <h3 className="mb-2 font-semibold">{service.name}</h3>
                                            <p className="text-sm text-gray-600">{service.description}</p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="text-xl font-bold">£{service.price}</span>
                                            <button className="rounded-lg bg-black px-4 py-1 text-white">
                                                Book
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Reviews Section */}
                        <section className="mb-12">
                            <h2 className="mb-6 text-xl font-bold">Reviews</h2>
                            <div className="mb-4 flex items-center gap-2">
                                <div className="flex text-yellow-400">
                                    {[1, 2, 3, 4].map((star) => (
                                        <Star key={star} className="h-4 w-4 fill-current" />
                                    ))}
                                    <Star className="h-4 w-4" />
                                </div>
                                <span className="text-sm text-gray-600">324 ratings · 4 star average</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                {reviews.map((review) => (
                                    <div key={review.id} className="rounded-2xl bg-gray-100 p-6">
                                        <div className="mb-4 flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white">
                                                {review.initial}
                                            </div>
                                            <div>
                                                <p className="font-medium">{review.name}</p>
                                                <p className="text-sm text-gray-500">{review.date}</p>
                                            </div>
                                        </div>
                                        <div className="mb-2 flex text-yellow-400">
                                            {Array.from({ length: review.rating }).map((_, i) => (
                                                <Star key={i} className="h-4 w-4 fill-current" />
                                            ))}
                                        </div>
                                        <p className="text-sm text-gray-600">{review.comment}</p>
                                    </div>
                                ))}
                            </div>
                            <button className="mt-6 flex items-center gap-2 rounded-full bg-gray-100 px-6 py-2">
                                More
                                <ChevronRight className="h-4 w-4" />
                            </button>
                        </section>

                        {/* About & Opening Hours */}
                        <div className="grid grid-cols-2 gap-8">
                            <section>
                                <h2 className="mb-6 text-xl font-bold">About</h2>
                                <p className="mb-8 text-gray-600">
                                    Lorem ipsum dolor sit amet consectetur. Risus dis libero urna nec. Hendrerit nunc cursus amet pellentesque est auctor semper. Sit societas convallis varius tincidunt pellentesque ultrices ornare tellus sit.
                                </p>
                                <h2 className="mb-6 text-xl font-bold">Opening Hours</h2>
                                <div className="space-y-2">
                                    {openingHours.map((item, index) => (
                                        <div key={index} className="flex justify-between">
                                            <span className="font-medium">{item.day}</span>
                                            <span className="text-gray-600">{item.hours}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                            <section>
                                <div className="h-full overflow-hidden rounded-3xl">
                                    <iframe
                                        src="https://www.google.com/maps/embed?pb=your-map-embed-url"
                                        width="100%"
                                        height="100%"
                                        style={{ border: 0 }}
                                        allowFullScreen
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                    ></iframe>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HairBySharon