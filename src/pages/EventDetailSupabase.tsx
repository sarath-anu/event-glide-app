
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import { Badge } from "@/components/ui/badge";
import LikeButton from "@/components/LikeButton";
import ReviewSection from "@/components/ReviewSection";
import { getEventById } from "@/lib/supabase-data";
import { format } from "date-fns";
import {
  CalendarDays,
  Clock,
  MapPin,
  Share2,
  Phone,
  Mail,
  UserCircle,
  Check,
} from "lucide-react";

const EventDetailSupabase = () => {
  const { id } = useParams<{ id: string }>();

  const { data: event, isLoading, error } = useQuery({
    queryKey: ['event', id],
    queryFn: () => getEventById(id!),
    enabled: !!id,
  });

  const isBookingOpen = event
    ? new Date(event.booking_opening_date) <= new Date()
    : false;

  const isFull = event ? event.registered_count >= event.total_capacity : false;

  const registrationPercentage = event
    ? (event.registered_count / event.total_capacity) * 100
    : 0;

  const getProgressBarColor = () => {
    if (registrationPercentage >= 80) return "filled-progress";
    if (registrationPercentage >= 50) return "medium-progress";
    return "low-progress";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container py-12">
          <div className="animate-pulse space-y-4">
            <div className="h-10 w-3/4 rounded-md bg-gray-200"></div>
            <div className="h-96 rounded-lg bg-gray-200"></div>
            <div className="h-4 w-1/2 rounded-md bg-gray-200"></div>
            <div className="h-4 w-full rounded-md bg-gray-200"></div>
            <div className="h-4 w-full rounded-md bg-gray-200"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Event not found</h1>
          <p className="text-muted-foreground mb-6">
            The event you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <Link to="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  const eventDate = new Date(event.event_date);

  return (
    <div className="min-h-screen">
      <Header />

      {/* Event Hero */}
      <div className="relative h-64 md:h-96 bg-gradient-to-b from-primary/10 to-background">
        <img
          src={event.image_url || "/placeholder.svg"}
          alt={event.name}
          className="absolute inset-0 w-full h-full object-cover opacity-75"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
      </div>

      <div className="container px-4 py-6 -mt-16 relative z-10">
        <Badge className={`category-badge-${event.category} mb-3`}>
          {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
        </Badge>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-3xl md:text-4xl font-bold">{event.name}</h1>

          <div className="flex items-center space-x-2">
            <LikeButton 
              eventId={event.id} 
              likesCount={event.likes || 0} 
            />
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm" className="bg-[#F2FCE2] border-[#8E9196]/30 hover:bg-[#E5F9D0]">
              <Check className="h-4 w-4 text-[#7E69AB]" />
              <span className="text-[#7E69AB]">Verified</span>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Event Details */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-wrap gap-x-6 gap-y-4 mb-6">
                  <div className="flex items-center text-sm">
                    <CalendarDays className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{format(eventDate, "EEEE, MMMM do, yyyy")}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{event.event_time}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>
                      {event.venue}, {event.city}
                    </span>
                  </div>
                </div>

                <h3 className="text-xl font-semibold mb-3">About this event</h3>
                <p className="text-muted-foreground whitespace-pre-line">
                  {event.description}
                </p>

                <div className="flex flex-wrap gap-2 mt-6">
                  {event.tags?.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      #{tag.replace(/\s+/g, '')}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Reviews Section */}
            <div className="mt-6">
              <ReviewSection 
                eventId={event.id} 
                eventRating={event.rating || 0} 
              />
            </div>
          </div>

          {/* Sidebar */}
          <div>
            {/* Registration Card */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Registration</h3>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span>Registered</span>
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

                  {isFull ? (
                    <Button disabled className="w-full">
                      Registration Full
                    </Button>
                  ) : isBookingOpen ? (
                    <div className="space-y-2">
                      <Link to={`/event/${id}/register`}>
                        <Button className="w-full">Register</Button>
                      </Link>
                      <Link to={`/event/${id}/book`}>
                        <Button variant="outline" className="w-full">Book Tickets</Button>
                      </Link>
                    </div>
                  ) : (
                    <div>
                      <Button disabled className="w-full mb-2">
                        Registration Opens Soon
                      </Button>
                      <p className="text-xs text-center text-muted-foreground">
                        Booking opens on{" "}
                        {format(
                          new Date(event.booking_opening_date),
                          "MMMM do, yyyy"
                        )}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Organizer Card */}
            <Card className="mt-6">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Organizer</h3>
                <div className="flex items-center gap-2 mb-4">
                  <UserCircle className="h-10 w-10" />
                  <span className="font-medium">{event.organizer_name}</span>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Contact Details</h4>
                  {event.contact_phone && (
                    <div className="flex items-center text-sm">
                      <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{event.contact_phone}</span>
                    </div>
                  )}
                  {event.contact_email && (
                    <div className="flex items-center text-sm">
                      <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{event.contact_email}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Map Placeholder */}
            <Card className="mt-6">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-2">Location</h3>
                <div className="bg-gray-200 rounded-md h-48 flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-muted-foreground" />
                  <span className="ml-2 text-sm text-muted-foreground">
                    Map View
                  </span>
                </div>
                <div className="mt-2">
                  <p className="text-sm font-medium">
                    {event.venue}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {event.city}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailSupabase;
