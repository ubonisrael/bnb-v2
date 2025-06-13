import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CarouselImage } from "../../types";

interface ImageCarouselProps {
  images: CarouselImage[];
}

export default function ImageCarousel({ images }: ImageCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
//   const [autoplayInterval, setAutoplayInterval] = useState<NodeJS.Timeout | null>(null);

  const showSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    if (currentSlide < images.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

//   const startAutoplay = () => {
//     if (images.length > 1) {
//       const interval = setInterval(() => {
//         setCurrentSlide((prev) => {
//           if (prev === images.length - 1) {
//             return 0;
//           }
//           return prev + 1;
//         });
//       }, 4000);
//       setAutoplayInterval(interval);
//     }
//   };

//   const stopAutoplay = () => {
//     if (autoplayInterval) {
//       clearInterval(autoplayInterval);
//       setAutoplayInterval(null);
//     }
//   };

  const handleNavigation = (direction: 'next' | 'prev') => {
    // stopAutoplay();
    if (direction === 'next') {
      nextSlide();
    } else {
      prevSlide();
    }
    // Restart autoplay after 6 seconds
    // setTimeout(startAutoplay, 6000);
  };

  const handleIndicatorClick = (index: number) => {
    // stopAutoplay();
    showSlide(index);
    // setTimeout(startAutoplay, 6000);
  };

//   useEffect(() => {
//     startAutoplay();
//     return () => stopAutoplay();
//   }, [images.length]);

  return (
    <Card className="relative bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="relative h-64 sm:h-80 md:h-96 lg:h-[448px] xl:h-[540px]">
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-500 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-full object-cover"
            />
          </div>
        ))}

        {/* Navigation Buttons */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-4 top-1/2 transform -translate-y-1/2 !bg-white bg-opacity-80 hover:bg-opacity-100 hover:!bg-green-500 rounded-full p-3 shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => handleNavigation('prev')}
          disabled={currentSlide === 0 || images.length <= 1}
        >
          <ChevronLeft className="h-4 w-4 text-slate-700" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-1/2 transform -translate-y-1/2 !bg-white bg-opacity-80 hover:bg-opacity-100 hover:!bg-green-500 rounded-full p-3 shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => handleNavigation('next')}
          disabled={currentSlide === images.length - 1 || images.length <= 1}
        >
          <ChevronRight className="h-4 w-4 text-slate-700" />
        </Button>

        {/* Slide Indicators */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {images.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentSlide
                    ? 'bg-white'
                    : 'bg-white bg-opacity-60 hover:bg-opacity-100'
                }`}
                onClick={() => handleIndicatorClick(index)}
              />
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
