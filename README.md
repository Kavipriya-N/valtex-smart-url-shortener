# VΛLTEX — Links at the Speed of Thought

> Smart URL Shortener & Analytics Platform

![VALTEX](https://img.shields.io/badge/VΛLTEX-v1.0.0-7C3AED?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square)
![MongoDB](https://img.shields.io/badge/MongoDB-8.0-47A248?style=flat-square)

## Features
- ⚡ Sub-50ms URL redirects
- 📊 Real-time click analytics
- 🎯 Custom URL aliases
- ⬛ QR code generation
- 🔐 JWT authentication
- 🌍 Country & device analytics
- 🌙 Dark & Light theme
- ⏰ Link expiry dates

## Tech Stack
| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite + React Router v6 |
| Backend | Node.js + Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcryptjs |
| Charts | Chart.js + react-chartjs-2 |
| Styling | Pure CSS Custom Properties |

## Project Structure
```text
valtex/
├── client/                     # Frontend client React application
│   ├── src/
│   │   ├── components/         # Navbar, Sidebar, MetricCard, UrlTable, etc.
│   │   ├── context/            # AuthContext and ThemeContext state providers
│   │   ├── pages/              # Landing, Dashboard, Login, Signup, Analytics, Profile
│   │   └── styles/             # CSS sheets (variables, globals, components, animations)
│   ├── package.json
│   └── vite.config.js
├── server/                     # Backend API server application
│   ├── controllers/            # Logic controllers (auth, url, analytics)
│   ├── models/                 # Database schema models (User, Url, Visit)
│   ├── routes/                 # Express routing endpoints
│   ├── server.js               # Application server bootstrap file
│   └── package.json
├── .gitignore                  # Git ignore definitions
├── package.json                # Root Workspace definition
└── README.md                   # Project documentation
```

## Setup & Installation

### Prerequisites
- Node.js >= 18.x
- MongoDB local instance running or Atlas URI connection

### Quick Start

1. **Clone and run workspace install**:
   ```bash
   npm run install:all
   ```

2. **Configure environment variables**:
   Set up your environment variables as documented in [.env.example](file:///.env.example).

3. **Launch the platform**:
   - Start the backend API: `npm run dev:server`
   - Start the frontend client: `npm run dev:client`

---

This project is a part of a hackathon run by https://katomaran.com
