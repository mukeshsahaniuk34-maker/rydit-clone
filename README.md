# Rydit Clone - Airport Ride Booking Platform

A full-stack airport ride booking application built with React, Node.js, Express, and MongoDB. Similar to Rydit.in, this platform allows users to book affordable shared or private rides to/from airports.

## 🚀 Features

### User Features
- ✅ User registration & authentication (JWT + Firebase)
- ✅ Book shared or private rides
- ✅ Real-time seat availability
- ✅ Multiple payment options (Razorpay)
- ✅ Booking history & cancellation
- ✅ Driver ratings & reviews
- ✅ Live tracking (coming soon)
- ✅ Push notifications

### Driver Features
- ✅ Driver registration & profile management
- ✅ Document upload & verification
- ✅ Earnings dashboard
- ✅ Route management
- ✅ Ride completion tracking

### Admin Features
- ✅ User & driver management
- ✅ Ride analytics & reporting
- ✅ Payment settlement
- ✅ Support ticket management
- ✅ Dynamic pricing control

## 📋 Tech Stack

### Frontend
- React 18
- Tailwind CSS
- Axios
- React Router v6
- Chart.js (Analytics)
- Socket.io (Real-time)

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- Razorpay Payment Gateway
- Firebase (Optional)
- Socket.io for real-time features

### DevOps
- Docker & Docker Compose
- Environment configuration
- Production-ready setup

## 📁 Project Structure

```
rydit-clone/
├── frontend/                 # React web app
│   ├── public/
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   ├── context/         # Context API
│   │   ├── styles/          # Tailwind CSS
│   │   └── App.js
│   ├── package.json
│   └── Dockerfile
│
├── backend/                  # Node.js/Express API
│   ├── src/
│   │   ├── controllers/      # Request handlers
│   │   ├── models/          # Mongoose schemas
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Auth, validation
│   │   ├── services/        # Business logic
│   │   ├── utils/           # Helper functions
│   │   ├── config/          # Configuration
│   │   └── server.js        # Entry point
│   ├── .env.example
│   ├── package.json
│   └── Dockerfile
│
├── docker-compose.yml       # Docker composition
└── docs/                    # Documentation
```

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- MongoDB 5+
- Docker & Docker Compose (optional)
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/mukeshsahaniuk34-maker/rydit-clone.git
cd rydit-clone
```

2. **Backend Setup**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```

3. **Frontend Setup**
```bash
cd ../frontend
npm install
npm start
```

### Using Docker Compose

```bash
docker-compose up -d
```

## 📚 API Documentation

See `docs/API.md` for complete API endpoints and usage.

## 🔒 Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/rydit
JWT_SECRET=your_jwt_secret_key
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
FIREBASE_API_KEY=your_firebase_key
NODE_ENV=production
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_RAZORPAY_KEY=your_razorpay_key
```

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 📦 Deployment

### AWS Deployment
1. Create EC2 instances for frontend & backend
2. Use RDS for MongoDB
3. Deploy using docker-compose

### Heroku Deployment
```bash
heroku login
heroku create rydit-clone-api
git push heroku main
```

### Vercel (Frontend)
```bash
npm install -g vercel
vercel
```

## 💰 Monetization

- **Commission Model**: 10-15% per booking
- **Subscription Plans**: Monthly/yearly passes
- **Premium Features**: Priority booking, express lanes
- **Affiliate Partnerships**: With hotels & travel agencies

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/AmazingFeature`
3. Commit changes: `git commit -m 'Add AmazingFeature'`
4. Push to branch: `git push origin feature/AmazingFeature`
5. Open a Pull Request

## 📄 License

MIT License - see LICENSE file for details

## 👨‍💻 Author

Mukesh Sahani (@mukeshsahaniuk34-maker)

## 📞 Support

For issues and questions, please open an issue on GitHub or contact support.

## 🔗 Links

- Live Demo: (coming soon)
- Documentation: `docs/`
- API Docs: `docs/API.md`
- Deployment Guide: `docs/DEPLOYMENT.md`

---

**Built with ❤️ for seamless airport rides**