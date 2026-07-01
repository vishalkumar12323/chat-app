# Slack-Lite Chat Application

A real-time chat application inspired by Slack, built with modern web technologies. This full-stack application features user authentication, real-time messaging, channel management, file-sharing(Images, Documents[pdf]), show typing-indicators and online presence tracking.

## 📖 About

Slack-Lite is a simplified version of Slack that enables teams to communicate in real-time through organized channels. Users can register, log in, create or join channels, send messages, and see who's currently online. The application uses WebSocket technology for instant message delivery and presence updates, providing a seamless chat experience.

## 🚀 Tech Stack

### Frontend
- **React.js** - UI library for building interactive user interfaces
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework for styling
- **React Router DOM** - Client-side routing
- **Socket.IO Client** - Real-time bidirectional communication
- **Zustand** - Lightweight state management
- **Axios** - HTTP client for API requests
- **Lucide React** - Icon library
- **date-fns** - Date formatting utilities

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **PostgreSQL** - Relational database
- **Sequelize** - ORM for database operations
- **Socket.IO** - Real-time event-based communication
- **JWT (jsonwebtoken)** - Authentication and authorization
- **bcrypt** - Password hashing
- **dotenv** - Environment variable management
- **cors** - Cross-origin resource sharing
- **Appwrite** - Appwrite storage service for file-management

## ✨ Features

### User Authentication
- User registration with secure password hashing
- Login/logout functionality
- JWT-based authentication
- Protected routes and API endpoints

### Channel Management
- Create new channels
- Join existing channels
- View list of available channels
- Channel-based message organization

### Real-Time Messaging
- Send and receive messages instantly
- Message timestamps
- Message history for each channel
- WebSocket-based real-time updates

### Real-Time FileSharing
- Send and receive images/documents instantly
- Optoinal file caption/alt message

### User Presence
- Online/offline status indicators
- Real-time presence updates
- User list showing active members

### User Interface
- Clean and intuitive design
- Responsive layout
- Sidebar navigation
- Message input with real-time sending
- User and channel lists

## 🛠️ Local Setup

### Prerequisites
- Node.js (v14 or higher)
- PostgreSQL database
- npm or yarn package manager

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd slack-lite
   ```

2. **Setup PostgreSQL Database**
   - Install PostgreSQL if not already installed
   - Create a new database:
     ```sql
     CREATE DATABASE slack_lite;
     ```

3. **Configure Environment Variables**
   
   Create a `.env` file in the `server` directory:
   ```env
   PORT=3001
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=slack_lite
   DB_USER=your_postgres_username
   DB_PASSWORD=your_postgres_password
   JWT_SECRET=your_secret_key_here
   ```

4. **Install Server Dependencies**
   ```bash
   cd server
   npm install
   ```

5. **Initialize Database**
   ```bash
   node create_db.js
   ```

6. **Install Client Dependencies**
   ```bash
   cd ../client
   npm install
   ```

7. **Start the Application**

   Open two terminal windows:

   **Terminal 1 - Start Backend Server:**
   ```bash
   cd server
   npm run dev
   ```
   Server will run on `http://localhost:3001`

   **Terminal 2 - Start Frontend Client:**
   ```bash
   cd client
   npm run dev
   ```
   Client will run on `http://localhost:5173`

8. **Access the Application**
   
   Open your browser and navigate to `http://localhost:5173`

### Default Setup
- Register a new account to get started
- Create or join channels
- Start chatting in real-time!

## 📁 Project Structure

```
slack-lite/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components (Login, Register, Chat)
│   │   ├── services/      # API service layer
│   │   ├── store/         # Zustand state management
│   │   └── App.jsx        # Main App component
│   └── package.json
│
├── server/                # Backend Node.js application
│   ├── src/
│   │   ├── config/        # Database configuration
│   │   ├── controllers/   # Request handlers
│   │   ├── middleware/    # Authentication middleware
│   │   ├── models/        # Sequelize models
│   │   ├── routes/        # API routes
│   │   └── socket/        # Socket.IO event handlers
│   ├── index.js           # Server entry point
│   └── package.json
│
└── README.md
```

## 🔧 Available Scripts

### Client
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Server
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [ISC License](LICENSE).
