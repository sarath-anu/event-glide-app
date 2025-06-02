import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

export type Event = Database['public']['Tables']['events']['Row'];
export type EventInsert = Database['public']['Tables']['events']['Insert'];
export type EventRegistration = Database['public']['Tables']['event_registrations']['Row'];
export type EventRegistrationInsert = Database['public']['Tables']['event_registrations']['Insert'];
export type EventBooking = Database['public']['Tables']['event_bookings']['Row'];
export type EventBookingInsert = Database['public']['Tables']['event_bookings']['Insert'];
export type EventLike = Database['public']['Tables']['event_likes']['Row'];
export type EventLikeInsert = Database['public']['Tables']['event_likes']['Insert'];
export type EventReview = Database['public']['Tables']['event_reviews']['Row'];
export type EventReviewInsert = Database['public']['Tables']['event_reviews']['Insert'];
export type PaymentInvoice = Database['public']['Tables']['payment_invoices']['Row'];
export type PaymentInvoiceInsert = Database['public']['Tables']['payment_invoices']['Insert'];
export type UserRole = Database['public']['Tables']['user_roles']['Row'];

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

// Admin functions
export const getAllEventsForAdmin = async () => {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
};

export const updateEventStatus = async (eventId: string, status: 'approved' | 'rejected' | 'pending') => {
  const { data, error } = await supabase
    .from('events')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', eventId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const getUserRole = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', userId);
  
  if (error) throw error;
  return data || [];
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

// Like functions
export const toggleEventLike = async (eventId: string, userId: string) => {
  // Check if like exists
  const { data: existingLike } = await supabase
    .from('event_likes')
    .select('id')
    .eq('event_id', eventId)
    .eq('user_id', userId)
    .single();

  if (existingLike) {
    // Unlike
    const { error } = await supabase
      .from('event_likes')
      .delete()
      .eq('id', existingLike.id);
    
    if (error) throw error;
    return false;
  } else {
    // Like
    const { error } = await supabase
      .from('event_likes')
      .insert({ event_id: eventId, user_id: userId });
    
    if (error) throw error;
    return true;
  }
};

export const getUserEventLike = async (eventId: string, userId: string) => {
  const { data, error } = await supabase
    .from('event_likes')
    .select('id')
    .eq('event_id', eventId)
    .eq('user_id', userId)
    .single();
  
  return !!data;
};

// Review functions
export const createEventReview = async (reviewData: EventReviewInsert) => {
  const { data, error } = await supabase
    .from('event_reviews')
    .insert(reviewData)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const updateEventReview = async (reviewId: string, reviewData: Partial<EventReviewInsert>) => {
  const { data, error } = await supabase
    .from('event_reviews')
    .update({ ...reviewData, updated_at: new Date().toISOString() })
    .eq('id', reviewId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const getEventReviews = async (eventId: string) => {
  const { data, error } = await supabase
    .from('event_reviews')
    .select('*')
    .eq('event_id', eventId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
};

export const getUserEventReview = async (eventId: string, userId: string) => {
  const { data, error } = await supabase
    .from('event_reviews')
    .select('*')
    .eq('event_id', eventId)
    .eq('user_id', userId)
    .single();
  
  return data;
};

// Invoice functions
export const createPaymentInvoice = async (invoiceData: PaymentInvoiceInsert) => {
  const { data, error } = await supabase
    .from('payment_invoices')
    .insert(invoiceData)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const getUserInvoices = async (userId: string) => {
  const { data, error } = await supabase
    .from('payment_invoices')
    .select(`
      *,
      event_bookings (
        *,
        events (name)
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
};

export const getInvoiceById = async (invoiceId: string) => {
  const { data, error } = await supabase
    .from('payment_invoices')
    .select(`
      *,
      event_bookings (
        *,
        events (*)
      )
    `)
    .eq('id', invoiceId)
    .single();
  
  if (error) throw error;
  return data;
};
