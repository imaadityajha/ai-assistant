# A Final year Project Made by batch - 8 of Computer Science and Engineering Department of Aditya University

---

# 🧠 Personal AI Assistant

Personal AI Assistant is a full-stack intelligent tutoring system developed as a final year project. It leverages the power of modern web technologies to create a responsive, interactive, and personalized learning experience for students. The frontend is built using React with Vite for blazing-fast development, while the backend is powered by Node.js and Express, with MongoDB as the database.

---

## 👨‍💻 Project Members

- **Aaditya Jha**
- **Abhay Kumar Yadav**
- **Palli Harshavardhan**
- **Suraj Kumar**


---

## 📚 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [Folder Structure](#folder-structure)
- [Examples](#examples)
- [Troubleshooting](#troubleshooting)
- [Contributors](#contributors)
- [License](#license)

---

## 🚀 Features

- User Authentication with JWT
- Interactive Learning UI with Chakra UI
- Form handling via React Hook Form
- Markdown content rendering and syntax highlighting
- State management using Redux Toolkit
- Responsive routing with React Router
- Email notifications using Nodemailer
- MongoDB integration for data persistence

---

## 🧰 Tech Stack

### Frontend

- React 19
- Vite
- Chakra UI
- Redux Toolkit
- React Router DOM
- React Hook Form
- Framer Motion
- React Markdown

### Backend

- Node.js
- Express.js
- MongoDB via Mongoose
- JWT Authentication
- Nodemailer for email services
- Multer for file uploads

---

## ⚙️ Installation

### Prerequisites

- Node.js (v18 or higher)
- MongoDB instance (local or cloud)
- npm or yarn

### Clone the repository

```bash
git clone https://github.com/your-username/ai-assistant.git
cd ai-assistant
```

### Install backend dependencies

```bash
cd server
npm install
```

### Install frontend dependencies

```bash
cd client
npm install
```

---

## 🧪 Usage

### Start the backend server

```bash
cd server
npm run dev
```

### Start the frontend app

```bash
cd client
npm run dev
```

Visit `http://localhost:5173` in your browser.

---

## 🔧 Configuration

Create a `.env` file in the `server/` directory with the following variables:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
GROQ_API_KEY=Your API KEY
AI_API_URL=https://api.groq.com/GIVEN_URL
YOUTUBE_API_KEY=Your Youtube API

```

---

## 📁 Folder Structure

```plaintext
ai-tutor/
│
├── client/                  # React frontend (Vite)
│   ├── public/
│   ├── src/
│   ├── package.json
│
├── server/                  # Node.js backend (Express)
│   ├── src/
│   ├── package.json
│
├── README.md
```

---

## 🧪 Examples

- **Student Dashboard** with interactive modules and performance tracking.
- **Markdown-enabled Lessons** rendered beautifully using `react-markdown`.
- **Real-time Form Validation** with `react-hook-form`.

---

## 🛠️ Troubleshooting

- **MongoDB Connection Error**: Ensure your `.env` is correctly set up.
- **CORS Issues**: Make sure your backend includes the CORS middleware.
- **Email not sending**: Double-check the email credentials in the `.env` file.

---

## 👥 Contributors

- **Aaditya Jha**
- **Abhay Kumar Yadav**
- **Palli Harshavardhan**
- **Suraj Kumar**