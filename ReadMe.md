# 📝 MERN Blogging Platform

A full-stack blogging platform built with the MERN stack (MongoDB, Express.js, React, Node.js). This project supports user authentication, blog creation/editing, pagination, search, and more — with a clean modern frontend. Designed to be scalable and extendable.

---

## 📌 Project Overview

This project aims to create a fully functional blogging platform where users can:
- Register and log in
- Create, edit, soft-delete, and permanently delete blog posts
- Read blog posts in a public feed
- Search, sort, and paginate blogs
- View individual post pages
- Manage their own content via a dashboard
- Automatically delete soft-deleted blogs after 30 days

---

## 🔧 Tech Stack

| Layer       | Technology              |
|------------|--------------------------|
| **Frontend**   | React, React Router DOM |
| **Backend**    | Node.js, Express        |
| **Database**   | MongoDB, Mongoose       |
| **Authentication** | JWT, bcrypt         |
| **Styling**    | TailwindCSS             |
| **Image Handling** | URL-based image preview, Cloudinary (optional) |
| **Validation** | Joi (Express middleware) |
| **Deployment** | Vercel (frontend), Render (backend) |

---

## 🧠 Mind Map (Feature Outline)

```
Blogging Platform
│
├── 1. Authentication
│   ├── Register / Login
│   ├── JWT Token Auth
│   └── Role: Admin vs User (optional)
│
├── 2. Users
│   ├── Profile page
│   └── Edit bio / social links (optional)
│
├── 3. Blog Posts
│   ├── Create / Edit / Delete (Soft Delete)
│   ├── Markdown or Rich Text support
│   ├── Cover Image (URL-based for now)
│   ├── Tags / Categories
│   ├── Publish / Draft modes
│   ├── Pagination / Search / Sorting
│   └── Permanent deletion after 30 days (cron job)
│
├── 4. Comments (optional)
│   ├── Add / delete comment
│   └── Nested replies
│
├── 5. Dashboard
│   ├── My Posts
│   └── Edit Profile
│
├── 6. Admin Panel (optional)
│   ├── Manage Users
│   ├── Approve Posts (moderation)
│   └── View Platform Stats
│
├── 7. Frontend UX/UI
│   ├── Home Page – List of Posts
│   ├── Post Detail Page
│   ├── Search / Filter by tags
│   ├── Pagination
│   └── Mobile Responsive Design
│
├── 8. Backend Features
│   ├── RESTful API (Node + Express)
│   ├── MongoDB Models with Timestamps
│   ├── Joi Validation Middleware
│   ├── Utility Functions (pagination, search, sorting)
│   └── Scheduled Jobs (soft delete cleanup)
│
├── 9. DevOps & Deployment
│   ├── Git & GitHub
│   ├── .env for secrets
│   └── Deploy: Vercel / Render
```

---

## 🗂️ Folder Structure

### Backend
```
blog-backend/
├── models/
├── routes/
├── controllers/
├── middleware/
├── utils/          # Pagination, Search, Cron Jobs
└── server.js
```

### Frontend
```
blog-frontend/
├── components/
├── pages/
├── services/       # Axios API wrappers
├── contexts/       # Auth context
└── App.jsx
```

---

## 📐 Database Schema

### User
```js
{
  username: String,
  email: String,
  password: String, // hashed
  role: 'user' | 'admin',
  createdAt: Date
}
```

### Blog
```js
{
  title: String,
  content: String,
  coverImage: String, // optional URL
  tags: [String],
  isPublished: Boolean,
  isDeleted: Boolean,
  author: ObjectId, // linked to User
  createdAt: Date,
  updatedAt: Date,
  deletedAt: Date // only if soft-deleted
}
```

---

## 🚀 Features Implemented So Far

- ✅ Register / Login with JWT auth
- ✅ Blog model with `isPublished`, `isDeleted`, `coverImage`, `tags`
- ✅ Create / Read / Update / Soft Delete blogs (author only)
- ✅ Blog preview on homepage with title, image, tags, and short content
- ✅ Show live image preview from URL on create/edit form
- ✅ Public homepage shows only published + non-deleted blogs
- ✅ Pagination, Search by title, Sorting by date/title
- ✅ Reusable utility for pagination/search/filtering
- ✅ Cron job deletes soft-deleted blogs after 30 days

---

## 🛣️ Roadmap (Next Steps)

- [ ] Implement file/image upload using Cloudinary (optional)
- [ ] User Dashboard to manage own posts
- [ ] Post Detail Page
- [ ] Like/Bookmark (optional)
- [ ] Admin Panel (optional)
- [ ] Add Comments (optional)
- [ ] SEO, Sitemap, and Meta Tags

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd "Itee's Bolg"
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   
   # Create .env file from example
   cp .env.example .env
   # Edit .env and add your MongoDB URI and JWT secret
   
   # Start the backend server
   npm start
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   
   # Create .env file from example (if needed)
   cp .env.example .env
   
   # Start the frontend development server
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000

### Environment Variables

#### Backend (.env)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT token generation
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)

#### Frontend (.env)
- `VITE_API_URL` - Backend API base URL

---

## 📦 Deployment

- Backend: [Render](https://render.com/)
- Frontend: [Vercel](https://vercel.com/)
- Secrets managed with `.env` for both environments

---

## 🤝 Contributing

This is a solo learning project. Feedback and ideas are always welcome.

---

## 📜 License

MIT License
