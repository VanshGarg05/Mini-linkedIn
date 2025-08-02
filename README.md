# Mini LinkedIn - Community Platform

A modern, full-stack LinkedIn-like community platform built with Next.js, MongoDB, and Tailwind CSS.

## Features

- 🔐 **User Authentication** - Register and login with email & password
- 👤 **User Profiles** - View user profiles with name, email, and bio
- 📝 **Create Posts** - Share text-only posts with the community
- 🏠 **Home Feed** - View all posts from users in chronological order
- 🎨 **Modern UI** - Clean, responsive design with Tailwind CSS
- 🔒 **Secure** - JWT-based authentication and password hashing

## Tech Stack

- **Frontend**: Next.js 15 (React 18)
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **Styling**: Tailwind CSS
- **Authentication**: JWT + bcryptjs
- **Language**: TypeScript

## Setup Instructions

### 1. Environment Variables

Create a `.env.local` file in the root directory and add:

```env
# MongoDB Connection String (get from MongoDB Atlas)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mini-linkedin

# JWT Secret (use a strong, random string)
JWT_SECRET=your_super_secure_jwt_secret_key_here

# App URL
NEXTAUTH_URL=http://localhost:3000
```

### 2. MongoDB Setup

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Create a database user
4. Get your connection string and add it to `.env.local`
5. Make sure to replace `<password>` and `<username>` in the connection string

### 3. Install Dependencies

```bash
npm install
```

### 4. Run the Application

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Usage

1. **Register**: Create a new account with your name, email, password, and optional bio
2. **Login**: Sign in with your credentials
3. **Create Posts**: Share your thoughts with the community
4. **View Feed**: See all posts from users in the home feed
5. **View Profiles**: Click on user names to view their profiles and posts

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── posts/         # Posts endpoints
│   │   └── users/         # User endpoints
│   ├── login/             # Login page
│   ├── register/          # Registration page
│   ├── profile/[id]/      # Dynamic profile page
│   └── page.tsx           # Home page
├── components/            # Reusable React components
├── contexts/              # React contexts (Auth)
├── lib/                   # Utility functions
└── models/                # MongoDB models
```

## API Endpoints

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/posts` - Get all posts
- `POST /api/posts` - Create new post (authenticated)
- `GET /api/users/[id]` - Get user profile and posts

## Development

- The app uses TypeScript for type safety
- ESLint is configured for code quality
- Tailwind CSS for styling with custom design system
- Responsive design that works on mobile and desktop

## Important Notes

⚠️ **Before running the application:**

1. **Set up MongoDB**: You need a MongoDB database. The easiest way is to use MongoDB Atlas (free tier available)
2. **Update environment variables**: Replace the placeholder values in `.env.local` with your actual MongoDB connection string and JWT secret
3. **Test the connection**: The app will show connection errors if MongoDB is not properly configured

## Troubleshooting

- **"Loading posts..." forever**: Check your MongoDB connection string in `.env.local`
- **Input fields not visible**: This has been fixed in the latest version with improved styling
- **Can't create posts**: Make sure you're logged in and have a valid JWT token

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this project for learning or as a starting point for your own applications.
