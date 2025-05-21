
import { Event } from "@/lib/data";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Clock, MapPin, Heart, Star, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";

interface EventCardProps {
  event: Event;
}

const EventCard = ({ event }: EventCardProps) => {
  const registrationPercentage = (event.registeredCount / event.totalOccupancy) * 100;
  
  const getProgressBarColor = () => {
    if (registrationPercentage >= 80) return "filled-progress";
    if (registrationPercentage >= 50) return "medium-progress";
    return "low-progress";
  };
  
  const formattedDate = format(new Date(event.eventDate), "MMM d, yyyy");
  
  return (
    <Card className="event-card overflow-hidden">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={event.imageUrl} 
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
          <span>{event.location.city}, {event.location.venue}</span>
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
            <span>{event.eventTime}</span>
          </div>
        </div>
        
        <p className="text-sm line-clamp-2">{event.shortDescription}</p>
        
        <div className="space-y-1 pt-2">
          <div className="flex items-center justify-between text-sm">
            <span>Registration</span>
            <span className="font-medium">
              {event.registeredCount}/{event.totalOccupancy}
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
        <div className="flex items-center gap-1">
          <Heart className="h-4 w-4 text-red-500" />
          <span className="text-sm">{event.likes}</span>
        </div>
        <div className="flex items-center gap-1">
          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
          <span className="text-sm">{event.rating.toFixed(1)}</span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default EventCard;
