import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Review } from "../../types";

interface ReviewsSectionProps {
  reviews: Review[];
}

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${
            star <= rating
              ? "fill-yellow-400 text-yellow-400"
              : "text-slate-300"
          }`}
        />
      ))}
    </div>
  );
};

export default function ReviewsSection({ reviews }: ReviewsSectionProps) {
  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : "0.0";

  return (
    <Card className="bg-white rounded-2xl shadow-lg">
      <CardContent className="p-8">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-slate-800">Customer Reviews</h2>
            <div className="flex items-center space-x-2">
              <StarRating rating={reviews.length ? Math.round(parseFloat(averageRating)) : 0} />
              <span className="text-lg font-semibold text-slate-800">
              {reviews.length ? averageRating : "0.0"}
              </span>
              <span className="text-slate-600">
              ({reviews.length} {reviews.length === 1 ? "review" : "reviews"})
              </span>
            </div>
          </div>
        </div>

        {reviews.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-slate-500">No reviews yet. Be the first to leave a review!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="border-b border-slate-100 pb-6 last:border-b-0 last:pb-0">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h4 className="font-semibold text-slate-800">{review.customerName}</h4>
              {review.service && (
                <p className="text-sm text-slate-500">{review.service}</p>
              )}
            </div>
            <div className="text-right">
              <StarRating rating={review.rating} />
              <p className="text-xs text-slate-500 mt-1">
                {new Date(review.date).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
                })}
              </p>
            </div>
          </div>
          <p className="text-slate-600 leading-relaxed">{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}