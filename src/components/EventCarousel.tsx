
import { useEffect, useRef, useState } from "react";
import { Event } from "@/lib/data";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import EventCard from "./EventCard";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface EventCarouselProps {
  title: string;
  events: Event[];
}

const EventCarousel = ({ title, events }: EventCarouselProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);

  useEffect(() => {
    const updateMaxScroll = () => {
      if (scrollContainerRef.current) {
        const { scrollWidth, clientWidth } = scrollContainerRef.current;
        setMaxScroll(scrollWidth - clientWidth);
      }
    };

    updateMaxScroll();
    window.addEventListener("resize", updateMaxScroll);
    
    return () => {
      window.removeEventListener("resize", updateMaxScroll);
    };
  }, [events]);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      setScrollPosition(scrollContainerRef.current.scrollLeft);
    }
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -300,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 300,
        behavior: "smooth",
      });
    }
  };

  const canScrollLeft = scrollPosition > 0;
  const canScrollRight = scrollPosition < maxScroll;

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-heading font-semibold">{title}</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={scrollLeft}
            disabled={!canScrollLeft}
            className="hidden md:flex h-8 w-8"
            aria-label="Scroll left"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={scrollRight}
            disabled={!canScrollRight}
            className="hidden md:flex h-8 w-8"
            aria-label="Scroll right"
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto space-x-4 pb-4 scrollbar-hide"
        onScroll={handleScroll}
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {events.map((event) => (
          <div
            key={event.id}
            className="flex-none w-[280px] md:w-[320px]"
          >
            <EventCard event={event} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventCarousel;
