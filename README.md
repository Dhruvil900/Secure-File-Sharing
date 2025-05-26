#  Secure File Sharing Web App

##  Project Overview

A secure file-sharing platform that allows registered users to:
- Upload files with token-based expiration
- Generate secure, expiring download links
- View/manage uploaded files via a dashboard
- Share public download links with or without login
- Get visual alerts for expired tokens

---

##  Core Features Implemented

###  User Authentication (JWT + bcrypt)
- Users register/login with token-based auth
- Passwords hashed using `bcrypt`
- JWT tokens expire in 10 minutes
- Auth middleware protects upload & dashboard routes

###  File Upload & Metadata Storage
- Files uploaded via `Multer`
- Metadata and encrypted filename stored in MongoDB
- Each file is associated with the uploader
- Customizable token expiration (1h, 12h, 1d, 3d, 7d)

###  Dashboard Features
- Lists all uploaded files per user
- Copyable download links (`/download.html?token=...`)
- File delete button
- Countdown until expiry displayed beside each file
- Red alert message for expired tokens

### Token-Based Downloads
- Token issued via `jsonwebtoken` on upload
- Users can choose expiration (default: 7d)
- Download endpoint verifies token and expiration
- Public users can download without logging in
- `/download.html?token=...` provides download interface

---

## Tech Stack

- Node.js + Express
- MongoDB + Mongoose
- JWT + Bcrypt
- Multer (file upload middleware)
- HTML + CSS + Vanilla JavaScript

---

##  How to Run Locally

###  Prerequisites
- Node.js installed
- MongoDB running locally or via Atlas

###  Install Dependencies

```bash
npm install

Setup .env File
Create a .env file in the root:

env
Copy
Edit
PORT=3000
MONGODB_URI=mongodb://localhost:27017/secure-file-db
JWT_SECRET=your_secret_key

Run the Server
	
node server.js
Then visit:

http://localhost:3000/dashboard.html

http://localhost:3000/download.html?token=<token>

## Contributors

Bhanderi Dhruvil – Backend, file validation, JWT setup
Vedang Kathiriya – MongoDB models, registration logic
Kliona Kennet – Dashboard UI, error handling, JWT expiry
Binul Bijo – Token management, frontend UX, deployment