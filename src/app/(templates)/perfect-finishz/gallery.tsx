"use client";
import React, { useState } from 'react'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react';
const Gallery = () => {
    const [selectedImage, setSelectedImage] = useState<number>(0);
    const images = [
        {
            src: '/images/gallery_1.png',
            alt: 'Gallery',
            width: 580,
            height: 774
        },
        {
            src: '/images/gallery_2.jpeg',
            alt: 'Gallery',
            width: 580,
            height: 774
        }
    ]
    return (
        <div className=' relative rounded-xl overflow-hidden w-full h-full '>
            <div style={{
                transform: `translatex(${selectedImage * -100}%)`
            }} className='grid grid-cols-[100%_100%] transition-transform duration-300 h-full'>
                {images.map((image, index) => (
                    <div key={index} className='relative w-full h-full'>
                        <Image src={image.src} alt={image.alt} fill className='object-cover' />
                    </div>
                ))}
            </div>
            <div className='absolute bottom-6 left-6 right-6 flex items-end justify-between'>
                <Image className='rounded-xl' src={images[selectedImage === images.length - 1 ? 0 : selectedImage + 1].src} alt='Gallery' width={100} height={100} />

                <a onClick={() => setSelectedImage(selectedImage === images.length - 1 ? 0 : selectedImage + 1)} className='flex cursor-pointer text-white text-sm font-semibold items-center gap-2'>
                    Next <ArrowRight className='w-4 h-4' />
                </a>
            </div>
        </div>
    )
}

export default Gallery