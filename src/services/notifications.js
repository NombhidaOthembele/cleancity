// ── Push Notifications Service ──
// Uses Firebase Cloud Messaging (FCM)
// Setup: npm install firebase
// Create a project at https://console.firebase.google.com

import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

// Replace with your Firebase config from Firebase Console
const firebaseConfig = {
  apiKey:            process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain:        process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId:         process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket:     process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_SENDER_ID,
  appId:             process.env.REACT_APP_FIREBASE_APP_ID,
};

const app       = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// Request permission and get FCM token
export async function requestNotificationPermission() {
  try {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.log('Notification permission denied');
      return null;
    }
    const token = await getToken(messaging, {
      vapidKey: process.env.REACT_APP_FIREBASE_VAPID_KEY,
    });
    console.log('FCM Token:', token);
    // TODO: save this token to your backend/Supabase for the current user
    return token;
  } catch (err) {
    console.error('FCM token error:', err);
    return null;
  }
}

// Listen for foreground messages
export function onForegroundMessage(callback) {
  return onMessage(messaging, (payload) => {
    console.log('Foreground message:', payload);
    callback(payload);
  });
}

// ── Send a notification from the backend (server.js) ──
// Add this to server.js:
/*
const admin = require('firebase-admin');
const serviceAccount = require('./firebase-service-account.json');

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });

async function sendPushNotification(fcmToken, title, body) {
  const message = {
    token: fcmToken,
    notification: { title, body },
    android: { priority: 'high' },
    apns:    { payload: { aps: { sound: 'default' } } },
  };
  const response = await admin.messaging().send(message);
  console.log('Notification sent:', response);
}

// Example: notify collector when new report submitted
app.post('/api/reports', async (req, res) => {
  // ... create report ...
  await sendPushNotification(collectorFcmToken, 'New report', `${report.type} in ${report.zone}`);
});
*/
