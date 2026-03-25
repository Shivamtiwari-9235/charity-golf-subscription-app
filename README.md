# Golf Charity Subscription Platform

## Overview
A complete MERN full-stack application implementing a golf-based subscription platform with charity donations and monthly prize draws. Features a modern dark UI with glassmorphism effects, JWT authentication, Stripe payment integration, and comprehensive admin panel.

## Features ✅
- **User Authentication**: JWT-based login/register with role-based access
- **Subscription System**: Monthly/yearly plans via Stripe integration
- **Score Management**: Track last 5 golf scores (1-45 points) with auto-replacement
- **Draw System**: Monthly random draws with 5/4/3-match prize tiers
- **Prize Pool**: Auto-calculated distribution (40% 5-match, 35% 4-match, 25% 3-match)
- **Charity Integration**: User selects charity with minimum 10% contribution
- **Winner Verification**: Upload proof → admin review → payout system
- **Admin Dashboard**: Complete management panel with analytics and controls
- **Responsive Design**: Mobile-first with dark theme and glassmorphism

## Tech Stack
- **Backend**: Node.js + Express.js + MongoDB (Mongoose)
- **Frontend**: React.js + Tailwind CSS + Framer Motion
- **Auth**: JWT with bcrypt password hashing
- **Payments**: Stripe Checkout + Webhooks
- **Email**: Nodemailer for notifications

## Quick Start

### Prerequisites
- Node.js 16+
- MongoDB Atlas account (or local MongoDB)
- Stripe account for payments

### Installation

1. **Clone and setup environment**:
   ```bash
   # Copy environment files
   cp .env.example .env
   cp frontend/.env.example frontend/.env
   ```

2. **Configure environment variables**:
   - Update `MONGO_URI` with your MongoDB connection string
   - Add your Stripe secret key and webhook secret
   - Configure Stripe price IDs for monthly/yearly subscriptions
   - Set up email credentials (optional)

3. **Install dependencies**:
   ```bash
   # Backend
   cd backend && npm install

   # Frontend
   cd ../frontend && npm install
   ```

4. **Start the application**:
   ```bash
   # Terminal 1: Backend
   cd backend && npm start

   # Terminal 2: Frontend
   cd frontend && npm start
   ```

5. **Access the application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000/api

### Default Admin Account
- **Email**: admin@golf.com
- **Password**: admin123

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile

### Scores
- `POST /api/scores` - Add golf score (max 5 stored)
- `GET /api/scores` - Get user's scores

### Subscriptions
- `POST /api/stripe/checkout-session` - Create Stripe checkout
- `POST /api/stripe/cancel-subscription` - Cancel subscription

### Draws & Winners
- `GET /api/draws` - List all draws
- `POST /api/draws` - Create new draw (admin)
- `POST /api/draws/:id/simulate` - Simulate draw (admin)
- `POST /api/draws/:id/publish` - Publish draw results (admin)
- `POST /api/winners` - Submit winner verification
- `GET /api/winners` - List verifications (admin)
- `PUT /api/winners/:id/review` - Review verification (admin)

### Charities
- `GET /api/charities` - List all charities
- `POST /api/charities` - Create charity (admin)

### Admin
- `GET /api/admin/reports` - Analytics dashboard data

## Data Models

- **User**: Profile, subscription status, charity selection, winnings
- **Score**: Golf scores (1-45) with date, max 5 per user
- **Draw**: Monthly draw configuration and results
- **Ticket**: User participation in draws with match counts
- **Charity**: Charity information and user contributions
- **WinnerVerification**: Proof submission and payout tracking

## Deployment

### Backend (Render/Railway)
1. Connect GitHub repository
2. Set environment variables
3. Deploy from main branch

### Frontend (Vercel/Netlify)
1. Connect GitHub repository
2. Set `REACT_APP_API_URL` to production backend URL
3. Deploy automatically

### Environment Variables for Production
```env
NODE_ENV=production
CLIENT_URL=https://your-frontend-domain.com
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

## Development

### Available Scripts
```bash
# Backend
npm start          # Start production server
npm run dev        # Start with nodemon (if installed)

# Frontend
npm start          # Start development server
npm run build      # Create production build
npm test           # Run tests
```

### Project Structure
```
/
├── backend/
│   ├── controllers/     # Route handlers
│   ├── models/         # MongoDB schemas
│   ├── routes/         # API routes
│   ├── middlewares/    # Auth, error handling
│   ├── utils/          # Email, helpers
│   └── server.js       # Main server file
├── frontend/
│   ├── src/
│   │   ├── components/ # Reusable components
│   │   ├── pages/      # Route components
│   │   └── App.js      # Main app component
│   └── public/         # Static assets
└── README.md
```

## Security Features
- JWT token authentication
- Password hashing with bcrypt
- Role-based access control
- Input validation and sanitization
- Secure Stripe webhook verification
- CORS configuration

## Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License
This project is licensed under the MIT License.
- Keep max 5 scores per user; older entries removed on insert.
- Return reverse chronological score list.

## Draw logic
- 5-number draw results generated randomly (or algorithmic if future extension).
- prizePool computed from `active users * fixed amount` (example $20 per active user).
- 40% goes to 5-match (rollover if no winners), 35% to 4-match, 25% to 3-match.
- winners share their tier pool equally.

## Deployment to Vercel

1. Backend: Deploy to Vercel with Node.js runtime, set env vars in Vercel dashboard.
2. Frontend: Deploy to Vercel, set REACT_APP_API_URL to backend URL.
3. Database: MongoDB Atlas.
4. Stripe: Set webhook URL to backend /api/stripe/webhook.

## Testing login flow manually
1. Register user at `/register`.
2. Login at `/login`.
3. You should be redirected to dashboard and able to post scores.

## Required env variables
See `.env.example` and `frontend/.env.example`.

## Production checks
- All three roles functional: Public (homepage), Subscriber (dashboard), Admin (admin panel).
- Auth, scores, draws, charities, winners working.
- Email notifications on register and draw results.
- Mobile-first responsive design.
- Error handling for invalid inputs, no winners, etc.
