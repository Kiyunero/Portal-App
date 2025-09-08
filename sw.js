// キャッシュするファイルの名前とバージョンを定義
const CACHE_NAME = 'apps-portal-cache-v1';
const urlsToCache = [
    // 基本的なファイル
    './',
    './index.html',
    './css/style.css',
    './js/main.js',
    './manifest.json',

    // 外部ライブラリ
    'https://unpkg.com/swiper/swiper-bundle.min.css',
    'https://cdn.jsdelivr.net/npm/marked/marked.min.js',
    'https://unpkg.com/swiper/swiper-bundle.min.js',

    // How-toページ
    './how-to/asj-hotel.md',
    './how-to/mebuku.md',
    './how-to/maebashi-witches.md',
    // 他のhow-toページも必要に応じて追加
    './how-to/zasupa.md',
    './how-to/monster-hunter.md',

    // 画像ファイル
    './images/logo.png',
    './images/app_icon_ASJ.png',
    './images/banner_ASJ.png',
    './images/app_icon_mebuku.png',
    './images/banner_mebuku.png',
    './images/app_icon_witch.png',
    './images/banner_witch.png',
    './images/app_icon_zasupa.png',
    './images/banner_zasupa.png',
    './images/app_icon_monhan.png',
    './images/banner_monhan.png',

    // PWA用アイコン
    './images/icons/icon-192x192.png',
    './images/icons/icon-512x512.png'
];

// Service Workerのインストールイベント
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

// Service Workerのフェッチイベント
// リクエストされたリソースがキャッシュにあればそれを返し、なければネットワークから取得する
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                if (response) {
                    return response; // キャッシュにヒットした場合
                }
                return fetch(event.request); // キャッシュになかった場合
            }
        )
    );
});

// Service Workerの有効化イベント
// 古いキャッシュを削除する
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});