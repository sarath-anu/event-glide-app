
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Layout } from "@/components/Layout";
import { getEventById, createEventBooking, createPaymentInvoice, createEventRegistration } from "@/lib/supabase-data";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { CreditCard, Calendar, MapPin, Users, ArrowLeft, Check } from "lucide-react";

const EventBooking = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingData, setBookingData] = useState({
    ticketType: "",
    quantity: 1,
    fullName: "",
    email: "",
    phone: "",
    emergencyContact: "",
    emergencyPhone: "",
  });

  const { data: event, isLoading, error } = useQuery({
    queryKey: ['event', id],
    queryFn: () => getEventById(id!),
    enabled: !!id,
  });

  const ticketPrices = {
    standard: event?.price_standard || 50,
    vip: event?.price_vip || 120,
    group: event?.price_group || 40,
  };

  const calculateTotal = () => {
    if (event?.free_event) return 0;
    if (!bookingData.ticketType) return 0;
    const price = ticketPrices[bookingData.ticketType as keyof typeof ticketPrices];
    return price * bookingData.quantity;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !event) return;

    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please log in to book events.",
          variant: "destructive",
        });
        navigate("/login");
        return;
      }

      if (event.free_event) {
        // For free events, create registration instead of booking
        await createEventRegistration({
          event_id: id,
          user_id: user.id,
          full_name: bookingData.fullName,
          email: bookingData.email,
          phone: bookingData.phone,
          group_size: bookingData.quantity,
          emergency_contact: bookingData.emergencyContact || null,
          emergency_phone: bookingData.emergencyPhone || null,
          status: 'approved',
          registration_type: 'individual'
        });

        toast({
          title: "Registration Successful!",
          description: "You have been registered for this free event.",
        });
      } else {
        // For paid events, create booking
        const total = calculateTotal();
        
        const booking = await createEventBooking({
          event_id: id,
          user_id: user.id,
          ticket_type: bookingData.ticketType,
          quantity: bookingData.quantity,
          total_amount: total,
          cardholder_name: bookingData.fullName,
          payment_status: 'completed',
        });

        // Generate invoice
        const invoiceNumber = `INV-${new Date().getFullYear()}-${Date.now()}`;
        await createPaymentInvoice({
          booking_id: booking.id,
          user_id: user.id,
          invoice_number: invoiceNumber,
          subtotal: total,
          tax_amount: total * 0.1,
          total_amount: total * 1.1,
          status: 'paid',
          payment_method: 'credit_card',
        });

        toast({
          title: "Booking Successful!",
          description: "Your booking has been confirmed.",
        });
      }

      navigate('/dashboard');
    } catch (error) {
      console.error('Booking error:', error);
      toast({
        title: "Booking Failed",
        description: "There was an error processing your booking. Please try again.",
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
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading event details...</p>
        </div>
      </Layout>
    );
  }

  if (error || !event) {
    return (
      <Layout>
        <div className="container py-8 text-center">
          <h1 className="text-2xl font-bold mb-4 text-gray-900">Event Not Found</h1>
          <p className="text-gray-600">The event you're looking for doesn't exist.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-8 bg-gray-50 min-h-screen">
        {/* Back Button */}
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 btn-secondary"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Event
          </Button>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {event.free_event ? 'Register for Event' : 'Book Your Tickets'}
            </h1>
            <p className="text-gray-600">
              {event.free_event ? 'Complete your registration for this free event' : 'Complete your booking details below'}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Event Summary */}
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  Event Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">{event.name}</h3>
                  <p className="text-gray-600">{event.short_description}</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    <span>{new Date(event.event_date).toLocaleDateString()} at {event.event_time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4 text-blue-600" />
                    <span>{event.venue}, {event.city}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="h-4 w-4 text-blue-600" />
                    <span>{event.registered_count}/{event.total_capacity} registered</span>
                  </div>
                </div>

                {event.free_event ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-green-600" />
                      <span className="font-semibold text-green-800">Free Event</span>
                    </div>
                    <p className="text-green-700 text-sm mt-1">No payment required for this event</p>
                  </div>
                ) : (
                  <div className="border-t pt-4">
                    <h4 className="font-medium text-gray-900 mb-2">Ticket Prices</h4>
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
              </CardContent>
            </Card>

            {/* Booking Form */}
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <CreditCard className="h-5 w-5 text-blue-600" />
                  {event.free_event ? 'Registration Details' : 'Booking Details'}
                </CardTitle>
                <CardDescription className="text-gray-600">
                  {event.free_event ? 'Please fill in your details to register' : 'Complete your booking information'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fullName" className="text-gray-700">Full Name *</Label>
                      <Input
                        id="fullName"
                        value={bookingData.fullName}
                        onChange={(e) => setBookingData({...bookingData, fullName: e.target.value})}
                        placeholder="Enter your full name"
                        required
                        className="border-gray-300 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-gray-700">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={bookingData.email}
                        onChange={(e) => setBookingData({...bookingData, email: e.target.value})}
                        placeholder="your.email@example.com"
                        required
                        className="border-gray-300 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone" className="text-gray-700">Phone Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={bookingData.phone}
                        onChange={(e) => setBookingData({...bookingData, phone: e.target.value})}
                        placeholder="Your phone number"
                        required
                        className="border-gray-300 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <Label htmlFor="quantity" className="text-gray-700">
                        {event.free_event ? 'Number of Attendees' : 'Quantity'} *
                      </Label>
                      <Input
                        id="quantity"
                        type="number"
                        min="1"
                        max="10"
                        value={bookingData.quantity}
                        onChange={(e) => setBookingData({...bookingData, quantity: parseInt(e.target.value)})}
                        required
                        className="border-gray-300 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  {!event.free_event && (
                    <div>
                      <Label htmlFor="ticketType" className="text-gray-700">Ticket Type *</Label>
                      <Select 
                        value={bookingData.ticketType} 
                        onValueChange={(value) => setBookingData({...bookingData, ticketType: value})}
                        required
                      >
                        <SelectTrigger className="border-gray-300 focus:border-blue-500">
                          <SelectValue placeholder="Select ticket type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="standard">Standard - ${event.price_standard}</SelectItem>
                          <SelectItem value="vip">VIP - ${event.price_vip}</SelectItem>
                          <SelectItem value="group">Group (5+) - ${event.price_group}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="emergencyContact" className="text-gray-700">Emergency Contact</Label>
                      <Input
                        id="emergencyContact"
                        value={bookingData.emergencyContact}
                        onChange={(e) => setBookingData({...bookingData, emergencyContact: e.target.value})}
                        placeholder="Emergency contact name"
                        className="border-gray-300 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <Label htmlFor="emergencyPhone" className="text-gray-700">Emergency Phone</Label>
                      <Input
                        id="emergencyPhone"
                        type="tel"
                        value={bookingData.emergencyPhone}
                        onChange={(e) => setBookingData({...bookingData, emergencyPhone: e.target.value})}
                        placeholder="Emergency contact phone"
                        className="border-gray-300 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  {!event.free_event && bookingData.ticketType && (
                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center text-lg font-semibold">
                        <span className="text-gray-900">Total:</span>
                        <span className="text-blue-600">${calculateTotal()}</span>
                      </div>
                    </div>
                  )}

                  <Button 
                    type="submit" 
                    className="w-full btn-primary" 
                    disabled={isSubmitting || (!event.free_event && !bookingData.ticketType) || !bookingData.fullName || !bookingData.email}
                  >
                    {isSubmitting ? "Processing..." : 
                     event.free_event ? "Register Now" : `Book Now - $${calculateTotal()}`}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EventBooking;
