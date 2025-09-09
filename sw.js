// キャッシュするアセットのバージョンを定義します。名前を変更すると新しいキャッシュが作成されます。
const CACHE_NAME = 'apps-portal-cache-v2';

// サイトの基本構成ファイル
const coreAssets = [
    './',
    './index.html',
    './css/style.css',
    './js/main.js',
    './manifest.json',
    'https://unpkg.com/swiper/swiper-bundle.min.css',
    'https://cdn.jsdelivr.net/npm/marked/marked.min.js',
    'https://unpkg.com/swiper/swiper-bundle.min.js',
    './images/logo.png',
    './images/icons/icon-192x192.png',
    './images/icons/icon-512x512.png'
];

// アプリごとのアセット（画像、Markdownファイル、そして重要な動画ファイル）
const appAssets = [
    // ASJ Hotel
    './how-to/asj-hotel.md',
    './images/app_icon_ASJ.png',
    './images/banner_ASJ.png',
    'https://firebasestorage.googleapis.com/v0/b/pilgrimage-quest-app.firebasestorage.app/o/%E5%A5%A5%E5%A4%9A%E6%91%A9_%E6%A8%AA%E7%94%BB%E9%9D%A2.mp4?alt=media&token=9cf70644-9f17-485e-a29b-03302329fb24',

    // Mebuku
    './how-to/mebuku.md',
    './images/app_icon_mebuku.png',
    './images/banner_mebuku.png',
    'https://firebasestorage.googleapis.com/v0/b/pilgrimage-quest-app.firebasestorage.app/o/%E3%82%81%E3%81%B6%E3%81%8F_%E6%A8%AA%E7%94%BB%E9%9D%A2.mp4?alt=media&token=f9195110-13b9-49da-9057-49705af97c5d',

    // Maebashi Witches
    './how-to/maebashi-witches.md',
    './images/app_icon_witch.png',
    './images/banner_witch.png',
    'https://firebasestorage.googleapis.com/v0/b/pilgrimage-quest-app.firebasestorage.app/o/%E3%82%A6%E3%82%A3%E3%83%83%E3%83%81%E3%83%BC%E3%82%BAOP_%E6%A8%AA%E7%94%BB%E9%9D%A2.mp4?alt=media&token=16e1ca27-1760-4265-bb77-0fdaf2e8402e',

    // Zasupa
    './how-to/zasupa.md',
    './images/app_icon_zasupa.png',
    './images/banner_zasupa.png',

    // Monster Hunter
    './how-to/monster-hunter.md',
    './images/app_icon_monhan.png',
    './images/banner_monhan.png'
];

// キャッシュするすべてのURLを結合
const urlsToCache = [...coreAssets, ...appAssets];


// Service Workerのインストールイベント
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Opened cache and caching assets');
                return cache.addAll(urlsToCache);
            })
    );
});

// Service Workerのフェッチイベント (Stale-While-Revalidate戦略)
self.addEventListener('fetch', (event) => {
    // POSTリクエストなど、特定のタイプのリクエストはキャッシュしない
    if (event.request.method !== 'GET') {
        return;
    }

    event.respondWith(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.match(event.request).then((cachedResponse) => {
                // ネットワークからの最新のレスポンスを取得するPromise
                const fetchPromise = fetch(event.request).then((networkResponse) => {
                    // レスポンスが正常な場合のみキャッシュを更新
                    if (networkResponse && networkResponse.status === 200) {
                        cache.put(event.request, networkResponse.clone());
                    }
                    return networkResponse;
                });

                // キャッシュがあればそれを即座に返し、裏側でネットワーク取得を試みる
                // これにより表示が高速化される
                return cachedResponse || fetchPromise;
            });
        })
    );
});


// Service Workerの有効化イベント (古いキャッシュを削除)
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