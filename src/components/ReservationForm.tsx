import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  Users,
  Sparkles,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  CalendarPlus,
  Loader2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { RESTAURANT_INFO } from '../data/restaurant';
import type { ReservationFormData, ReservationResponse } from '../types/reservation';
import { validateReservationForm, getMinReservationDate } from '../utils/validation';
import { submitReservation } from '../services/reservationService';

export const ReservationForm: React.FC = () => {
  const [formData, setFormData] = useState<ReservationFormData>({
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    reservation_date: getMinReservationDate(),
    reservation_time: '19:00',
    guests: 2,
    special_requests: '',
    occasion: 'Romantic Date Night',
    honeypot: '',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<ReservationResponse | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'guests' ? parseInt(value, 10) || 1 : value,
    }));

    // Clear inline error when typing
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Spam honeypot detection
    if (formData.honeypot && formData.honeypot.trim() !== '') {
      console.warn('Spam submission detected by honeypot');
      return;
    }

    const validation = validateReservationForm(formData);
    if (!validation.isValid) {
      setFormErrors(validation.errors);
      return;
    }

    setFormErrors({});
    setIsSubmitting(true);

    try {
      const response = await submitReservation(formData);
      setSubmitResult(response);

      if (response.success) {
        try {
          confetti({
            particleCount: 70,
            spread: 60,
            origin: { y: 0.6 },
            colors: ['#D9B65D', '#E9CC82', '#102E18'],
          });
        } catch {
          // ignore confetti if blocked
        }
      }
    } catch (err) {
      setSubmitResult({
        success: false,
        message: 'Unable to submit reservation request. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmitResult(null);
    setFormData({
      customer_name: '',
      customer_phone: '',
      customer_email: '',
      reservation_date: getMinReservationDate(),
      reservation_time: '19:00',
      guests: 2,
      special_requests: '',
      occasion: 'Romantic Date Night',
      honeypot: '',
    });
  };

  const generateGoogleCalendarUrl = () => {
    if (!submitResult?.details) return '#';
    const { customer_name, reservation_date, reservation_time, guests, booking_id } =
      submitResult.details;

    const [year, month, day] = reservation_date.split('-');
    const [hours, minutes] = reservation_time.split(':');

    const startDate = new Date(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day),
      parseInt(hours),
      parseInt(minutes)
    );
    const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000);

    const formatCalDate = (d: Date) =>
      d.toISOString().replace(/-|:|\.\d\d\d/g, '').slice(0, 15) + 'Z';

    const title = encodeURIComponent(`Table Reservation at Monaco Restaurant — ${customer_name}`);
    const details = encodeURIComponent(
      `Booking ID: ${booking_id}\nGuests: ${guests}\nStatus: Pending Restaurant Confirmation\nAddress: ${RESTAURANT_INFO.address}\nPhone: ${RESTAURANT_INFO.phone}`
    );
    const location = encodeURIComponent(RESTAURANT_INFO.address);

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${formatCalDate(
      startDate
    )}/${formatCalDate(endDate)}&details=${details}&location=${location}`;
  };

  return (
    <section id="reservations" className="bg-monaco-cream py-20 lg:py-28 relative">
      <div className="max-w-7xl xl:max-w-[1400px] 2xl:max-w-[1600px] 3xl:max-w-[1780px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        {/* Main Rounded Container with Gold Border */}
        <div className="bg-[#FFFDF8] rounded-3xl lg:rounded-[2.5rem] border-2 border-monaco-gold shadow-luxury overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
            {/* Left Column: Restaurant Interior Image */}
            <div className="lg:col-span-5 relative min-h-[300px] sm:min-h-[380px] lg:min-h-full overflow-hidden">
              <img
                src={RESTAURANT_INFO.interiorImage}
                alt="Monaco Restaurant luxury dining room interior"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-monaco-deep/60 via-transparent to-transparent pointer-events-none" />

              {/* Interior Atmosphere Badge */}
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-monaco-deep/85 backdrop-blur-md border border-monaco-gold/40 text-monaco-ivory">
                <div className="flex items-center space-x-2 text-monaco-gold mb-1">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-[11px] uppercase tracking-wider font-semibold">
                    The Monaco Ambience
                  </span>
                </div>
                <p className="text-xs text-monaco-cream/80 leading-relaxed font-light">
                  Acoustically tuned for intimate conversation, hand-crafted rattan lanterns, and bespoke leather seating.
                </p>
              </div>
            </div>

            {/* Right Column: Online Reservation Form */}
            <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-center">
              {/* Form Heading & Description */}
              <div className="space-y-2 mb-8">
                <h3 className="font-serif text-3xl sm:text-4xl lg:text-4xl font-bold text-monaco-forest tracking-tight">
                  Online Reservation
                </h3>
                <p className="text-sm sm:text-base text-monaco-darkText/75 font-normal">
                  Booking is fast and easy. Reserve your table for an unforgettable dining experience.
                </p>
              </div>

              {/* Success Result View */}
              {submitResult && submitResult.success ? (
                <div className="bg-monaco-ivory border border-monaco-gold/70 rounded-2xl p-6 sm:p-8 space-y-5 animate-fadeIn">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-7 h-7 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-serif text-xl font-bold text-monaco-forest">
                        Reservation Request Received
                      </h4>
                      <p className="text-sm text-monaco-mutedText mt-1">
                        {submitResult.message}
                      </p>
                    </div>
                  </div>

                  <div className="bg-monaco-cream/80 border border-monaco-gold/40 rounded-xl p-4 text-xs sm:text-sm space-y-2">
                    <div className="flex justify-between items-center pb-2 border-b border-monaco-gold/20">
                      <span className="text-monaco-mutedText uppercase tracking-wider font-medium text-[11px]">
                        Booking Reference
                      </span>
                      <span className="font-mono font-bold text-monaco-forest text-sm bg-monaco-gold/20 px-2.5 py-0.5 rounded">
                        {submitResult.booking_id}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <div>
                        <span className="text-monaco-mutedText block text-[11px]">Date & Time</span>
                        <span className="font-medium text-monaco-darkText">
                          {formData.reservation_date} at {formData.reservation_time}
                        </span>
                      </div>
                      <div>
                        <span className="text-monaco-mutedText block text-[11px]">Guests</span>
                        <span className="font-medium text-monaco-darkText">
                          {formData.guests} Guest{formData.guests > 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>

                    <div className="pt-2">
                      <span className="text-monaco-mutedText block text-[11px]">Status</span>
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-900 border border-amber-300">
                        Pending Restaurant Confirmation
                      </span>
                    </div>
                  </div>

                  {/* Google Calendar Link Button */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <a
                      href={generateGoogleCalendarUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded-full bg-monaco-forest text-monaco-cream text-xs uppercase tracking-wider font-semibold hover:bg-monaco-deep transition-colors"
                    >
                      <CalendarPlus className="w-4 h-4 text-monaco-gold" />
                      <span>Add to Google Calendar</span>
                    </a>

                    <button
                      onClick={handleReset}
                      className="inline-flex items-center justify-center px-5 py-2.5 rounded-full border border-monaco-gold text-monaco-forest text-xs uppercase tracking-wider font-semibold hover:bg-monaco-cream transition-colors"
                    >
                      Reserve Another Table
                    </button>
                  </div>
                </div>
              ) : (
                /* Reservation Form */
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5" noValidate>
                  {submitResult && !submitResult.success && (
                    <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm flex items-start space-x-2">
                      <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                      <div>
                        <p className="font-semibold">Submission failed</p>
                        <p>{submitResult.message}</p>
                      </div>
                    </div>
                  )}

                  <input
                    type="text"
                    name="honeypot"
                    value={formData.honeypot}
                    onChange={handleChange}
                    className="hidden"
                    tabIndex={-1}
                    autoComplete="off"
                  />

                  {/* Row 1: Name and Phone Number */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <input
                        type="text"
                        name="customer_name"
                        value={formData.customer_name}
                        onChange={handleChange}
                        placeholder="Your Name"
                        className={`w-full px-4 py-3 rounded-xl bg-[#FFF5E6] border text-sm text-monaco-darkText placeholder:text-monaco-mutedText/70 focus:outline-none focus:ring-2 focus:ring-monaco-gold transition-colors ${
                          formErrors.customer_name ? 'border-red-400 bg-red-50' : 'border-monaco-gold/40'
                        }`}
                        required
                      />
                      {formErrors.customer_name && (
                        <p className="text-[11px] text-red-600 mt-1">{formErrors.customer_name}</p>
                      )}
                    </div>

                    <div>
                      <input
                        type="tel"
                        name="customer_phone"
                        value={formData.customer_phone}
                        onChange={handleChange}
                        placeholder="Phone Number (e.g. +1 555 12345)"
                        className={`w-full px-4 py-3 rounded-xl bg-[#FFF5E6] border text-sm text-monaco-darkText placeholder:text-monaco-mutedText/70 focus:outline-none focus:ring-2 focus:ring-monaco-gold transition-colors ${
                          formErrors.customer_phone ? 'border-red-400 bg-red-50' : 'border-monaco-gold/40'
                        }`}
                        required
                      />
                      {formErrors.customer_phone && (
                        <p className="text-[11px] text-red-600 mt-1">{formErrors.customer_phone}</p>
                      )}
                    </div>
                  </div>

                  {/* Customer Email */}
                  <div>
                    <input
                      type="email"
                      name="customer_email"
                      value={formData.customer_email}
                      onChange={handleChange}
                      placeholder="Email Address (for booking confirmation)"
                      className={`w-full px-4 py-3 rounded-xl bg-[#FFF5E6] border text-sm text-monaco-darkText placeholder:text-monaco-mutedText/70 focus:outline-none focus:ring-2 focus:ring-monaco-gold transition-colors ${
                        formErrors.customer_email ? 'border-red-400 bg-red-50' : 'border-monaco-gold/40'
                      }`}
                      required
                    />
                    {formErrors.customer_email && (
                      <p className="text-[11px] text-red-600 mt-1">{formErrors.customer_email}</p>
                    )}
                  </div>

                  {/* Row 2: Choose Date, Choose Time, Guests */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <div className="relative">
                        <input
                          type="date"
                          name="reservation_date"
                          min={getMinReservationDate()}
                          value={formData.reservation_date}
                          onChange={handleChange}
                          className={`w-full pl-9 pr-3 py-3 rounded-xl bg-[#FFF5E6] border text-xs sm:text-sm text-monaco-darkText focus:outline-none focus:ring-2 focus:ring-monaco-gold transition-colors ${
                            formErrors.reservation_date ? 'border-red-400' : 'border-monaco-gold/40'
                          }`}
                          required
                        />
                        <CalendarIcon className="w-4 h-4 text-monaco-forest absolute left-3 top-3.5 pointer-events-none" />
                      </div>
                      {formErrors.reservation_date && (
                        <p className="text-[11px] text-red-600 mt-1">{formErrors.reservation_date}</p>
                      )}
                    </div>

                    <div>
                      <div className="relative">
                        <select
                          name="reservation_time"
                          value={formData.reservation_time}
                          onChange={handleChange}
                          className="w-full pl-9 pr-4 py-3 rounded-xl bg-[#FFF5E6] border border-monaco-gold/40 text-xs sm:text-sm text-monaco-darkText focus:outline-none focus:ring-2 focus:ring-monaco-gold transition-colors appearance-none cursor-pointer"
                        >
                          {RESTAURANT_INFO.availableTimes.map((t) => (
                            <option key={t} value={t}>
                              {t}
                            </option>
                          ))}
                        </select>
                        <Clock className="w-4 h-4 text-monaco-forest absolute left-3 top-3.5 pointer-events-none" />
                        <span className="absolute right-3 top-3.5 text-xs text-monaco-mutedText pointer-events-none">
                          &gt;
                        </span>
                      </div>
                    </div>

                    <div>
                      <div className="relative">
                        <select
                          name="guests"
                          value={formData.guests}
                          onChange={handleChange}
                          className="w-full pl-9 pr-4 py-3 rounded-xl bg-[#FFF5E6] border border-monaco-gold/40 text-xs sm:text-sm text-monaco-darkText focus:outline-none focus:ring-2 focus:ring-monaco-gold transition-colors appearance-none cursor-pointer"
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 16].map((num) => (
                            <option key={num} value={num}>
                              {num} {num === 1 ? 'Guest' : 'Guests'}
                            </option>
                          ))}
                        </select>
                        <Users className="w-4 h-4 text-monaco-forest absolute left-3 top-3.5 pointer-events-none" />
                        <span className="absolute right-3 top-3.5 text-xs text-monaco-mutedText pointer-events-none">
                          &gt;
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Row 3: Occasion & Special Requests */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <select
                        name="occasion"
                        value={formData.occasion}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#FFF5E6] border border-monaco-gold/40 text-xs sm:text-sm text-monaco-darkText focus:outline-none focus:ring-2 focus:ring-monaco-gold cursor-pointer"
                      >
                        {RESTAURANT_INFO.occasions.map((occ) => (
                          <option key={occ} value={occ}>
                            {occ}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <input
                        type="text"
                        name="special_requests"
                        value={formData.special_requests}
                        onChange={handleChange}
                        placeholder="Special Requests (e.g. Window table)"
                        className="w-full px-4 py-2.5 rounded-xl bg-[#FFF5E6] border border-monaco-gold/40 text-xs sm:text-sm text-monaco-darkText placeholder:text-monaco-mutedText/70 focus:outline-none focus:ring-2 focus:ring-monaco-gold"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 px-6 rounded-full bg-monaco-forest hover:bg-monaco-deep border border-monaco-gold/50 text-monaco-ivory font-serif text-base sm:text-lg font-semibold tracking-wide transition-all duration-300 shadow-md flex items-center justify-center space-x-2 disabled:opacity-70 group"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin text-monaco-gold" />
                          <span>Sending Reservation Request...</span>
                        </>
                      ) : (
                        <>
                          <span>Book a Table</span>
                          <ArrowRight className="w-4 h-4 text-monaco-gold transition-transform group-hover:translate-x-1" />
                        </>
                      )}
                    </button>
                  </div>

                  <p className="text-[11px] text-center text-monaco-mutedText">
                    * By submitting, your reservation request is logged into our system and forwarded for restaurant confirmation.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
