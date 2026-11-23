<div align="center">
  <h1>💇‍♀️ SalonBook - Client (Frontend)</h1>
  <p>A modern, full-featured salon appointment booking platform built with Next.js.</p>
  
  [![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
  [![Shadcn UI](https://img.shields.io/badge/Shadcn_UI-000000?style=for-the-badge&logo=shadcnui&logoColor=white)](https://ui.shadcn.com/)
</div>

---

## 📖 Project Overview
**SalonBook** is a comprehensive salon booking platform that bridges the gap between customers and salon owners. This repository contains the frontend code, which provides an intuitive, responsive, and secure interface for both customers and administrators.

### 🔗 Important Links
- **Live Website:** [https://your-live-link.vercel.app](https://your-live-link.vercel.app)
- **Backend Repository:** [https://github.com/your-username/salonbook-server](https://github.com/your-username/salonbook-server)

---

## ✨ Core Features

### 👤 Customer Panel:
- **Authentication:** Secure Sign-in & Sign-up using **Better Auth** (Email/Password and Google OAuth).
- **Explore Services:** Browse, search, and filter salon services by category and price.
- **Service Details:** View detailed information about services, including duration, price, and images.
- **Booking System:** Book appointments by selecting dates and available time slots.
- **My Appointments:** Track appointment statuses (Pending, Confirmed, Cancelled).
- **Online Payment:** Pay securely via **Stripe Checkout** for confirmed appointments.
- **Profile Management:** Update personal information and profile images.

### 🛡️ Admin Panel:
- **Dashboard Overview:** View statistics (Total Users, Total Services, Total Appointments, Successful Payments).
- **Manage Services:** Add, update, delete, and toggle the status (Active/Inactive) of salon services.
- **Image Upload:** Upload service images seamlessly using the **ImgBB API**.
- **Manage Appointments:** View all customer requests, approve (Confirm), or decline (Cancel) them.
- **Manage Users:** View registered users, block or unblock them to prevent unauthorized access.
- **Transactions:** View all successful payment histories and transaction details.

---

## 🛠️ Technology Stack
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Shadcn UI & Lucide React (Icons)
- **Authentication:** Better Auth
- **State/Notifications:** Sonner (Toast notifications)
- **Payments:** Stripe JS
- **HTTP Client:** Fetch API (with custom JWT interceptor)

---

## 🚀 Getting Started

### 1. Prerequisites
Make sure you have Node.js and npm installed on your machine.

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/your-username/salonbook-client.git

# Navigate to the project directory
cd salonbook-client

# Install dependencies
npm install