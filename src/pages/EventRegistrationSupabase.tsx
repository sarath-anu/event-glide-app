
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/Layout";
import { EventRegistrationForm } from "@/components/EventRegistrationForm";
import { getEventById, createEventRegistration } from "@/lib/supabase-data";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const EventRegistrationSupabase = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: event, isLoading, error } = useQuery({
    queryKey: ['event', id],
    queryFn: () => getEventById(id!),
    enabled: !!id,
  });

  const handleRegistrationSubmit = async (formData: any) => {
    if (!id || !event) return;

    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please log in to register for events.",
          variant: "destructive",
        });
        return;
      }

      const registrationData = {
        event_id: id,
        user_id: user.id,
        full_name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        group_size: formData.groupSize,
        dietary_restrictions: formData.dietaryRestrictions,
        accessibility_needs: formData.accessibilityNeeds,
        emergency_contact: formData.emergencyContact,
        emergency_phone: formData.emergencyPhone,
        special_requests: formData.specialRequests,
        registration_type: formData.registrationType,
      };

      await createEventRegistration(registrationData);

      // Send confirmation email
      try {
        await fetch('/functions/v1/send-registration-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email,
            fullName: formData.fullName,
            eventName: event.name,
            eventDate: new Date(event.event_date).toLocaleDateString(),
            venue: event.venue,
            city: event.city,
          }),
        });
      } catch (emailError) {
        console.error('Failed to send confirmation email:', emailError);
      }

      toast({
        title: "Registration Successful!",
        description: "You have been registered for the event. A confirmation email has been sent.",
      });

      navigate('/dashboard');
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registration Failed",
        description: "There was an error processing your registration. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container py-8 text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading event details...</p>
        </div>
      </Layout>
    );
  }

  if (error || !event) {
    return (
      <Layout>
        <div className="container py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Event Not Found</h1>
          <p className="text-muted-foreground">The event you're looking for doesn't exist.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Register for {event.name}</h1>
            <p className="text-muted-foreground">
              Fill out the form below to register for this event.
            </p>
          </div>

          <div className="bg-card p-6 rounded-lg border mb-6">
            <h2 className="font-semibold mb-2">{event.name}</h2>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>📅 {new Date(event.event_date).toLocaleDateString()} at {event.event_time}</p>
              <p>📍 {event.venue}, {event.city}</p>
              <p>👥 {event.registered_count}/{event.total_capacity} registered</p>
            </div>
          </div>

          <EventRegistrationForm 
            onSubmit={handleRegistrationSubmit}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </Layout>
  );
};

export default EventRegistrationSupabase;
