import React from 'react'
import Image from 'next/image'
import { Search, Star, MapPin, ChevronRight } from 'lucide-react'

const services = [
    {
        name: "SOFT GLAM",
        description: "A soft base make up with a natural no eye shadow look on the eyes this look includes a soft set of lashes of your choice provided by me",
        price: 30
    },
    {
        name: "NATURAL GLAM",
        description: "A soft seamless base with bronzer on the eyes and a lip colour of your choice and a pair of lashes provided by me",
        price: 35
    },
    {
        name: "FULL GLAM",
        description: "Multiple choice shades of eyeshadow / glitter wherever and a pair of lashes provided by me",
        price: 45
    }
]

const reviews = [
    {
        id: 1,
        name: "Jane Doe",
        initial: "J",
        date: "Sat, 13 Apr 2024 at 16:21",
        rating: 5,
        comment: "Lovely environment, super friendly staff, and great products and service. Can't wait til I come back"
    },
    {
        id: 2,
        name: "John Doe",
        initial: "J",
        date: "Sat, 13 Apr 2024 at 16:21",
        rating: 5,
        comment: "Brilliant...Always brilliant!"
    }
]

const openingHours = [
    { day: "Monday", hours: "10:00 - 14:30" },
    { day: "Tuesday", hours: "10:00 - 14:30" },
    { day: "Wednesday", hours: "10:00 - 14:30" },
    { day: "Thursday", hours: "10:00 - 14:30" },
    { day: "Friday", hours: "10:00 - 14:30" },
    { day: "Saturday", hours: "10:00 - 14:30" },
    { day: "Sunday", hours: "10:00 - 14:30" },
]

const PerfectFinishz = () => {
    return (
        <div className="min-h-screen bg-pink-300">
            {/* Header */}
            <header className="flex items-center justify-between p-6">
                <div className="text-2xl font-bold">BNB</div>
                <div className="flex items-center gap-2 rounded-full bg-white p-2 pr-4">
                    <input type="text" placeholder="Location" className="ml-2 border-r border-gray-200 px-2 outline-none" />
                    <input type="text" placeholder="Date" className="border-r border-gray-200 px-2 outline-none" />
                    <input type="text" placeholder="Time" className="px-2 outline-none" />
                    <Search className="h-5 w-5 text-gray-500" />
                </div>
            </header>

            <div className="mx-auto max-w-6xl px-6">
                {/* Profile Section */}
                <div className="mb-12 grid grid-cols-12 gap-8">
                    {/* Profile Card */}
                    <div className="col-span-3">
                        <div className="rounded-3xl bg-white p-6">
                            <div className="relative mb-4 aspect-square overflow-hidden rounded-t-2xl bg-pink-200">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <h2 className="text-2xl font-bold text-pink-400">Perfect Finishz</h2>
                                </div>
                            </div>
                            <div className="mb-4 text-center">
                                <h3 className="font-semibold">Perfect Finishx ✓</h3>
                                <p className="text-sm text-gray-500">123, Manchester Dummy, Address</p>
                            </div>
                            <div className="grid grid-cols-4 gap-2">
                                {['x', '£', 'ii', '@'].map((icon, i) => (
                                    <div key={i} className="rounded-full bg-pink-100 p-3 text-center">
                                        {icon}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Gallery */}
                    <div className="col-span-9 grid grid-cols-2 gap-4">
                        <div className="relative aspect-square overflow-hidden rounded-3xl">
                            <Image
                                src="/studio-1.jpg"
                                alt="Studio"
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                <p className="text-2xl font-light text-white">Where the magic happens</p>
                            </div>
                        </div>
                        <div className="relative aspect-square overflow-hidden rounded-3xl">
                            <Image
                                src="/makeup-1.jpg"
                                alt="Makeup"
                                fill
                                className="object-cover"
                            />
                            <button className="absolute bottom-4 right-4 rounded-full bg-white/90 px-4 py-2 backdrop-blur-sm">
                                next ›
                            </button>
                        </div>
                    </div>
                </div>

                {/* Services Section */}
                <section className="mb-12">
                    <h2 className="mb-6 text-xl font-bold">Services</h2>
                    <div className="mb-6 flex gap-2">
                        <button className="rounded-full bg-white px-4 py-2 text-sm">Make Up</button>
                        <button className="rounded-full bg-white px-4 py-2 text-sm">Hairstyles</button>
                    </div>
                    <div className="space-y-4">
                        {services.map((service, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between rounded-2xl bg-white/80 p-6 backdrop-blur-sm"
                            >
                                <div>
                                    <h3 className="mb-2 font-semibold">{service.name}</h3>
                                    <p className="text-sm text-gray-600">{service.description}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-xl font-bold">£{service.price}</span>
                                    <button className="rounded-lg bg-green-100 px-4 py-1 text-green-800">
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
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star key={star} className="h-4 w-4 fill-current" />
                            ))}
                        </div>
                        <span className="text-sm text-gray-600">324 ratings · 4 star average</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        {reviews.map((review) => (
                            <div key={review.id} className="rounded-2xl bg-white p-6">
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
                    <button className="mt-6 flex items-center gap-2 rounded-full bg-white px-6 py-2">
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
    )
}

export default PerfectFinishz