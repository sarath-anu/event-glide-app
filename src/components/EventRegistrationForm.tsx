
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { EventCategory } from "@/lib/data";
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  List, 
  Users, 
  MessageSquare, 
  Check, 
  Save, 
  Send,
  Clock
} from "lucide-react";

const TIME_SLOTS = [
  "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
  "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM",
  "5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM"
];

const formSchema = z.object({
  fullName: z.string().min(2, {
    message: "Full name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().regex(/^\d{10}$/, {
    message: "Phone number must be exactly 10 digits.",
  }),
  eventName: z.string().min(1, {
    message: "Please select an event.",
  }),
  category: z.string().min(1, {
    message: "Please select a category.",
  }),
  attendeeCount: z.coerce.number().min(1, {
    message: "At least 1 attendee is required.",
  }).max(5, {
    message: "Maximum 5 attendees allowed per registration.",
  }),
  timeSlot: z.string().optional(),
  specialRequirements: z.string().optional(),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface EventRegistrationFormProps {
  eventName: string;
  eventCategory: EventCategory;
  onSaveDraft: (data: FormValues) => void;
  onProceedToPayment: (data: FormValues) => void;
  onCancel: () => void;
}

const EventRegistrationForm = ({
  eventName,
  eventCategory,
  onSaveDraft,
  onProceedToPayment,
  onCancel,
}: EventRegistrationFormProps) => {
  const [formProgress, setFormProgress] = useState(0);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      eventName: eventName,
      category: eventCategory,
      attendeeCount: 1,
      timeSlot: "",
      specialRequirements: "",
      acceptTerms: false,
    },
    mode: "onChange"
  });

  // Calculate form completion progress
  React.useEffect(() => {
    const formState = form.getValues();
    const totalFields = 8; // Count of required fields
    let filledFields = 0;

    if (formState.fullName.length >= 2) filledFields++;
    if (formState.email && formState.email.includes('@')) filledFields++;
    if (/^\d{10}$/.test(formState.phone)) filledFields++;
    if (formState.eventName) filledFields++;
    if (formState.category) filledFields++;
    if (formState.attendeeCount >= 1) filledFields++;
    if (formState.acceptTerms) filledFields++;
    // Time slot and special requirements are optional

    setFormProgress(Math.floor((filledFields / totalFields) * 100));
  }, [form.watch()]);

  const getProgressBarClass = () => {
    if (formProgress < 50) return "low-progress";
    if (formProgress < 100) return "medium-progress";
    return "filled-progress";
  };

  const handleSaveDraft = () => {
    onSaveDraft(form.getValues());
    toast({
      title: "Draft Saved",
      description: "Your registration information has been saved as a draft.",
    });
  };

  return (
    <div className="bg-white rounded-lg p-6">
      <h3 className="text-xl font-semibold mb-4">Register for {eventName}</h3>
      
      <div className="mb-6">
        <p className="text-sm text-muted-foreground mb-2">Registration Progress</p>
        <div className="registration-progress">
          <div 
            className={`registration-progress-bar ${getProgressBarClass()}`} 
            style={{ width: `${formProgress}%` }}
          ></div>
        </div>
      </div>
      
      <Form {...form}>
        <form className="space-y-6">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input className="pl-10" placeholder="Enter your full name" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input className="pl-10" type="email" placeholder="your.email@example.com" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        className="pl-10" 
                        type="tel" 
                        placeholder="10-digit phone number" 
                        {...field}
                        onChange={(e) => {
                          // Only allow digits
                          const value = e.target.value.replace(/\D/g, '');
                          // Limit to 10 digits
                          field.onChange(value.substring(0, 10));
                        }}
                      />
                    </div>
                  </FormControl>
                  <FormDescription>Enter your 10-digit phone number without spaces or hyphens.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="eventName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Name</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        className="pl-10" 
                        placeholder="Event name" 
                        {...field} 
                        disabled 
                      />
                    </div>
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
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <List className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        className="pl-10" 
                        placeholder="Event category" 
                        {...field} 
                        disabled 
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="attendeeCount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Attendees</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        className="pl-10"
                        type="number" 
                        min="1" 
                        max="5" 
                        placeholder="Number of people attending"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormDescription>Enter the total number of people attending (including yourself, maximum 5)</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="timeSlot"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preferred Time Slot (Optional)</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <div className="flex items-center">
                          <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                          <SelectValue placeholder="Select preferred time" />
                        </div>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {TIME_SLOTS.map((time) => (
                        <SelectItem key={time} value={time}>{time}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>Choose your preferred time slot (optional)</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="specialRequirements"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Special Requirements (Optional)</FormLabel>
                <FormControl>
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Textarea 
                      className="pl-10 min-h-[100px]"
                      placeholder="Any special requirements or accessibility needs" 
                      {...field} 
                    />
                  </div>
                </FormControl>
                <FormDescription>Tell us if you have any special requirements or accessibility needs</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="acceptTerms"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    I agree to the terms and conditions
                  </FormLabel>
                  <FormDescription>
                    By checking this box, you agree to our Terms of Service and Privacy Policy.
                  </FormDescription>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button 
              variant="outline" 
              type="button"
              onClick={handleSaveDraft}
              className="flex items-center"
            >
              <Save className="mr-2 h-4 w-4" />
              Save Draft
            </Button>
            
            <Button 
              variant="outline"
              type="button"
              onClick={onCancel}
            >
              Cancel
            </Button>
            
            <Button 
              type="button"
              className="sm:ml-auto"
              disabled={!form.formState.isValid}
              onClick={form.handleSubmit(onProceedToPayment)}
            >
              <Send className="mr-2 h-4 w-4" />
              Proceed to Payment
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EventRegistrationForm;
