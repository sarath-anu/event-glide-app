
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getAllEventsForAdmin, updateEventStatus, getUserRole } from "@/lib/supabase-data";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Check, X, Clock, Users, Calendar } from "lucide-react";

const AdminDashboard = () => {
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [checkingRole, setCheckingRole] = useState(true);

  const { data: events = [], refetch } = useQuery({
    queryKey: ['admin-events'],
    queryFn: getAllEventsForAdmin,
    enabled: userRoles.includes('admin'),
  });

  useEffect(() => {
    checkUserRole();
  }, []);

  const checkUserRole = async () => {
    setCheckingRole(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const roles = await getUserRole(user.id);
        const roleNames = roles.map(r => r.role);
        setUserRoles(roleNames);
        
        // Auto-create admin role for specific email addresses
        if (!roleNames.includes('admin') && user.email === 'admin@eventease.com') {
          try {
            const { error } = await supabase
              .from('user_roles')
              .insert({ user_id: user.id, role: 'admin' });
            
            if (!error) {
              setUserRoles([...roleNames, 'admin']);
              toast({
                title: "Admin Role Assigned",
                description: "You have been granted admin access.",
              });
            }
          } catch (error) {
            console.error("Error creating admin role:", error);
          }
        }
      }
    } catch (error) {
      console.error("Error checking user role:", error);
    } finally {
      setCheckingRole(false);
    }
  };

  const handleStatusUpdate = async (eventId: string, status: 'approved' | 'rejected') => {
    setLoading(true);
    try {
      await updateEventStatus(eventId, status);
      toast({
        title: `Event ${status}`,
        description: `The event has been ${status} successfully.`,
      });
      refetch();
    } catch (error) {
      console.error("Error updating event status:", error);
      toast({
        title: "Error",
        description: "Failed to update event status.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      approved: "default",
      rejected: "destructive",
      pending: "secondary",
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || "secondary"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  if (checkingRole) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-12 text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Checking permissions...</p>
        </div>
      </div>
    );
  }

  if (!userRoles.includes('admin')) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-4">
            You don't have permission to access the admin dashboard.
          </p>
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 max-w-md mx-auto">
            <h3 className="font-medium text-blue-900 mb-2">Admin Access Instructions:</h3>
            <div className="text-sm text-blue-800 space-y-2">
              <p>1. Create an account with email: <strong>admin@eventease.com</strong></p>
              <p>2. Use password: <strong>admin123</strong></p>
              <p>3. Admin role will be automatically assigned</p>
            </div>
            <Button asChild className="mt-4">
              <a href="/admin-login">Admin Login</a>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const pendingEvents = events.filter(event => event.status === 'pending');
  const approvedEvents = events.filter(event => event.status === 'approved');
  const rejectedEvents = events.filter(event => event.status === 'rejected');

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage events, registrations, and user activities
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Pending Events</p>
                  <p className="text-2xl font-bold">{pendingEvents.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Check className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Approved Events</p>
                  <p className="text-2xl font-bold">{approvedEvents.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <X className="h-8 w-8 text-red-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Rejected Events</p>
                  <p className="text-2xl font-bold">{rejectedEvents.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Total Events</p>
                  <p className="text-2xl font-bold">{events.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="pending" className="space-y-4">
          <TabsList>
            <TabsTrigger value="pending">
              Pending Approval ({pendingEvents.length})
            </TabsTrigger>
            <TabsTrigger value="approved">
              Approved ({approvedEvents.length})
            </TabsTrigger>
            <TabsTrigger value="rejected">
              Rejected ({rejectedEvents.length})
            </TabsTrigger>
            <TabsTrigger value="all">
              All Events ({events.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            <Card>
              <CardHeader>
                <CardTitle>Pending Events</CardTitle>
                <CardDescription>
                  Events awaiting approval or rejection
                </CardDescription>
              </CardHeader>
              <CardContent>
                {pendingEvents.length > 0 ? (
                  <div className="space-y-4">
                    {pendingEvents.map((event) => (
                      <div key={event.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">{event.name}</h3>
                            <p className="text-sm text-muted-foreground mb-2">
                              By {event.organizer_name}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>📅 {format(new Date(event.event_date), "MMM dd, yyyy")}</span>
                              <span>📍 {event.venue}, {event.city}</span>
                              <span>👥 {event.total_capacity} capacity</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleStatusUpdate(event.id, 'approved')}
                              disabled={loading}
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleStatusUpdate(event.id, 'rejected')}
                              disabled={loading}
                            >
                              <X className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        </div>
                        <p className="text-sm">{event.description}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    No pending events
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="approved">
            <Card>
              <CardHeader>
                <CardTitle>Approved Events</CardTitle>
                <CardDescription>
                  Events that have been approved and are live
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {approvedEvents.map((event) => (
                    <div key={event.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold">{event.name}</h3>
                            {getStatusBadge(event.status)}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            By {event.organizer_name}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>📅 {format(new Date(event.event_date), "MMM dd, yyyy")}</span>
                            <span>📍 {event.venue}, {event.city}</span>
                            <span>👥 {event.registered_count}/{event.total_capacity}</span>
                            <span>❤️ {event.likes || 0} likes</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rejected">
            <Card>
              <CardHeader>
                <CardTitle>Rejected Events</CardTitle>
                <CardDescription>
                  Events that have been rejected
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {rejectedEvents.map((event) => (
                    <div key={event.id} className="border rounded-lg p-4 opacity-75">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold">{event.name}</h3>
                            {getStatusBadge(event.status)}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            By {event.organizer_name}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>📅 {format(new Date(event.event_date), "MMM dd, yyyy")}</span>
                            <span>📍 {event.venue}, {event.city}</span>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusUpdate(event.id, 'approved')}
                          disabled={loading}
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="all">
            <Card>
              <CardHeader>
                <CardTitle>All Events</CardTitle>
                <CardDescription>
                  Complete list of all events in the system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {events.map((event) => (
                    <div key={event.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold">{event.name}</h3>
                            {getStatusBadge(event.status)}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            By {event.organizer_name}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>📅 {format(new Date(event.event_date), "MMM dd, yyyy")}</span>
                            <span>📍 {event.venue}, {event.city}</span>
                            <span>👥 {event.registered_count}/{event.total_capacity}</span>
                            <span>❤️ {event.likes || 0} likes</span>
                            <span>⭐ {(event.rating || 0).toFixed(1)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
