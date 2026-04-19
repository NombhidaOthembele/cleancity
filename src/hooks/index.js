// ── useReports hook ──
// Manages report state, submission, and status updates

import { useState, useEffect } from 'react';
import { SAMPLE_REPORTS } from '../utils/data';

export function useReports() {
  const [reports, setReports] = useState(() => {
    try {
      const saved = localStorage.getItem('cleancity_reports');
      return saved ? JSON.parse(saved) : SAMPLE_REPORTS;
    } catch { return SAMPLE_REPORTS; }
  });

  useEffect(() => {
    try { localStorage.setItem('cleancity_reports', JSON.stringify(reports)); } catch {}
  }, [reports]);

  function addReport(report) {
    const id = 'WM-' + Math.floor(4800 + Math.random() * 500);
    const newReport = { ...report, id, status: 'Submitted', date: new Date().toISOString().split('T')[0] };
    setReports(prev => [newReport, ...prev]);
    return newReport;
  }

  function updateStatus(id, status) {
    setReports(prev => prev.map(r => r.id === id ? { ...r, status } : r));
  }

  return { reports, addReport, updateStatus };
}

// ── useSchedule hook ──
import { SCHEDULE } from '../utils/data';
import { format } from 'date-fns';

export function useSchedule() {
  const today = format(new Date(), 'yyyy-MM-dd');
  const upcoming = SCHEDULE.filter(s => s.date >= today);
  const todayItems = SCHEDULE.filter(s => s.date === today);
  return { schedule: SCHEDULE, upcoming, todayItems };
}

// ── useNotifications hook ──
import { NOTIFICATIONS } from '../utils/data';

export function useNotifications() {
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const unreadCount = notifications.filter(n => !n.read).length;

  function markRead(id) {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }

  function markAllRead() {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }

  function addNotification(notif) {
    setNotifications(prev => [{ ...notif, id: Date.now(), read: false }, ...prev]);
  }

  return { notifications, unreadCount, markRead, markAllRead, addNotification };
}

// ── useGeolocation hook ──
export function useGeolocation() {
  const [location, setLocation] = useState(null);
  const [error, setError]       = useState(null);
  const [loading, setLoading]   = useState(false);

  function getLocation() {
    if (!navigator.geolocation) {
      setError('Geolocation not supported by this browser');
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      pos => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLoading(false);
      },
      err => {
        setError(err.message);
        setLoading(false);
      }
    );
  }

  return { location, error, loading, getLocation };
}
