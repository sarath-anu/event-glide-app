
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
  Heart,
  Star,
} from "lucide-react";

const EventDetailSupabase = () => {
  const { id } = useParams<{ id: string }>();

  const { data: event, isLoading, error, refetch } = useQuery({
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

  const handleShare = async () => {
    const shareData = {
      title: event?.name || 'Event',
      text: event?.short_description || 'Check out this amazing event!',
      url: window.location.href
    };

    try {
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert('Event link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert('Event link copied to clipboard!');
      } catch (clipboardError) {
        console.error('Clipboard error:', clipboardError);
        alert('Unable to share. Please copy the URL manually.');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-orange-50 to-purple-50">
        <Header />
        <div className="container py-12">
          <div className="animate-pulse space-y-4">
            <div className="h-10 w-3/4 rounded-md bg-orange-200"></div>
            <div className="h-96 rounded-lg bg-purple-200"></div>
            <div className="h-4 w-1/2 rounded-md bg-pink-200"></div>
            <div className="h-4 w-full rounded-md bg-green-200"></div>
            <div className="h-4 w-full rounded-md bg-yellow-200"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-orange-50 to-purple-50">
        <Header />
        <div className="container py-12 text-center">
          <h1 className="text-2xl font-bold mb-4 text-purple-800">Event not found</h1>
          <p className="text-muted-foreground mb-6">
            The event you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild className="bg-orange-500 hover:bg-orange-600">
            <Link to="/events">Back to Events</Link>
          </Button>
        </div>
      </div>
    );
  }

  const eventDate = new Date(event.event_date);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-orange-50 to-purple-50">
      <Header />

      {/* Event Hero */}
      <div className="relative h-64 md:h-96 bg-gradient-to-b from-primary/10 to-background">
        <img
          src={event.image_url || "/placeholder.svg"}
          alt={event.name}
          className="absolute inset-0 w-full h-full object-cover opacity-75"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/60 via-pink-500/40 to-orange-300/30" />
      </div>

      <div className="container px-4 py-6 -mt-16 relative z-10">
        <Badge className={`category-badge-${event.category} mb-3`}>
          {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
        </Badge>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">{event.name}</h1>

          <div className="flex items-center space-x-2">
            <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2">
              <Heart className="h-4 w-4 text-red-500" />
              <span className="text-sm font-medium">{Math.max(0, event.likes || 0)}</span>
            </div>
            <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2">
              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
              <span className="text-sm font-medium">{event.rating?.toFixed(1) || '0.0'}</span>
            </div>
            <LikeButton 
              eventId={event.id} 
              likesCount={Math.max(0, event.likes || 0)} 
              className="bg-white/90 backdrop-blur-sm hover:bg-white"
            />
            <Button variant="outline" size="sm" onClick={handleShare} className="bg-white/90 backdrop-blur-sm hover:bg-white">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm" className="bg-green-100 border-green-300 hover:bg-green-200">
              <Check className="h-4 w-4 text-green-600" />
              <span className="text-green-600">Verified</span>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Event Details */}
            <Card className="border-2 border-orange-200 shadow-lg">
              <CardContent className="p-6">
                <div className="flex flex-wrap gap-x-6 gap-y-4 mb-6">
                  <div className="flex items-center text-sm">
                    <CalendarDays className="h-4 w-4 mr-2 text-pink-500" />
                    <span>{format(eventDate, "EEEE, MMMM do, yyyy")}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Clock className="h-4 w-4 mr-2 text-green-500" />
                    <span>{event.event_time}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <MapPin className="h-4 w-4 mr-2 text-orange-500" />
                    <span>
                      {event.venue}, {event.city}
                    </span>
                  </div>
                </div>

                <h3 className="text-xl font-semibold mb-3 text-purple-800">About this event</h3>
                <p className="text-muted-foreground whitespace-pre-line">
                  {event.description}
                </p>

                <div className="flex flex-wrap gap-2 mt-6">
                  {event.tags?.map((tag) => (
                    <Badge key={tag} variant="secondary" className="bg-gradient-to-r from-pink-100 to-orange-100 text-purple-700">
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
                onRatingUpdate={refetch}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div>
            {/* Registration Card */}
            <Card className="border-2 border-purple-200 shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 text-purple-800">Event Status</h3>

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
                    <div className="text-center p-4 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-600 font-medium">Event is Full</p>
                      <p className="text-sm text-red-500 mt-1">No more spots available</p>
                    </div>
                  ) : isBookingOpen ? (
                    <div className="text-center p-4 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-green-600 font-medium">Registration Open</p>
                      <p className="text-sm text-green-500 mt-1">Secure your spot now!</p>
                    </div>
                  ) : (
                    <div className="text-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-yellow-600 font-medium">Registration Opens Soon</p>
                      <p className="text-xs text-yellow-500 mt-1">
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
            <Card className="mt-6 border-2 border-green-200 shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 text-green-700">Organizer</h3>
                <div className="flex items-center gap-2 mb-4">
                  <UserCircle className="h-10 w-10 text-green-600" />
                  <span className="font-medium">{event.organizer_name}</span>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Contact Details</h4>
                  {event.contact_phone && (
                    <div className="flex items-center text-sm">
                      <Phone className="h-4 w-4 mr-2 text-blue-500" />
                      <span>{event.contact_phone}</span>
                    </div>
                  )}
                  {event.contact_email && (
                    <div className="flex items-center text-sm">
                      <Mail className="h-4 w-4 mr-2 text-purple-500" />
                      <span>{event.contact_email}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Map Placeholder */}
            <Card className="mt-6 border-2 border-pink-200 shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-2 text-pink-700">Location</h3>
                <div className="bg-gradient-to-r from-pink-100 to-orange-100 rounded-md h-48 flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-orange-500" />
                  <span className="ml-2 text-sm text-orange-600">
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

        {/* Footer Actions */}
        <div className="mt-12 bg-gradient-to-r from-purple-100 via-pink-100 to-orange-100 rounded-lg p-6 border-2 border-purple-200">
          <div className="text-center space-y-4">
            <h3 className="text-lg font-semibold text-purple-800">Ready to Join?</h3>
            <div className="flex flex-wrap justify-center gap-4">
              {!isFull && isBookingOpen ? (
                <>
                  <Link 
                    to={`/events/${id}/register`}
                    className="text-purple-600 hover:text-purple-800 font-medium underline transition-colors"
                  >
                    Register for Event
                  </Link>
                  <span className="text-gray-400">|</span>
                  <Link 
                    to={`/events/${id}/booking`}
                    className="text-orange-600 hover:text-orange-800 font-medium underline transition-colors"
                  >
                    Book Tickets
                  </Link>
                </>
              ) : (
                <span className="text-gray-500">
                  {isFull ? "Event is Full" : "Registration not yet open"}
                </span>
              )}
              <span className="text-gray-400">|</span>
              <Link 
                to="/events"
                className="text-green-600 hover:text-green-800 font-medium underline transition-colors"
              >
                Browse More Events
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailSupabase;
