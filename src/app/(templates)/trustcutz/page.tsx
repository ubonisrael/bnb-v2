import React from 'react'
import Image from 'next/image'
import { ArrowDown, ArrowUpRight, Clock } from 'lucide-react'
import Link from 'next/link'
import { Inspiration, Inter } from 'next/font/google'
import verified from '@/assets/images/verified.png'
import map_pin from '@/assets/images/map_pin.png'
import StarIcon from '@/icons/star.icon'
import Review from './review'

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

const inspiration = Inspiration({
    weight: ["400"],
    variable: "--font-inspiration",
    subsets: ["latin"]
})

const openingHours = [
    { day: "Monday", hours: "10:00 - 14:30" },
    { day: "Tuesday", hours: "10:00 - 14:30" },
    { day: "Wednesday", hours: "10:00 - 14:30" },
    { day: "Thursday", hours: "10:00 - 14:30" },
    { day: "Friday", hours: "10:00 - 14:30" },
    { day: "Saturday", hours: "10:00 - 14:30" },
]

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

const TrustCutz = () => {
    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="relative h-screen">
                <div className="absolute inset-0">
                    <Image
                        src="/templates/trustcutz/trustcutz-bg.png"
                        alt="Trust Cutz Barber"
                        fill
                        className="object-cover brightness-75"
                    />
                </div>
                <div className="mx-auto relative z-10 max-w-6xl w-full py-12 h-full flex flex-col justify-between">
                    <div className="flex justify-between items-center">
                        <Link href="/">
                            <Image src="/templates/trustcutz/trustcutz-logo.png" alt="Trust Cutz Logo" className='w-20 h-20' width={80} height={80} />
                        </Link>
                        <button className="rounded-full bg-white px-8 py-3 text-black transition hover:bg-opacity-90">
                            Book
                        </button>
                    </div>
                    <div>
                        <Image src="/templates/trustcutz/trustcutz-graphicz.png" width={422} height={118} alt="Trust Cutz Graphic" className='h-[118px] w-auto' />
                    </div>
                    <div className="flex justify-between items-center">
                        <button className="rounded-full bg-transparent border border-white px-8 py-[18px] text-white transition group hover:bg-opacity-90 flex items-center gap-2">
                            Services
                            <ArrowUpRight className='w-4 h-4 group-hover:translate-x-1
                            group-hover:-translate-y-1 transition' />
                        </button>

                        <button className='w-16 h-16 rounded-full flex items-center justify-center group bg-white text-black '>
                            <ArrowDown className='w-4 h-4 group-hover:animate-bounce' />
                        </button>
                    </div>
                </div>

            </section>

            {/* Services Section */}
            <section className="py-16">
                <div className="container grid grid-cols-2 gap-8">
                    <div className="mb-12 grid grid-cols-1 gap-8">
                        {/* Welcome Card */}
                        <div className="rounded-lg bg-[#f0f0f0] p-6 shadow-card">
                            <div className="flex mb-1 flex-col">
                                <div className=" flex justify-between items-center gap-8">
                                    <h2 className={`text-5xl/none ${inter.className}  font-extrabold`}>
                                        <span className='text-2xl/none '>
                                            Welcome to <br />
                                        </span>Trust Cutz</h2>
                                    <Image src="/templates/trustcutz/flag.svg" alt="UK Flag" width={150} height={92} className='h-[92px] w-auto' />
                                </div>
                                <span className={`${inspiration.variable} ${inspiration.className} text-5xl/none`}>
                                    Manchester’s Best
                                </span>
                            </div>

                            <div className="grid mb-3 grid-flow-col h-[413px] grid-cols-3 grid-rows-2 gap-3">

                                <div className="row-span-2 relative col-span-1">
                                    <Image
                                        src={`/templates/trustcutz/image_1.png`}
                                        alt={`Trustcutz image 1`}
                                        width={200}
                                        height={800}
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                                <div className="row-span-1 relative col-span-1">
                                    <Image
                                        src={`/templates/trustcutz/image_2.png`}
                                        alt={`Trustcutz image 2`}
                                        width={200}
                                        height={500}
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                                <div className="row-span-1 relative col-span-1">
                                    <Image
                                        src={`/templates/trustcutz/image_3.png`}
                                        alt={`Trustcutz image 3`}
                                        width={200}
                                        height={500}
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                                <div className="row-span-2 relative col-span-1">
                                    <Image
                                        src={`/templates/trustcutz/image_4.png`}
                                        alt={`Trustcutz image 4`}
                                        width={200}
                                        height={800}
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                            </div>
                            <button className="mt-4 w-full rounded-lg bg-black py-3 text-white">
                                Book now
                            </button>
                        </div>

                        {/* Business Info */}
                        <div className="space-y-6 rounded-lg bg-[#f0f0f0] p-4 shadow-card">
                            <div className="flex flex-col items-center gap-4">
                                <div className="flex items-center">
                                    <Image src="/templates/trustcutz/trustcutz-logo.png" alt="Trust Cutz" className='mr-2' width={80} height={80} />
                                    <h3 className="text-2xl mr-1 font-black">Trust Cutz</h3>
                                    <Image src={verified} alt="Verified" className='ml-2' width={20} height={20} />
                                </div>
                                <div className='flex flex-col items-center gap-2'>
                                    <div className="flex items-center gap-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <StarIcon key={star} color={star <= 4 ? "#F0C24D" : "rgba(240, 194, 77, 0.3)"} />

                                        ))}
                                    </div>
                                    <div className="flex  items-center">
                                        <span className=" text-sm text-gray-600">529 ratings</span>
                                        <span className="text-gray-400 text-[6px] mx-3">★</span>
                                        <span className=" text-sm text-gray-600">4 star average</span>
                                    </div>
                                    <div className="flex w-fit items-center gap-6">
                                        <Image src={map_pin} alt="Map Pin" width={40} height={40} className='w-10 h-10' />
                                        <span className="text-base text-black font-medium">123 Manchester Dummy, Address AB12 3CD</span>
                                    </div>
                                </div>
                            </div>

                            <div className="">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=your-map-embed-url"
                                    width="100%"
                                    height="236"
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
                <div className="container grid grid-cols-2 gap-8">
                    <div>
                        <h2 className="mb-6 text-2xl font-bold">About</h2>
                        <p className="text-gray-600">
                            Lorem ipsum dolor sit amet consectetur. Risus dis libero urna nec. Hendrerit nunc cursus amet pellentesque est auctor semper. Sit societas convallis varius tincidunt pellentesque ultrices ornare tellus sit. Ut integer mattis mi odio magna sed egestas. Purus tempor tristique id sem. Pulvinar nec faucibus nunc id vestibulum nullam dictum consequat nec ut.
                        </p>

                        <h2 className="mb-6 mt-12 text-2xl font-bold">Opening Hours</h2>
                        <div className="space-y-2">
                            {openingHours.map((item) => (
                                <div key={item.day} className="flex items-center justify-between gap-2">
                                    <div className="flex items-center">
                                        <span className="h-2 w-2 rounded-full bg-black"></span>
                                        <span className="text-gray-600">{item.day}</span>

                                    </div>


                                    <span className="text-gray-600">{item.hours}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className=''>
                        <h2 className="mb-6 text-2xl font-bold">Reviews</h2>

                        <div className="grid grid-rows-2 overflow-x-auto w-full gap-4 grid-flow-col">
                            <Review review={{
                                comment: "Lorem ipsum dolor sit amet consectetur. Risus dis libero urna nec. ",
                                date: "2024-01-01",
                                id: "1",
                                initial: "A",
                                name: "John Doe",
                                rating: 5
                            }} />

                            <Review review={{
                                comment: "Lorem ipsum dolor sit amet consectetur. Risus dis libero urna nec. ",
                                date: "2024-01-01",
                                id: "1",
                                initial: "A",
                                name: "John Doe",
                                rating: 5
                            }} />

                            <Review review={{
                                comment: "Lorem ipsum dolor sit amet consectetur. Risus dis libero urna nec. ",
                                date: "2024-01-01",
                                id: "1",
                                initial: "A",
                                name: "John Doe",
                                rating: 5
                            }} />

                            <Review review={{
                                comment: "Lorem ipsum dolor sit amet consectetur. Risus dis libero urna nec. ",
                                date: "2024-01-01",
                                id: "1",
                                initial: "A",
                                name: "John Doe",
                                rating: 5
                            }} />

                            <Review review={{
                                comment: "Lorem ipsum dolor sit amet consectetur. Risus dis libero urna nec. ",
                                date: "2024-01-01",
                                id: "1",
                                initial: "A",
                                name: "John Doe",
                                rating: 5
                            }} />


                            <Review review={{
                                comment: "Lorem ipsum dolor sit amet consectetur. Risus dis libero urna nec. ",
                                date: "2024-01-01",
                                id: "1",
                                initial: "A",
                                name: "John Doe",
                                rating: 5
                            }} />

                            <Review review={{
                                comment: "Lorem ipsum dolor sit amet consectetur. Risus dis libero urna nec. ",
                                date: "2024-01-01",
                                id: "1",
                                initial: "A",
                                name: "John Doe",
                                rating: 5
                            }} />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default TrustCutz