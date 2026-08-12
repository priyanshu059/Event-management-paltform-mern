<div align="center">
  <h1>🎉 EventOps AI - MERN Event Management Platform</h1>
  <p>A comprehensive, intelligent event management platform built with the MERN stack and powered by Google's Generative AI.</p>

  <!-- Badges -->
  <p>
    <img src="https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
    <img src="https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB" alt="Express.js" />
    <img src="https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB" alt="React" />
    <img src="https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
    <img src="https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/Google%20Gemini-%238E75B2.svg?style=for-the-badge&logo=google&logoColor=white" alt="Google Gemini" />
  </p>
</div>

<br />

## 📖 Overview

**EventOps AI** is a robust web application designed to streamline the entire event lifecycle. From managing venues, speakers, and sponsorships to handling user registrations and real-time feedback, EventOps AI covers it all. The platform uniquely integrates **Google Generative AI** to provide an intelligent assistant and smart insights, making event planning more efficient and data-driven.

---

## ✨ Key Features

- **🛡️ Secure Authentication:** JWT-based login and registration with Role-Based Access Control (Admin/User).
- **📅 Event Management:** Full CRUD operations for planning and showcasing events.
- **🗣️ Speaker & Sponsorship Modules:** Dedicated portals to onboard speakers and manage event sponsors.
- **🎟️ Registration System:** Seamless attendee registration and ticketing flow.
- **📊 Admin Dashboard:** High-level overview of metrics, registrations, and system intelligence.
- **🤖 AI Assistant Integration:** Built-in generative AI (via Google Gemini) to assist with event planning, email drafts, and intelligence gathering.
- **📍 Venue Tracking:** Manage physical or virtual locations for various events.
- **🔔 Notifications & Reminders:** Automated alerting system and scheduled jobs for upcoming events.
- **⚠️ Incident Management:** Track and resolve on-site or virtual incidents quickly.

---

## 🛠️ Tech Stack

### Frontend (Client)
- **Framework:** React 19 (via Vite)
- **Styling:** Tailwind CSS & PostCSS
- **Routing:** React Router DOM
- **Network Requests:** Axios
- **Linting:** Oxlint

### Backend (Server)
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (via Mongoose)
- **Authentication:** JSON Web Tokens (JWT) & bcryptjs
- **AI Integration:** `@google/genai` & `@google/generative-ai`
- **Security:** `express-rate-limit`, `cors`

---

## 📂 Project Structure

```text
eventmanagement-mern/
├── client/                 # Frontend React/Vite application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Full page views (Admin, Auth, Public)
│   │   ├── utils/          # Helper functions
│   │   └── ...
│   ├── package.json
│   └── vite.config.js
│
├── server/                 # Backend Node/Express application
│   ├── models/             # Mongoose Database schemas
│   ├── routes/             # Express API routes (auth, events, ai, etc.)
│   ├── middleware/         # Custom middlewares (auth, rate limiting)
│   ├── server.js           # Entry point for backend
│   └── package.json
│
└── package.json            # Root configuration for concurrently running both
```

---



## 📡 API Routes Overview

The backend is neatly structured into modular routes. Some of the core endpoints include:

- `/api/auth` - Login, register, profile management.
- `/api/events` - Fetch, create, update, and delete events.
- `/api/registration` - Handle user signups for specific events.
- `/api/assistant` & `/api/intelligence` - Interact with the Google Gemini AI integration.
- `/api/dashboard` - Fetch aggregate metrics for the admin view.
- `/api/venues`, `/api/speakers`, `/api/sponsorships` - Resource management.

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the project.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## 📜 License

This project is licensed under the **ISC License**.
