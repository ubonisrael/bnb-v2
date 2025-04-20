"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import ApiService from "@/services/api-service"
import { SettingsResponse } from "@/types/response"
import { useMutation } from "@tanstack/react-query"
import { minutesToTimeString, timeStringToMinutes } from "@/utils/time"
import toast from "react-hot-toast"
import { Loader2 } from "lucide-react"

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
    // const { dgata: settings } = useQuery({
    //     queryKey: ["settings"],
    //     queryFn: () => new ApiService().get<SettingsResponse>("/booking/settings"),
    // })
    const [workingHours, setWorkingHours] = useState<{ [key: string]: WorkingHours }>(
        initialData || {
            monday: { isOpen: false, startTime: minutesToTimeString(540), endTime: minutesToTimeString(1020) },
            tuesday: { isOpen: false, startTime: minutesToTimeString(540), endTime: minutesToTimeString(1020) },
            wednesday: { isOpen: false, startTime: minutesToTimeString(540), endTime: minutesToTimeString(1020) },
            thursday: { isOpen: false, startTime: minutesToTimeString(540), endTime: minutesToTimeString(1020) },
            friday: { isOpen: false, startTime: minutesToTimeString(540), endTime: minutesToTimeString(1020) },
            saturday: { isOpen: false, startTime: minutesToTimeString(540), endTime: minutesToTimeString(1020) },
            sunday: { isOpen: false, startTime: minutesToTimeString(540), endTime: minutesToTimeString(1020) },
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

    const updateBookingDaysMutation = useMutation({
        mutationFn: async (data: { [key: string]: WorkingHours }) => {
            const controller = new AbortController();
            const signal = controller.signal;

            try {
                const response = await new ApiService().post<SettingsResponse>(
                    '/booking/settings/days',
                    {
                        monday_enabled: data.monday.isOpen,
                        monday_opening: timeStringToMinutes(data.monday.startTime),
                        monday_closing: timeStringToMinutes(data.monday.endTime),
                        tuesday_enabled: data.tuesday.isOpen,
                        tuesday_opening: timeStringToMinutes(data.tuesday.startTime),
                        tuesday_closing: timeStringToMinutes(data.tuesday.endTime),
                        wednesday_enabled: data.wednesday.isOpen,
                        wednesday_opening: timeStringToMinutes(data.wednesday.startTime),
                        wednesday_closing: timeStringToMinutes(data.wednesday.endTime),
                        thursday_enabled: data.thursday.isOpen,
                        thursday_opening: timeStringToMinutes(data.thursday.startTime),
                        thursday_closing: timeStringToMinutes(data.thursday.endTime),
                        friday_enabled: data.friday.isOpen,
                        friday_opening: timeStringToMinutes(data.friday.startTime),
                        friday_closing: timeStringToMinutes(data.friday.endTime),
                        saturday_enabled: data.saturday.isOpen,
                        saturday_opening: timeStringToMinutes(data.saturday.startTime),
                        saturday_closing: timeStringToMinutes(data.saturday.endTime),
                        sunday_enabled: data.sunday.isOpen,
                        sunday_opening: timeStringToMinutes(data.sunday.startTime),
                        sunday_closing: timeStringToMinutes(data.sunday.endTime),
                    },
                    { signal }
                );
                return response;
            } catch (error: unknown) {
                if (error instanceof Error && error.name === 'AbortError') {
                    toast.error('Request was cancelled');
                }
                throw error;
            }
        },
        onMutate: () => {
            toast.loading('Saving booking days...', { id: 'booking-days-save' });
        },
        onSuccess: (response) => {
            toast.success('Booking days updated successfully', { id: 'booking-days-save' });
        },
        onError: (error: Error) => {
            toast.error(error?.message || 'Failed to update booking days', { id: 'booking-days-save' });
        },
    });

    const handleSave = async () => {
        try {
            await updateBookingDaysMutation.mutateAsync(workingHours);
        } catch (error) {
            console.error('Error saving booking days:', error);
        }
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
                <Button
                    onClick={handleSave}
                    disabled={updateBookingDaysMutation.isPending}
                >
                    {updateBookingDaysMutation.isPending ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        'Save Changes'
                    )}
                </Button>
            </div>
        </div>
    )
} 