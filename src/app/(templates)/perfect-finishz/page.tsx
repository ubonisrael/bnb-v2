"use client";
import React, { useState } from 'react'
import Image from 'next/image'
import { Search, Star, MapPin, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import Policies from './policies'
import { Almendra_SC } from "next/font/google"
import Gallery from './gallery'

const almendra = Almendra_SC({
    subsets: ['latin'],
    weight: ['400'],
    variable: '--font-almendra',
})

const makeupServices = [
    {
        name: "SOFT GLAM",
        description: "a soft base make up with a natural no eye shadow look on the eyes this look includes a pair of lashes of your choice provided by me",
        price: 30,
        duration: "1hour 30minutes"
    },
    {
        name: "NATURAL GLAM",
        description: "a soft seamless base with bronzer on the eyes and a lip colour of your choice and a pair of lashes provided by me",
        price: 35,
        duration: "1hour 30minutes"
    },
    {
        name: "FULL GLAM",
        description: "multiple varied shades of eyeshadow / glitter, shimmer and a pair of lashes provided by me",
        price: 45,
        duration: "1hour 30minutes"
    }
]

const hairstyleServices = [
    {
        name: "SLEEK PONYTAIL",
        description: "please make sure your hair is freshly washed and blow-dried with no products this service includes straightening of natural hair and basic styling",
        price: 30,
        duration: "1 hour 30 minutes"
    },
    {
        name: "BRAIDED PONYTAIL",
        description: "please make sure your hair is freshly washed and blow-dried with no products this service includes straightening of natural hair and basic styling",
        price: 35,
        duration: "1hour 30minutes"
    },
    {
        name: "MIDDLE PART PONYTAIL",
        description: "please make sure your hair is freshly washed and blow-dried with no products this service includes straightening of natural hair and basic styling",
        price: 35,
        duration: "1hour 30minutes"
    }
]

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
    },
    {
        id: 3,
        name: "John Doe",
        initial: "J",
        date: "Sat, 13 Apr 2024 at 16:21",
        rating: 5,
        comment: "Brilliant...Always brilliant!"
    },
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
    const [activeTab, setActiveTab] = useState('Make Up')
    return (
        <div className='bg-gradient-to-b pb-12 from-[#FF82C2] to-[#FFD0E8]'>


            <div className="max-w-7xl mx-auto px-4 w-full">
                <div className="min-h-screen">
                    {/* Header */}
                    <header className="flex items-center justify-between px-6 py-4 mb-10">
                        <Link href="/">
                            <Image
                                src="/logo.png"
                                alt="Perfect Finishz"
                                width={60}
                                height={60}
                            />
                        </Link>
                        <div className="flex items-center gap-2 rounded-[50px]  w-full max-w-2xl bg-white p-2  pr-4">
                            {/* <input type="text" placeholder="Location" className="ml-2 border-r border-gray-200 px-2 outline-none" />
                    <input type="text" placeholder="Date" className="border-r border-gray-200 px-2 outline-none" /> */}
                            <input type="text" placeholder="Search" className="px-2 flex-1 outline-none" />
                            <Search className="h-5 w-5 text-gray-500" />
                        </div>
                    </header>

                    <div className="">
                        {/* Profile Section */}
                        <div className="mb-12 grid grid-cols-[repeat(13,1fr)] gap-8">
                            {/* Profile Card */}
                            <div className="col-span-3 flex justify-center items-center">
                                <div className="flex flex-col items-center">
                                    <div className="relative mb-4 w-[258px] h-[343px] rounded-t-3xl flex justify-center items-center bg-[#FFD7EC] shadow-[0px_4px_45px_62px_rgba(249,116,116,0.25)_inset,0px_-56px_52.5px_-17px_rgba(0,0,0,0.25)] ">
                                        <Image
                                            src="/perfect_logo.png"
                                            alt="Perfect Finishz"
                                            width={203}
                                            height={117}
                                            className="w-[203px] h-[117px]"
                                        />


                                    </div>
                                    <div className="mb-4 text-center items-center flex flex-col gap-2">
                                        <div className="flex items-center gap-1">
                                            <h3 className="font-semibold">Perfect Finishx </h3>
                                            <Image src="/images/verified.png" alt="Verified" width={16} height={16} />
                                        </div>

                                        <div className="flex items-center gap-1">
                                            <Image src="/images/location.png" alt="Location" width={16} height={16} />
                                            <p className="text-sm text-gray-500 flex items-center gap-1">123, Manchester Dummy, Address</p>
                                        </div>

                                    </div>
                                    <div className="flex mt-10 flex-col items-center gap-2">
                                        <span className="text-xs text-black font-semibold">
                                            POLICIES
                                        </span>
                                        <Policies />
                                    </div>

                                </div>
                            </div>

                            {/* Gallery */}
                            <div className="col-span-5 ">
                                <div className="relative overflow-hidden  rounded-3xl">
                                    <Image
                                        src="/images/header.png"
                                        alt="Studio"
                                        width={580}
                                        height={774}
                                        className="w-[580px] h-auto"
                                    />
                                </div>
                            </div>

                            <div className="col-span-5">
                                <Gallery />
                            </div>
                        </div>

                        <div className="grid grid-cols-8 gap-14">
                            {/* Services Section */}
                            <section className="mb-12 col-span-5">
                                <h2 className="mb-6 text-xl font-bold">Services</h2>
                                <div className="mb-6 flex gap-2">
                                    <button
                                        onClick={() => setActiveTab('Make Up')}
                                        className={`rounded-full px-4 py-2 ${activeTab === 'Make Up' ? 'bg-white' : 'bg-white/50'
                                            }`}
                                    >
                                        Make Up
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('Hairstyles')}
                                        className={`rounded-full px-4 py-2 ${activeTab === 'Hairstyles' ? 'bg-white' : 'bg-white/50'
                                            }`}
                                    >
                                        Hairstyles
                                    </button>
                                </div>
                                <div className="space-y-4">
                                    {(activeTab === 'Make Up' ? makeupServices : hairstyleServices).map((service, index) => (
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
                            <section className="mb-12 grid-flow-row w-full overflow-auto scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pt-5 col-span-3">
                                <h2 className="mb-6 text-xl font-bold">Reviews</h2>
                                <div className="mb-4 flex items-center gap-2">
                                    <div className="flex text-yellow-400">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star key={star} className="h-4 w-4 fill-current" />
                                        ))}
                                    </div>
                                    <span className="text-sm text-gray-600">324 ratings · 4 star average</span>
                                </div>
                                <div className="grid grid-rows-3 gap-4">
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
                        </div>




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

export default PerfectFinishz