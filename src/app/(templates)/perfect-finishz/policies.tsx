"use client";

import Image from 'next/image'
import React, { useState } from 'react'

const policies = () => {
    const [policy, setPolicy] = useState<number>()
    return (
        <div className="grid grid-cols-4 gap-2">
            <div onClick={() => {
                if (policy === 0) {
                    setPolicy(undefined)
                } else {
                    setPolicy(0)
                }
            }} className="w-10 h-10 rounded-full bg-white gap-2.5 flex items-center justify-center relative transition-all cursor-pointer">
                <Image className='z-[2]' src="/images/close.png" alt="Cancellation Policy" width={16} height={16} />
                <div className={`${policy === 0 ? 'w-[340px] h-[300px]' : 'h-0 w-0'} flex-col bg-white rounded-[15px] absolute top-0 left-0 transition-all gap-3 z-[1]`}>
                </div>
                <div className={`flex-col ${policy === 0 ? 'flex opacity-100' : 'hidden opacity-0'} absolute top-0 left-0 flex transition-all py-3  z-[4] gap-3 w-[280px] translate-x-[40px]`}>
                    <span className="text-xs text-black font-semibold uppercase"> RESCHEDULING & CANCELATION</span>
                    <span className="text-xs text-black font-semibold uppercase">
                        MY ADDRESS WILL BE SENT OUT TO YOU IN 24 HOURS PLEASE MAKE SURE YOU DO NOT SHARE THE ADDRESS WITH ANYONE. APPOINTMENTS OR RESCHEDULE & CANCELLATION MUST BE MADE 48 HOURS IN ADVANCE
                    </span>
                </div>
            </div>

            <div onClick={() => {
                if (policy === 1) {
                    setPolicy(undefined)
                } else {
                    setPolicy(1)
                }
            }} className="w-10 h-10 rounded-full bg-white gap-2.5 flex items-center justify-center relative transition-all cursor-pointer">
                <Image className='z-[2]' src="/images/clock.png" alt="Cancellation Policy" width={16} height={16} />
                <div className={`${policy === 1 ? 'w-[340px] h-[300px]' : 'h-0 w-0'} flex-col bg-white rounded-[15px] absolute top-0 left-0 transition-all gap-3 z-[1]`}>
                </div>
                <div className={`flex-col ${policy === 1 ? 'flex opacity-100' : 'hidden opacity-0'} absolute top-0 left-0 flex transition-all py-3  z-[4] gap-3 w-[280px] translate-x-[40px]`}>
                    <span className="text-xs text-black font-semibold uppercase">LATE POLICY</span>
                    <span className="text-xs text-black font-semibold uppercase">
                        PLEASE BE ON TIME. THERE IS A 15MINUTES GRACE PERIOD. AFTER THAT TIME,  THERE WILL BE £15 LATE FEE. AFTER 20 MINUTES OR MORE, YOUR APPOINTMENT WILL BE CANCELED.
                    </span>
                </div>
            </div>


            <div onClick={() => {
                if (policy === 2) {
                    setPolicy(undefined)
                } else {
                    setPolicy(2)
                }
            }} className="w-10 h-10 rounded-full bg-white gap-2.5 flex items-center justify-center relative transition-all cursor-pointer">
                <Image className='z-[2]' src="/images/coin.png" alt="Cancellation Policy" width={16} height={16} />
                <div className={`${policy === 2 ? 'w-[340px] h-[300px]' : 'h-0 w-0'} flex-col bg-white rounded-[15px] absolute top-0 left-0 transition-all gap-3 z-[1]`}>
                </div>
                <div className={`flex-col ${policy === 1 ? 'flex opacity-100' : 'hidden opacity-0'} absolute top-0 left-0 flex transition-all py-3  z-[4] gap-3 w-[280px] translate-x-[40px]`}>
                    <span className="text-xs text-black font-semibold uppercase">PAYMENT</span>
                    <span className="text-xs text-black font-semibold uppercase">
                        £10 NON- REFUNDABLE DEPOSIT IS REQUESTED TO SECURE AN APPOINTMENT(DEPOSITS WILL BE
                        ADDED TOWARDS THE TOTAL) THE REMAINING BALANCE NEEDS TO BE PAID IN CASH SO PLEASE
                        MAKE SURE YOU BRING THE CORRECT AMOUNT
                    </span>
                </div>
            </div>

            <div onClick={() => {
                if (policy === 3) {
                    setPolicy(undefined)
                } else {
                    setPolicy(3)
                }
            }} className="w-10 h-10 rounded-full bg-white gap-2.5 flex items-center justify-center relative transition-all cursor-pointer">
                <Image className='z-[2]' src="/images/meeting.png" alt="Cancellation Policy" width={16} height={16} />
                <div className={`${policy === 3 ? 'w-[340px] h-[300px]' : 'h-0 w-0'} flex-col bg-white rounded-[15px] absolute top-0 left-0 transition-all gap-3 z-[1]`}>
                </div>
                <div className={`flex-col ${policy === 1 ? 'flex opacity-100' : 'hidden opacity-0'} absolute top-0 left-0 flex transition-all py-3  z-[4] gap-3 w-[280px] translate-x-[40px]`}>
                    <span className="text-xs text-black font-semibold uppercase">GUEST</span>
                    <span className="text-xs text-black font-semibold uppercase">
                        NO EXTRA PEOPLE UNLESS ASKED
                        UPON APPOINTMENT
                    </span>
                </div>
            </div>
        </div>
    )
}

export default policies