# Knowvy - AI-Powered Mentorship & Opportunity Hub

Knowvy is a sophisticated web application designed to connect students, mentors, and organizations. It features a robust, production-ready authentication system, role-based access control, and AI-driven career development tools.

---

## 🚀 Recent Core Functionalities (Production-Ready)

### 1. Robust Authentication & User Management
*   **Dual-Flow Auth:** Supports both high-security local email/password registration and seamless **Google OAuth 2.0**.
*   **Profile Completion Flow:** A dedicated step for OAuth users to select their role and provide missing details (Bio, College, Occupation, etc.) before accessing the platform.
*   **Centralized User Identity:** A single `User` collection handles all authentication credentials, while specific profiles (`Student`, `Mentor`, `Organization`, `Admin`) store role-related data through dedicated 1-to-1 relationships.
*   **Secure JWT Implementation:** Industry-standard JWT tokens with minimal payloads for security, handled via high-performance middleware.

### 2. Role-Based Ecosystem
*   **Students:** Can browse/book mentorship sessions, register for hackathons, and use AI tools.
*   **Mentors:** Can list their expertise, manage session availability, and mentor students (requires admin approval).
*   **Organizations:** Can host hackathons and sessions to engage with the community.
*   **Admins:** Oversee the platform, approving mentor applications and managing quality control.

### 3. AI Features
*   **Voice-Driven Mock Interviews:** Real-time AI interaction to simulate technical and behavioral interviews.
*   **AI Chat Assistant:** Personalized career guidance and platform navigation support.

### 4. Opportunity Management
*   **Hackathon Portal:** List, view details, and register for upcoming coding challenges.
*   **Mentorship Booking:** Real-time booking system to connect with industry experts.
*   **Session Hosting:** Live sessions and workshops organized by mentors and orgs.

---

## 🛠️ Technical Architecture

### Backend (Node.js/Express)
- **Database:** MongoDB with Mongoose (Separated Auth and Profile logic).
- **Authentication:** Passport.js (Google Strategy) + Custom JWT logic.
- **Middleware:** Granular Role-Based Access Control (RBAC) to protect sensitive routes.
- **rollback System:** Automatic cleanup of user accounts if profile creation fails during registration.

### Frontend (React/Vite)
- **UI/UX:** Premium Glassmorphism design with a dark-mode neon aesthetic.
- **State Management:** Context API for global auth and user data hydration.
- **Icons:** Lucide React for modern, consistent iconography.
- **Dynamic Routing:** Protected routes that redirect based on `profileCompleted` status.

---

## 🔄 The Authentication Working Flow

1.  **Entry:** User visits `/login` or `/signup`.
2.  **Selection:** 
    *   **Local:** User fills full form (including role). Account & Role Profile are created simultaneously.
    *   **Google OAuth:** User clicks "Continue with Google".
3.  **Authentication:** Server validates Google credentials.
4.  **Checking Profile Status:**
    *   If user exists and `profileCompleted: true`, they are logged in and redirected home.
    *   If it's a new Google user, `profileCompleted` is `false`.
5.  **Completion Step:** The user is forced to the `/complete-profile` page. They choose their role and enter mandatory fields.
6.  **Finalization:** Server creates the role-specific profile, updates `User.role`, sets `profileCompleted: true`.
7.  **Access:** User now has full access to features specific to their role.

---

## ⚙️ Setup & Environment Variables

To run this project, the following `.env` variables are required in the `/server` directory:

```env
# SERVER CONFIG
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret

# GOOGLE OAUTH
GOOGLE_CLIENT_ID=your_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# SESSION
SESSION_SECRET=a_secure_random_string

# CLIENT
CLIENT_URL=http://localhost:5173
```

---

*This README is generated for AI-to-AI handovers to ensure full context of the project's current state and architecture.*
