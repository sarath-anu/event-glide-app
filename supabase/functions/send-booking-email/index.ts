
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface BookingEmailRequest {
  email: string;
  cardholderName: string;
  eventName: string;
  eventDate: string;
  venue: string;
  city: string;
  ticketType: string;
  quantity: number;
  totalAmount: number;
  bookingReference: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      email, 
      cardholderName, 
      eventName, 
      eventDate, 
      venue, 
      city, 
      ticketType, 
      quantity, 
      totalAmount, 
      bookingReference 
    }: BookingEmailRequest = await req.json();

    const emailResponse = await resend.emails.send({
      from: "EventEase <onboarding@resend.dev>",
      to: [email],
      subject: `Booking Confirmed: ${eventName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #16a34a;">Booking Confirmed!</h1>
          <p>Dear ${cardholderName},</p>
          <p>Your booking for <strong>${eventName}</strong> has been confirmed!</p>
          
          <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2563eb;">
            <h3 style="margin-top: 0; color: #2563eb;">Booking Details:</h3>
            <p><strong>Booking Reference:</strong> ${bookingReference}</p>
            <p><strong>Event:</strong> ${eventName}</p>
            <p><strong>Date:</strong> ${eventDate}</p>
            <p><strong>Venue:</strong> ${venue}</p>
            <p><strong>Location:</strong> ${city}</p>
            <p><strong>Ticket Type:</strong> ${ticketType}</p>
            <p><strong>Quantity:</strong> ${quantity}</p>
            <p><strong>Total Amount:</strong> $${totalAmount}</p>
          </div>
          
          <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0;"><strong>Important:</strong> Please bring this confirmation email or your booking reference to the event.</p>
          </div>
          
          <p>We're excited to see you at the event! If you have any questions, please don't hesitate to contact us.</p>
          
          <p>Best regards,<br>The EventEase Team</p>
        </div>
      `,
    });

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-booking-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
