import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CarouselImage } from "@/types/response";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";

interface ImageCarouselProps {
  images: CarouselImage[];
}

export default function ImageCarousel({ images }: ImageCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const onSelect = () => {
      setSelectedIndex(emblaApi?.selectedScrollSnap() || 0);
    };

    emblaApi?.on("select", onSelect);
    return () => {
      emblaApi?.off("select", onSelect);
    };
  }, [emblaApi]);

  const CarouselButton = ({
    direction,
    onClick,
  }: {
    direction: "left" | "right";
    onClick: () => void;
  }) => (
    <Button
      type="button"
      variant="outline"
      size="icon"
      className="absolute top-1/2 -translate-y-1/2 h-8 w-8 rounded-full border-gray-200 bg-white/80 z-10"
      style={{ [direction]: "1rem" }}
      onClick={onClick}
    >
      {direction === "left" ? (
        <ChevronLeft className="h-4 w-4" />
      ) : (
        <ChevronRight className="h-4 w-4" />
      )}
    </Button>
  );

  const DotButton = ({
    selected,
    onClick,
  }: {
    selected: boolean;
    onClick: () => void;
  }) => (
    <button
      className={`relative h-2 w-2 rounded-full mx-1 ${
        selected ? "bg-[#7B68EE]" : "bg-[#E0E0E5]"
      }`}
      type="button"
      onClick={onClick}
    />
  );
  return (
    <Card className="relative bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="relative h-64 sm:h-80 md:h-96 lg:h-[448px] xl:h-[540px]">
        <div className="h-full w-full">
          <div className="overflow-hidden h-full" ref={emblaRef}>
            <div className="flex h-full">
              {images.map((img, i) => (
                <div key={i} className="relative flex-[0_0_100%] min-w-0">
                  <Image
                    src={img.src || "/placeholder.svg"}
                    alt={`Banner Image ${i}`}
                    fill
                    placeholder="blur"
                    blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mM8++JFPQAIRQMetjSWgwAAAABJRU5ErkJggg=="
                    className="rounded-md object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
          {images.length > 1 && (
            <>
              <CarouselButton
                direction="left"
                onClick={() => emblaApi?.scrollPrev()}
              />
              <CarouselButton
                direction="right"
                onClick={() => emblaApi?.scrollNext()}
              />
              <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                {images.map((_, index) => (
                  <DotButton
                    key={index}
                    selected={index === selectedIndex}
                    onClick={() => emblaApi?.scrollTo(index)}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </Card>
  );
}
