"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface WorkingHours {
    isOpen: boolean
    startTime: string
    endTime: string
}

interface BookingDaysSettingsProps {
    initialData?: {
        [key: string]: WorkingHours
    }
}

export function BookingDaysSettings({ initialData }: BookingDaysSettingsProps) {
    const [workingHours, setWorkingHours] = useState<{ [key: string]: WorkingHours }>(
        initialData || {
            monday: { isOpen: true, startTime: "09:00", endTime: "17:00" },
            tuesday: { isOpen: true, startTime: "09:00", endTime: "17:00" },
            wednesday: { isOpen: true, startTime: "09:00", endTime: "17:00" },
            thursday: { isOpen: true, startTime: "09:00", endTime: "17:00" },
            friday: { isOpen: true, startTime: "09:00", endTime: "17:00" },
            saturday: { isOpen: false, startTime: "09:00", endTime: "17:00" },
            sunday: { isOpen: false, startTime: "09:00", endTime: "17:00" },
        }
    )

    const handleDayChange = (day: string, field: keyof WorkingHours, value: any) => {
        setWorkingHours((prev) => ({
            ...prev,
            [day]: {
                ...prev[day],
                [field]: value,
            },
        }))
    }

    const handleSave = async () => {
        // TODO: Implement save functionality
        console.log("Saving working hours:", workingHours)
    }

    const days = [
        { id: "monday", label: "Monday" },
        { id: "tuesday", label: "Tuesday" },
        { id: "wednesday", label: "Wednesday" },
        { id: "thursday", label: "Thursday" },
        { id: "friday", label: "Friday" },
        { id: "saturday", label: "Saturday" },
        { id: "sunday", label: "Sunday" },
    ]

    return (
        <div className="space-y-6">
            <div className="space-y-4">
                {days.map((day) => (
                    <Card key={day.id} className="border-[#E0E0E5]">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <Switch
                                        checked={workingHours[day.id].isOpen}
                                        onCheckedChange={(checked) => handleDayChange(day.id, "isOpen", checked)}
                                    />
                                    <Label className="text-sm font-medium">{day.label}</Label>
                                </div>
                                {workingHours[day.id].isOpen && (
                                    <div className="flex items-center space-x-4">
                                        <div className="flex items-center space-x-2">
                                            <Input
                                                type="time"
                                                value={workingHours[day.id].startTime}
                                                onChange={(e) => handleDayChange(day.id, "startTime", e.target.value)}
                                                className="w-32"
                                            />
                                            <span className="text-sm text-[#6E6E73]">to</span>
                                            <Input
                                                type="time"
                                                value={workingHours[day.id].endTime}
                                                onChange={(e) => handleDayChange(day.id, "endTime", e.target.value)}
                                                className="w-32"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="flex justify-end">
                <Button onClick={handleSave}>Save Changes</Button>
            </div>
        </div>
    )
} 