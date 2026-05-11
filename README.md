# 🚀 Nexus - Modern Employee Management System

![Nexus EMS Banner](https://via.placeholder.com/1200x400/0d1117/2ea043?text=Nexus+Employee+Management+System)

> A high-fidelity, GitHub-inspired Employee Management System built with the MERN stack. Nexus provides administrators and employees with a seamless, dark-mode experience for tracking attendance, managing profiles, and handling leave requests.

---

## ✨ Features

### 🧑‍💻 For Employees
- **Personalized Dashboard**: View your overall stats, recent leave requests, and a beautiful, dynamically generated GitHub-style contribution heatmap of your daily attendance.
- **Attendance Check-in**: Mark yourself as "Present" or "Late" with a single click.
- **Leave Applications**: Submit leave requests specifying the type of leave, dates, and reasons.
- **Unique Profiles**: Deterministically generated professional biographies based on employee credentials.

### 🛡️ For Administrators
- **Employee Directory**: A comprehensive list of all employees in the organization with quick actions.
- **Leave Management**: Instantly approve or reject pending leave requests from the dashboard or the leaves tab.
- **Full View Access**: Navigate into any employee's personal dashboard to view their specific attendance heatmap and stats.
- **Profile Editing**: Update employee details directly from the directory overview.

---

## 📸 Screenshots & Working

### 1. The Dashboard (Overview)
*The centralized hub showing pinned employees, your GitHub-style attendance graph, and recent activity.*
![Dashboard View](./screenshots/dashboard.png)

### 2. Employee Directory
*A beautiful list view of all employees with designation badges, days attended, and quick action buttons.*
![Employee Directory](./screenshots/directory.png)

### 3. Leave Management & Approval
*Administrators can view all pending leaves across the company and approve/reject them instantly.*
![Leave Management](./screenshots/leaves.png)

### 4. Daily Attendance Check-in
*Employees can mark their attendance daily. Admins can view the master log.*
![Attendance Logs](./screenshots/attendance.png)

---

## 🛠️ Technology Stack

- **Frontend**: React.js, Vite, Framer Motion (for smooth animations), Lucide React (icons), Vanilla CSS (GitHub dark-mode aesthetics).
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose ORM)
- **Authentication**: JWT (JSON Web Tokens)

---

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) and [MongoDB](https://www.mongodb.com/) installed on your machine.

### Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repository-url>
   cd "MERN Intership"
   ```

2. **Install Backend Dependencies & Seed Data:**
   ```bash
   cd backend
   npm install
   
   # Setup your .env file
   echo "PORT=5000\nMONGODB_URI=mongodb://127.0.0.1:27017/ems\nJWT_SECRET=your_secret_key" > .env
   
   # Seed the database with dummy employees and attendance data
   node seed.js
   ```

3. **Install Frontend Dependencies:**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

Open two terminal windows:

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

The application will be running at `http://localhost:5173`.

---

## 🔑 Demo Credentials

To test the application, you can use the following seeded credentials:

**Administrator Account:**
- **Email:** `admin@ems.com`
- **Password:** `adminpassword`

**Employee Accounts:**
- **Emails:** `aarav@company.com`, `priya@company.com`, `rohan@company.com`
- **Password:** `password123`

---

## 🎨 Design Philosophy
The UI was meticulously crafted to replicate the sleek, developer-friendly aesthetic of GitHub's dark mode. By utilizing colors like `#0d1117` (background), `#161b22` (cards), and `#2ea043` (success/contributions), the system provides a familiar and highly legible environment for modern teams.
