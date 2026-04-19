# CleanCity — Smart Waste Management App

A full-stack React app for citizens and municipal collectors in Durban (or any city).

## Features
- **Waste reporting** with interactive Leaflet map and pin dropping
- **AI image classification** via Claude (Anthropic) vision — snap a photo and get instant waste type, priority, and recycling advice
- **Collection schedules** with week calendar strip
- **Recycling guide** — searchable, categorised (plastic, paper, glass, metal, hazardous)
- **Notifications** — alert feed + toggleable notification preferences
- **Express backend** — proxies Anthropic API so your key stays server-side

---

## Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | React 18, React Router 6            |
| Map       | Leaflet + React-Leaflet             |
| AI        | Anthropic Claude (vision)           |
| Dates     | date-fns                            |
| Icons     | Lucide React                        |
| Toasts    | react-hot-toast                     |
| Backend   | Node.js + Express                   |
| Styling   | Plain CSS (custom design system)    |

---

## Project Structure

```
cleancity/
├── public/
│   └── index.html
├── src/
│   ├── pages/
│   │   ├── HomePage.js          ← Dashboard, stats, upcoming schedule
│   │   ├── ReportPage.js        ← Map + AI image classifier + report form
│   │   ├── RecyclePage.js       ← Searchable recycling guide
│   │   ├── SchedulePage.js      ← Week calendar + collection list
│   │   └── NotificationsPage.js ← Alert feed + notification toggles
│   ├── services/
│   │   └── aiClassifier.js      ← Anthropic API call (image → JSON)
│   ├── utils/
│   │   └── data.js              ← Mock data, constants, schedule
│   ├── App.js                   ← Router + bottom nav
│   ├── index.js                 ← Entry point
│   └── index.css                ← Global design system
├── server.js                    ← Express backend (API proxy + reports CRUD)
├── server-package.json          ← Backend dependencies
├── package.json                 ← Frontend dependencies
└── .env.example                 ← Environment variable template
```

---

## Setup & Running

### 1. Get an Anthropic API key
- Go to https://console.anthropic.com
- Create an account and generate an API key
- Copy `.env.example` to `.env` and paste your key

### 2. Install frontend dependencies
```bash
npm install
```

### 3. Install backend dependencies
```bash
cp server-package.json server/package.json   # or just run npm install in root after renaming
npm install --prefix server express cors dotenv @anthropic-ai/sdk
# OR rename server-package.json to a separate /server folder
```

### 4. Run the backend
```bash
node server.js
# or with auto-reload:
npx nodemon server.js
```

### 5. Run the frontend (new terminal)
```bash
npm start
```
App opens at **http://localhost:3000**

---

## Recommended Tools & Apps

### Development
| Tool              | Purpose                              | Get it                          |
|-------------------|--------------------------------------|---------------------------------|
| VS Code           | Code editor                          | code.visualstudio.com           |
| Node.js (v18+)    | Run JavaScript backend               | nodejs.org                      |
| Git               | Version control                      | git-scm.com                     |
| Postman           | Test your API endpoints              | postman.com                     |

### Deployment
| Tool              | Purpose                              | Notes                           |
|-------------------|--------------------------------------|---------------------------------|
| Vercel            | Deploy React frontend (free)         | vercel.com — `npx vercel`       |
| Railway / Render  | Deploy Node.js backend (free tier)   | railway.app or render.com       |
| Supabase          | Replace in-memory DB with Postgres   | supabase.com — free tier        |

### Mobile (turn it into a real app)
| Tool              | Purpose                              | Notes                           |
|-------------------|--------------------------------------|---------------------------------|
| React Native      | Build iOS + Android app              | Same React knowledge            |
| Expo              | Easiest React Native setup           | expo.dev                        |
| Capacitor         | Wrap web app into native shell       | capacitorjs.com                 |

### Push Notifications (extend alerts)
| Tool              | Purpose                              |
|-------------------|--------------------------------------|
| Firebase FCM      | Free push notifications              |
| OneSignal         | Easy push + in-app notifications     |

---

## Extending the App

### Add a real database
Replace the in-memory `reports` array in `server.js` with Supabase:
```bash
npm install @supabase/supabase-js
```

### Add user authentication
```bash
npm install @supabase/auth-ui-react
# or Firebase Auth
```

### Add collector dashboard
Create `/pages/CollectorDashboard.js` — show assigned reports, route optimisation, status updates.

### Add push notifications
Integrate Firebase Cloud Messaging when a report status changes.
