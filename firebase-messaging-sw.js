/* Prachi Cloud Kitchen - Firebase Cloud Messaging service worker */
importScripts('https://www.gstatic.com/firebasejs/12.1.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/12.1.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyBq7UEsIwoudC2g8DRrG7EwqblX9SIDCF8',
  authDomain: 'ticktok-7fb30.firebaseapp.com',
  databaseURL: 'https://ticktok-7fb30-default-rtdb.firebaseio.com',
  projectId: 'ticktok-7fb30',
  storageBucket: 'ticktok-7fb30.firebasestorage.app',
  messagingSenderId: '493782050714',
  appId: '1:493782050714:web:5f6bd9eae6af68b250fc23',
  measurementId: 'G-3KH8Y1SVDG'
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notification = payload.notification || {};
  const data = payload.data || {};

  const title = notification.title || data.title || '🍽️ NEW ORDER RECEIVED';
  const body = notification.body || data.body || 'A new customer order has been placed.';
  const orderId = data.orderId || '';

  self.registration.showNotification(title, {
    body,
    icon: '/menu/favicon.ico',
    badge: '/menu/favicon.ico',
    tag: orderId ? `prachi-order-${orderId}` : 'prachi-new-order',
    renotify: true,
    requireInteraction: true,
    data: {
      url: '/menu/secret-controller.html',
      orderId
    }
  });
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const targetUrl = new URL(
    event.notification.data?.url || '/menu/secret-controller.html',
    self.location.origin
  ).href;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ('focus' in client) {
          if ('navigate' in client && client.url !== targetUrl) {
            client.navigate(targetUrl);
          }
          return client.focus();
        }
      }

      if (clients.openWindow) return clients.openWindow(targetUrl);
      return undefined;
    })
  );
});
