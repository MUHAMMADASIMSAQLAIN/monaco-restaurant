export interface ReservationFormData {
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  reservation_date: string;
  reservation_time: string;
  guests: number;
  special_requests?: string;
  occasion?: string;
  honeypot?: string; // Anti-spam hidden field
}

export interface ReservationPayload {
  booking_id: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  reservation_date: string;
  reservation_time: string;
  requested_time?: string;
  guests: number;
  special_requests: string;
  occasion: string;
  restaurant_name: string;
  submitted_at: string;
  booking_status: 'Pending' | 'Confirmed' | 'Declined';
  slot_adjusted?: boolean;
  adjustment_reason?: string;
}

export interface ReservationResponse {
  success: boolean;
  booking_id?: string;
  status?: string;
  message: string;
  details?: ReservationPayload;
  error?: string;
  adjusted_slot?: boolean;
  original_time?: string;
  assigned_time?: string;
}

export interface SlotAvailability {
  time: string;
  status: 'available' | 'high_demand' | 'booked';
  remainingTables: number;
}
