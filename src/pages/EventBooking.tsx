
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
import { CreditCard, Calendar, MapPin, Users, DollarSign, Gift, Star } from "lucide-react";

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
      
      const booking = await createEventBooking({
        event_id: id,
        user_id: user.id,
        ticket_type: bookingData.ticketType,
        quantity: bookingData.quantity,
        total_amount: total,
        cardholder_name: bookingData.cardholderName,
        payment_status: 'completed',
      });

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
        title: "Booking Successful! 🎉",
        description: "Your tickets are confirmed! Check your email for details.",
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
        <div className="container py-8 text-center bg-gradient-to-br from-pink-50 via-orange-50 to-purple-50 min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-purple-500 mx-auto"></div>
          <p className="mt-4 text-purple-600 font-medium">Loading event details...</p>
        </div>
      </Layout>
    );
  }

  if (error || !event) {
    return (
      <Layout>
        <div className="container py-8 text-center bg-gradient-to-br from-pink-50 via-orange-50 to-purple-50 min-h-screen">
          <h1 className="text-2xl font-bold mb-4 text-purple-800">Event Not Found</h1>
          <p className="text-muted-foreground">The event you're looking for doesn't exist.</p>
        </div>
      </Layout>
    );
  }

  const isFreeEvent = event.price_standard === 0 && event.price_vip === 0 && event.price_group === 0;

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-orange-50 to-purple-50">
        <div className="container py-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-purple-800 mb-2 flex items-center justify-center gap-2">
                <Gift className="h-8 w-8 text-pink-500" />
                {isFreeEvent ? 'Reserve Your Spot' : 'Book Your Tickets'}
              </h1>
              <p className="text-purple-600">
                {isFreeEvent ? 'Secure your free spot at this amazing event!' : 'Get ready for an unforgettable experience!'}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Event Summary */}
              <Card className="border-2 border-orange-200 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Event Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 p-6">
                  <div>
                    <h3 className="font-semibold text-lg text-purple-800">{event.name}</h3>
                    <p className="text-muted-foreground">{event.short_description}</p>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm bg-pink-50 p-2 rounded-lg">
                      <Calendar className="h-4 w-4 text-pink-500" />
                      <span>{new Date(event.event_date).toLocaleDateString()} at {event.event_time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm bg-orange-50 p-2 rounded-lg">
                      <MapPin className="h-4 w-4 text-orange-500" />
                      <span>{event.venue}, {event.city}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm bg-green-50 p-2 rounded-lg">
                      <Users className="h-4 w-4 text-green-500" />
                      <span>{event.registered_count}/{event.total_capacity} spots taken</span>
                    </div>
                  </div>

                  {!isFreeEvent && (
                    <div className="border-t pt-4">
                      <h4 className="font-medium mb-3 text-purple-700 flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        Ticket Prices
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between p-2 bg-blue-50 rounded">
                          <span className="font-medium">Standard</span>
                          <span className="text-blue-600 font-bold">${event.price_standard}</span>
                        </div>
                        <div className="flex justify-between p-2 bg-purple-50 rounded">
                          <span className="font-medium">VIP</span>
                          <span className="text-purple-600 font-bold">${event.price_vip}</span>
                        </div>
                        <div className="flex justify-between p-2 bg-green-50 rounded">
                          <span className="font-medium">Group (5+)</span>
                          <span className="text-green-600 font-bold">${event.price_group}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-3 rounded-lg border border-orange-200">
                    <div className="flex items-center gap-2 text-orange-700">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="text-sm font-medium">Premium Event Experience</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Booking Form */}
              <Card className="border-2 border-purple-200 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-orange-500 to-pink-500 text-white">
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    {isFreeEvent ? 'Reserve Your Spot' : 'Book Your Tickets'}
                  </CardTitle>
                  <CardDescription className="text-orange-100">
                    {isFreeEvent ? 'Complete your free reservation below' : 'Complete your booking details below'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {!isFreeEvent && (
                      <div className="space-y-2">
                        <Label htmlFor="ticketType" className="text-purple-700 font-medium">Ticket Type</Label>
                        <Select 
                          value={bookingData.ticketType} 
                          onValueChange={(value) => setBookingData({...bookingData, ticketType: value})}
                          required
                        >
                          <SelectTrigger className="border-2 border-orange-200 focus:border-orange-400">
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

                    <div className="space-y-2">
                      <Label htmlFor="quantity" className="text-purple-700 font-medium">
                        {isFreeEvent ? 'Number of Spots' : 'Quantity'}
                      </Label>
                      <Input
                        id="quantity"
                        type="number"
                        min="1"
                        max="10"
                        value={bookingData.quantity}
                        onChange={(e) => setBookingData({...bookingData, quantity: parseInt(e.target.value)})}
                        required
                        className="border-2 border-orange-200 focus:border-orange-400"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cardholderName" className="text-purple-700 font-medium">Full Name</Label>
                      <Input
                        id="cardholderName"
                        value={bookingData.cardholderName}
                        onChange={(e) => setBookingData({...bookingData, cardholderName: e.target.value})}
                        placeholder="Enter your full name"
                        required
                        className="border-2 border-orange-200 focus:border-orange-400"
                      />
                    </div>

                    {!isFreeEvent && bookingData.ticketType && (
                      <div className="border-t pt-4">
                        <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border-2 border-green-200">
                          <div className="flex justify-between items-center text-lg font-bold text-green-700">
                            <span>Total Amount:</span>
                            <span className="text-2xl">${calculateTotal()}</span>
                          </div>
                          <p className="text-xs text-green-600 mt-1">Tax included • Secure payment</p>
                        </div>
                      </div>
                    )}

                    {isFreeEvent && (
                      <div className="border-t pt-4">
                        <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border-2 border-green-200 text-center">
                          <div className="text-lg font-bold text-green-700">
                            🎉 FREE EVENT 🎉
                          </div>
                          <p className="text-sm text-green-600 mt-1">No payment required - just reserve your spot!</p>
                        </div>
                      </div>
                    )}

                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 text-lg"
                      disabled={isSubmitting || (!isFreeEvent && !bookingData.ticketType) || !bookingData.cardholderName}
                    >
                      {isSubmitting ? "Processing..." : 
                       isFreeEvent ? `Reserve ${bookingData.quantity} Spot${bookingData.quantity > 1 ? 's' : ''} - FREE` :
                       `Confirm Booking - $${calculateTotal()}`}
                    </Button>

                    <div className="text-xs text-center text-muted-foreground bg-blue-50 p-3 rounded-lg">
                      <p className="font-medium text-blue-700 mb-1">🔒 Secure & Trusted</p>
                      <p>Your information is protected and will only be used for this event.</p>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EventBooking;
