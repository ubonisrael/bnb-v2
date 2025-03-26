import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Star, ChevronRight, MapPin } from 'lucide-react'

const services = [
    {
        name: "Low taper",
        duration: "30 mins - 1 hour",
        description: "Lorem ipsum dolor sit amet consectetur. Vulputat tot aliquam enim nisi urna quis consectetur habitasse. Elementum purus et faucibus tellus nec. Ut integer mattis mi odio magna sed egestas. Purus tempor tristique in est. Pulvinar sed faucibus nunc ut vestibulum ultricies.",
        price: 40
    },
    {
        name: "Low taper",
        duration: "30 mins - 1 hour",
        description: "Lorem ipsum dolor sit amet consectetur. Vulputat tot aliquam enim nisi urna quis consectetur habitasse. Elementum purus et faucibus tellus nec. Ut integer mattis mi odio magna sed egestas. Purus tempor tristique in est. Pulvinar sed faucibus nunc ut vestibulum ultricies.",
        price: 40
    },
    {
        name: "Low taper",
        duration: "30 mins - 1 hour",
        description: "Lorem ipsum dolor sit amet consectetur. Vulputat tot aliquam enim nisi urna quis consectetur habitasse. Elementum purus et faucibus tellus nec. Ut integer mattis mi odio magna sed egestas. Purus tempor tristique in est. Pulvinar sed faucibus nunc ut vestibulum ultricies.",
        price: 40
    },
    {
        name: "Low taper",
        duration: "30 mins - 1 hour",
        description: "Lorem ipsum dolor sit amet consectetur. Vulputat tot aliquam enim nisi urna quis consectetur habitasse. Elementum purus et faucibus tellus nec. Ut integer mattis mi odio magna sed egestas. Purus tempor tristique in est. Pulvinar sed faucibus nunc ut vestibulum ultricies.",
        price: 40
    },
    {
        name: "Low taper",
        duration: "30 mins - 1 hour",
        description: "Lorem ipsum dolor sit amet consectetur. Vulputat tot aliquam enim nisi urna quis consectetur habitasse. Elementum purus et faucibus tellus nec. Ut integer mattis mi odio magna sed egestas. Purus tempor tristique in est. Pulvinar sed faucibus nunc ut vestibulum ultricies.",
        price: 40
    }
]

const reviews = [
    {
        id: 1,
        name: "John Doe",
        initial: "J",
        date: "Sat, 13 Apr 2024 at 16:21",
        rating: 5,
        comment: "Different Set game......Elite"
    },
    {
        id: 2,
        name: "Jane Doe",
        initial: "J",
        date: "Sat, 13 Apr 2024 at 16:21",
        rating: 4,
        comment: "Lorem ipsum dolor sit amet consectetur. Nec ut amet mi pellentesque ultrices sociis posuere dictumst ut tristique viverra faucibus morbi."
    },
    {
        id: 3,
        name: "Jane Doe",
        initial: "J",
        date: "Sat, 13 Apr 2024 at 16:21",
        rating: 5,
        comment: "Lorem ipsum dolor sit amet consectetur. Nec ut amet mi pellentesque ultrices sociis posuere dictumst ut tristique viverra faucibus morbi."
    },
    {
        id: 4,
        name: "John Doe",
        initial: "J",
        date: "Sat, 13 Apr 2024 at 16:21",
        rating: 4,
        comment: "Different Set game......Elite"
    }
]

const openingHours = [
    { day: "Monday", hours: "10:00-14:30" },
    { day: "Tuesday", hours: "10:00-14:30" },
    { day: "Wednesday", hours: "10:00-14:30" },
    { day: "Thursday", hours: "10:00-14:30" },
    { day: "Friday", hours: "10:00-14:30" },
    { day: "Saturday", hours: "10:00-14:30" }
]

const KTrimz = () => {
    return (
        <div className="min-h-screen bg-black text-white">
            {/* Header */}
            <header className="relative flex items-center justify-between p-6">
                <div className="z-10">
                    <Image src="/ktrimz-logo.png" alt="KS Trimz" width={80} height={40} />
                    <p className="mt-1 text-sm text-gray-400">Since 2021</p>
                </div>
                <Link
                    href="/book"
                    className="z-10 rounded-full bg-white px-6 py-2 text-sm font-medium text-black transition-colors hover:bg-gray-100"
                >
                    Book
                </Link>
            </header>

            {/* Hero Section */}
            <section className="relative min-h-[80vh] px-6 pb-20 pt-12">
                <div className="relative z-10">
                    <p className="mb-4 font-serif text-lg italic text-green-400">Style & Pattern</p>
                    <h1 className="mb-8 text-5xl font-bold">
                        Private Barber based in
                        <br />
                        <span className="font-serif text-green-400">SOUTH YORKSHIRE</span>
                    </h1>
                    <div className="flex gap-4">
                        <Link
                            href="#pricing"
                            className="flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 transition-colors hover:bg-white/10"
                        >
                            Pricing
                            <ChevronRight className="h-4 w-4" />
                        </Link>
                        <Link
                            href="#recent"
                            className="flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 transition-colors hover:bg-white/10"
                        >
                            Recent Work
                            <ChevronRight className="h-4 w-4" />
                        </Link>
                    </div>
                </div>
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/hero-bg.jpg"
                        alt="Background"
                        fill
                        className="object-cover opacity-50"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black" />
                </div>
            </section>

            {/* Recent Work */}
            <section className="relative mb-20">
                <div className="absolute -left-20 top-1/2 -rotate-90 transform">
                    <h2 className="text-xl font-bold">RECENT WORK</h2>
                </div>
                <div className="flex gap-4 overflow-x-auto px-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="relative h-96 w-72 flex-shrink-0 overflow-hidden">
                            <Image
                                src={`/recent-${i}.jpg`}
                                alt={`Recent Work ${i}`}
                                fill
                                className="object-cover"
                            />
                        </div>
                    ))}
                </div>
            </section>

            {/* Services Section */}
            <section className="px-6">
                <h2 className="mb-8 text-2xl font-bold">SERVICES</h2>
                <div className="mb-8 flex gap-4">
                    <button className="rounded-full bg-white px-6 py-2 text-sm font-medium text-black">
                        Haircuts
                    </button>
                    <button className="rounded-full border border-white/20 px-6 py-2 text-sm font-medium">
                        Beard Trims
                    </button>
                </div>

                <div className="space-y-6">
                    {services.map((service, index) => (
                        <div
                            key={index}
                            className="rounded-2xl bg-white/5 p-6 backdrop-blur-sm"
                        >
                            <div className="mb-4 flex items-start justify-between">
                                <div>
                                    <h3 className="text-lg font-medium">{service.name}</h3>
                                    <p className="text-sm text-gray-400">{service.duration}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-xl font-bold">£{service.price}</span>
                                    <button className="rounded-full bg-white px-4 py-1 text-sm font-medium text-black">
                                        Book
                                    </button>
                                </div>
                            </div>
                            <p className="text-sm text-gray-400">{service.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Business Info */}
            <section className="mt-20 grid grid-cols-1 gap-8 px-6 md:grid-cols-2">
                <div>
                    <div className="mb-8">
                        <div className="mb-4 flex items-center gap-2">
                            <Image
                                src="/ktrimz-avatar.jpg"
                                alt="KS Trimz"
                                width={48}
                                height={48}
                                className="rounded-full"
                            />
                            <div>
                                <h3 className="font-medium">KS Trimz</h3>
                                <div className="flex items-center gap-1">
                                    <div className="flex text-yellow-400">
                                        {[1, 2, 3, 4].map((star) => (
                                            <Star key={star} className="h-4 w-4 fill-current" />
                                        ))}
                                        <Star className="h-4 w-4" />
                                    </div>
                                    <span className="text-sm text-gray-400">(4.5 average)</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                            <MapPin className="h-4 w-4" />
                            <span>123, Manchester Dummy, Address AB12 3CD</span>
                        </div>
                    </div>

                    <div className="mb-12">
                        <h3 className="mb-6 text-xl font-bold">About</h3>
                        <p className="text-gray-400">
                            Lorem ipsum dolor sit amet consectetur. Risus dis libero urna nec. Hendrerit nunc cursus amet pellentesque est auctor semper. Sit societas convallis varius tincidunt pellentesque ultrices ornare tellus sit. Ut integer mattis mi odio magna sed egestas. Purus tempor tristique in est. Pulvinar sed faucibus nunc ut vestibulum ultricies.
                        </p>
                    </div>

                    <div>
                        <h3 className="mb-6 text-xl font-bold">Opening Hours</h3>
                        <div className="space-y-2">
                            {openingHours.map((item, index) => (
                                <div key={index} className="flex justify-between">
                                    <span>{item.day}</span>
                                    <span className="text-gray-400">{item.hours}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="mb-6 text-xl font-bold">Reviews</h3>
                    <div className="grid gap-4">
                        {reviews.map((review) => (
                            <div key={review.id} className="rounded-2xl bg-white/5 p-6 backdrop-blur-sm">
                                <div className="mb-4 flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white">
                                        {review.initial}
                                    </div>
                                    <div>
                                        <p className="font-medium">{review.name}</p>
                                        <p className="text-sm text-gray-400">{review.date}</p>
                                    </div>
                                </div>
                                <div className="mb-2 flex text-yellow-400">
                                    {Array.from({ length: review.rating }).map((_, i) => (
                                        <Star key={i} className="h-4 w-4 fill-current" />
                                    ))}
                                </div>
                                <p className="text-sm text-gray-400">{review.comment}</p>
                            </div>
                        ))}
                    </div>
                    <button className="mt-6 flex items-center gap-2 rounded-full bg-white/5 px-6 py-2 backdrop-blur-sm">
                        More
                        <ChevronRight className="h-4 w-4" />
                    </button>
                </div>
            </section>
        </div>
    )
}

export default KTrimz