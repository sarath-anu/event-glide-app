
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  fullName: z.string().min(2, {
    message: "Full name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().min(10, {
    message: "Phone number must be at least 10 digits.",
  }),
  gender: z.enum(["male", "female", "other", "prefer_not_to_say"], {
    message: "Please select a gender option.",
  }),
  attendeeCount: z.coerce.number().min(1, {
    message: "At least 1 attendee is required.",
  }).max(10, {
    message: "Maximum 10 attendees allowed per registration.",
  }),
  address: z.string().optional(),
  specialRequirements: z.string().optional(),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface EventRegistrationFormProps {
  eventName: string;
  onSaveDraft: (data: FormValues) => void;
  onProceedToPayment: (data: FormValues) => void;
  onCancel: () => void;
}

const EventRegistrationForm = ({
  eventName,
  onSaveDraft,
  onProceedToPayment,
  onCancel,
}: EventRegistrationFormProps) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      gender: "prefer_not_to_say",
      attendeeCount: 1,
      address: "",
      specialRequirements: "",
      acceptTerms: false,
    },
  });

  const handleSaveDraft = (data: FormValues) => {
    onSaveDraft(data);
    toast({
      title: "Draft Saved",
      description: "Your registration information has been saved as a draft.",
    });
  };

  return (
    <div className="bg-white rounded-lg p-6">
      <h3 className="text-xl font-semibold mb-4">Register for {eventName}</h3>
      
      <Form {...form}>
        <form className="space-y-6">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your full name" {...field} />
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
                    <Input type="email" placeholder="your.email@example.com" {...field} />
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
                    <Input type="tel" placeholder="Your phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Gender</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="male" id="gender-male" />
                        <Label htmlFor="gender-male">Male</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="female" id="gender-female" />
                        <Label htmlFor="gender-female">Female</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="other" id="gender-other" />
                        <Label htmlFor="gender-other">Other</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="prefer_not_to_say" id="gender-prefer-not" />
                        <Label htmlFor="gender-prefer-not">Prefer not to say</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="attendeeCount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Attendees</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="1" 
                      max="10" 
                      placeholder="Number of people attending"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Enter the total number of people attending (including yourself)</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input placeholder="Your address (optional)" {...field} />
                </FormControl>
                <FormDescription>This information will be used for event communications only.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="specialRequirements"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Special Requirements</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Any special requirements or accessibility needs (optional)" 
                    {...field} 
                  />
                </FormControl>
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
                    I accept the terms and conditions
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
              onClick={() => {
                const isValid = form.trigger();
                if (isValid) {
                  handleSaveDraft(form.getValues());
                }
              }}
            >
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
              onClick={form.handleSubmit(onProceedToPayment)}
            >
              Proceed to Payment
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EventRegistrationForm;
