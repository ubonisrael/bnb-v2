import React from 'react'
import Image from 'next/image'
import cards from '@/assets/images/cards.png'
import CardForm from './card-form'

const PaymentPage = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-[#C0CBF9] to-[#3232B8] p-6">
            {/* Navigation Steps */}
            <div className='flex mb-12 items-center justify-between gap-2'>
                <div className="flex flex-col">
                    <div className=" flex items-center gap-2 text-sm text-gray-600">
                        <span>Service</span>
                        <span>›</span>
                        <span className="font-medium text-black">Time</span>
                        <span>›</span>
                        <span>Confirm</span>
                    </div>
                    <h1 className=" text-2xl font-bold">Payment</h1>
                </div>


                <Image src="/images/filled_logo.png" className='w-14 h-14 rounded-full' alt="verified" width={80} height={80} />
            </div>

            <div className="mx-auto max-w-6xl justify-between flex items-center">


                <div className="flex items-center gap-12">

                    <Image src={cards} alt="cards" className='w-[600px] h-auto' width={600} height={440} />
                    <CardForm />
                </div>
            </div>
        </div>
    )
}

export default PaymentPage