
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { createEvent } from "@/lib/supabase-data";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { CalendarDays, MapPin, DollarSign, Users, FileText } from "lucide-react";

const EventSubmissionForm = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    short_description: "",
    category: "",
    event_date: "",
    event_time: "",
    venue: "",
    city: "",
    organizer_name: "",
    contact_phone: "",
    contact_email: "",
    total_capacity: 100,
    booking_opening_date: "",
    price_standard: 50,
    price_vip: 120,
    price_group: 40,
    image_url: "",
    free_event: false,
    tags: [] as string[],
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'total_capacity' || name === 'price_standard' || name === 'price_vip' || name === 'price_group' 
        ? parseFloat(value) || 0 
        : value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to create events.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    setIsSubmitting(true);

    try {
      const eventData = {
        ...formData,
        organizer_id: user.id,
        status: 'pending' as const,
        registered_count: 0,
        likes: 0,
        rating: 0,
        featured: false,
        trending: false,
      };

      await createEvent(eventData);

      toast({
        title: "Event Submitted Successfully!",
        description: "Your event has been submitted for review. You'll be notified once it's approved.",
      });

      navigate("/");
    } catch (error: any) {
      console.error("Event creation error:", error);
      toast({
        title: "Submission Failed",
        description: error.message || "Failed to submit event. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Event</h1>
          <p className="text-gray-600">Fill out the form below to submit your event for approval.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <FileText className="h-5 w-5 text-blue-600" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="text-gray-700">Event Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter event name"
                    className="border-gray-300 focus:border-blue-500"
                  />
                </div>
                <div>
                  <Label htmlFor="category" className="text-gray-700">Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => handleSelectChange('category', value)}>
                    <SelectTrigger className="border-gray-300 focus:border-blue-500">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="music">Music</SelectItem>
                      <SelectItem value="sports">Sports</SelectItem>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="food">Food & Drink</SelectItem>
                      <SelectItem value="art">Art & Culture</SelectItem>
                      <SelectItem value="health">Health & Wellness</SelectItem>
                      <SelectItem value="entertainment">Entertainment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="short_description" className="text-gray-700">Short Description *</Label>
                <Input
                  id="short_description"
                  name="short_description"
                  value={formData.short_description}
                  onChange={handleInputChange}
                  required
                  placeholder="Brief description for event listings"
                  className="border-gray-300 focus:border-blue-500"
                />
              </div>

              <div>
                <Label htmlFor="description" className="text-gray-700">Full Description *</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  placeholder="Detailed event description"
                  rows={4}
                  className="border-gray-300 focus:border-blue-500"
                />
              </div>

              <div>
                <Label htmlFor="image_url" className="text-gray-700">Event Image URL</Label>
                <Input
                  id="image_url"
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                  className="border-gray-300 focus:border-blue-500"
                />
              </div>
            </CardContent>
          </Card>

          {/* Date & Location */}
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <CalendarDays className="h-5 w-5 text-blue-600" />
                Date & Location
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="event_date" className="text-gray-700">Event Date *</Label>
                  <Input
                    id="event_date"
                    name="event_date"
                    type="date"
                    value={formData.event_date}
                    onChange={handleInputChange}
                    required
                    className="border-gray-300 focus:border-blue-500"
                  />
                </div>
                <div>
                  <Label htmlFor="event_time" className="text-gray-700">Event Time *</Label>
                  <Input
                    id="event_time"
                    name="event_time"
                    value={formData.event_time}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., 7:00 PM"
                    className="border-gray-300 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="venue" className="text-gray-700">Venue *</Label>
                  <Input
                    id="venue"
                    name="venue"
                    value={formData.venue}
                    onChange={handleInputChange}
                    required
                    placeholder="Event venue name"
                    className="border-gray-300 focus:border-blue-500"
                  />
                </div>
                <div>
                  <Label htmlFor="city" className="text-gray-700">City *</Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    placeholder="City name"
                    className="border-gray-300 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="booking_opening_date" className="text-gray-700">Booking Opening Date *</Label>
                <Input
                  id="booking_opening_date"
                  name="booking_opening_date"
                  type="date"
                  value={formData.booking_opening_date}
                  onChange={handleInputChange}
                  required
                  className="border-gray-300 focus:border-blue-500"
                />
              </div>
            </CardContent>
          </Card>

          {/* Capacity & Pricing */}
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <Users className="h-5 w-5 text-blue-600" />
                Capacity & Pricing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="total_capacity" className="text-gray-700">Total Capacity *</Label>
                <Input
                  id="total_capacity"
                  name="total_capacity"
                  type="number"
                  min="1"
                  value={formData.total_capacity}
                  onChange={handleInputChange}
                  required
                  className="border-gray-300 focus:border-blue-500"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="free_event"
                  checked={formData.free_event}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, free_event: checked }))}
                />
                <Label htmlFor="free_event" className="text-gray-700">
                  This is a free event
                </Label>
              </div>

              {!formData.free_event && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="price_standard" className="text-gray-700">Standard Price ($)</Label>
                    <Input
                      id="price_standard"
                      name="price_standard"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.price_standard}
                      onChange={handleInputChange}
                      className="border-gray-300 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <Label htmlFor="price_vip" className="text-gray-700">VIP Price ($)</Label>
                    <Input
                      id="price_vip"
                      name="price_vip"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.price_vip}
                      onChange={handleInputChange}
                      className="border-gray-300 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <Label htmlFor="price_group" className="text-gray-700">Group Price ($)</Label>
                    <Input
                      id="price_group"
                      name="price_group"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.price_group}
                      onChange={handleInputChange}
                      className="border-gray-300 focus:border-blue-500"
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <MapPin className="h-5 w-5 text-blue-600" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="organizer_name" className="text-gray-700">Organizer Name *</Label>
                  <Input
                    id="organizer_name"
                    name="organizer_name"
                    value={formData.organizer_name}
                    onChange={handleInputChange}
                    required
                    placeholder="Your name or organization"
                    className="border-gray-300 focus:border-blue-500"
                  />
                </div>
                <div>
                  <Label htmlFor="contact_email" className="text-gray-700">Contact Email</Label>
                  <Input
                    id="contact_email"
                    name="contact_email"
                    type="email"
                    value={formData.contact_email}
                    onChange={handleInputChange}
                    placeholder="contact@example.com"
                    className="border-gray-300 focus:border-blue-500"
                  />
                </div>
                <div>
                  <Label htmlFor="contact_phone" className="text-gray-700">Contact Phone</Label>
                  <Input
                    id="contact_phone"
                    name="contact_phone"
                    value={formData.contact_phone}
                    onChange={handleInputChange}
                    placeholder="Phone number"
                    className="border-gray-300 focus:border-blue-500"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex gap-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate("/")}
              className="flex-1 btn-secondary"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="flex-1 btn-primary"
            >
              {isSubmitting ? "Submitting..." : "Submit Event"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventSubmissionForm;
