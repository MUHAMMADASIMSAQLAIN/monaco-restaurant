export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export const validateReservationForm = (data: {
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  reservation_date: string;
  reservation_time: string;
  guests: number;
}): ValidationResult => {
  const errors: Record<string, string> = {};

  // Name validation
  if (!data.customer_name || data.customer_name.trim().length < 2) {
    errors.customer_name = 'Please provide your full name (at least 2 characters).';
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.customer_email || !emailRegex.test(data.customer_email.trim())) {
    errors.customer_email = 'Please provide a valid email address.';
  }

  // Phone validation (flexible for international formats: numbers, +, dashes, spaces, min 7 digits)
  const phoneDigits = (data.customer_phone || '').replace(/\D/g, '');
  if (!data.customer_phone || phoneDigits.length < 7) {
    errors.customer_phone = 'Please provide a valid contact phone number with country/area code.';
  }

  // Date validation (must not be past date)
  if (!data.reservation_date) {
    errors.reservation_date = 'Please select a reservation date.';
  } else {
    const selectedDate = new Date(data.reservation_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    // Account for timezone date string YYYY-MM-DD
    const parts = data.reservation_date.split('-');
    if (parts.length === 3) {
      const selectedYear = parseInt(parts[0], 10);
      const selectedMonth = parseInt(parts[1], 10) - 1;
      const selectedDay = parseInt(parts[2], 10);
      const targetDate = new Date(selectedYear, selectedMonth, selectedDay);
      if (targetDate < today) {
        errors.reservation_date = 'Reservation date cannot be in the past.';
      }
    } else if (selectedDate < today) {
      errors.reservation_date = 'Reservation date cannot be in the past.';
    }
  }

  // Time validation
  if (!data.reservation_time) {
    errors.reservation_time = 'Please select a dining time.';
  }

  // Guests validation
  if (!data.guests || data.guests < 1 || data.guests > 20) {
    errors.guests = 'Please select between 1 and 20 guests.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const getMinReservationDate = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};
