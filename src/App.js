import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Home, AlertTriangle, Recycle, Calendar, Bell, LayoutDashboard } from 'lucide-react';

import LoginPage           from './pages/LoginPage';
import HomePage            from './pages/HomePage';
import ReportPage          from './pages/ReportPage';
import RecyclePage         from './pages/RecyclePage';
import SchedulePage        from './pages/SchedulePage';
import NotificationsPage   from './pages/NotificationsPage';
import CollectorDashboard  from './pages/CollectorDashboard';

const CITIZEN_NAV = [
  { path: '/',              label: 'Home',     Icon: Home          },
  { path: '/report',        label: 'Report',   Icon: AlertTriangle },
  { path: '/recycle',       label: 'Recycle',  Icon: Recycle       },
  { path: '/schedule',      label: 'Schedule', Icon: Calendar      },
  { path: '/notifications', label: 'Alerts',   Icon: Bell          },
];

const COLLECTOR_NAV = [
  { path: '/collector',     label: 'Dashboard', Icon: LayoutDashboard },
  { path: '/schedule',      label: 'Schedule',  Icon: Calendar        },
  { path: '/notifications', label: 'Alerts',    Icon: Bell            },
];

function BottomNav({ role }) {
  const navigate     = useNavigate();
  const { pathname } = useLocation();
  const nav          = role === 'collector' ? COLLECTOR_NAV : CITIZEN_NAV;
  return (
    <nav className="bottom-nav">
      {nav.map(({ path, label, Icon }) => (
        <button
          key={path}
          className={`nav-item ${pathname === path ? 'active' : ''}`}
          onClick={() => navigate(path)}
        >
          <Icon />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  return (
    <Router>
      <Toaster position="top-center" toastOptions={{ style: { fontFamily: 'DM Sans, sans-serif', fontSize: 14 } }} />
      {!user ? (
        <Routes>
          <Route path="*" element={<LoginPage onLogin={setUser} />} />
        </Routes>
      ) : (
        <>
          <Routes>
            <Route path="/"              element={<HomePage user={user} />} />
            <Route path="/report"        element={<ReportPage />} />
            <Route path="/recycle"       element={<RecyclePage />} />
            <Route path="/schedule"      element={<SchedulePage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/collector"     element={user.role === 'collector' ? <CollectorDashboard user={user} /> : <Navigate to="/" replace />} />
            <Route path="*"              element={<Navigate to="/" replace />} />
          </Routes>
          <BottomNav role={user.role} />
        </>
      )}
    </Router>
  );
}
