import StarIcon from '@/icons/star.icon'
import React from 'react'

const Review = ({ review }: {
    review: {
        id: string,
        initial: string,
        name: string,
        date: string,
        rating: number,
        comment: string
    }
}) => {
    return (
        <div key={review.id} className="rounded-2xl bg-white p-6">
            <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white">
                    {review.initial}
                </div>
                <div>
                    <p className="font-medium">{review.name}</p>
                    <p className="text-sm text-gray-500">{review.date}</p>
                </div>
            </div>
            <div className="mb-2 flex text-yellow-400">
                {Array.from({ length: review.rating }).map((_, i) => (
                    <StarIcon color={"#000"} key={i} className="h-4 w-4 fill-current" />
                ))}
            </div>
            <p className="text-sm text-gray-600">{review.comment}</p>
        </div>
    )
}

export default Review