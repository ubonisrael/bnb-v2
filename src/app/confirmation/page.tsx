import React from 'react'
import paper from '@/assets/images/paper.png'
import tick from '@/assets/images/tick.png'
import Image from 'next/image'
const ConfirmationPage = () => {
    return (
        <div className='bg-gradient-to-b from-[#C0CBF9] to-[#3232B8]'>
            <div className="mb-8 flex items-center gap-2 text-sm text-gray-600">
                <span>Service</span>
                <span>›</span>
                <span className="font-medium text-black">Time</span>
                <span>›</span>
                <span>Confirm</span>
            </div>

            <div className="mx-auto max-w-6xl justify-between flex items-center">
                <h1 className="mb-12 text-2xl font-bold">Payment</h1>

                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex justify-between items-center ">
                    <Image src={paper} alt="paper" className='object-cover w-[720px] h-auto ' />

                    <Image src={tick} alt="tick" className='' />

                    <div className="flex flex-col gap-4">
                        <h2 className='text-3xl font-bold mb-4'>PAYMENT CONFIRMED</h2>
                        <div className="flex justify-between items-center">
                            <span>
                                Reference number
                            </span>
                            <span>
                                001922773JK47KF47
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span>
                                Reference number
                            </span>
                            <span>
                                001922773JK47KF47
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span>
                                Reference number
                            </span>
                            <span>
                                001922773JK47KF47
                            </span>
                        </div>
                        <div className="flex justify-between items-center mb-12">
                            <span>
                                Reference number
                            </span>
                            <span>
                                001922773JK47KF47
                            </span>
                        </div>

                        <div className="flex justify-between text-4xl font-bold items-center">
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