
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

export type Event = Database['public']['Tables']['events']['Row'];
export type EventInsert = Database['public']['Tables']['events']['Insert'];
export type EventRegistration = Database['public']['Tables']['event_registrations']['Row'];
export type EventRegistrationInsert = Database['public']['Tables']['event_registrations']['Insert'];
export type EventBooking = Database['public']['Tables']['event_bookings']['Row'];
export type EventBookingInsert = Database['public']['Tables']['event_bookings']['Insert'];

// Event functions
export const getEvents = async () => {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('status', 'approved')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
};

export const getFeaturedEvents = async () => {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('status', 'approved')
    .eq('featured', true)
    .order('created_at', { ascending: false })
    .limit(6);
  
  if (error) throw error;
  return data || [];
};

export const getTrendingEvents = async () => {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('status', 'approved')
    .eq('trending', true)
    .order('likes', { ascending: false })
    .limit(6);
  
  if (error) throw error;
  return data || [];
};

export const getEventById = async (id: string) => {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .eq('status', 'approved')
    .single();
  
  if (error) throw error;
  return data;
};

export const getEventsByCategory = async (category: string) => {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('status', 'approved')
    .eq('category', category)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
};

export const searchEvents = async (query: string) => {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('status', 'approved')
    .or(`name.ilike.%${query}%, description.ilike.%${query}%, city.ilike.%${query}%`)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
};

export const createEvent = async (eventData: EventInsert) => {
  const { data, error } = await supabase
    .from('events')
    .insert(eventData)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

// Registration functions
export const createEventRegistration = async (registrationData: EventRegistrationInsert) => {
  const { data, error } = await supabase
    .from('event_registrations')
    .insert(registrationData)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const getUserRegistrations = async (userId: string) => {
  const { data, error } = await supabase
    .from('event_registrations')
    .select(`
      *,
      events (*)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
};

export const getEventRegistrations = async (eventId: string) => {
  const { data, error } = await supabase
    .from('event_registrations')
    .select('*')
    .eq('event_id', eventId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
};

// Booking functions
export const createEventBooking = async (bookingData: EventBookingInsert) => {
  const { data, error } = await supabase
    .from('event_bookings')
    .insert(bookingData)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const getUserBookings = async (userId: string) => {
  const { data, error } = await supabase
    .from('event_bookings')
    .select(`
      *,
      events (*)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
};

export const updateBookingPaymentStatus = async (bookingId: string, status: 'completed' | 'failed' | 'refunded') => {
  const { data, error } = await supabase
    .from('event_bookings')
    .update({ payment_status: status, updated_at: new Date().toISOString() })
    .eq('id', bookingId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};
