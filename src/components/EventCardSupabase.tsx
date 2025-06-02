
import { Event } from "@/lib/supabase-data";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Clock, MapPin, Heart, Star, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";

interface EventCardProps {
  event: Event;
}

const EventCardSupabase = ({ event }: EventCardProps) => {
  const registrationPercentage = (event.registered_count / event.total_capacity) * 100;
  
  const getProgressBarColor = () => {
    if (registrationPercentage >= 80) return "filled-progress";
    if (registrationPercentage >= 50) return "medium-progress";
    return "low-progress";
  };
  
  const formattedDate = format(new Date(event.event_date), "MMM d, yyyy");
  
  return (
    <Card className="event-card group overflow-hidden">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={event.image_url || "/placeholder.svg"} 
          alt={event.name} 
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <Badge className={`category-badge-${event.category} absolute top-3 left-3`}>
          {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
        </Badge>
      </div>
      
      <CardHeader className="p-4 pb-2">
        <Link to={`/event/${event.id}`} className="hover:underline">
          <h3 className="text-lg font-semibold line-clamp-2">{event.name}</h3>
        </Link>
        <div className="flex items-center gap-1 text-muted-foreground text-sm mt-1">
          <MapPin className="h-4 w-4" />
          <span>{event.city}, {event.venue}</span>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 pt-0 space-y-2">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <CalendarDays className="h-4 w-4" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{event.event_time}</span>
          </div>
        </div>
        
        <p className="text-sm line-clamp-2">{event.short_description}</p>
        
        <div className="space-y-1 pt-2">
          <div className="flex items-center justify-between text-sm">
            <span>Registration</span>
            <span className="font-medium">
              {event.registered_count}/{event.total_capacity}
            </span>
          </div>
          <div className="registration-progress">
            <div 
              className={`registration-progress-bar ${getProgressBarColor()}`} 
              style={{ width: `${registrationPercentage}%` }}
            />
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Heart className="h-4 w-4 text-red-500" />
            <span className="text-sm">{event.likes}</span>
          </div>
          <div className="flex items-center justify-center rounded-full bg-[#F2FCE2] border border-[#8E9196]/30 p-1">
            <Check className="h-3 w-3 text-[#7E69AB]" />
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
          <span className="text-sm">{event.rating?.toFixed(1) || '0.0'}</span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default EventCardSupabase;
