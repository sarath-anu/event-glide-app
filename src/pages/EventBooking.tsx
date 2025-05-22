
import React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { getEventById, Event } from "@/lib/data";
import { toast } from "@/hooks/use-toast";
import { Check, CalendarDays, Clock, MapPin, Users } from "lucide-react";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const EventBooking = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [ticketCount, setTicketCount] = useState(1);
  const [bookingComplete, setBookingComplete] = useState(false);

  useEffect(() => {
    if (id) {
      // In a real app, this would be an API call
      const eventData = getEventById(id);
      setEvent(eventData || null);
      setLoading(false);
    }
  }, [id]);

  const handleTicketChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const count = parseInt(e.target.value);
    if (!isNaN(count) && count >= 1 && count <= 10) {
      setTicketCount(count);
    }
  };

  const calculateTotal = () => {
    if (!event) return 0;
    return (event.price || 0) * ticketCount;
  };

  const handleBookNow = () => {
    // In a real app, this would submit booking details to backend
    setTimeout(() => {
      setBookingComplete(true);
      toast({
        title: "Booking Successful",
        description: `You have successfully booked ${ticketCount} ticket(s) for ${event?.name}`,
      });
    }, 1000);
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container py-12">
          <div className="animate-pulse space-y-4">
            <div className="h-10 w-3/4 rounded-md bg-gray-200"></div>
            <div className="h-40 rounded-lg bg-gray-200"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Event not found</h1>
          <p className="text-muted-foreground mb-6">
            The event you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <Link to="/events">Back to Events</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (bookingComplete) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container py-12 max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto my-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                <Check className="h-10 w-10 text-green-600" />
              </div>
              <CardTitle className="text-2xl">Booking Confirmed!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-center">
              <p>You have successfully booked {ticketCount} ticket(s) for:</p>
              <h3 className="text-xl font-medium">{event.name}</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-center text-sm">
                  <CalendarDays className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{format(new Date(event.eventDate), "EEEE, MMMM do, yyyy")}</span>
                </div>
                <div className="flex items-center justify-center text-sm">
                  <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{event.eventTime}</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-6">
                A confirmation email with details and e-tickets has been sent to your email address.
              </p>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              <Button className="w-full" onClick={() => navigate(`/event/${id}`)}>
                Back to Event
              </Button>
              <Button variant="outline" className="w-full" onClick={() => navigate("/events")}>
                Browse More Events
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container px-4 py-8">
        <div className="mb-6">
          <Link to={`/event/${id}`} className="flex items-center text-primary hover:underline">
            <Button variant="ghost" size="sm">
              ← Back to Event
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <h1 className="text-3xl font-bold mb-6">Book Tickets</h1>
            
            <Card>
              <CardHeader>
                <CardTitle>Ticket Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="ticketCount">Number of Tickets</Label>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => ticketCount > 1 && setTicketCount(ticketCount - 1)}
                      disabled={ticketCount <= 1}
                    >
                      -
                    </Button>
                    <Input 
                      id="ticketCount" 
                      className="w-20 text-center" 
                      type="number" 
                      min="1" 
                      max="10" 
                      value={ticketCount} 
                      onChange={handleTicketChange} 
                    />
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => ticketCount < 10 && setTicketCount(ticketCount + 1)}
                      disabled={ticketCount >= 10}
                    >
                      +
                    </Button>
                    <span className="text-sm text-muted-foreground ml-2">
                      (max 10 tickets per booking)
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Price Summary</h3>
                  <div className="bg-muted p-4 rounded-md space-y-2">
                    <div className="flex justify-between">
                      <span>Ticket price</span>
                      <span>${event.price?.toFixed(2) || "Free"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Number of tickets</span>
                      <span>x {ticketCount}</span>
                    </div>
                    <div className="border-t pt-2 mt-2 flex justify-between font-medium">
                      <span>Total</span>
                      <span>${calculateTotal().toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button className="w-full">Proceed to Checkout</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirm Your Booking</AlertDialogTitle>
                      <AlertDialogDescription>
                        You are about to book {ticketCount} ticket(s) for {event.name} for a total of ${calculateTotal().toFixed(2)}. 
                        Would you like to proceed?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleBookNow}>
                        Yes, Book Now
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardFooter>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Event Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-bold text-lg">{event.name}</h3>
                    <p className="text-muted-foreground text-sm">{event.shortDescription}</p>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center text-sm">
                      <CalendarDays className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{format(new Date(event.eventDate), "EEEE, MMMM do, yyyy")}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{event.eventTime}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>
                        {event.location.venue}, {event.location.city}
                      </span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>
                        {event.registeredCount}/{event.totalOccupancy} registered
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventBooking;
