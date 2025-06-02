
import React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getEventById, createEventRegistration } from "@/lib/supabase-data";
import EventRegistrationForm from "@/components/EventRegistrationForm";
import { toast } from "@/hooks/use-toast";
import { CalendarDays, Clock, MapPin } from "lucide-react";
import { format } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";

const EventRegistrationSupabase = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: event, isLoading, error } = useQuery({
    queryKey: ['event', id],
    queryFn: () => getEventById(id!),
    enabled: !!id,
  });

  const handleSaveDraft = (data: any) => {
    console.log("Saving draft:", data);
    toast({
      title: "Draft Saved",
      description: "Your registration information has been saved as a draft.",
    });
    // TODO: Implement draft saving to localStorage or database
  };

  const handleProceedToPayment = async (data: any) => {
    if (!user || !event) {
      toast({
        title: "Error",
        description: "Please log in to continue with registration.",
        variant: "destructive",
      });
      return;
    }

    try {
      await createEventRegistration({
        event_id: event.id,
        user_id: user.id,
        full_name: data.fullName,
        email: data.email,
        phone: data.phone,
        group_size: data.attendeeCount,
        special_requests: data.specialRequirements,
        registration_type: data.attendeeCount > 1 ? 'group' : 'individual',
        status: 'pending'
      });

      toast({
        title: "Registration Submitted",
        description: "Your registration has been submitted successfully!",
      });
      
      navigate(`/event/${id}`);
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Registration Failed",
        description: "There was an error submitting your registration. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
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
            <Link to="/events">Back to Events</Link>
          </Button>
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
            <h1 className="text-3xl font-bold mb-6">Register for Event</h1>
            <EventRegistrationForm
              eventName={event.name}
              eventCategory={event.category as any}
              onSaveDraft={handleSaveDraft}
              onProceedToPayment={handleProceedToPayment}
              onCancel={() => window.history.back()}
            />
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
                    <p className="text-muted-foreground text-sm">{event.short_description}</p>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center text-sm">
                      <CalendarDays className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{format(new Date(event.event_date), "EEEE, MMMM do, yyyy")}</span>
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
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventRegistrationSupabase;
