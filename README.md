# 🌍 SafeTrip — Smart & Secure Travel Companion

> A full-stack travel safety and assistance platform designed to make travel planning, navigation, and on-trip assistance more accessible, informed, and secure.

<p align="center">
  <a href="https://safetrip-g0tr.onrender.com">
    <img src="https://img.shields.io/badge/Live_Demo-Visit_SafeTrip-6C63FF?style=for-the-badge" alt="Live Demo">
  </a>
  <a href="https://github.com/Sayeedazaiba/SafeTrip">
    <img src="https://img.shields.io/badge/View_Code-GitHub-181717?style=for-the-badge&logo=github" alt="View Code">
  </a>
</p>

<p align="center">
  <a href="https://github.com/user-attachments/assets/49f81601-7135-49c8-9127-1f2281fd112b">
    <img src="https://img.shields.io/badge/▶_Demo_Video-Watch_Now-FF4B6E?style=for-the-badge" alt="Demo Video">
  </a>
</p>

---

## ✨ Overview

**SafeTrip** is a full-stack travel companion built to bring multiple travel utilities into one platform.

It combines **trip planning, route assistance, weather information, nearby assistance, document management, AI-powered travel support, accommodation and transport discovery, currency information, and multilingual accessibility** into a single web application.

The project was developed during a **30-hour Presidency University Hackathon** focused on women’s safety and secured **First Runner-Up**.

### 🎯 What SafeTrip Solves

Travelers often need to switch between multiple applications for:

* 🗺️ Route and travel planning
* 🌦️ Weather information
* 🏨 Accommodation discovery
* 🚍 Transport information
* 💱 Currency conversion
* 📍 Nearby assistance
* 📄 Important travel documents
* 🤖 AI-based travel guidance
* 🌐 Multilingual travel support

**SafeTrip brings these capabilities together in one unified platform.**

---

## 🚀 Live Demo

### 🌐 Try SafeTrip

**[Launch SafeTrip →](https://safetrip-g0tr.onrender.com)**

> The application is deployed and can be explored through the live demo.

### 🎥 Demo Video

**[▶ Watch the SafeTrip Demo →]([YOUR_DEMO_VIDEO_URL](https://github.com/user-attachments/assets/49f81601-7135-49c8-9127-1f2281fd112b))**

<!-- Replace YOUR_DEMO_VIDEO_URL with your actual YouTube / Google Drive / Loom demo link. -->

---


## 🌟 Key Features

### 🗺️ Smart Travel & Route Planning

Plan journeys and explore travel routes through an interactive travel interface.

### 🤖 AI Travel Assistant

An AI-powered assistant that helps users with travel-related questions, recommendations, and planning.

### 🧳 AI Itinerary Generation

Generate personalized travel plans based on the user's destination and travel requirements.

### 📍 Nearby Assistance

Helps users discover relevant nearby services and assistance while travelling.

### 🌦️ Weather Information

Provides weather information to help users make better travel decisions.

### 📄 Document Vault

Securely organize important travel documents within the platform.

### 🏨 Hotel & Accommodation Discovery

Provides an integrated interface for exploring accommodation options.

### 🚍 Transport Assistance

Helps users explore available transportation-related information.

### 💱 Currency Information

Provides currency-related information useful for travelling across regions.

### 🌐 Multilingual Support

Designed to improve accessibility with support for multiple Indian languages, including:

* English
* Hindi
* Kannada
* Telugu
* Marathi

### 🔐 Authentication & Data Management

User authentication and backend data management are implemented using **Supabase**, including database-backed application functionality.

---

## 🛠️ Tech Stack

### Frontend

* React
* TypeScript
* Vite
* Tailwind CSS
* shadcn/ui

### Backend & Database

* Supabase
* Supabase Authentication
* PostgreSQL
* Supabase Edge Functions

### AI

* Google Gemini
* Gemini 2.5 Flash

### APIs & Services

* OpenStreetMap
* Weather API
* Travel-related external APIs

### Deployment

* Render
* GitHub

---

## 🏗️ Architecture

```text
                         ┌─────────────────────┐
                         │       SafeTrip      │
                         │     Web Platform    │
                         └──────────┬──────────┘
                                    │
                   ┌────────────────┼────────────────┐
                   │                │                │
                   ▼                ▼                ▼
              React + TS        Supabase          External APIs
              Vite + UI         Backend           & Services
                   │                │                │
                   │         ┌──────┴──────┐         │
                   │         │             │         │
                   │         ▼             ▼         │
                   │      Auth + DB    Edge Functions│
                   │                                   │
                   └────────────────┬──────────────────┘
                                    │
                                    ▼
                             Gemini AI Assistant
                                    │
                                    ▼
                            Travel Recommendations
```

---

## 🔄 How It Works

```text
User
  │
  ▼
SafeTrip Web Application
  │
  ├── Authentication
  │
  ├── Travel Planning
  │
  ├── Route Assistance
  │
  ├── Weather
  │
  ├── Nearby Assistance
  │
  ├── Documents
  │
  ├── Hotels & Transport
  │
  ├── Currency
  │
  └── AI Travel Assistant
             │
             ▼
        Gemini + APIs
             │
             ▼
      Personalized Assistance
```

---

## 💻 Getting Started

### Prerequisites

Make sure you have:

* Node.js
* npm
* Git
* A Supabase project
* Required API keys

### 1. Clone the Repository

```bash
git clone https://github.com/Sayeedazaiba/SafeTrip.git
cd SafeTrip
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the project root and add the required API credentials.

Example:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GEMINI_API_KEY=your_gemini_api_key
```

> Do not commit `.env` files or expose private API keys in the repository.

### 4. Run the Development Server

```bash
npm run dev
```

The application will be available at the local development URL shown in your terminal.

---

## 📁 Project Structure

```text
SafeTrip/
│
├── public/
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── hooks/
│   ├── lib/
│   └── ...
│
├── supabase/
│   ├── functions/
│   └── ...
│
├── .env.example
├── package.json
├── vite.config.ts
└── README.md
```

> The exact structure may vary depending on the current repository version.

---

## 🏆 Hackathon Achievement

### 🥈 First Runner-Up — Presidency University Hackathon

SafeTrip was developed during a **30-hour hackathon** focused on **women's safety**.

**Role:** Team Leader & Primary Technical Contributor

I took primary responsibility for the technical development and contributed to the majority of the project implementation, including feature integration, backend connectivity, and deployment.

---

## 👩‍💻 My Contribution

As the **Team Leader**, I was primarily responsible for:

* Leading the technical development of SafeTrip
* Implementing major application features
* Integrating Supabase authentication and database functionality
* Working on AI-powered travel assistance
* Integrating external APIs and services
* Connecting frontend features with backend services
* Coordinating feature integration within the team
* Taking the application from development to deployment

---

## 🔐 Security & Privacy

SafeTrip uses:

* Supabase Authentication
* PostgreSQL-backed data management
* Environment variables for API credentials
* Secure backend/API integration

Sensitive credentials should be stored in environment variables and never committed to the repository.

---

## 📈 Future Improvements

Potential future enhancements include:

* More intelligent personalized itinerary generation
* Real-time travel alerts
* Expanded multilingual support
* Improved location-based assistance
* More travel-service integrations
* Enhanced accessibility features
* Progressive Web App support

---

## 🔗 Links

| Resource             | Link                                                                 |
| -------------------- | -------------------------------------------------------------------- |
| 🌐 Live Demo         | [SafeTrip](https://safetrip-g0tr.onrender.com)                       |
| 💻 GitHub Repository | [Sayeeda Zaiba / SafeTrip](https://github.com/Sayeedazaiba/SafeTrip) |
| 🎥 Demo Video        | [Watch Demo](YOUR_DEMO_VIDEO_URL)                                    |

---

## 👩‍💻 Developer

### Sayeeda Zaiba

**Final-Year B.E. Electronics & Communication Engineering Student**
Interested in **Software Development, AI, and Full-Stack Development**

* GitHub: [@Sayeedazaiba](https://github.com/Sayeedazaiba)
* Email: [sayeedazaiba99@gmail.com](mailto:sayeedazaiba99@gmail.com)

---


