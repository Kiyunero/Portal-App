// =============================================
// アプリケーションのデータベース
// =============================================
const appDatabase = [
    {
        id: 'asj-hotel',
        title: '【奥多摩】ASJ×沿線まるごとホテル',
        icon: 'images/app_icon_ASJ.png',
        url: 'https://kiyunero.github.io/-2/',
        showOnBanner: true,
        bannerImage: 'images/banner_ASJ.png',
        bannerButtonText: 'MORE',
        howToPage: 'how-to/asj-hotel.md',
        videoUrl: 'https://firebasestorage.googleapis.com/v0/b/pilgrimage-quest-app.firebasestorage.app/o/%E5%A5%A5%E5%A4%9A%E6‘©_%E6%A8%AA%E7%94%BB%E9%9D%A2.mp4?alt=media&token=9cf70644-9f17-485e-a29b-03302329fb24'
    },
    {
        id: 'mebuku',
        title: 'めぶく前橋',
        icon: 'images/app_icon_mebuku.png',
        url: 'https://kiyunero.github.io/uxitti-zu-point-koukan-system-jihanki-/',
        showOnBanner: true,
        bannerImage: 'images/banner_mebuku.png',
        bannerButtonText: 'MORE',
        howToPage: 'how-to/mebuku.md',
        videoUrl: 'https://firebasestorage.googleapis.com/v0/b/pilgrimage-quest-app.firebasestorage.app/o/%E3%82%81%E3%81%B6%E3%81%8F_%E6%A8%AA%E7%94%BB%E9%9D%A2.mp4?alt=media&token=f9195110-13b9-49da-9057-49705af97c5d'
    },
    {
        id: 'maebashi-witches',
        title: '前橋ウィッチーズ',
        icon: 'images/app_icon_witch.png',
        url: 'https://kiyunero.github.io/uxitti-zu_61/',
        showOnBanner: true,
        bannerImage: 'images/banner_witch.png',
        bannerButtonText: 'MORE',
        howToPage: 'how-to/maebashi-witches.md',
        videoUrl: 'https://firebasestorage.googleapis.com/v0/b/pilgrimage-quest-app.firebasestorage.app/o/%E3%82%A6%E3%82%A3%E3%83%83%E3%83%81%E3%83%BC%E3%82%BAOP_%E6%A8%AA%E7%94%BB%E9%9D%A2.mp4?alt=media&token=16e1ca27-1760-4265-bb77-0fdaf2e8402e'
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
    {
        id: 'manga',
        title: '漫画風聖地巡礼図鑑',
        icon: 'images/app_icon_manga.png',
        url: 'https://kiyunero.github.io/manga_seitijunrei/',
        showOnBanner: true,
        bannerImage: 'images/banner_manga.png',
        bannerButtonText: 'MORE',
        howToPage: 'how-to/manga.md'
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
const appContainer = document.getElementById('app-container');
const appFrame = document.getElementById('app-frame');
const closeAppButton = document.getElementById('close-app-button');

let mySwiper;

// =============================================
// リソースの先読み（プリフェッチ）機能
// =============================================
const preloadedUrls = new Set(); 

function preloadResources(urls) {
    urls.forEach(url => {
        if (!url || preloadedUrls.has(url)) {
            return;
        }

        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = url;
        if (url.endsWith('.mp4')) {
            link.as = 'video';
        } else {
            link.as = 'fetch';
        }
        document.head.appendChild(link);
        preloadedUrls.add(url);
    });
}

function preloadAllBannerContents() {
    const resourcesToPreload = [];
    appDatabase.forEach(app => {
        if (app.showOnBanner) {
            if (app.howToPage) resourcesToPreload.push(app.howToPage);
            if (app.videoUrl) resourcesToPreload.push(app.videoUrl);
        }
    });
    preloadResources(resourcesToPreload);
}

// =============================================
// 外部アプリの起動・終了処理
// =============================================
function launchApp(url) {
    appFrame.src = url;
    mainContents.classList.add('hidden');
    pageViewer.classList.add('hidden');
    appContainer.classList.remove('hidden');
}

function closeApp() {
    appContainer.classList.add('hidden');
    mainContents.classList.remove('hidden');
    appFrame.src = "";

    // Swiperインスタンスを破棄して再初期化
    if (mySwiper) {
        mySwiper.destroy();
    }
    initializeSwiper();
}

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

        const video = pageContent.querySelector('video');
        if (video) {
            video.volume = 0.5;
            video.play().catch(e => console.log("Autoplay was prevented. User interaction needed."));
        }

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
    appContainer.classList.add('hidden');
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
        link.href = "#";
        link.className = 'app-item';

        link.addEventListener('click', (event) => {
            event.preventDefault();
            launchApp(app.url);
        });

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
    mySwiper = new Swiper('.banner-swiper', {
        loop: true,
        autoplay: {
            delay: 3000,
            disableOnInteraction: false
        },
        centeredSlides: true,
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

    closeAppButton.addEventListener('click', closeApp);

    backButton.addEventListener('click', () => {
        const video = pageContent.querySelector('video');
        if (video) {
            video.pause();
            video.currentTime = 0;
        }
        showMainContents();

        // Swiperインスタンスを破棄して再初期化
        if (mySwiper) {
            mySwiper.destroy();
        }
        initializeSwiper();
    });
    
    preloadAllBannerContents();
});