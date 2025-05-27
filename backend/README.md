# Auto Auction Shipping Tracker

A professional web platform for tracking cars purchased from Copart, IAAI, and Manheim auctions through the shipping process.

## Features

- Real-time car shipping status tracking
- Unique customer ID system
- Multi-stage photo documentation
- Admin panel for managing car records
- Bilingual support (AZ/EN)
- Live ship tracking integration
- Email notifications for status updates

## Tech Stack

- Frontend: React.js + Tailwind CSS
- Backend: Node.js + Express
- Database: MongoDB
- Authentication: JWT
- File Upload: Multer
- Email: Nodemailer

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd car-track
```

2. Install dependencies:
```bash
npm install
```

3. Create a .env file in the root directory:
```env
NODE_ENV=development
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
SMTP_HOST=your_smtp_host
SMTP_PORT=your_smtp_port
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
```

4. Start the development server:
```bash
npm run dev
```

## Project Structure

```
car-track/
├── frontend/          # React frontend
├── backend/           # Node.js backend
│   ├── config/       # Configuration files
│   ├── controllers/  # Route controllers
│   ├── middleware/   # Custom middleware
│   ├── models/       # Database models
│   ├── routes/       # API routes
│   └── server.js     # Entry point
└── uploads/          # Uploaded files
```

## API Endpoints

### Authentication
- POST /api/auth/register - Register new admin
- POST /api/auth/login - Admin login

### Cars
- GET /api/cars - Get all cars
- GET /api/cars/:id - Get car by ID
- POST /api/cars - Add new car
- PUT /api/cars/:id - Update car
- DELETE /api/cars/:id - Delete car

### Customers
- GET /api/customers - Get all customers
- POST /api/customers - Add new customer
- GET /api/customers/:id - Get customer by ID

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the ISC License. 