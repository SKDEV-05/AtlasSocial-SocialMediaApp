# 🌐 Atlas Social: Modern Social & Messaging Platform

A premium, full-featured web application combining **Real-time Messaging**, a **Social Media Feed**, and an immersive **Video Reels** experience. Built with a focus on high-end aesthetics, accessibility, and modern technology.

---

## ✨ Key Features

### 💬 Real-time Messaging
- **Instant Chat:** Powered by **Laravel Reverb** (WebSockets) for ultra-low latency messaging.
- **Presence Indicators:** See when friends are active.
- **Unread Counters:** Stay updated with message notifications.
- **Audio Alerts:** Custom notification sounds for incoming messages.

### 🍱 Social Media Feed
- **Post Interaction:** Create, Like, Dislike, and Comment on posts.
- **Rich Media Support:** Supports image and video posts with modern card designs.
- **Engagement:** Real-time updates for likes and comments.

### 🎥 Video Reels (Pexels Integration)
- **Automated Content:** Fetches high-quality popular videos directly from the **Pexels API**.
- **Premium Experience:** Integrated with **Plyr.io** for a high-end, responsive video player.
- **Seamless Navigation:** Smart keyboard navigation (Up/Down) and custom "Reels-style" controls.
- **HD Quality:** Automatically prioritizes HD streams for visual excellence.

### 🛡️ Admin & Dashboard
- **Admin Panel:** Powerful moderation tools for posts and users.
- **Profile Management:** Fully customizable user profiles with personalized avatars and themes.
- **Analytics:** Dashboard overview of activity.

### 🌗 Premium UI/UX
- **Design System:** Built on a custom token-based architecture using **Shadcn UI** and **Radix UI**.
- **Dark/Light Mode:** Full native support for theme toggling with persistent preferences.
- **Glassmorphism:** Elegant use of blur effects and gradients for a state-of-the-art look.

---

## 🚀 Tech Stack

### Backend
- **Framework:** [Laravel 11](https://laravel.com)
- **Real-time:** [Laravel Reverb](https://reverb.laravel.com) & Laravel Echo
- **Broadcasting:** WebSocket-based event system
- **Database:** SQLite (Default) / PostgreSQL / MySQL
- **HTTP Client:** Guzzle/Laravel Http for Pexels API integration

### Frontend
- **Framework:** [React 18](https://reactjs.org) + [Inertia.js](https://inertiajs.com)
- **Styling:** [Tailwind CSS](https://tailwindcss.com) + Framer Motion
- **UI Components:** [Shadcn UI](https://ui.shadcn.com)
- **Icons:** [Lucide-React](https://lucide.dev)
- **Video Player:** [Plyr.io](https://plyr.io) via `plyr-react`
- **Build Tool:** Vite

---

## 🛠️ Installation

### Prerequisites
- **PHP 8.2+** & **Composer**
- **Node.js 18+** & **npm**

### Setup Steps
1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd chat-app
   ```
2. **Install Dependencies:**
   ```bash
   composer install
   npm install
   ```
3. **Configure Environment:**
   Copy `.env.example` to `.env` and configure your database and Pexels API key:
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```
   *Make sure to add your `PEXELS_API_KEY` to the `.env` file.*

4. **Run Migrations:**
   ```bash
   php artisan migrate
   ```
5. **Start Servers:**
   - **Frontend/Vite:** `npm run dev`
   - **Backend:** `php artisan serve`
   - **WebSocket (Reverb):** `php artisan reverb:start`

---

## 📖 Directory Structure

- `app/Http/Controllers/` - Core business logic (Chat, Videos, Posts).
- `resources/js/Pages/` - React pages (Inertia views).
- `resources/js/Layouts/` - Shared layouts for Authenticated & Public states.
- `resources/js/Components/ui/` - Custom design system components.
- `routes/web.php` - Application routing.

---

## 📜 License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT). This application is built for performance and security.
