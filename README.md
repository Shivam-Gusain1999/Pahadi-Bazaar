# Ticket Reservation System 🎫

A full-stack ticket reservation system built with the MERN stack (MongoDB, Express.js, React, Node.js) that allows users to browse events and book tickets with **guaranteed seat consistency**.

## 🌐 Live Demo

- **Frontend**: [https://pahadi-bazaar-website.vercel.app](https://pahadi-bazaar-website.vercel.app)
- **Backend API**: [Your Backend URL]

## ✨ Features

- **Browse Events**: View all available events with category filters
- **Real-time Seat Availability**: See live seat counts that update immediately
- **Instant Booking**: Book multiple tickets with immediate confirmation
- **Seat Consistency**: Atomic operations prevent overbooking
- **Booking Management**: View and cancel your bookings
- **Dark Mode**: Toggle between light and dark themes
- **Responsive Design**: Works on all devices

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19, React Router, TailwindCSS 4 |
| Backend | Node.js, Express.js 5 |
| Database | MongoDB with Mongoose |
| Deployment | Vercel (Frontend), [Backend Host] |

## 🚀 Setup Instructions

### Prerequisites
- Node.js 18+
- MongoDB Atlas account or local MongoDB
- npm or yarn

### Clone & Install

```bash
# Clone the repository
git clone https://github.com/yourusername/ticket-reservation.git
cd ticket-reservation

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### Environment Variables

**Server (.env)**
```env
PORT=5000
MONGODB_URI=mongodb+srv://your-connection-string
NODE_ENV=development
```

**Client (.env)**
```env
VITE_BACKEND_URL=http://localhost:5000
```

### Run Locally

```bash
# Terminal 1: Start server
cd server
npm run dev

# Terminal 2: Start client
cd client
npm run dev
```

### Seed Sample Events
After starting, hit the seed endpoint or click "Load Sample Events" on the homepage:
```bash
curl -X POST http://localhost:5000/api/seed
```

## 📁 Project Structure

```
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── context/       # React Context for state
│   │   ├── pages/         # Page components
│   │   └── App.jsx        # Main app with routing
│   └── package.json
│
├── server/                 # Express Backend
│   ├── src/
│   │   ├── controllers/   # Route handlers
│   │   ├── models/        # MongoDB schemas
│   │   ├── routes/        # API routes
│   │   └── app.js         # Express app setup
│   └── package.json
│
└── README.md
```

## 🔑 Key Decisions & Assumptions

### Seat Consistency (Critical)
Used **MongoDB atomic `findOneAndUpdate`** with conditions to prevent race conditions:

```javascript
const result = await Event.findOneAndUpdate(
  { 
    _id: eventId, 
    availableSeats: { $gte: requestedSeats } // Only if enough seats
  },
  { 
    $inc: { availableSeats: -requestedSeats } // Atomic decrement
  },
  { new: true }
);
```

This guarantees:
- ✅ No overbooking even with concurrent requests
- ✅ Immediate availability updates
- ✅ Consistent data without manual locking

### No Authentication
Per requirements, the system assumes a **single-user interaction model**. Bookings are tracked by email address for simplicity.

### Maximum 10 Seats Per Booking
Limited to prevent bulk bookings that could monopolize seats.

## 📝 API Endpoints

### Events
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/events` | List all events |
| GET | `/api/events/:id` | Get event details |
| GET | `/api/events/categories` | Get event categories |
| POST | `/api/events` | Create event |

### Bookings
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/bookings` | Create booking |
| GET | `/api/bookings?email=x` | Get bookings by email |
| GET | `/api/bookings/:id` | Get booking details |
| PATCH | `/api/bookings/:id/cancel` | Cancel booking |

## ⚠️ Known Limitations

1. **No Payment Integration**: Bookings are confirmed without payment
2. **No Email Notifications**: Users should save their booking ID
3. **No User Accounts**: Bookings are tracked by email only
4. **Basic UI**: Focused on functionality over polish

## 🚀 Future Improvements

With more time, I would add:

1. **User Authentication** - Proper login/signup with JWT
2. **Payment Gateway** - Stripe/Razorpay integration
3. **Email Confirmations** - SendGrid/Nodemailer for booking emails
4. **Real-time Updates** - WebSocket for live seat availability
5. **Seat Selection** - Visual seat picker for venues
6. **Admin Dashboard** - Full event management interface
7. **E2E Tests** - Cypress/Playwright test suite

## 🧪 Testing

### Manual Testing Checklist
- [x] Events load on homepage
- [x] Category filtering works
- [x] Event details page loads
- [x] Booking form validates input
- [x] Booking succeeds and shows confirmation
- [x] Seat count decreases after booking
- [x] Cannot book more seats than available
- [x] My Bookings shows user's bookings
- [x] Booking cancellation works and restores seats

### Edge Cases Handled
- Concurrent booking attempts (atomic updates)
- Invalid seat counts (validation)
- Non-existent events (404 handling)
- Already cancelled bookings (status check)

## 👨‍💻 Author

Built with ❤️ for the assessment

---

**Note**: This project was built as part of a timed assessment to demonstrate MERN stack proficiency and ability to handle real-world constraints like data consistency.
