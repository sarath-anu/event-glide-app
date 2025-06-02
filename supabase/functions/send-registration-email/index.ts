
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface RegistrationEmailRequest {
  email: string;
  fullName: string;
  eventName: string;
  eventDate: string;
  venue: string;
  city: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, fullName, eventName, eventDate, venue, city }: RegistrationEmailRequest = await req.json();

    const emailResponse = await resend.emails.send({
      from: "EventEase <onboarding@resend.dev>",
      to: [email],
      subject: `Registration Confirmed: ${eventName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2563eb;">Registration Confirmed!</h1>
          <p>Dear ${fullName},</p>
          <p>Thank you for registering for <strong>${eventName}</strong>!</p>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Event Details:</h3>
            <p><strong>Event:</strong> ${eventName}</p>
            <p><strong>Date:</strong> ${eventDate}</p>
            <p><strong>Venue:</strong> ${venue}</p>
            <p><strong>Location:</strong> ${city}</p>
          </div>
          
          <p>We're excited to see you at the event! Please keep this email as confirmation of your registration.</p>
          
          <p>If you have any questions, please don't hesitate to contact us.</p>
          
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
    console.error("Error in send-registration-email function:", error);
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
