"use client";
import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Clock, Bell, X, Star } from 'lucide-react'
import { hairstyleServices, makeupServices } from '../data/data';

const timeSlots = [
    "9:00am",
    "1:00pm",
    "3:00pm",
    "3:30pm",
    "4:00pm",
    "6:10pm",
    "7:00pm",
    "8:10pm"
]

interface NotificationModalProps {
    isOpen: boolean
    onClose: () => void
}

const NotificationModal = ({ isOpen, onClose }: NotificationModalProps) => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="relative w-full  max-w-2xl rounded-3xl bg-pink-300 px-8 pb-8 pt-14">
                <button
                    onClick={onClose}
                    className="absolute left-6 top-6"
                >
                    <ChevronLeft className="h-5 w-5" />
                </button>

                <div className="mb-2 flex items-center gap-2">
                    <Bell className="h-8 w-8" />
                    <h2 className="text-2xl font-bold">Get notified</h2>
                </div>

                <p className="mb-12 text-lg">
                    Incase a customer cancels get notified if you'd want the spot.
                </p>

                <div className="space-y-8">
                    <h3 className="text-3xl font-bold">HELLO</h3>

                    <div>
                        <div className="flex items-baseline gap-4">
                            <label className="text-2xl font-bold">My name is</label>
                            <div className="relative flex-1">
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="what should we call you"
                                    className="w-full border-b-2 border-black bg-transparent pb-2 text-lg placeholder-black/50 focus:outline-none"
                                />
                                <span className="absolute -right-4 top-0 text-2xl">*</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="flex items-baseline gap-4">
                            <label className="text-2xl font-bold">Here is my email</label>
                            <div className="relative flex-1">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter Email"
                                    className="w-full border-b-2 border-black bg-transparent pb-2 text-lg placeholder-black/50 focus:outline-none"
                                />
                                <span className="absolute -right-4 top-0 text-2xl">*</span>
                            </div>
                        </div>
                    </div>

                    <button
                        className="relative mt-8 w-full rounded-full bg-black py-4 text-xl text-white"
                        disabled={!name || !email}
                    >
                        <span>Submit</span>
                        <div className="absolute right-4 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white text-black">
                            /
                        </div>
                    </button>
                </div>
            </div>
        </div>
    )
}

const TimePage = () => {
    const [selectedDate, setSelectedDate] = useState<number | null>(null)
    const [selectedTime, setSelectedTime] = useState<string | null>(null)
    const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false)

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

    // Calendar data
    const daysOfWeek = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']
    const calendarDays = Array.from({ length: 31 }, (_, i) => i + 1)
    const startPadding = Array.from({ length: 0 }, () => null) // Adjust based on month start
    const endPadding = Array.from({ length: 7 - ((31 + 0) % 7) }, () => null) // Adjust based on month end
    const allDays = [...startPadding, ...calendarDays, ...endPadding]

    return (
        <div className="min-h-screen bg-pink-300">
            <div className="max-w-7xl mx-auto pt-10 px-4 w-full">
                <div className="mb-8">
                    <Link href="/perfect-finishz/services" className="mb-4 inline-flex items-center text-sm">
                        <ChevronLeft className="mr-1 h-4 w-4" />
                        Back
                    </Link>
                    <div className="flex items-center gap-2 text-sm">
                        <span>Service</span>
                        <span>›</span>
                        <span className="font-medium text-black">Time</span>
                        <span>›</span>
                        <span>Confirm</span>
                    </div>
                </div>
                <div className="grid grid-cols-12 gap-6">
                    {/* Main Content */}
                    <div className="col-span-8 p-6">
                        {/* Navigation */}


                        <h1 className="mb-6 text-2xl font-bold">Select time</h1>

                        <div className="grid grid-cols-2 gap-8">
                            {/* Calendar */}
                            <div className="rounded-3xl bg-white p-6">
                                <div className="mb-6 flex items-center justify-between">
                                    <button className="rounded-full p-1 hover:bg-gray-100">
                                        <ChevronLeft className="h-5 w-5" />
                                    </button>
                                    <h2 className="text-lg font-medium">February 2021</h2>
                                    <button className="rounded-full p-1 hover:bg-gray-100">
                                        <ChevronRight className="h-5 w-5" />
                                    </button>
                                </div>

                                <div className="grid grid-cols-7 gap-1">
                                    {/* Day Headers */}
                                    {daysOfWeek.map((day) => (
                                        <div
                                            key={day}
                                            className="pb-2 text-center text-sm font-medium text-gray-500"
                                        >
                                            {day}
                                        </div>
                                    ))}

                                    {/* Calendar Days */}
                                    {allDays.map((day, index) => (
                                        <button
                                            key={index}
                                            disabled={!day}
                                            onClick={() => day && setSelectedDate(day)}
                                            className={`
                      aspect-square rounded-full p-2 text-sm
                      ${!day ? 'invisible' : 'hover:bg-gray-100'}
                      ${selectedDate === day ? 'bg-black text-white hover:bg-black' : ''}
                    `}
                                        >
                                            {day}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Time Slots */}
                            <div>
                                <div className="mb-6 flex items-center gap-2">
                                    <Clock className="h-6 w-6" />
                                    <h2 className="text-xl font-bold">TIME</h2>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    {timeSlots.map((time) => (
                                        <button
                                            key={time}
                                            onClick={() => setSelectedTime(time)}
                                            className={`
                      rounded-xl px-4 py-3 text-center
                      ${selectedTime === time
                                                    ? 'bg-black text-white'
                                                    : 'bg-gray-300 hover:bg-gray-400'}
                    `}
                                        >
                                            {time}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Notification Option */}
                        <button
                            onClick={() => setIsNotificationModalOpen(true)}
                            className="mt-8 flex w-fit mx-auto items-center gap-3 rounded-full bg-white px-6 py-3"
                        >
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black">
                                <Bell className="h-5 w-5 text-white" />
                            </div>
                            <span>Get notified of booking cancelation</span>
                        </button>
                    </div>

                    {/* Cart Preview */}
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

                <NotificationModal
                    isOpen={isNotificationModalOpen}
                    onClose={() => setIsNotificationModalOpen(false)}
                />
            </div>
        </div>
    )
}

export default TimePage