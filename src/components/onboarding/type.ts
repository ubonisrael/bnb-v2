
export interface BusinessInfoData {
    name: string
    email: string
    phone: string
    description: string
    category: string
}

export interface LocationData {
    address: string
    city: string
    state: string
    postalCode: string
    country: string
}

export interface VisualSettingsData {
    logoUrl: string
    primaryColor: string
    accentColor: string
}

export interface ServiceCategory {
    id: string
    name: string
    description: string
}

export interface Service {
    id: string
    name: string
    categoryId: string
    price: number
    duration: number
    description?: string
    availableDays: string[]
}

export interface ServicesSetupData {
    categories: ServiceCategory[]
    services: Service[]
}

export interface PaymentDetailsData {
    provider: string
    accountDetails: Record<string, string>
}

export interface EmailSettingsData {
    sendBookingConfirmations: boolean
    sendReminders: boolean
    reminderHours: number
    sendFollowUpEmails: boolean
    followUpDelayHours: number
    sendCancellationNotices: boolean
    sendNoShowNotifications: boolean
}

export interface NotificationSettingsData {
    cancelNoticeHours: number
    emailSettings: EmailSettingsData
}

export interface OnboardingFormData {
    businessInfo: BusinessInfoData
    location: LocationData
    visualSettings: VisualSettingsData
    servicesSetup: ServicesSetupData
    paymentDetails: PaymentDetailsData
    notificationSettings: NotificationSettingsData
}