// =============================================
// アプリケーションのデータベース
// =============================================
const appDatabase = [
    {
        id: 'asj-hotel', // アプリを内部的に識別するための一意のID、英数字とハイフン(-)で命名すれば何でも良い(今は私用されていない、今後お気に入りなどを実装した時に必要)
        title: '【奥多摩】ASJ×沿線まるごとホテル',
        icon: 'images/app_icon_ASJ.png', // アプリ一覧に表示されるアイコン画像のパス
        url: 'https://kiyunero.github.io/-2/', // ここを実際のアプリのURLに書き換える
        showOnBanner: true, // このアプリを画面上部のスライドバナーに表示するかどうかを決める
        bannerImage: 'images/banner_ASJ.png',
        bannerButtonText: 'MORE',
        howToPage: 'how-to/asj-hotel.md'
    },
    {
        id: 'mebuku',
        title: 'めぶく前橋',
        icon: 'images/app_icon_mebuku.png',
        url: 'https://kiyunero.github.io/uxitti-zu-point-koukan-system-jihanki-/',
        showOnBanner: true,
        bannerImage: 'images/banner_mebuku.png',
        bannerButtonText: 'MORE',
        howToPage: 'how-to/mebuku.md'
    },
    {
        id: 'maebashi-witches',
        title: '前橋ウィッチーズ',
        icon: 'images/app_icon_witch.png',
        url: 'https://kiyunero.github.io/uxitti-zu_61/',
        showOnBanner: true,
        bannerImage: 'images/banner_witch.png',
        bannerButtonText: 'MORE',
        howToPage: 'how-to/maebashi-witches.md'
    },
    {
        id: 'zasupa',
        title: 'ザスパ草津選手名鑑',
        icon: 'images/app_icon_zasupa.png',
        url: 'https://kiyunero.github.io/zasupa_sensyuzukan/',
        showOnBanner: true,
        bannerImage: 'images/banner_zasupa.png',
        bannerButtonText: 'MORE',
        howToPage: 'how-to/zasupa.md'
    },
    {
        id: 'monster-hunter',
        title: 'Monster Hunter Wilds',
        icon: 'images/app_icon_monhan.png',
        url: 'https://あなたのアプリ4のURL.com',
        showOnBanner: true,
        bannerImage: 'images/banner_monhan.png',
        bannerButtonText: 'MORE',
        howToPage: 'how-to/monster-hunter.md'
    },
];

// =============================================
// DOM要素の取得
// =============================================
const bannerWrapper = document.querySelector('.banner-swiper .swiper-wrapper');
const appGrid = document.getElementById('app-grid');
const mainContents = document.getElementById('main-contents');
const pageViewer = document.getElementById('page-viewer');
const pageContent = document.getElementById('page-content');
const backButton = document.getElementById('back-button');

// --- ▼▼▼ 動画の音量制御用変数を追加 ▼▼▼ ---
let volumeInterval = null; // 音量フェード処理を管理するための変数

// =============================================
// ページ表示・非表示の制御
// =============================================
async function showPage(pagePath) {
    if (!pagePath) return;

    try {
        const response = await fetch(pagePath);
        if (!response.ok) { throw new Error('Network response was not ok.'); }
        const markdown = await response.text();

        pageContent.innerHTML = marked.parse(markdown);

        // --- ▼▼▼ 動画の音量フェードイン処理を追加 ▼▼▼ ---
        const video = pageContent.querySelector('video');
        if (video) {
            // 前のインターバルが残っていればクリアする
            if (volumeInterval) clearInterval(volumeInterval);
            
            video.volume = 0; // まず音量を0にする
            video.play().catch(e => console.log("Autoplay was prevented.")); // 再生開始

            volumeInterval = setInterval(() => {
                // 少しずつ音量を上げる
                if (video.volume < 1.0) {
                    video.volume = Math.min(1.0, video.volume + 0.1);
                } else {
                    // 音量が最大になったら処理を停止
                    clearInterval(volumeInterval);
                }
            }, 100); // 100ミリ秒ごとに実行
        }
        // --- ▲▲▲ ここまで追加 ▲▲▲ ---

        mainContents.classList.add('hidden');
        pageViewer.classList.remove('hidden');
        window.scrollTo(0, 0);
    } catch (error) {
        console.error('Error fetching or parsing page:', error);
        pageContent.innerHTML = '<h2>Page failed to load</h2>';
        mainContents.classList.add('hidden');
        pageViewer.classList.remove('hidden');
    }
}

function showMainContents() {
    pageViewer.classList.add('hidden');
    mainContents.classList.remove('hidden');
}

// =============================================
// バナーの動的生成
// =============================================
function generateBanners() {
    const bannerApps = appDatabase.filter(app => app.showOnBanner);
    bannerApps.forEach(app => {
        const slide = document.createElement('div');
        slide.className = 'swiper-slide';

        slide.innerHTML = `
            <a href="#" data-page="${app.howToPage}">
                <img src="${app.bannerImage}" alt="${app.title}">
                <div class="slide-overlay">
                    <span class="slide-title">${app.title}</span>
                    <button class="slide-button">${app.bannerButtonText}</button>
                </div>
            </a>
        `;
        bannerWrapper.appendChild(slide);
    });

    bannerWrapper.addEventListener('click', (event) => {
        const link = event.target.closest('a');
        if (link && link.dataset.page) {
            event.preventDefault();
            showPage(link.dataset.page);
        }
    });
}

// =============================================
// アプリアイコン一覧の動的生成
// =============================================
function generateAppGrid() {
    appDatabase.forEach(app => {
        const link = document.createElement('a');
        link.href = app.url;
        link.className = 'app-item';

        const icon = document.createElement('img');
        icon.src = app.icon;
        icon.alt = app.title;
        icon.className = 'app-icon';

        const title = document.createElement('span');
        title.className = 'app-title';
        title.textContent = app.title;

        link.appendChild(icon);
        link.appendChild(title);

        appGrid.appendChild(link);
    });
}

// =============================================
// Swiper.js の初期化
// =============================================
function initializeSwiper() {
    new Swiper('.banner-swiper', {
        loop: true,
        autoplay: { delay: 3000, disableOnInteraction: false },
        slidesPerView: 3,
        spaceBetween: 20,
        breakpoints: {
            0: { slidesPerView: 1.2, spaceBetween: 10 },
            768: { slidesPerView: 3, spaceBetween: 20 },
        },
        observer: true,
        observeParents: true,
        pagination: { el: '.swiper-pagination', clickable: true },
    });
}

// =============================================
// アプリケーションの初期化処理
// =============================================
document.addEventListener('DOMContentLoaded', () => {
    generateBanners();
    generateAppGrid();
    initializeSwiper();

    // --- ▼▼▼ 戻るボタンの処理を修正 ▼▼▼ ---
    backButton.addEventListener('click', () => {
        const video = pageContent.querySelector('video');
        
        // もし動画が存在すれば、音量をフェードアウトさせてからページを切り替える
        if (video) {
            // 前のインターバルが残っていればクリアする
            if (volumeInterval) clearInterval(volumeInterval);

            volumeInterval = setInterval(() => {
                if (video.volume > 0.0) {
                    video.volume = Math.max(0.0, video.volume - 0.1);
                } else {
                    // 音量が0になったら、インターバルを停止し、動画も停止
                    clearInterval(volumeInterval);
                    video.pause();
                    video.currentTime = 0; // 動画を最初に戻す
                    
                    // 最後にメインコンテンツを表示
                    showMainContents();
                }
            }, 50); // 50ミリ秒ごと（フェードインより少し速く）
        } else {
            // 動画がなければ、すぐにメインコンテンツを表示
            showMainContents();
        }
    });
});