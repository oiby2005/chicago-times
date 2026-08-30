# 📰 Chicago Times / Wall Street Journal Web Application

A full-stack, responsive news portal web application built with **Next.js 15 (React 19, Tailwind CSS)** on the frontend and **Node.js (Express.js, MySQL)** on the backend.

---

## 📋 Prerequisites

Before running the application, make sure your computer has:
1. **Node.js** (v18 or higher) — [Download Node.js](https://nodejs.org/)
2. **XAMPP / WAMP / MySQL Server with phpMyAdmin** — Ensure Apache & MySQL services are running.

---

## 🗄️ Step 1: Database Setup (phpMyAdmin)

1. Start **XAMPP / WAMP** and click **Start** for both **Apache** and **MySQL**.
2. Open your web browser and navigate to phpMyAdmin:
   ```text
   http://localhost/phpmyadmin
   ```
3. In the left sidebar, click **New**.
4. Enter Database Name: **`wsj_db`** and click **Create**.
5. Click on the newly created **`wsj_db`** database in the left sidebar.
6. Click the **Import** tab at the top menu.
7. Click **Choose File** (or Browse), select the file located at:
   ```text
   Backend/database/wsj_db.sql
   ```
8. Scroll down to the bottom and click **Import**.

---

## ⚙️ Step 2: Start Backend Express Server

1. Open a Terminal / Command Prompt / PowerShell in the **`Backend`** folder.
2. Install dependencies (first time only):
   ```bash
   npm install
   ```
3. Start the backend server:
   ```bash
   node server.js
   ```
4. You will see:
   ```text
   =================================
   🚀 WSJ Backend Server running on http://localhost:5000
   =================================
   ✅ Connected to MySQL database: wsj_db
   ```

---

## 💻 Step 3: Start Frontend Next.js Web Application

1. Open a **new** Terminal / Command Prompt in the **`Frontend`** folder.
2. Install dependencies (first time only):
   ```bash
   npm install
   ```
3. Start the application:
   ```bash
   npm run dev
   ```
   *(or run `npx next start -p 3000` for production build mode)*
4. Open your web browser and go to:
   ```text
   http://localhost:3000
   ```

---

## 🔐 Credentials for Demo & Testing

| Role | Email | Password | Dashboard Route |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@gmail.com` | `admin123` | `/admin-dashboard` |
| **Writer** | `writer@gmail.com` | `writer123` | `/writer-dashboard` |
| **Reader** | `reader@gmail.com` | `reader123` | `/reader-dashboard` |

---

## 🌟 Key Features

- **Dynamic Homepage Placements**: Manage Top News, A+ Main News, Right Main Panel, In-Depth Panel, Category Sections, etc.
- **Role-Based Workflows**:
  - **Writer Dashboard**: Create articles, save drafts, manage submissions.
  - **Admin Dashboard**: Review pending posts, publish, edit homepage placements, manage categories.
  - **Reader Dashboard**: Saved articles, personalized topic feeds, newsletter subscriptions.
- **69 Selectable Website Categories**: Complete categorization across News, Business, Tech, Politics, Markets & Finance, Investing (including Stocks), Arts, Lifestyle, and Opinions.
- **Real-Time Synchronized Profiles**: Writer profile updates (avatar, name, bio) sync instantly across bylines and author pages.
- **Live Vercel Production Build**: Pre-configured for deployment.
