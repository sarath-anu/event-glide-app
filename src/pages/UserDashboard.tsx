
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import EventCardSupabase from "@/components/EventCardSupabase";
import InvoiceDownload from "@/components/InvoiceDownload";
import { getUserRegistrations, getUserBookings, getUserInvoices } from "@/lib/supabase-data";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, Heart, Star, Receipt, Ticket } from "lucide-react";
import { format } from "date-fns";

// Mockup for user dashboard
const user = {
  name: "Jane Doe",
  email: "jane.doe@example.com",
  avatar: "",
  initials: "JD",
};

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState("events");
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Get current user
  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
    };
    getCurrentUser();
  }, []);

  const { data: registrations = [] } = useQuery({
    queryKey: ['user-registrations', currentUser?.id],
    queryFn: () => getUserRegistrations(currentUser?.id || ''),
    enabled: !!currentUser?.id,
  });

  const { data: bookings = [] } = useQuery({
    queryKey: ['user-bookings', currentUser?.id],
    queryFn: () => getUserBookings(currentUser?.id || ''),
    enabled: !!currentUser?.id,
  });

  const { data: invoices = [] } = useQuery({
    queryKey: ['user-invoices', currentUser?.id],
    queryFn: () => getUserInvoices(currentUser?.id || ''),
    enabled: !!currentUser?.id,
  });

  const getPaymentStatusBadge = (status: string) => {
    const variants = {
      completed: "default",
      pending: "secondary",
      failed: "destructive",
      refunded: "outline",
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || "secondary"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container py-8 px-4">
        <div className="flex flex-col md:flex-row gap-6">
          {/* User Profile Sidebar */}
          <div className="md:w-1/4">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center mb-6">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="text-2xl">{user.initials}</AvatarFallback>
                  </Avatar>
                  <h2 className="text-xl font-bold">{currentUser?.email || user.name}</h2>
                  <p className="text-sm text-muted-foreground">{currentUser?.email || user.email}</p>
                </div>
                
                <div className="space-y-2">
                  <Button variant="outline" className="w-full">
                    Edit Profile
                  </Button>
                  <Button variant="outline" className="w-full">
                    Account Settings
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full text-destructive"
                    onClick={() => supabase.auth.signOut()}
                  >
                    Log Out
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Main Content */}
          <div className="md:w-3/4">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="events" className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  Registrations
                </TabsTrigger>
                <TabsTrigger value="bookings" className="flex items-center">
                  <Ticket className="h-4 w-4 mr-2" />
                  Booked Tickets
                </TabsTrigger>
                <TabsTrigger value="invoices" className="flex items-center">
                  <Receipt className="h-4 w-4 mr-2" />
                  Invoices
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="events">
                <Card>
                  <CardHeader>
                    <CardTitle>Event Registrations</CardTitle>
                    <CardDescription>
                      Events you have registered for
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {registrations.length > 0 ? (
                      <div className="space-y-4">
                        {registrations.map((registration) => (
                          <div key={registration.id} className="border rounded-lg p-4">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <h3 className="font-semibold text-lg">
                                  {registration.events?.name}
                                </h3>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                                  <span>📅 {registration.events?.event_date ? format(new Date(registration.events.event_date), "MMM dd, yyyy") : 'N/A'}</span>
                                  <span>📍 {registration.events?.venue}, {registration.events?.city}</span>
                                  <span>👥 {registration.group_size || 1} {registration.group_size === 1 ? 'person' : 'people'}</span>
                                </div>
                                <div className="mt-2">
                                  <Badge variant={registration.status === 'confirmed' ? 'default' : 'secondary'}>
                                    {registration.status}
                                  </Badge>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-sm text-muted-foreground">
                                  Registered: {format(new Date(registration.created_at!), "MMM dd, yyyy")}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <h3 className="text-lg font-medium mb-2">No registrations</h3>
                        <p className="text-muted-foreground mb-4">
                          You haven't registered for any events yet.
                        </p>
                        <Button asChild>
                          <Link to="/events">Explore Events</Link>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="bookings">
                <Card>
                  <CardHeader>
                    <CardTitle>Booked Tickets</CardTitle>
                    <CardDescription>
                      Tickets you have purchased for events
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {bookings.length > 0 ? (
                      <div className="space-y-4">
                        {bookings.map((booking) => (
                          <div key={booking.id} className="border rounded-lg p-4">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <h3 className="font-semibold text-lg">
                                  {booking.events?.name}
                                </h3>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                                  <span>📅 {booking.events?.event_date ? format(new Date(booking.events.event_date), "MMM dd, yyyy") : 'N/A'}</span>
                                  <span>📍 {booking.events?.venue}, {booking.events?.city}</span>
                                  <span>🎫 {booking.ticket_type}</span>
                                  <span>🔢 Qty: {booking.quantity}</span>
                                </div>
                                <div className="mt-2 flex items-center gap-2">
                                  {getPaymentStatusBadge(booking.payment_status)}
                                  {booking.booking_reference && (
                                    <span className="text-sm text-muted-foreground">
                                      Ref: {booking.booking_reference}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-lg font-semibold">
                                  ${booking.total_amount.toFixed(2)}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  Booked: {format(new Date(booking.created_at!), "MMM dd, yyyy")}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <h3 className="text-lg font-medium mb-2">No booked tickets</h3>
                        <p className="text-muted-foreground mb-4">
                          You haven't booked any tickets yet.
                        </p>
                        <Button asChild>
                          <Link to="/events">Explore Events</Link>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="invoices">
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Invoices</CardTitle>
                    <CardDescription>
                      Download and manage your payment invoices
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {invoices.length > 0 ? (
                      <div className="space-y-4">
                        {invoices.map((invoice) => (
                          <div key={invoice.id} className="border rounded-lg p-4">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <h3 className="font-semibold">
                                  Invoice {invoice.invoice_number}
                                </h3>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {invoice.event_bookings?.events?.name}
                                </p>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                                  <span>📅 {format(new Date(invoice.invoice_date), "MMM dd, yyyy")}</span>
                                  <span>💰 ${invoice.total_amount.toFixed(2)}</span>
                                  <Badge variant={invoice.status === 'paid' ? 'default' : 'secondary'}>
                                    {invoice.status}
                                  </Badge>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <InvoiceDownload invoiceId={invoice.id} />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <h3 className="text-lg font-medium mb-2">No invoices</h3>
                        <p className="text-muted-foreground mb-4">
                          You don't have any invoices yet.
                        </p>
                        <Button asChild>
                          <Link to="/events">Book an Event</Link>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
