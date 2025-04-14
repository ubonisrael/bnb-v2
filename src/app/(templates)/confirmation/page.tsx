import React from 'react'
import paper from '@/assets/images/paper.png'
import tick from '@/assets/images/tick.png'
import Image from 'next/image'
const ConfirmationPage = () => {
    return (
        <div className='bg-gradient-to-b h-screen overflow-hidden from-[#C0CBF9] to-[#3232B8] p-6'>
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


                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex justify-between items-center w-[920px] h-[565px] ">
                    <Image src={paper} alt="paper" className='object-cover  absolute w-full h-full top-0 left-0' />

                    <Image src={tick} alt="tick" className='absolute top-1/2 left-0 translate-x-[260%] w-14 h-14 -translate-y-1/2' />

                    <div className="relative z-40 items-center mx-auto w-full max-w-[480px] flex flex-col  translate-x-[14%]">
                        <h2 className='text-2xl  font-extrabold mb-4'>PAYMENT CONFIRMED</h2>
                        <div className="flex w-full justify-between items-center">
                            <span>
                                Reference number
                            </span>
                            <span>
                                001922773JK47KF47
                            </span>
                        </div>
                        <div className="flex w-full justify-between items-center">
                            <span>
                                Date
                            </span>
                            <span>
                                19 Jan, 2025
                            </span>
                        </div>
                        <div className="flex w-full justify-between items-center">
                            <span>
                                Time
                            </span>
                            <span>
                                17:53 PM
                            </span>
                        </div>
                        <div className="flex w-full justify-between items-center mb-6">
                            <span>
                                Payment method
                            </span>
                            <span>
                                Debit Card
                            </span>
                        </div>

                        <div className="flex w-full justify-between text-2xl font-extrabold items-center">
                            <span>
                                AMOUNT
                            </span>
                            <span>
                                $40
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ConfirmationPage