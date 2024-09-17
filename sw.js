const CACHE_NAME = 'ifs-tracker-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/icon.png',
  '/manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});

self.addEventListener('message', event => {
  if (event.data && event.data.type === 'UPDATE_INTERVAL') {
    updateNotificationSchedule(event.data.interval);
  }
});

let notificationInterval;

function updateNotificationSchedule(interval) {
  clearInterval(notificationInterval);
  if (interval === 'random') {
    scheduleRandomNotification();
  } else {
    const milliseconds = parseInt(interval) * 1000;
    notificationInterval = setInterval(() => {
      self.registration.showNotification('IFS Tracker Reminder', {
        body: "It's time to rate your Cs and Ps!",
        icon: 'icon.png'
      });
    }, milliseconds);
  }
}

function scheduleRandomNotification() {
  const randomHours = Math.floor(Math.random() * 24) + 1;
  setTimeout(() => {
    self.registration.showNotification('IFS Tracker Reminder', {
      body: "It's time to rate your Cs and Ps!",
      icon: 'icon.png'
    });
    scheduleRandomNotification();
  }, randomHours * 60 * 60 * 1000);
}

// Background Sync
self.addEventListener('sync', event => {
  if (event.tag === 'sync-notifications') {
    event.waitUntil(syncNotifications());
  }
});

function syncNotifications() {
  // Here you would typically fetch any new data or perform updates
  // For now, we'll just reschedule the notifications
  const interval = localStorage.getItem('reminderInterval') || '14400';
  updateNotificationSchedule(interval);
}
