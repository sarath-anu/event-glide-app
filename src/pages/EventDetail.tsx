
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import { Badge } from "@/components/ui/badge";
import { getEventById, Event } from "@/lib/data";
import { format } from "date-fns";
import {
  CalendarDays,
  Clock,
  MapPin,
  Heart,
  Share2,
  Star,
  Phone,
  Mail,
  UserCircle,
  Users,
  Check,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import EventRegistrationForm from "@/components/EventRegistrationForm";
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const EventDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);

  useEffect(() => {
    if (id) {
      // In a real app, this would be an API call
      const eventData = getEventById(id);
      setEvent(eventData || null);
      setLoading(false);
    }
  }, [id]);

  const handleLike = () => {
    setLiked(!liked);
    // In a real app, this would send a request to the server
  };

  const isBookingOpen = event
    ? new Date(event.bookingOpeningDate) <= new Date()
    : false;

  const isFull = event ? event.registeredCount >= event.totalOccupancy : false;

  const registrationPercentage = event
    ? (event.registeredCount / event.totalOccupancy) * 100
    : 0;

  const getProgressBarColor = () => {
    if (registrationPercentage >= 80) return "filled-progress";
    if (registrationPercentage >= 50) return "medium-progress";
    return "low-progress";
  };

  const handleSaveDraft = (data: any) => {
    console.log("Saving draft:", data);
    toast({
      title: "Draft Saved",
      description: "Your registration information has been saved as a draft.",
    });
    // In a real app, this would save to local storage or DB
  };

  const handleProceedToPayment = (data: any) => {
    console.log("Proceeding to payment with data:", data);
    toast({
      title: "Registration Submitted",
      description: "Proceeding to payment...",
    });
    // In a real app, this would redirect to payment page/gateway
    setShowRegistrationForm(false);
  };

  // Desktop dialog for registration form with full screen overlay
  const RegistrationDialog = () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full">Register Now</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden rounded-lg">
        <EventRegistrationForm 
          eventName={event?.name || ""}
          onSaveDraft={handleSaveDraft}
          onProceedToPayment={handleProceedToPayment}
          onCancel={() => setShowRegistrationForm(false)}
        />
      </DialogContent>
    </Dialog>
  );

  // Mobile drawer for registration form
  const RegistrationDrawer = () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="w-full">Register Now</Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[90vh] pt-8 px-0 rounded-t-xl">
        <div className="px-4">
          <EventRegistrationForm
            eventName={event?.name || ""}
            onSaveDraft={handleSaveDraft}
            onProceedToPayment={handleProceedToPayment}
            onCancel={() => setShowRegistrationForm(false)}
          />
        </div>
      </SheetContent>
    </Sheet>
  );

  if (loading) {
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
            <Link to="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  const eventDate = new Date(event.eventDate);

  return (
    <div className="min-h-screen">
      <Header />

      {/* Event Hero */}
      <div className="relative h-64 md:h-96 bg-gradient-to-b from-primary/10 to-background">
        <img
          src={event.imageUrl}
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
            <Button
              variant="outline"
              size="sm"
              className={liked ? "text-red-500 border-red-500" : ""}
              onClick={handleLike}
            >
              <Heart
                className={`h-4 w-4 mr-2 ${liked ? "fill-red-500" : ""}`}
              />
              {liked ? "Liked" : "Like"}
            </Button>
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
                    <span>{event.eventTime}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>
                      {event.location.venue}, {event.location.city}
                    </span>
                  </div>
                </div>

                <h3 className="text-xl font-semibold mb-3">About this event</h3>
                <p className="text-muted-foreground whitespace-pre-line">
                  {event.description}
                </p>

                <div className="flex flex-wrap gap-2 mt-6">
                  {event.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      #{tag.replace(/\s+/g, '')}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Reviews Section Placeholder */}
            <Card className="mt-6">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold">Reviews</h3>
                  <div className="flex items-center">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(event.rating)
                              ? "text-yellow-500 fill-yellow-500"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="ml-2 font-medium">
                      {event.rating.toFixed(1)}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Login to leave a review for this event.
                </p>
              </CardContent>
            </Card>
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

                  {isFull ? (
                    <Button disabled className="w-full">
                      Registration Full
                    </Button>
                  ) : isBookingOpen ? (
                    <div className="hidden md:block">
                      <RegistrationDialog />
                    </div>
                  ) : (
                    <div>
                      <Button disabled className="w-full mb-2">
                        Registration Opens Soon
                      </Button>
                      <p className="text-xs text-center text-muted-foreground">
                        Booking opens on{" "}
                        {format(
                          new Date(event.bookingOpeningDate),
                          "MMMM do, yyyy"
                        )}
                      </p>
                    </div>
                  )}
                  
                  {/* Only show drawer on mobile */}
                  {!isFull && isBookingOpen && (
                    <div className="md:hidden">
                      <RegistrationDrawer />
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
                  <span className="font-medium">{event.organizer}</span>
                </div>
                {event.contactDetails && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Contact Details</h4>
                    {event.contactDetails.phone && (
                      <div className="flex items-center text-sm">
                        <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{event.contactDetails.phone}</span>
                      </div>
                    )}
                    {event.contactDetails.email && (
                      <div className="flex items-center text-sm">
                        <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{event.contactDetails.email}</span>
                      </div>
                    )}
                  </div>
                )}
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
                    {event.location.venue}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {event.location.city}
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

export default EventDetail;
