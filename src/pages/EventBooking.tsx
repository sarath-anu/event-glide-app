
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Layout } from "@/components/Layout";
import { getEventById, createEventBooking, createPaymentInvoice } from "@/lib/supabase-data";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { CreditCard, Calendar, MapPin, Users } from "lucide-react";

const EventBooking = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingData, setBookingData] = useState({
    ticketType: "",
    quantity: 1,
    cardholderName: "",
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
        return;
      }

      const total = calculateTotal();
      
      // Create booking
      const booking = await createEventBooking({
        event_id: id,
        user_id: user.id,
        ticket_type: bookingData.ticketType,
        quantity: bookingData.quantity,
        total_amount: total,
        cardholder_name: bookingData.cardholderName,
        payment_status: 'completed',
      });

      // Create invoice
      await createPaymentInvoice({
        booking_id: booking.id,
        user_id: user.id,
        subtotal: total,
        tax_amount: total * 0.1, // 10% tax
        total_amount: total * 1.1,
        status: 'paid',
        payment_method: 'credit_card',
      });

      // Send booking confirmation email
      try {
        await fetch('/functions/v1/send-booking-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: user.email,
            cardholderName: bookingData.cardholderName,
            eventName: event.name,
            eventDate: new Date(event.event_date).toLocaleDateString(),
            venue: event.venue,
            city: event.city,
            ticketType: bookingData.ticketType,
            quantity: bookingData.quantity,
            totalAmount: total,
            bookingReference: booking.booking_reference,
          }),
        });
      } catch (emailError) {
        console.error('Failed to send booking confirmation email:', emailError);
      }

      toast({
        title: "Booking Successful!",
        description: "Your booking has been confirmed. A confirmation email has been sent.",
      });

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
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Event Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Event Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">{event.name}</h3>
                  <p className="text-muted-foreground">{event.short_description}</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(event.event_date).toLocaleDateString()} at {event.event_time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4" />
                    <span>{event.venue}, {event.city}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4" />
                    <span>{event.registered_count}/{event.total_capacity} registered</span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2">Ticket Prices</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Standard</span>
                      <span>${event.price_standard}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>VIP</span>
                      <span>${event.price_vip}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Group (5+)</span>
                      <span>${event.price_group}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Booking Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Book Your Tickets
                </CardTitle>
                <CardDescription>
                  Complete your booking details below
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="ticketType">Ticket Type</Label>
                    <Select 
                      value={bookingData.ticketType} 
                      onValueChange={(value) => setBookingData({...bookingData, ticketType: value})}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select ticket type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">Standard - ${event.price_standard}</SelectItem>
                        <SelectItem value="vip">VIP - ${event.price_vip}</SelectItem>
                        <SelectItem value="group">Group (5+) - ${event.price_group}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      max="10"
                      value={bookingData.quantity}
                      onChange={(e) => setBookingData({...bookingData, quantity: parseInt(e.target.value)})}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cardholderName">Cardholder Name</Label>
                    <Input
                      id="cardholderName"
                      value={bookingData.cardholderName}
                      onChange={(e) => setBookingData({...bookingData, cardholderName: e.target.value})}
                      placeholder="Enter cardholder name"
                      required
                    />
                  </div>

                  {bookingData.ticketType && (
                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center text-lg font-semibold">
                        <span>Total:</span>
                        <span>${calculateTotal()}</span>
                      </div>
                    </div>
                  )}

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isSubmitting || !bookingData.ticketType || !bookingData.cardholderName}
                  >
                    {isSubmitting ? "Processing..." : `Book Now - $${calculateTotal()}`}
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
