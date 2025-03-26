import React from 'react'
import Image from 'next/image'
import { Clock } from 'lucide-react'

const services = [
    {
        id: 1,
        name: "Haircut & Beard",
        duration: "30 mins - 1 hour",
        price: 20,
        description: "Lorem ipsum dolor sit amet consectetur. Natum felix sectur pellentesque porttitor. Rutrum duis te ut quidem dolor una sollicitudin mi ut consequat. Tristique"
    },
    // Add more services as needed
]

const openingHours = [
    { day: "Monday", hours: "10:00 - 14:30" },
    { day: "Tuesday", hours: "10:00 - 14:30" },
    { day: "Wednesday", hours: "10:00 - 14:30" },
    { day: "Thursday", hours: "10:00 - 14:30" },
    { day: "Friday", hours: "10:00 - 14:30" },
    { day: "Saturday", hours: "10:00 - 14:30" },
]

const TrustCutz = () => {
    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="relative h-screen">
                <div className="absolute inset-0">
                    <Image
                        src="/hero-image.jpg"
                        alt="Trust Cutz Barber"
                        fill
                        className="object-cover brightness-75"
                    />
                </div>
                <div className="relative z-10 flex h-full flex-col items-center justify-center text-white">
                    <div className="animate-fade-up text-center">
                        <h1 className="mb-4 text-6xl font-bold">
                            <span className="text-3xl font-light">welcome to</span>
                            <br />
                            TRUST CUTZ
                        </h1>
                        <div className="mx-auto mt-8 flex gap-4">
                            <button className="rounded-full bg-white px-8 py-3 text-black transition hover:bg-opacity-90">
                                Services
                            </button>
                            <button className="rounded-full border-2 border-white px-8 py-3 transition hover:bg-white hover:text-black">
                                Book
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section className="py-16">
                <div className="container">
                    <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-2">
                        {/* Welcome Card */}
                        <div className="rounded-lg bg-white p-6 shadow-card">
                            <div className="mb-4 flex items-center gap-4">
                                <h2 className="text-2xl font-bold">Welcome to Trust Cutz</h2>
                                <Image src="/uk-flag.png" alt="UK Flag" width={40} height={25} />
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                {[1, 2, 3, 4, 5, 6].map((i) => (
                                    <div key={i} className="aspect-square overflow-hidden rounded-lg">
                                        <Image
                                            src={`/gallery-${i}.jpg`}
                                            alt={`Gallery ${i}`}
                                            width={200}
                                            height={200}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                ))}
                            </div>
                            <button className="mt-4 w-full rounded-lg bg-black py-3 text-white">
                                Book now
                            </button>
                        </div>

                        {/* Business Info */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-full bg-black">
                                    <Image src="/logo.png" alt="Trust Cutz" width={48} height={48} />
                                </div>
                                <div>
                                    <h3 className="font-bold">Trust Cutz</h3>
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4].map((star) => (
                                            <span key={star} className="text-yellow-400">★</span>
                                        ))}
                                        <span className="text-gray-400">★</span>
                                        <span className="ml-2 text-sm text-gray-600">4 star average</span>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-lg bg-white p-4 shadow-card">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=your-map-embed-url"
                                    width="100%"
                                    height="200"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                ></iframe>
                                <p className="mt-2 text-sm text-gray-600">
                                    123 Manchester Dummy, Address AB12 3CD
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Services List */}
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold">Services</h2>
                        <div className="grid gap-4">
                            {services.map((service) => (
                                <div
                                    key={service.id}
                                    className="flex items-center justify-between rounded-lg bg-white p-6 shadow-card"
                                >
                                    <div>
                                        <h3 className="font-bold">{service.name}</h3>
                                        <p className="mt-1 text-sm text-gray-600">{service.description}</p>
                                        <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                                            <Clock className="h-4 w-4" />
                                            {service.duration}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-xl font-bold">£{service.price}</span>
                                        <button className="rounded-full bg-blue-600 p-2 text-white">
                                            +
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section className="bg-gray-50 py-16">
                <div className="container">
                    <h2 className="mb-6 text-2xl font-bold">About</h2>
                    <p className="text-gray-600">
                        Lorem ipsum dolor sit amet consectetur. Risus dis libero urna nec. Hendrerit nunc cursus amet pellentesque est auctor semper. Sit societas convallis varius tincidunt pellentesque ultrices ornare tellus sit. Ut integer mattis mi odio magna sed egestas. Purus tempor tristique id sem. Pulvinar nec faucibus nunc id vestibulum nullam dictum consequat nec ut.
                    </p>

                    <h2 className="mb-6 mt-12 text-2xl font-bold">Opening Hours</h2>
                    <div className="space-y-2">
                        {openingHours.map((item) => (
                            <div key={item.day} className="flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-black"></span>
                                <span className="w-32 font-medium">{item.day}</span>
                                <span className="text-gray-600">{item.hours}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}

export default TrustCutz