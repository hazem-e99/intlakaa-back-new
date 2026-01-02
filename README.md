# Intlakaa Backend - Node.js + Express + MongoDB

Backend API for Intlakaa platform using Node.js, Express, and MongoDB Atlas.

## 🚀 Features

- ✅ RESTful API with Express.js
- ✅ MongoDB Atlas database
- ✅ JWT Authentication
- ✅ Role-based access control (Owner/Admin)
- ✅ User management with invite system
- ✅ Request management with pagination & search
- ✅ Email notifications
- ✅ Data migration from Supabase
- ✅ Comprehensive error handling

## 📋 Prerequisites

- Node.js 16+ installed
- MongoDB Atlas account (free tier available)
- Gmail account for sending emails (or other SMTP service)

## 🛠️ Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Create MongoDB Atlas Database

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster (M0 Free tier)
4. Create a database user with password
5. Whitelist your IP address (or use 0.0.0.0/0 for development)
6. Get your connection string

### 3. Configure Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Then edit `.env` and fill in your values:

```env
# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/intlakaa?retryWrites=true&w=majority

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@intlakaa.com

# Site Configuration
SITE_URL=http://localhost:5173
SITE_NAME=انطلاقة
```

### 4. Gmail App Password Setup

1. Go to your Google Account settings
2. Enable 2-Step Verification
3. Go to Security > App passwords
4. Generate a new app password for "Mail"
5. Use this password in `EMAIL_PASSWORD`

### 5. Run the Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will run on `http://localhost:5000`

## 📦 Data Migration from Supabase

If you have existing data in Supabase, you can migrate it:

### 1. Add Supabase credentials to `.env`:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key-here
```

### 2. Install Supabase client:

```bash
npm install @supabase/supabase-js
```

### 3. Run migration:

```bash
npm run migrate
```

**Important Notes:**
- User passwords cannot be migrated from Supabase
- All users will need to reset their passwords
- The script will create temporary passwords
- Duplicate entries will be skipped

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/accept-invite` - Accept invite & set password
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/change-password` - Change password

### Users (Owner only)
- `GET /api/users` - Get all users
- `POST /api/users/invite` - Invite new admin
- `PUT /api/users/:id/role` - Update user role
- `DELETE /api/users/:id` - Delete user

### Requests
- `POST /api/requests` - Create request (public)
- `GET /api/requests` - Get requests with pagination
- `GET /api/requests/:id` - Get single request
- `DELETE /api/requests/:id` - Delete request
- `GET /api/requests/export` - Export all requests

## 🔐 Authentication

All protected routes require a Bearer token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## 📝 Database Schema

### User Model
```javascript
{
  email: String (unique),
  password: String (hashed),
  role: String (owner/admin),
  mustChangePassword: Boolean,
  lastSignInAt: Date,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Request Model
```javascript
{
  name: String,
  phone: String,
  storeUrl: String,
  monthlySales: String,
  ipAddress: String,
  country: String,
  phoneCountry: String,
  createdAt: Date,
  updatedAt: Date
}
```

## 🚀 Deployment

### Deploy to Render.com (Free)

1. Push your code to GitHub
2. Go to [Render.com](https://render.com)
3. Create a new Web Service
4. Connect your GitHub repository
5. Set build command: `npm install`
6. Set start command: `npm start`
7. Add all environment variables
8. Deploy!

### Deploy to Railway.app (Free)

1. Go to [Railway.app](https://railway.app)
2. Create new project from GitHub
3. Add environment variables
4. Deploy automatically

## 🔧 Troubleshooting

### MongoDB Connection Issues
- Check your connection string
- Verify IP whitelist in Atlas
- Ensure database user has correct permissions

### Email Not Sending
- Verify Gmail app password
- Check SMTP settings
- Enable "Less secure app access" if needed

### CORS Errors
- Update `FRONTEND_URL` in `.env`
- Check CORS configuration in `server.js`

## 📚 Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB Atlas
- **ODM:** Mongoose
- **Authentication:** JWT (jsonwebtoken)
- **Password Hashing:** bcryptjs
- **Email:** Nodemailer
- **Validation:** express-validator

## 👨‍💻 Development

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Run in production mode
npm start

# Run migration
npm run migrate
```

## 📄 License

ISC
