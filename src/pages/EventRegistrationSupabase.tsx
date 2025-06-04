
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import { getEventById, createEventRegistration } from "@/lib/supabase-data";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Calendar, MapPin, Clock, Users, User, Mail, Phone, Heart } from "lucide-react";

const EventRegistrationSupabase = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    groupSize: 1,
    specialRequests: "",
    emergencyContact: "",
    emergencyPhone: "",
    dietaryRestrictions: "",
    accessibilityNeeds: "",
  });

  const { data: event, isLoading } = useQuery({
    queryKey: ['event', id],
    queryFn: () => getEventById(id!),
    enabled: !!id,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'groupSize' ? parseInt(value) || 1 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to register for events.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    if (!event) {
      toast({
        title: "Error",
        description: "Event not found.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      await createEventRegistration({
        event_id: id!,
        user_id: user.id,
        full_name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        group_size: formData.groupSize,
        special_requests: formData.specialRequests || null,
        emergency_contact: formData.emergencyContact || null,
        emergency_phone: formData.emergencyPhone || null,
        dietary_restrictions: formData.dietaryRestrictions || null,
        accessibility_needs: formData.accessibilityNeeds || null,
        status: 'confirmed',
        registration_type: 'individual'
      });

      try {
        await supabase.functions.invoke('send-registration-email', {
          body: {
            email: formData.email,
            fullName: formData.fullName,
            eventName: event.name,
            eventDate: format(new Date(event.event_date), "MMMM dd, yyyy"),
            venue: event.venue,
            city: event.city,
          },
        });
      } catch (emailError) {
        console.error("Failed to send registration email:", emailError);
      }

      toast({
        title: "Registration Successful! 🎉",
        description: "You're all set! A confirmation email has been sent to your inbox.",
      });

      navigate(`/events/${id}`);
    } catch (error: any) {
      console.error("Registration error:", error);
      toast({
        title: "Registration Failed",
        description: error.message || "Failed to submit registration. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-orange-50 to-purple-50">
        <Header />
        <div className="container py-12">
          <div className="animate-pulse">
            <div className="h-8 w-64 bg-purple-200 rounded mb-4"></div>
            <div className="h-96 bg-orange-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-orange-50 to-purple-50">
        <Header />
        <div className="container py-12 text-center">
          <h1 className="text-2xl font-bold mb-4 text-purple-800">Event not found</h1>
          <Button onClick={() => navigate("/events")} className="bg-orange-500 hover:bg-orange-600">
            Browse Events
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-orange-50 to-purple-50">
      <Header />
      
      <div className="container py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-4 text-purple-800 flex items-center justify-center gap-2">
              <Heart className="h-8 w-8 text-pink-500" />
              Register for Event
            </h1>
            <p className="text-purple-600">Join the excitement and secure your spot!</p>
          </div>
          
          {/* Event Summary */}
          <Card className="mb-6 border-2 border-orange-200 shadow-lg">
            <CardContent className="p-6 bg-gradient-to-r from-purple-50 to-pink-50">
              <h2 className="text-xl font-semibold mb-4 text-purple-800">{event.name}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-pink-500" />
                  <span>{format(new Date(event.event_date), "EEEE, MMMM dd, yyyy")}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-green-500" />
                  <span>{event.event_time}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-orange-500" />
                  <span>{event.venue}, {event.city}</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2 text-purple-500" />
                  <span>{event.registered_count}/{event.total_capacity} registered</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Registration Form */}
          <Card className="border-2 border-purple-200 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
              <CardTitle className="text-center">Registration Details</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName" className="flex items-center gap-2">
                      <User className="h-4 w-4 text-purple-500" />
                      Full Name *
                    </Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter your full name"
                      className="border-2 border-orange-200 focus:border-orange-400"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-pink-500" />
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="your.email@example.com"
                      className="border-2 border-orange-200 focus:border-orange-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone" className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-green-500" />
                      Phone Number *
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      placeholder="Your phone number"
                      className="border-2 border-orange-200 focus:border-orange-400"
                    />
                  </div>
                  <div>
                    <Label htmlFor="groupSize" className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-orange-500" />
                      Group Size *
                    </Label>
                    <Input
                      id="groupSize"
                      name="groupSize"
                      type="number"
                      min="1"
                      max="10"
                      value={formData.groupSize}
                      onChange={handleInputChange}
                      required
                      className="border-2 border-orange-200 focus:border-orange-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="emergencyContact">Emergency Contact</Label>
                    <Input
                      id="emergencyContact"
                      name="emergencyContact"
                      value={formData.emergencyContact}
                      onChange={handleInputChange}
                      placeholder="Emergency contact name"
                      className="border-2 border-orange-200 focus:border-orange-400"
                    />
                  </div>
                  <div>
                    <Label htmlFor="emergencyPhone">Emergency Phone</Label>
                    <Input
                      id="emergencyPhone"
                      name="emergencyPhone"
                      type="tel"
                      value={formData.emergencyPhone}
                      onChange={handleInputChange}
                      placeholder="Emergency contact phone"
                      className="border-2 border-orange-200 focus:border-orange-400"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="dietaryRestrictions">Dietary Restrictions</Label>
                  <Textarea
                    id="dietaryRestrictions"
                    name="dietaryRestrictions"
                    value={formData.dietaryRestrictions}
                    onChange={handleInputChange}
                    placeholder="Please list any dietary restrictions or food allergies"
                    rows={2}
                    className="border-2 border-orange-200 focus:border-orange-400"
                  />
                </div>

                <div>
                  <Label htmlFor="accessibilityNeeds">Accessibility Needs</Label>
                  <Textarea
                    id="accessibilityNeeds"
                    name="accessibilityNeeds"
                    value={formData.accessibilityNeeds}
                    onChange={handleInputChange}
                    placeholder="Please describe any accessibility accommodations needed"
                    rows={2}
                    className="border-2 border-orange-200 focus:border-orange-400"
                  />
                </div>

                <div>
                  <Label htmlFor="specialRequests">Special Requests</Label>
                  <Textarea
                    id="specialRequests"
                    name="specialRequests"
                    value={formData.specialRequests}
                    onChange={handleInputChange}
                    placeholder="Any special requests or additional information"
                    rows={3}
                    className="border-2 border-orange-200 focus:border-orange-400"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => navigate(`/events/${id}`)}
                    className="flex-1 border-2 border-purple-300 text-purple-600 hover:bg-purple-50"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold"
                  >
                    {loading ? "Registering..." : "Complete Registration 🎉"}
                  </Button>
                </div>

                <div className="text-sm text-muted-foreground bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border-2 border-green-200">
                  <p className="mb-2 font-semibold text-green-700">✨ Registration Benefits:</p>
                  <ul className="space-y-1 text-xs text-green-600">
                    <li>• Instant confirmation via email</li>
                    <li>• Access to event updates and announcements</li>
                    <li>• Priority seating (where applicable)</li>
                    <li>• Direct communication with event organizers</li>
                  </ul>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EventRegistrationSupabase;
