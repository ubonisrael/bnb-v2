"use client";
import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, Star } from 'lucide-react'

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

const ServicesPage = () => {
    const [activeTab, setActiveTab] = useState('Make Up')
    const [selectedServices, setSelectedServices] = useState<string[]>([])
    const [total, setTotal] = useState(0)

    const handleServiceSelect = (serviceName: string, price: number) => {
        if (selectedServices.includes(serviceName)) {
            setSelectedServices(selectedServices.filter(name => name !== serviceName))
            setTotal(total - price)
        } else {
            setSelectedServices([...selectedServices, serviceName])
            setTotal(total + price)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-b pb-12 from-[#FF82C2] to-[#FFD0E8]">
            <div className="max-w-7xl mx-auto pt-10 px-4 w-full">

                <div className="mb-8">
                    <Link href="/perfect-finishz" className="mb-4 inline-flex items-center text-sm">
                        <ChevronLeft className="mr-1 h-4 w-4" />
                        Back
                    </Link>
                    <div className="flex items-center gap-2 text-sm">
                        <span>Home</span>
                        <span>›</span>
                        <span>Services</span>

                    </div>
                </div>
                <div className="grid grid-cols-12 gap-6">
                    {/* Main Content */}
                    <div className="col-span-8 p-6">
                        {/* Navigation */}


                        <h1 className="mb-6 text-2xl font-bold">Select Service</h1>

                        {/* Service Type Tabs */}
                        <div className="mb-8 flex gap-2">
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

                        {/* Services List */}
                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold">{activeTab}</h2>
                            {(activeTab === 'Make Up' ? makeupServices : hairstyleServices).map((service, index) => (
                                <div
                                    key={index}
                                    className="rounded-2xl bg-white/90 p-6 backdrop-blur-sm"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <h3 className="font-semibold">{service.name}</h3>
                                            <p className="mt-1 text-sm text-gray-600">{service.description}</p>
                                            <p className="mt-2 text-xs text-gray-500">{service.duration}</p>
                                        </div>
                                        <div className="ml-4 flex items-center gap-4">
                                            <span className="text-xl font-bold">£{service.price}</span>
                                            <button
                                                onClick={() => handleServiceSelect(service.name, service.price)}
                                                className={`rounded-lg px-4 py-1 ${selectedServices.includes(service.name)
                                                    ? 'bg-black text-white'
                                                    : 'bg-green-100 text-black'
                                                    }`}
                                            >
                                                Book
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Cart Preview */}
                    <div className="col-span-4 rounded-3xl bg-[#FFADD7] p-6">
                        <div className="sticky top-6 px-3">
                            <div className="mb-4 flex items-center gap-2">
                                <Image
                                    src="/images/filled_logo.png"
                                    alt="Perfect Finishz"
                                    width={40}
                                    height={40}
                                    className="rounded-lg"
                                />

                                <div>
                                    <div className="flex items-center gap-1">
                                        <h2 className="font-semibold">Perfect Finishz</h2>
                                        <Image src="/images/verified.png" alt="Verified" width={16} height={16} />
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <div className="flex text-black">
                                            {[1, 2, 3, 4, 5].map((_, i) => (
                                                <Star key={i} className="h-3 w-3 fill-current" />
                                            ))}
                                        </div>
                                        <span className="text-sm text-gray-500">(529)</span>
                                    </div>
                                </div>
                            </div>

                            <div className="my-6 h-1.5 rounded bg-black" />

                            {selectedServices.map((service, index) => (
                                <div key={index} className="mb-2 flex items-center justify-between">
                                    <span>{service}</span>
                                    <span>£{
                                        [...makeupServices, ...hairstyleServices].find(s => s.name === service)?.price
                                    }</span>
                                </div>
                            ))}

                            <div className="my-10 h-px " />

                            <div className="mb-6 flex items-center justify-between font-semibold">
                                <span>Total</span>
                                <span>£{total}</span>
                            </div>

                            <button
                                className="w-full rounded-xl bg-black py-3 text-white disabled:opacity-50"
                                disabled={selectedServices.length === 0}
                            >
                                Continue
                            </button>

                            <div className="mt-6 grid grid-cols-3 gap-2">
                                <Image
                                    src="/images/model_1.jpeg"
                                    alt="Gallery 1"
                                    width={120}
                                    height={120}
                                    className="rounded-xl object-cover"
                                />
                                <Image
                                    src="/images/model_2.jpeg"
                                    alt="Gallery 2"
                                    width={120}
                                    height={120}
                                    className="rounded-xl object-cover"
                                />
                                <Image
                                    src="/images/model_3.jpeg"
                                    alt="Gallery 3"
                                    width={120}
                                    height={120}
                                    className="rounded-xl object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ServicesPage