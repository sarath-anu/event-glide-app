
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { getEventById, Event } from "@/lib/data";
import { toast } from "@/hooks/use-toast";
import { CalendarDays, Clock, MapPin, CreditCard, Users } from "lucide-react";
import { format } from "date-fns";

const ticketTypes = [
  { id: "standard", name: "Standard", price: 50 },
  { id: "vip", name: "VIP", price: 120 },
  { id: "group", name: "Group (5+)", price: 40 },
];

const EventBooking = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [ticketType, setTicketType] = useState("standard");
  const [quantity, setQuantity] = useState(1);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  useEffect(() => {
    if (id) {
      // In a real app, this would be an API call
      const eventData = getEventById(id);
      setEvent(eventData || null);
      setLoading(false);
    }
  }, [id]);

  // Get the selected ticket type details
  const selectedTicketType = ticketTypes.find(t => t.id === ticketType);
  
  // Calculate the total price
  const ticketPrice = selectedTicketType?.price || 0;
  const total = ticketPrice * quantity;

  const handleBooking = () => {
    if (!agreeToTerms) {
      toast({
        title: "Error",
        description: "You must agree to the terms and conditions.",
        variant: "destructive",
      });
      return;
    }

    console.log("Booking with:", { ticketType, quantity, total });
    toast({
      title: "Booking Successful",
      description: "Your tickets have been booked successfully!",
    });
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
            
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="ticket-type">Ticket Type</Label>
                    <Select 
                      value={ticketType} 
                      onValueChange={setTicketType}
                    >
                      <SelectTrigger id="ticket-type" className="w-full">
                        <SelectValue placeholder="Select ticket type" />
                      </SelectTrigger>
                      <SelectContent>
                        {ticketTypes.map((type) => (
                          <SelectItem key={type.id} value={type.id}>
                            {type.name} - ${type.price}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="quantity">Quantity</Label>
                    <div className="flex items-center">
                      <Button 
                        type="button" 
                        variant="outline"
                        size="sm"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity <= 1}
                      >
                        -
                      </Button>
                      <Input 
                        id="quantity" 
                        type="number" 
                        className="mx-2 text-center w-20" 
                        min={1} 
                        max={10}
                        value={quantity}
                        onChange={(e) => setQuantity(Math.min(10, Math.max(1, parseInt(e.target.value) || 1)))}
                      />
                      <Button 
                        type="button" 
                        variant="outline"
                        size="sm"
                        onClick={() => setQuantity(Math.min(10, quantity + 1))}
                        disabled={quantity >= 10}
                      >
                        +
                      </Button>
                    </div>
                  </div>

                  <div className="border-t pt-4 mt-6">
                    <div className="flex justify-between mb-2">
                      <span>Ticket Price:</span>
                      <span>${ticketPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span>Quantity:</span>
                      <span>x{quantity}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg mt-2">
                      <span>Total:</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Payment Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="card-name">Name on Card</Label>
                    <Input id="card-name" placeholder="Enter the name on your card" />
                  </div>

                  <div>
                    <Label htmlFor="card-number">Card Number</Label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input id="card-number" className="pl-10" placeholder="1234 5678 9012 3456" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiry">Expiry Date</Label>
                      <Input id="expiry" placeholder="MM/YY" />
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV</Label>
                      <Input id="cvv" placeholder="123" />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 pt-4">
                    <Checkbox 
                      id="terms" 
                      checked={agreeToTerms} 
                      onCheckedChange={(checked) => setAgreeToTerms(checked === true)} 
                    />
                    <label
                      htmlFor="terms"
                      className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      I agree to the terms and conditions and cancellation policy
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button onClick={handleBooking} disabled={!agreeToTerms}>
                Complete Booking
              </Button>
            </div>
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
                        {event.registeredCount} / {event.totalOccupancy} registered
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
