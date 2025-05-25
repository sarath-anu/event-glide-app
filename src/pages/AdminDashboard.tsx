import { useState } from "react";
import { Layout } from "@/components/Layout";
import { getPendingEvents, getApprovedEvents, getRejectedEvents, approveEvent, rejectEvent, Event, EventCategory, events } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Calendar, Clock, MapPin, Users, Eye, CheckCircle, XCircle, AlertCircle, Plus, Image } from "lucide-react";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const eventFormSchema = z.object({
  name: z.string().min(1, "Event name is required"),
  location: z.string().min(1, "Event location is required"),
  eventDate: z.string().min(1, "Event date is required"),
  eventTime: z.string().min(1, "Event time is required"),
  description: z.string().min(1, "Event description is required"),
  totalOccupancy: z.number().min(1, "Available seats must be at least 1"),
  category: z.enum(['sports', 'college', 'entertainment', 'circus', 'theater', 'music', 'other']),
  eventImage: z.any().optional()
});

type EventFormData = z.infer<typeof eventFormSchema>;

const AdminDashboard = () => {
  const [pendingEvents, setPendingEvents] = useState(getPendingEvents());
  const [approvedEvents, setApprovedEvents] = useState(getApprovedEvents());
  const [rejectedEvents, setRejectedEvents] = useState(getRejectedEvents());
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>("");

  const form = useForm<EventFormData>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      name: "",
      location: "",
      eventDate: "",
      eventTime: "",
      description: "",
      totalOccupancy: 0,
      category: "other"
    }
  });

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      form.setValue("eventImage", file);
    }
  };

  const handleApprove = (eventId: string) => {
    if (approveEvent(eventId)) {
      // Update local state
      const event = pendingEvents.find(e => e.id === eventId);
      if (event) {
        setPendingEvents(prev => prev.filter(e => e.id !== eventId));
        setApprovedEvents(prev => [...prev, { ...event, status: 'approved' as const, approvedDate: new Date().toISOString() }]);
      }
    }
  };

  const handleReject = (eventId: string) => {
    if (rejectEvent(eventId, rejectionReason)) {
      // Update local state
      const event = pendingEvents.find(e => e.id === eventId);
      if (event) {
        setPendingEvents(prev => prev.filter(e => e.id !== eventId));
        setRejectedEvents(prev => [...prev, { ...event, status: 'rejected' as const, rejectedReason: rejectionReason }]);
      }
      setIsRejectDialogOpen(false);
      setRejectionReason("");
      setSelectedEvent(null);
    }
  };

  const handleCreateEvent = (data: EventFormData) => {
    // Create image URL from uploaded file or use default
    let imageUrl = "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop";
    if (data.eventImage && imagePreview) {
      imageUrl = imagePreview;
    }

    const newEvent: Event = {
      id: (events.length + 1).toString(),
      name: data.name,
      category: data.category,
      location: {
        city: data.location.split(',')[1]?.trim() || data.location,
        venue: data.location.split(',')[0]?.trim() || data.location,
      },
      contactDetails: {
        email: "admin@events.com"
      },
      totalOccupancy: data.totalOccupancy,
      registeredCount: 0,
      bookingOpeningDate: new Date().toISOString(),
      eventDate: new Date(data.eventDate).toISOString(),
      eventTime: data.eventTime,
      likes: 0,
      rating: 0,
      description: data.description,
      shortDescription: data.description.substring(0, 100) + "...",
      organizer: "Admin",
      tags: [data.category],
      imageUrl: imageUrl,
      status: 'pending',
      submittedDate: new Date().toISOString()
    };

    events.push(newEvent);
    setPendingEvents(prev => [...prev, newEvent]);
    setIsCreateEventOpen(false);
    setImagePreview("");
    form.reset();
  };

  const openRejectDialog = (event: Event) => {
    setSelectedEvent(event);
    setIsRejectDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="flex items-center gap-1"><AlertCircle className="h-3 w-3" />Pending</Badge>;
      case 'approved':
        return <Badge variant="default" className="flex items-center gap-1 bg-green-500"><CheckCircle className="h-3 w-3" />Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive" className="flex items-center gap-1"><XCircle className="h-3 w-3" />Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const EventDetailsDialog = ({ event }: { event: Event }) => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Eye className="h-4 w-4 mr-1" />
          View Details
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{event.name}</DialogTitle>
          <DialogDescription>Event Details for Review</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <img src={event.imageUrl} alt={event.name} className="w-full h-48 object-cover rounded-lg" />
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{format(new Date(event.eventDate), "PPP")}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{event.eventTime}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{event.location.venue}, {event.location.city}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{event.totalOccupancy} capacity</span>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Description</h4>
            <p className="text-sm text-muted-foreground">{event.description}</p>
          </div>

          <div>
            <h4 className="font-medium mb-2">Organizer</h4>
            <p className="text-sm">{event.organizer}</p>
          </div>

          <div>
            <h4 className="font-medium mb-2">Contact Details</h4>
            <p className="text-sm">Email: {event.contactDetails.email}</p>
            {event.contactDetails.phone && (
              <p className="text-sm">Phone: {event.contactDetails.phone}</p>
            )}
          </div>

          <div>
            <h4 className="font-medium mb-2">Tags</h4>
            <div className="flex flex-wrap gap-1">
              {event.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <Layout>
      <div className="container py-8 px-4">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-heading font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage and review event submissions</p>
          </div>
          <Dialog open={isCreateEventOpen} onOpenChange={setIsCreateEventOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create Event
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Event</DialogTitle>
                <DialogDescription>Fill in the details to create a new event</DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleCreateEvent)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Event Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter event name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Event Location</FormLabel>
                        <FormControl>
                          <Input placeholder="Venue, City" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="eventDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Event Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="eventTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Event Time</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="totalOccupancy"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Available Seats</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="Enter number of seats" 
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Event Category</FormLabel>
                        <FormControl>
                          <select 
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            {...field}
                          >
                            <option value="sports">Sports</option>
                            <option value="college">College</option>
                            <option value="entertainment">Entertainment</option>
                            <option value="circus">Circus</option>
                            <option value="theater">Theater</option>
                            <option value="music">Music</option>
                            <option value="other">Other</option>
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="eventImage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Event Image</FormLabel>
                        <FormControl>
                          <div className="space-y-2">
                            <Input 
                              type="file" 
                              accept="image/*"
                              onChange={handleImageChange}
                              className="cursor-pointer"
                            />
                            {imagePreview && (
                              <div className="relative w-full h-32 border rounded-lg overflow-hidden">
                                <img 
                                  src={imagePreview} 
                                  alt="Event preview" 
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute top-2 right-2">
                                  <Button
                                    type="button"
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => {
                                      setImagePreview("");
                                      form.setValue("eventImage", undefined);
                                    }}
                                  >
                                    Remove
                                  </Button>
                                </div>
                              </div>
                            )}
                            {!imagePreview && (
                              <div className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg">
                                <div className="text-center">
                                  <Image className="mx-auto h-8 w-8 text-gray-400" />
                                  <p className="mt-2 text-sm text-gray-500">Upload event image</p>
                                </div>
                              </div>
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Event Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Enter event description" 
                            className="min-h-[100px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsCreateEventOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Create Event</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
              <AlertCircle className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingEvents.length}</div>
              <p className="text-xs text-muted-foreground">Events awaiting approval</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{approvedEvents.length}</div>
              <p className="text-xs text-muted-foreground">Published events</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rejected</CardTitle>
              <XCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{rejectedEvents.length}</div>
              <p className="text-xs text-muted-foreground">Declined events</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="pending" className="w-full">
          <TabsList>
            <TabsTrigger value="pending">Pending ({pendingEvents.length})</TabsTrigger>
            <TabsTrigger value="approved">Approved ({approvedEvents.length})</TabsTrigger>
            <TabsTrigger value="rejected">Rejected ({rejectedEvents.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="pending">
            <Card>
              <CardHeader>
                <CardTitle>Events Pending Review</CardTitle>
                <CardDescription>Review and approve or reject event submissions</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Event Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Organizer</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingEvents.map((event) => (
                      <TableRow key={event.id}>
                        <TableCell className="font-medium">{event.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{event.category}</Badge>
                        </TableCell>
                        <TableCell>{format(new Date(event.eventDate), "PP")}</TableCell>
                        <TableCell>{event.organizer}</TableCell>
                        <TableCell>{format(new Date(event.submittedDate), "PP")}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <EventDetailsDialog event={event} />
                            <Button 
                              size="sm" 
                              onClick={() => handleApprove(event.id)}
                              className="bg-green-500 hover:bg-green-600"
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => openRejectDialog(event)}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {pendingEvents.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No pending events to review
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="approved">
            <Card>
              <CardHeader>
                <CardTitle>Approved Events</CardTitle>
                <CardDescription>Events that are live and visible to users</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Event Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Approved Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {approvedEvents.map((event) => (
                      <TableRow key={event.id}>
                        <TableCell className="font-medium">{event.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{event.category}</Badge>
                        </TableCell>
                        <TableCell>{format(new Date(event.eventDate), "PP")}</TableCell>
                        <TableCell>{getStatusBadge(event.status)}</TableCell>
                        <TableCell>{event.approvedDate ? format(new Date(event.approvedDate), "PP") : "-"}</TableCell>
                        <TableCell>
                          <EventDetailsDialog event={event} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="rejected">
            <Card>
              <CardHeader>
                <CardTitle>Rejected Events</CardTitle>
                <CardDescription>Events that were declined</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Event Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Rejection Reason</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rejectedEvents.map((event) => (
                      <TableRow key={event.id}>
                        <TableCell className="font-medium">{event.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{event.category}</Badge>
                        </TableCell>
                        <TableCell>{format(new Date(event.eventDate), "PP")}</TableCell>
                        <TableCell>{getStatusBadge(event.status)}</TableCell>
                        <TableCell className="max-w-xs truncate">{event.rejectedReason || "-"}</TableCell>
                        <TableCell>
                          <EventDetailsDialog event={event} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Reject Dialog */}
        <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reject Event</DialogTitle>
              <DialogDescription>
                Please provide a reason for rejecting "{selectedEvent?.name}"
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Textarea
                placeholder="Enter rejection reason..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => selectedEvent && handleReject(selectedEvent.id)}
                disabled={!rejectionReason.trim()}
              >
                Reject Event
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
