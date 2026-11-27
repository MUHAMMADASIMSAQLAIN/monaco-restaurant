# MONACO RESTAURANT — Fine Dining Website & Zapier Reservation Automation

> **Live Luxury Dining Experience & Autonomous Booking Automation Engine**  
> Inspired by European Michelin-pedigree dining aesthetics and modern multi-step Zapier automation workflows.

---

## 🌟 Executive Summary

**Monaco Restaurant** is a full-stack premium restaurant web application designed to reflect the visual quality, layout, spacing, typography, and luxury dining experience of world-class establishments. It includes:

1. **Aesthetic Visual Design**:
   - Palette: Deep Forest Green (`#102E18`, `#0A2112`), Warm Cream (`#FFF1D9`), Light Ivory (`#FFF8EA`), Champagne Gold (`#D9B65D`), Terracotta (`#C96F43`).
   - Typography: **Cormorant Garamond** and **Playfair Display** for headings paired with **Plus Jakarta Sans** for body.
   - Organic curved hero section with gourmet plated food photography and subtle gold halo accents.
   - **Circular Signature Dishes section**: 6 signature culinary items distributed on an ornamental gold circle with quick-add shopping cart buttons.
   - **Split Menu Section**: Interactive vertical category selector with real-time dish cards and add-to-cart functionality.
   - **Client-Side Shopping Cart Drawer**: Real-time quantity adjustments, price calculations, local dining tax, and `localStorage` persistence.
   - **Online Reservation Form**: High-end interior imagery, date/time pickers with past-date prevention, guest counts, and anti-spam honeypot.
2. **Zapier Automation Architecture**:
   - Secure serverless endpoint: `POST /api/reservations`.
   - Never exposes private Zapier Webhook URLs in frontend client code.
   - Forwards structured JSON payloads to **Zapier Catch Hook**.
   - Logs bookings directly into **Google Sheets** ("Monaco Restaurant Reservations").
   - Triggers automated **Customer Confirmation Emails** via Gmail / Zapier Mail.
   - Dispatches **Restaurant Owner Alerts** via WhatsApp / SMS / Email.
   - Synchronizes table reservations with **Google Calendar**.

---

## 🏗️ Project Architecture

```
monaco-restaurant/
├── api/
│   └── reservations.ts         # Secure Vercel Serverless Function (POST /api/reservations)
├── public/
│   └── favicon.svg             # Custom luxury gold Monaco monogram
├── src/
│   ├── assets/                 # Icons & brand assets
│   ├── components/
│   │   ├── Navbar.tsx          # Sticky luxury navigation with cart badge & mobile drawer
│   │   ├── Hero.tsx            # Organic curved hero with gourmet lamb dish & gold halo
│   │   ├── SignatureDishes.tsx # Circular 6-dish composition matching reference image
│   │   ├── MenuSection.tsx     # Split category selector and 4-column menu cards
│   │   ├── CartDrawer.tsx      # Slide-out shopping cart with order summary
│   │   ├── OurStory.tsx        # Brand philosophy and culinary director quote
│   │   ├── Gallery.tsx         # Responsive photo gallery with interactive Lightbox
│   │   ├── ReservationForm.tsx # Table booking form with past-date blocking & Zapier API
│   │   ├── Footer.tsx          # Deep green footer with brand links & social icons
│   │   └── ToastNotification.tsx # Quick toast notification on dish addition
│   ├── context/
│   │   └── CartContext.tsx     # React Cart state persisted in localStorage
│   ├── data/
│   │   ├── menu.ts             # Rich menu items across Pasta, Steak, Pizza, Dessert, Drinks, Salads
│   │   └── restaurant.ts       # Central restaurant details, hours, and photos
│   ├── services/
│   │   └── reservationService.ts # Client API service with graceful fallback
│   ├── types/
│   │   ├── menu.ts             # TypeScript interfaces for dishes & cart
│   │   └── reservation.ts      # TypeScript interfaces for reservation payloads & responses
│   ├── utils/
│   │   └── validation.ts       # Form validation & min-date calculators
│   ├── App.tsx                 # Root application composition
│   ├── index.css               # Tailwind directives & custom luxury styles
│   └── main.tsx                # React 19 entry point
├── scripts/
│   └── test-zapier-webhook.js  # CLI utility to test Zapier Catch Hook directly
├── .env.example                # Sample environment variables
├── vercel.json                 # Vercel deployment routing & caching
├── package.json
├── tailwind.config.js          # Custom colors, fonts, and shadows
└── vite.config.ts              # Vite config with local dev API middleware
```

---

## ⚡ Quick Start (Local Development)

### Prerequisites
- Node.js (v18 or higher)
- npm or pnpm

### 1. Installation
Clone the repository or navigate to the project directory:
```bash
cd "C:\Users\Muhammad Asim\.gemini\antigravity\scratch\monaco-restaurant"
npm install
```

### 2. Environment Configuration
Copy the sample environment file:
```bash
cp .env.example .env
```

Open `.env` and set your Zapier Webhook URL (or leave blank to use the built-in development simulation mode):
```env
ZAPIER_RESERVATION_WEBHOOK_URL=https://hooks.zapier.com/hooks/catch/XXXXXX/YYYYYY/
```

### 3. Start Development Server
```bash
npm run dev
```
The application will start at `http://localhost:5173` (or the next available port). The local Vite server includes built-in middleware for `/api/reservations`, so the reservation form works immediately without needing an external backend!

### 4. Build for Production
```bash
npm run build
```

---

## ⚡ Zapier Automation Architecture & Setup Guide

The automation workflow executes the following pipeline upon every customer booking:

```
Customer
  │
  ▼
Website Reservation Form
  │
  ▼
Secure Backend Endpoint (POST /api/reservations)
  │
  ▼
Zapier Catch Hook Trigger
  │
  ├──► Action 1: Google Sheets (Append Row to "Bookings")
  │
  ├──► Action 2: Customer Confirmation Email (Gmail / Zapier Mail)
  │
  ├──► Action 3: Restaurant Owner Alert (WhatsApp / SMS / Email)
  │
  └──► Action 4 (Optional): Google Calendar (Create Event)
```

### Step A: Zapier Catch Hook Configuration
1. Log in to [Zapier](https://zapier.com).
2. Click **Create Zap**.
3. **Trigger**:
   - App: **Webhooks by Zapier**
   - Event: **Catch Hook**
   - Click **Continue**.
4. Zapier will provide your unique Webhook URL, formatted like:
   `https://hooks.zapier.com/hooks/catch/1234567/abcdefg/`
5. Test the Catch Hook with the built-in test script:
   ```bash
   node scripts/test-zapier-webhook.js https://hooks.zapier.com/hooks/catch/1234567/abcdefg/
   ```
6. In Zapier, click **Test Trigger**. You will see the incoming payload:
   ```json
   {
     "booking_id": "MON-20261224-TEST",
     "customer_name": "Lady Eleanor Vance",
     "customer_phone": "+377 98 06 20 00",
     "customer_email": "eleanor.vance@example.com",
     "reservation_date": "2026-12-24",
     "reservation_time": "20:00",
     "guests": 4,
     "special_requests": "Window alcove table",
     "occasion": "Wedding Anniversary",
     "restaurant_name": "Monaco Restaurant",
     "submitted_at": "2026-11-27T10:55:00.000Z",
     "booking_status": "Pending"
   }
   ```

---

### Step B: Google Sheets Booking Log Setup
1. Create a Google Spreadsheet titled: **`Monaco Restaurant Reservations`**
2. Rename the first worksheet to: **`Bookings`**
3. Create the following header row in Row 1:
   | A | B | C | D | E | F | G | H | I | J | K |
   |---|---|---|---|---|---|---|---|---|---|---|
   | **Booking ID** | **Customer Name** | **Phone** | **Email** | **Reservation Date** | **Reservation Time** | **Guests** | **Special Requests** | **Occasion** | **Booking Status** | **Submitted At** |
4. In your Zap:
   - Add Step: **Google Sheets** -> **Create Spreadsheet Row**
   - Select your Google account and spreadsheet: `Monaco Restaurant Reservations`
   - Select the worksheet: `Bookings`
   - Map each column:
     - `Booking ID` -> `{{1. booking_id}}`
     - `Customer Name` -> `{{1. customer_name}}`
     - `Phone` -> `{{1. customer_phone}}`
     - `Email` -> `{{1. customer_email}}`
     - `Reservation Date` -> `{{1. reservation_date}}`
     - `Reservation Time` -> `{{1. reservation_time}}`
     - `Guests` -> `{{1. guests}}`
     - `Special Requests` -> `{{1. special_requests}}`
     - `Occasion` -> `{{1. occasion}}`
     - `Booking Status` -> `{{1. booking_status}}`
     - `Submitted At` -> `{{1. submitted_at}}`

---

### Step C: Customer Confirmation Email Setup
1. In Zapier, add an action: **Gmail** (or **Email by Zapier**) -> **Send Email**.
2. **To**: `{{1. customer_email}}`
3. **Subject**: `Reservation Request Received — Monaco Restaurant`
4. **Body Type**: HTML
5. **Body**:
```html
<div style="font-family: 'Georgia', serif; background-color: #0A2112; color: #FFF8EA; padding: 40px 20px; text-align: center;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #102E18; border: 2px solid #D9B65D; border-radius: 16px; padding: 32px;">
    <h1 style="color: #D9B65D; letter-spacing: 4px; margin: 0 0 8px 0; font-size: 28px;">MONACO</h1>
    <p style="font-size: 11px; letter-spacing: 3px; color: #E9CC82; text-transform: uppercase; margin-top: 0;">RESTAURANT — FINE DINING</p>
    
    <hr style="border: none; border-top: 1px solid rgba(217, 182, 93, 0.4); margin: 24px 0;" />
    
    <h2 style="font-size: 20px; font-weight: normal; color: #FFF8EA;">Dear {{1. customer_name}},</h2>
    <p style="color: #FFF1D9; font-size: 14px; line-height: 1.6;">
      Thank you for choosing Monaco Restaurant. We have received your table reservation request.
    </p>

    <div style="background-color: #0A2112; border: 1px solid rgba(217, 182, 93, 0.3); border-radius: 12px; padding: 18px; margin: 24px 0; text-align: left; font-size: 14px;">
      <p style="margin: 6px 0;"><strong style="color: #D9B65D;">Booking Reference:</strong> {{1. booking_id}}</p>
      <p style="margin: 6px 0;"><strong style="color: #D9B65D;">Date:</strong> {{1. reservation_date}}</p>
      <p style="margin: 6px 0;"><strong style="color: #D9B65D;">Time:</strong> {{1. reservation_time}}</p>
      <p style="margin: 6px 0;"><strong style="color: #D9B65D;">Party Size:</strong> {{1. guests}} Guests</p>
      <p style="margin: 6px 0;"><strong style="color: #D9B65D;">Occasion:</strong> {{1. occasion}}</p>
      <p style="margin: 6px 0;"><strong style="color: #D9B65D;">Special Requests:</strong> {{1. special_requests}}</p>
      <p style="margin: 6px 0;"><strong style="color: #D9B65D;">Status:</strong> <span style="background-color: #fef3c7; color: #92400e; padding: 2px 8px; border-radius: 9999px; font-weight: bold; font-size: 12px;">Pending Restaurant Confirmation</span></p>
    </div>

    <p style="font-size: 13px; color: #FFF1D9; line-height: 1.6; font-style: italic;">
      * Please note: Your reservation request has been received and our Maître d' will contact you shortly to confirm your table availability.
    </p>

    <div style="margin-top: 32px; font-size: 12px; color: #D9B65D;">
      <p style="margin: 4px 0;">742 Avenue des Beaux-Arts, Monte Carlo</p>
      <p style="margin: 4px 0;">Telephone: +377 98 06 20 00</p>
    </div>
  </div>
</div>
```

---

### Step D: Restaurant Owner Alert Setup
1. In Zapier, add an action: **Twilio** / **WhatsApp Notifications by Zapier** / **Slack** / **Gmail**.
2. **Alert Message Template**:
```
🛎️ [NEW MONACO BOOKING REQUEST]
-----------------------------------------
Booking ID: {{1. booking_id}}
Customer: {{1. customer_name}}
Phone: {{1. customer_phone}}
Email: {{1. customer_email}}
Date & Time: {{1. reservation_date}} at {{1. reservation_time}}
Guests: {{1. guests}}
Occasion: {{1. occasion}}
Requests: {{1. special_requests}}
Status: Pending Confirmation
Submitted: {{1. submitted_at}}
-----------------------------------------
Action Required: Review table layout and confirm booking with customer.
```

---

### Step E: Optional Google Calendar Event Setup
1. In Zapier, add action: **Google Calendar** -> **Create Detailed Event**.
2. **Event Title**: `Monaco Restaurant: {{1. customer_name}} ({{1. guests}} Guests)`
3. **Start Date & Time**: `{{1. reservation_date}} {{1. reservation_time}}`
4. **Duration**: 2 Hours (configurable)
5. **Location**: `742 Avenue des Beaux-Arts, Monte Carlo`
6. **Description**:
```
Table Reservation at Monaco Restaurant
Ref: {{1. booking_id}}
Customer: {{1. customer_name}} ({{1. customer_phone}} / {{1. customer_email}})
Guests: {{1. guests}}
Occasion: {{1. occasion}}
Notes: {{1. special_requests}}
Status: Pending Confirmation
```

---

## 🔒 Security Best Practices

- **Zero Client Credential Leakage**: The frontend code never has access to the Zapier Catch Hook URL.
- **Serverless API Proxy**: Requests are routed through `/api/reservations`.
- **Honeypot Protection**: An invisible `honeypot` field catches automated spam bots without burdening genuine diners with annoying CAPTCHAs.
- **Rate Limiting**: Built-in IP rate limiter stops abusive mass submissions.
- **Input Sanitization**: HTML tag stripping prevents XSS attacks in booking notes.

---

## 🚀 Deploying to Vercel

### Option 1: Vercel CLI
```bash
npm install -g vercel
vercel login
vercel
```

When prompted:
1. Link to existing project? **No**
2. Project name: **monaco-restaurant**
3. Framework preset: **Vite**
4. Set environment variable:
   ```bash
   vercel env add ZAPIER_RESERVATION_WEBHOOK_URL
   ```
5. Deploy to production:
   ```bash
   vercel --prod
   ```

### Option 2: Vercel Git Integration
1. Push this repository to GitHub / GitLab.
2. Go to [vercel.com/new](https://vercel.com/new).
3. Import the repository.
4. Under **Environment Variables**, add:
   - **Key**: `ZAPIER_RESERVATION_WEBHOOK_URL`
   - **Value**: Your Zapier Catch Hook URL
5. Click **Deploy**. Vercel will build the frontend assets and automatically host `api/reservations.ts` as a serverless function!

---

## 📄 License
© 2026 Monaco Restaurant. All Rights Reserved. Built for luxury hospitality.
