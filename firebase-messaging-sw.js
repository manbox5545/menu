importScripts(
  "https://www.gstatic.com/firebasejs/12.1.0/firebase-app-compat.js"
);

importScripts(
  "https://www.gstatic.com/firebasejs/12.1.0/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyBq7UEsIwoudC2g8DRrG7EwqblX9SIDCF8",
  authDomain: "ticktok-7fb30.firebaseapp.com",
  databaseURL: "https://ticktok-7fb30-default-rtdb.firebaseio.com",
  projectId: "ticktok-7fb30",
  storageBucket: "ticktok-7fb30.firebasestorage.app",
  messagingSenderId: "493782050714",
  appId: "1:493782050714:web:5f6bd9eae6af68b250fc23",
  measurementId: "G-3KH8Y1SVDG"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {

  const data = payload.data || {};

  const title =
    data.title || "🍽️ NEW ORDER RECEIVED";

  const body =
    data.body ||
    "A new customer order has been placed.";

  self.registration.showNotification(title, {
    body: body,

    tag: data.orderId
      ? `prachi-order-${data.orderId}`
      : "prachi-new-order",

    renotify: true,

    requireInteraction: true,

    silent: false,

    data: {
      url: data.url || "/secret-controller.html"
    }
  });

});


self.addEventListener("notificationclick", (event) => {

  event.notification.close();

  const url =
    event.notification.data?.url ||
    "/secret-controller.html";

  event.waitUntil(

    clients.matchAll({
      type: "window",
      includeUncontrolled: true
    }).then((clientList) => {

      for (const client of clientList) {

        if ("focus" in client) {

          client.navigate(url);

          return client.focus();

        }

      }

      if (clients.openWindow) {

        return clients.openWindow(url);

      }

    })

  );

});