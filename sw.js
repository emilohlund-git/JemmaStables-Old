importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

workbox.routing.registerRoute(
    /\.html$/,
    new workbox.strategies.CacheFirst({
        cacheName: 'html-cache'
    })
);

workbox.routing.registerRoute(
    /\.css$/,
    new workbox.strategies.CacheFirst({
        cacheName: 'css-cache',
    })
);

workbox.routing.registerRoute(
    /\.js/,
    new workbox.strategies.CacheFirst({
        cacheName: 'js-cache',
    })
);

workbox.routing.registerRoute(
    ({ request }) => request.destination === 'image',
    new workbox.strategies.CacheFirst({
        cacheName: 'image-cache',
        plugins: [
            new workbox.expiration.ExpirationPlugin({
                maxEntries: 50,
                maxAgeSeconds: 24 * 60 * 60
            }),
        ],
    })
);