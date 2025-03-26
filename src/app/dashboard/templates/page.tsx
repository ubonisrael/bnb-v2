import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Star, Clock, MapPin } from 'lucide-react'

const templates = [
    {
        id: 'hairbysharon',
        name: 'Hair by Sharon',
        description: 'Perfect for hairstylists and beauty professionals. Features a modern gallery layout with service booking and review system.',
        rating: 4.8,
        reviews: 107,
        preview: '/templates/hairbysharon-preview.jpg',
        demoUrl: '/hairbysharon',
        features: ['Service Booking', 'Gallery', 'Reviews', 'Opening Hours']
    },
    {
        id: 'perfect-finishz',
        name: 'Perfect Finishz',
        description: 'Ideal for barbers and grooming specialists. Includes a sleek appointment system and service showcase.',
        rating: 4.9,
        reviews: 89,
        preview: '/templates/perfect-finishz-preview.jpg',
        demoUrl: '/perfect-finishz',
        features: ['Appointment Booking', 'Service Menu', 'Client Gallery', 'Location Map']
    },
    {
        id: 'trustcutz',
        name: 'Trust Cutz',
        description: 'Modern template for barbershops with focus on appointment scheduling and service presentation.',
        rating: 4.7,
        reviews: 95,
        preview: '/templates/trustcutz-preview.jpg',
        demoUrl: '/trustcutz',
        features: ['Online Booking', 'Price List', 'Team Profiles', 'Customer Reviews']
    }
]

export default function TemplatesPage() {
    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="mx-auto max-w-7xl">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Templates</h1>
                    <p className="mt-2 text-gray-600">
                        Choose from our professionally designed templates to create your perfect business page.
                    </p>
                </div>

                {/* Templates Grid */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {templates.map((template) => (
                        <div
                            key={template.id}
                            className="group overflow-hidden rounded-2xl bg-white shadow-card transition-all hover:shadow-lg"
                        >
                            {/* Preview Image */}
                            <div className="relative h-48 overflow-hidden">
                                <Image
                                    src={template.preview}
                                    alt={template.name}
                                    fill
                                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <div className="mb-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-xl font-semibold text-gray-900">{template.name}</h3>
                                        <div className="flex items-center gap-1">
                                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                            <span className="text-sm text-gray-600">{template.rating}</span>
                                        </div>
                                    </div>
                                    <p className="mt-2 text-sm text-gray-600">{template.description}</p>
                                </div>

                                {/* Features */}
                                <div className="mb-6">
                                    <div className="flex flex-wrap gap-2">
                                        {template.features.map((feature) => (
                                            <span
                                                key={feature}
                                                className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600"
                                            >
                                                {feature}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-3">
                                    <Link
                                        href={template.demoUrl}
                                        className="flex-1 rounded-lg bg-gray-100 px-4 py-2 text-center text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
                                    >
                                        Preview
                                    </Link>
                                    <button className="flex-1 rounded-lg bg-[#1a1f36] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#2a3352]">
                                        Use Template
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
} 