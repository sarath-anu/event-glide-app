
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/hooks/use-toast";
import { createEvent } from "@/lib/supabase-data";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, MapPin, Users, DollarSign, FileText, Tag } from "lucide-react";

const EventSubmissionForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    shortDescription: "",
    category: "",
    eventDate: "",
    eventTime: "",
    venue: "",
    city: "",
    totalCapacity: "",
    organizerName: "",
    contactPhone: "",
    contactEmail: "",
    bookingOpeningDate: "",
    imageUrl: "",
    tags: "",
    eventType: "free", // free or paid
    priceStandard: "",
    priceVip: "",
    priceGroup: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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
    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please log in to submit an event.",
          variant: "destructive",
        });
        return;
      }

      const tagsArray = formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : [];

      const eventData = {
        name: formData.name,
        description: formData.description,
        short_description: formData.shortDescription,
        category: formData.category,
        event_date: formData.eventDate,
        event_time: formData.eventTime,
        venue: formData.venue,
        city: formData.city,
        total_capacity: parseInt(formData.totalCapacity),
        organizer_name: formData.organizerName,
        contact_phone: formData.contactPhone || null,
        contact_email: formData.contactEmail || null,
        booking_opening_date: formData.bookingOpeningDate,
        image_url: formData.imageUrl || null,
        tags: tagsArray,
        organizer_id: user.id,
        price_standard: formData.eventType === 'paid' ? parseFloat(formData.priceStandard) || 0 : 0,
        price_vip: formData.eventType === 'paid' ? parseFloat(formData.priceVip) || 0 : 0,
        price_group: formData.eventType === 'paid' ? parseFloat(formData.priceGroup) || 0 : 0,
        status: 'pending'
      };

      await createEvent(eventData);

      toast({
        title: "Event Submitted Successfully!",
        description: "Your event has been submitted for approval. You'll be notified once it's reviewed.",
      });

      // Reset form
      setFormData({
        name: "",
        description: "",
        shortDescription: "",
        category: "",
        eventDate: "",
        eventTime: "",
        venue: "",
        city: "",
        totalCapacity: "",
        organizerName: "",
        contactPhone: "",
        contactEmail: "",
        bookingOpeningDate: "",
        imageUrl: "",
        tags: "",
        eventType: "free",
        priceStandard: "",
        priceVip: "",
        priceGroup: "",
      });

    } catch (error: any) {
      console.error("Event submission error:", error);
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
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-orange-50 to-purple-50 py-8">
      <div className="container max-w-4xl mx-auto px-4">
        <Card className="border-2 border-orange-200 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-lg">
            <CardTitle className="text-2xl font-bold text-center">Submit Your Event</CardTitle>
            <p className="text-center text-purple-100">Share your amazing event with the community!</p>
          </CardHeader>
          
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-purple-800 flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Basic Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Event Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter event name"
                      className="border-2 border-orange-200 focus:border-orange-400"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select onValueChange={(value) => handleSelectChange('category', value)} required>
                      <SelectTrigger className="border-2 border-orange-200 focus:border-orange-400">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sports">Sports</SelectItem>
                        <SelectItem value="college">College</SelectItem>
                        <SelectItem value="entertainment">Entertainment</SelectItem>
                        <SelectItem value="circus">Circus</SelectItem>
                        <SelectItem value="theater">Theater</SelectItem>
                        <SelectItem value="music">Music</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="shortDescription">Short Description *</Label>
                  <Input
                    id="shortDescription"
                    name="shortDescription"
                    value={formData.shortDescription}
                    onChange={handleInputChange}
                    required
                    placeholder="Brief description for event cards"
                    className="border-2 border-orange-200 focus:border-orange-400"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Full Description *</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    placeholder="Detailed description of your event"
                    rows={4}
                    className="border-2 border-orange-200 focus:border-orange-400"
                  />
                </div>

                <div>
                  <Label htmlFor="tags">Tags (comma-separated)</Label>
                  <div className="relative">
                    <Tag className="absolute left-3 top-3 h-4 w-4 text-purple-500" />
                    <Input
                      id="tags"
                      name="tags"
                      value={formData.tags}
                      onChange={handleInputChange}
                      placeholder="music, outdoor, family-friendly"
                      className="pl-10 border-2 border-orange-200 focus:border-orange-400"
                    />
                  </div>
                </div>
              </div>

              {/* Date & Location */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-purple-800 flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Date & Location
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="eventDate">Event Date *</Label>
                    <Input
                      id="eventDate"
                      name="eventDate"
                      type="date"
                      value={formData.eventDate}
                      onChange={handleInputChange}
                      required
                      className="border-2 border-orange-200 focus:border-orange-400"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="eventTime">Event Time *</Label>
                    <Input
                      id="eventTime"
                      name="eventTime"
                      type="time"
                      value={formData.eventTime}
                      onChange={handleInputChange}
                      required
                      className="border-2 border-orange-200 focus:border-orange-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="venue">Venue *</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-green-500" />
                      <Input
                        id="venue"
                        name="venue"
                        value={formData.venue}
                        onChange={handleInputChange}
                        required
                        placeholder="Event venue"
                        className="pl-10 border-2 border-orange-200 focus:border-orange-400"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      placeholder="City"
                      className="border-2 border-orange-200 focus:border-orange-400"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="bookingOpeningDate">Booking Opening Date *</Label>
                  <Input
                    id="bookingOpeningDate"
                    name="bookingOpeningDate"
                    type="date"
                    value={formData.bookingOpeningDate}
                    onChange={handleInputChange}
                    required
                    className="border-2 border-orange-200 focus:border-orange-400"
                  />
                </div>
              </div>

              {/* Capacity & Pricing */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-purple-800 flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Capacity & Pricing
                </h3>
                
                <div>
                  <Label htmlFor="totalCapacity">Total Capacity *</Label>
                  <Input
                    id="totalCapacity"
                    name="totalCapacity"
                    type="number"
                    value={formData.totalCapacity}
                    onChange={handleInputChange}
                    required
                    placeholder="Maximum number of attendees"
                    className="border-2 border-orange-200 focus:border-orange-400"
                  />
                </div>

                <div>
                  <Label className="text-base font-medium">Event Type *</Label>
                  <RadioGroup 
                    value={formData.eventType} 
                    onValueChange={(value) => handleSelectChange('eventType', value)}
                    className="flex gap-6 mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="free" id="free" />
                      <Label htmlFor="free" className="text-green-600 font-medium">Free Event</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="paid" id="paid" />
                      <Label htmlFor="paid" className="text-orange-600 font-medium">Paid Event</Label>
                    </div>
                  </RadioGroup>
                </div>

                {formData.eventType === 'paid' && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-orange-50 rounded-lg border-2 border-orange-200">
                    <div>
                      <Label htmlFor="priceStandard">Standard Price ($)</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-3 h-4 w-4 text-green-500" />
                        <Input
                          id="priceStandard"
                          name="priceStandard"
                          type="number"
                          step="0.01"
                          value={formData.priceStandard}
                          onChange={handleInputChange}
                          placeholder="50.00"
                          className="pl-10 border-2 border-orange-300 focus:border-orange-400"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="priceVip">VIP Price ($)</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-3 h-4 w-4 text-purple-500" />
                        <Input
                          id="priceVip"
                          name="priceVip"
                          type="number"
                          step="0.01"
                          value={formData.priceVip}
                          onChange={handleInputChange}
                          placeholder="120.00"
                          className="pl-10 border-2 border-orange-300 focus:border-orange-400"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="priceGroup">Group Price ($)</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-3 h-4 w-4 text-blue-500" />
                        <Input
                          id="priceGroup"
                          name="priceGroup"
                          type="number"
                          step="0.01"
                          value={formData.priceGroup}
                          onChange={handleInputChange}
                          placeholder="40.00"
                          className="pl-10 border-2 border-orange-300 focus:border-orange-400"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Organizer Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-purple-800">Organizer Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="organizerName">Organizer Name *</Label>
                    <Input
                      id="organizerName"
                      name="organizerName"
                      value={formData.organizerName}
                      onChange={handleInputChange}
                      required
                      placeholder="Your name or organization"
                      className="border-2 border-orange-200 focus:border-orange-400"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="contactEmail">Contact Email</Label>
                    <Input
                      id="contactEmail"
                      name="contactEmail"
                      type="email"
                      value={formData.contactEmail}
                      onChange={handleInputChange}
                      placeholder="contact@example.com"
                      className="border-2 border-orange-200 focus:border-orange-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contactPhone">Contact Phone</Label>
                    <Input
                      id="contactPhone"
                      name="contactPhone"
                      type="tel"
                      value={formData.contactPhone}
                      onChange={handleInputChange}
                      placeholder="Phone number"
                      className="border-2 border-orange-200 focus:border-orange-400"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="imageUrl">Event Image URL</Label>
                    <Input
                      id="imageUrl"
                      name="imageUrl"
                      type="url"
                      value={formData.imageUrl}
                      onChange={handleInputChange}
                      placeholder="https://example.com/image.jpg"
                      className="border-2 border-orange-200 focus:border-orange-400"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 text-lg"
                >
                  {isSubmitting ? "Submitting..." : "Submit Event for Review"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EventSubmissionForm;
