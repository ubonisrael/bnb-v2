import React from 'react'
import Image from 'next/image'
import cards from '@/assets/images/cards.png'

const PaymentPage = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-[#C0CBF9] to-[#3232B8] p-6">
            {/* Navigation Steps */}
            <div className="mb-8 flex items-center gap-2 text-sm text-gray-600">
                <span>Service</span>
                <span>›</span>
                <span className="font-medium text-black">Time</span>
                <span>›</span>
                <span>Confirm</span>
            </div>

            <div className="mx-auto max-w-6xl justify-between flex items-center">
                <h1 className="mb-12 text-2xl font-bold">Payment</h1>

                <div className="flex items-center gap-12">
                    <Image src={cards} alt="cards" className='w-[600px] h-auto' width={600} height={440} />
                </div>
            </div>
        </div>
    )
}

export default PaymentPage