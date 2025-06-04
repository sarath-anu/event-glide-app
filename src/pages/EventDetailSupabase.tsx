
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
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
  ArrowLeft,
} from "lucide-react";

const EventDetailSupabase = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

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
      <div className="min-h-screen bg-gray-50">
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
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container py-12 text-center">
          <h1 className="text-2xl font-bold mb-4 text-gray-900">Event not found</h1>
          <p className="text-gray-600 mb-6">
            The event you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild className="btn-primary">
            <Link to="/events">Back to Events</Link>
          </Button>
        </div>
      </div>
    );
  }

  const eventDate = new Date(event.event_date);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Back Button */}
      <div className="container px-4 py-4">
        <Button 
          variant="outline" 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 btn-secondary"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </div>

      {/* Event Hero */}
      <div className="relative h-64 md:h-96 bg-gradient-to-b from-gray-100 to-gray-50">
        <img
          src={event.image_url || "/placeholder.svg"}
          alt={event.name}
          className="absolute inset-0 w-full h-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent" />
      </div>

      <div className="container px-4 py-6 -mt-16 relative z-10">
        <div className="flex gap-2 mb-3">
          <Badge className={`category-badge-${event.category}`}>
            {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
          </Badge>
          {event.free_event && (
            <Badge className="free-event-badge">
              FREE EVENT
            </Badge>
          )}
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{event.name}</h1>

          <div className="flex items-center space-x-2">
            <LikeButton 
              eventId={event.id} 
              likesCount={event.likes || 0} 
            />
            <Button variant="outline" size="sm" onClick={handleShare} className="btn-secondary">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm" className="bg-blue-50 border-blue-200 hover:bg-blue-100">
              <Check className="h-4 w-4 text-blue-600" />
              <span className="text-blue-600">Verified</span>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Event Details */}
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardContent className="p-6">
                <div className="flex flex-wrap gap-x-6 gap-y-4 mb-6">
                  <div className="flex items-center text-sm text-gray-600">
                    <CalendarDays className="h-4 w-4 mr-2 text-blue-600" />
                    <span>{format(eventDate, "EEEE, MMMM do, yyyy")}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="h-4 w-4 mr-2 text-blue-600" />
                    <span>{event.event_time}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-2 text-blue-600" />
                    <span>
                      {event.venue}, {event.city}
                    </span>
                  </div>
                </div>

                <h3 className="text-xl font-semibold mb-3 text-gray-900">About this event</h3>
                <p className="text-gray-600 whitespace-pre-line leading-relaxed">
                  {event.description}
                </p>

                <div className="flex flex-wrap gap-2 mt-6">
                  {event.tags?.map((tag) => (
                    <Badge key={tag} variant="secondary" className="bg-gray-100 text-gray-700">
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
            {/* Book Event Card */}
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Book This Event</h3>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Registered</span>
                      <span className="font-medium text-gray-900">
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

                  {/* Price Display */}
                  {!event.free_event && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2">Pricing</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Standard</span>
                          <span className="font-medium">${event.price_standard}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">VIP</span>
                          <span className="font-medium">${event.price_vip}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Group (5+)</span>
                          <span className="font-medium">${event.price_group}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {isFull ? (
                    <Button disabled className="w-full">
                      Event Full
                    </Button>
                  ) : isBookingOpen ? (
                    <Link to={`/events/${id}/booking`}>
                      <Button className="w-full btn-primary">
                        {event.free_event ? 'Register Now' : 'Book Tickets'}
                      </Button>
                    </Link>
                  ) : (
                    <div>
                      <Button disabled className="w-full mb-2">
                        Booking Opens Soon
                      </Button>
                      <p className="text-xs text-center text-gray-500">
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
            <Card className="mt-6 bg-white border-gray-200 shadow-sm">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Organizer</h3>
                <div className="flex items-center gap-2 mb-4">
                  <UserCircle className="h-10 w-10 text-gray-400" />
                  <span className="font-medium text-gray-900">{event.organizer_name}</span>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-900">Contact Details</h4>
                  {event.contact_phone && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="h-4 w-4 mr-2 text-blue-600" />
                      <span>{event.contact_phone}</span>
                    </div>
                  )}
                  {event.contact_email && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="h-4 w-4 mr-2 text-blue-600" />
                      <span>{event.contact_email}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Map Placeholder */}
            <Card className="mt-6 bg-white border-gray-200 shadow-sm">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Location</h3>
                <div className="bg-gray-100 rounded-md h-48 flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-gray-400" />
                  <span className="ml-2 text-sm text-gray-500">
                    Map View
                  </span>
                </div>
                <div className="mt-2">
                  <p className="text-sm font-medium text-gray-900">
                    {event.venue}
                  </p>
                  <p className="text-sm text-gray-600">
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
