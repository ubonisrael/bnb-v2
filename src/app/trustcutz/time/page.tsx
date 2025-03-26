import React, { useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const daysOfWeek = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']

const TimePage = () => {
    const [selectedDate, setSelectedDate] = useState<number | null>(null)
    const [selectedTime, setSelectedTime] = useState<string | null>(null)

    // Generate calendar days (example for February 2021)
    const calendarDays = Array.from({ length: 31 }, (_, i) => i + 1)
    const startPadding = Array.from({ length: 0 }, () => null) // Adjust based on month start
    const endPadding = Array.from({ length: 7 - ((31 + 0) % 7) }, () => null) // Adjust based on month end
    const allDays = [...startPadding, ...calendarDays, ...endPadding]

    return (
        <div className="min-h-screen bg-white p-6">
            {/* Navigation Steps */}
            <div className="mb-8 flex items-center gap-2 text-sm text-gray-600">
                <span>Service</span>
                <span>›</span>
                <span className="font-medium text-black">Time</span>
                <span>›</span>
                <span>Confirm</span>
            </div>

            <div className="mx-auto max-w-4xl">
                <h1 className="mb-12 text-2xl font-bold">Select Time & Date</h1>

                {/* Time Display */}
                <div className="mb-12 text-center">
                    <div className="font-mono text-[200px] font-bold leading-none tracking-tighter">
                        {selectedTime || "00:00"}
                    </div>
                </div>

                {/* Calendar */}
                <div className="mb-8 rounded-lg bg-white p-6 shadow-card">
                    {/* Calendar Header */}
                    <div className="mb-6 flex items-center justify-between">
                        <button className="rounded-full p-1 hover:bg-gray-100">
                            <ChevronLeft className="h-5 w-5" />
                        </button>
                        <h2 className="text-lg font-semibold">February 2021</h2>
                        <button className="rounded-full p-1 hover:bg-gray-100">
                            <ChevronRight className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Calendar Grid */}
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
                <div className="grid grid-cols-4 gap-3">
                    {['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30'].map((time) => (
                        <button
                            key={time}
                            onClick={() => setSelectedTime(time)}
                            className={`
                rounded-lg border border-gray-200 py-3 text-center
                ${selectedTime === time ? 'border-black bg-black text-white' : 'hover:border-black'}
              `}
                        >
                            {time}
                        </button>
                    ))}
                </div>

                {/* Continue Button */}
                <div className="mt-8 text-center">
                    <button
                        disabled={!selectedDate || !selectedTime}
                        className="rounded-lg bg-black px-8 py-3 text-white disabled:opacity-50"
                    >
                        Continue ›
                    </button>
                </div>
            </div>
        </div>
    )
}

export default TimePage