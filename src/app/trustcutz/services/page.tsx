import React from 'react'
import Image from 'next/image'
import { Star } from 'lucide-react'

const services = [
    {
        id: 1,
        name: "Haircut & Beard",
        duration: "30 mins - 1 hour",
        price: 20,
        description: "Lorem ipsum dolor sit amet consectetur. Nullam felis lectus pellentesque placerat. Rutrum lobortis eu pretium purus urna sollicitudin mi in consequat. Tristique"
    },
    {
        id: 2,
        name: "Haircut & Beard",
        duration: "30 mins - 1 hour",
        price: 20,
        description: "Lorem ipsum dolor sit amet consectetur. Nullam felis lectus pellentesque placerat. Rutrum lobortis eu pretium purus urna sollicitudin mi in consequat. Tristique"
    },
    {
        id: 3,
        name: "Haircut & Beard",
        duration: "30 mins - 1 hour",
        price: 20,
        description: "Lorem ipsum dolor sit amet consectetur. Nullam felis lectus pellentesque placerat. Rutrum lobortis eu pretium purus urna sollicitudin mi in consequat. Tristique"
    },
    {
        id: 4,
        name: "Haircut & Beard",
        duration: "30 mins - 1 hour",
        price: 20,
        description: "Lorem ipsum dolor sit amet consectetur. Nullam felis lectus pellentesque placerat. Rutrum lobortis eu pretium purus urna sollicitudin mi in consequat. Tristique"
    },
    {
        id: 5,
        name: "Haircut & Beard",
        duration: "30 mins - 1 hour",
        price: 20,
        description: "Lorem ipsum dolor sit amet consectetur. Nullam felis lectus pellentesque placerat. Rutrum lobortis eu pretium purus urna sollicitudin mi in consequat. Tristique"
    },
    {
        id: 6,
        name: "Haircut & Beard",
        duration: "30 mins - 1 hour",
        price: 20,
        description: "Lorem ipsum dolor sit amet consectetur. Nullam felis lectus pellentesque placerat. Rutrum lobortis eu pretium purus urna sollicitudin mi in consequat. Tristique"
    },
    {
        id: 7,
        name: "Haircut & Beard",
        duration: "30 mins - 1 hour",
        price: 20,
        description: "Lorem ipsum dolor sit amet consectetur. Nullam felis lectus pellentesque placerat. Rutrum lobortis eu pretium purus urna sollicitudin mi in consequat. Tristique"
    },
]

const ServicesPage = () => {
    return (
        <div className="min-h-screen bg-white p-6">
            {/* Navigation Steps */}
            <div className="mb-8 flex items-center gap-2 text-sm text-gray-600">
                <span className="font-medium text-black">Service</span>
                <span>›</span>
                <span>Time</span>
                <span>›</span>
                <span>Confirm</span>
            </div>

            <div className="flex gap-8">
                {/* Services Selection */}
                <div className="flex-1">
                    <h1 className="mb-6 text-2xl font-bold">Select Services</h1>

                    {/* Categories */}
                    <div className="mb-6 flex gap-2">
                        <button className="rounded-full bg-gray-200 px-4 py-2 text-sm">
                            Categories +
                        </button>
                        <button className="rounded-full bg-gray-200 px-4 py-2 text-sm">
                            Categories +
                        </button>
                    </div>

                    {/* Services List */}
                    <div className="space-y-4">
                        {services.map((service) => (
                            <div
                                key={service.id}
                                className="flex items-start justify-between rounded-lg border border-gray-200 p-4"
                            >
                                <div className="flex-1">
                                    <div className="mb-1 flex items-center gap-2">
                                        <h3 className="font-semibold">{service.name}</h3>
                                        <span className="text-sm text-gray-500">{service.duration}</span>
                                    </div>
                                    <p className="text-sm text-gray-600">{service.description}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-xl font-bold">£{service.price}</span>
                                    <button className="rounded-lg bg-blue-600 p-2 text-white">
                                        +
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Profile Card */}
                <div className="w-[400px]">
                    <div className="overflow-hidden rounded-3xl bg-gray-100">
                        {/* Profile Header */}
                        <div className="relative">
                            <Image
                                src="/gallery-1.jpg"
                                alt="Profile background"
                                width={400}
                                height={300}
                                className="h-[300px] w-full object-cover"
                            />

                            {/* Profile Info Overlay */}
                            <div className="absolute left-4 right-4 top-4 flex items-center gap-4 rounded-2xl bg-white/90 p-4 backdrop-blur-sm">
                                <Image
                                    src="/logo.png"
                                    alt="Trust Cutz Logo"
                                    width={48}
                                    height={48}
                                    className="rounded-lg"
                                />
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-bold">Trust Cutz</h3>
                                        <span className="text-blue-600">✓</span>
                                    </div>
                                    <button className="rounded-lg bg-blue-600 px-4 py-1 text-sm text-white">
                                        Profile ›
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Gallery Grid */}
                        <div className="grid grid-cols-2 gap-2 p-2">
                            <Image
                                src="/gallery-2.jpg"
                                alt="Gallery 2"
                                width={200}
                                height={200}
                                className="rounded-lg"
                            />
                            <Image
                                src="/gallery-3.jpg"
                                alt="Gallery 3"
                                width={200}
                                height={200}
                                className="rounded-lg"
                            />
                            <Image
                                src="/gallery-4.jpg"
                                alt="Gallery 4"
                                width={200}
                                height={200}
                                className="rounded-lg"
                            />
                            <Image
                                src="/gallery-5.jpg"
                                alt="Gallery 5"
                                width={200}
                                height={200}
                                className="rounded-lg"
                            />
                        </div>

                        {/* Rating */}
                        <div className="flex items-center gap-2 p-4">
                            <div className="flex text-yellow-400">
                                {[1, 2, 3, 4].map((star) => (
                                    <Star key={star} className="h-4 w-4 fill-current" />
                                ))}
                            </div>
                            <span className="font-bold">4.0</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ServicesPage