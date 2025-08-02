# Mini LinkedIn - Community Platform

A modern, full-stack LinkedIn-like community platform built with Next.js, MongoDB, and Tailwind CSS.

## Features

- 🔐 **User Authentication** - Register and login with email & password
- 👤 **User Profiles** - View user profiles with name, email, and bio
- 📝 **Create Posts** - Share text-only posts with the community
- 🏠 **Home Feed** - View all posts from users in chronological order
- 🎨 **Modern UI** - Clean, responsive design with Tailwind CSS
- 🔒 **Secure** - JWT-based authentication and password hashing

## Additional Features

- ✏️ **Update Posts** - Edit your previously created posts  
- 🗑️ **Delete Posts** - Remove your own posts  
- ❤️ **Like Posts** - Like and unlike posts  
- 💬 **Comment on Posts** - Add comments on any post  
- 🗑️ **Delete Comments** - Remove your own comments  
- ✏️ **Update Comments** - Edit your own comments

## Tech Stack

- **Frontend**: Next.js 15 (React 18)
- **Backend**: Next.js API Routes and Express
- **Database**: MongoDB with Mongoose
- **Styling**: Tailwind CSS
- **Authentication**: JWT + bcryptjs
- **Language**: TypeScript

## Setup Instructions

### 1. Environment Variables

Create a `.env` file in the root directory and add:

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

## Demo User

You can try out the platform using the following demo credentials:

- ✉️ **Email**: user@gmail.com
- 🔑 **Password**: user@123

## API Endpoints

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/posts` - Get all posts
- `POST /api/posts` - Create new post (authenticated)
- `GET /api/users/[id]` - Get user profile and posts




