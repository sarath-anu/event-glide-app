
import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Event, events } from "@/lib/data";
import EventCard from "@/components/EventCard";
import { Calendar, Heart, Star } from "lucide-react";

// Mockup for user dashboard
const user = {
  name: "Jane Doe",
  email: "jane.doe@example.com",
  avatar: "",
  initials: "JD",
};

// Mockup for registered events
const registeredEvents = events.slice(0, 2);

// Mockup for liked events
const likedEvents = events.slice(2, 5);

// Mockup for user reviews
const userReviews = [
  {
    id: "1",
    eventId: "1",
    eventName: "Annual College Basketball Tournament",
    rating: 4,
    comment: "Great event! Well organized and lots of fun.",
    date: "2023-06-20T00:00:00Z"
  },
  {
    id: "2",
    eventId: "4",
    eventName: "Summer Music Festival",
    rating: 5,
    comment: "Amazing experience! The lineup was incredible and the venue was perfect.",
    date: "2023-05-15T00:00:00Z"
  }
];

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState("events");

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
                  <h2 className="text-xl font-bold">{user.name}</h2>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
                
                <div className="space-y-2">
                  <Button variant="outline" className="w-full">
                    Edit Profile
                  </Button>
                  <Button variant="outline" className="w-full">
                    Account Settings
                  </Button>
                  <Button variant="outline" className="w-full text-destructive">
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
                  My Events
                </TabsTrigger>
                <TabsTrigger value="likes" className="flex items-center">
                  <Heart className="h-4 w-4 mr-2" />
                  Liked Events
                </TabsTrigger>
                <TabsTrigger value="reviews" className="flex items-center">
                  <Star className="h-4 w-4 mr-2" />
                  My Reviews
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="events">
                <Card>
                  <CardHeader>
                    <CardTitle>Registered Events</CardTitle>
                    <CardDescription>
                      Events you have registered for
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {registeredEvents.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {registeredEvents.map((event) => (
                          <EventCard key={event.id} event={event} />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <h3 className="text-lg font-medium mb-2">No registered events</h3>
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
              
              <TabsContent value="likes">
                <Card>
                  <CardHeader>
                    <CardTitle>Liked Events</CardTitle>
                    <CardDescription>
                      Events you've shown interest in
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {likedEvents.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {likedEvents.map((event) => (
                          <EventCard key={event.id} event={event} />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <h3 className="text-lg font-medium mb-2">No liked events</h3>
                        <p className="text-muted-foreground mb-4">
                          You haven't liked any events yet.
                        </p>
                        <Button asChild>
                          <Link to="/events">Explore Events</Link>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="reviews">
                <Card>
                  <CardHeader>
                    <CardTitle>Your Reviews</CardTitle>
                    <CardDescription>
                      Reviews you've left for events
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {userReviews.length > 0 ? (
                      <div className="space-y-6">
                        {userReviews.map((review) => (
                          <div key={review.id} className="border rounded-lg p-4">
                            <div className="flex justify-between mb-2">
                              <h4 className="font-medium">
                                <Link to={`/event/${review.eventId}`} className="hover:underline">
                                  {review.eventName}
                                </Link>
                              </h4>
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i < review.rating
                                        ? "text-yellow-500 fill-yellow-500"
                                        : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-sm">{review.comment}</p>
                            <p className="text-xs text-muted-foreground mt-2">
                              {new Date(review.date).toLocaleDateString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <h3 className="text-lg font-medium mb-2">No reviews</h3>
                        <p className="text-muted-foreground mb-4">
                          You haven't reviewed any events yet.
                        </p>
                        <Button asChild>
                          <Link to="/events">Explore Events</Link>
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
