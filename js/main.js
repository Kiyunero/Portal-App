// (Firebase設定とappDatabaseは変更ありません)
const firebaseConfig = { apiKey: "AIzaSyC0CAJL4tR7DI5qglKYYP6Mw-0ds6FC6vU", authDomain: "chaos-map-data-f2395.firebaseapp.com", projectId: "chaos-map-data-f2395", storageBucket: "chaos-map-data-f2395.appspot.com", messagingSenderId: "372157587318", appId: "1:372157587318:web:ee075f0ae1391af43aa457" };
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const appDatabase = [
    { id: 'asj-hotel', title: '【奥多摩】ASJ×沿線まるごとホテル', icon: 'images/app_icon_ASJ.png', url: 'https://kiyunero.github.io/-2/', showOnBanner: true, bannerImage: 'images/banner_ASJ.png', bannerButtonText: 'MORE', howToPage: 'how-to/asj-hotel.md', videoUrl: 'https://firebasestorage.googleapis.com/v0/b/pilgrimage-quest-app.firebasestorage.app/o/%E5%A5%A5%E5%A4%9A%E6‘©_%E6%A8%AA%E7%94%BB%E9%9D%A2.mp4?alt=media&token=9cf70644-9f17-485e-a29b-03302329fb24' },
    { id: 'mebuku', title: 'めぶく前橋', icon: 'images/app_icon_mebuku.png', url: 'https://kiyunero.github.io/uxitti-zu-point-koukan-system-jihanki-/', showOnBanner: true, bannerImage: 'images/banner_mebuku.png', bannerButtonText: 'MORE', howToPage: 'how-to/mebuku.md', videoUrl: 'https://firebasestorage.googleapis.com/v0/b/pilgrimage-quest-app.firebasestorage.app/o/%E3%82%81%E3%81%B6%E3%81%8F_%E6%A8%AA%E7%94%BB%E9%9D%A2.mp4?alt=media&token=f9195110-13b9-49da-9057-49705af97c5d' },
    { id: 'maebashi-witches', title: '前橋ウィッチーズ', icon: 'images/app_icon_witch.png', url: 'https://kiyunero.github.io/uxitti-zu_61/', showOnBanner: true, bannerImage: 'images/banner_witch.png', bannerButtonText: 'MORE', howToPage: 'how-to/maebashi-witches.md', videoUrl: 'https://firebasestorage.googleapis.com/v0/b/pilgrimage-quest-app.firebasestorage.app/o/%E3%82%A6%E3%82%A3%E3%83%83%E3%83%81%E3%83%BC%E3%82%BAOP_%E6%A8%AA%E7%94%BB%E9%9D%A2.mp4?alt=media&token=16e1ca27-1760-4265-bb77-0fdaf2e8402e' },
    { id: 'zasupa', title: 'ザスパ草津選手名鑑', icon: 'images/app_icon_zasupa.png', url: 'https://kiyunero.github.io/zasupa_sensyuzukan/', showOnBanner: true, bannerImage: 'images/banner_zasupa.png', bannerButtonText: 'MORE', howToPage: 'how-to/zasupa.md' },
    { id: 'monster-hunter', title: 'Monster Hunter Wilds', icon: 'images/app_icon_monhan.png', url: 'https://www.monsterhunter.com/wilds/ja-jp/', showOnBanner: true, bannerImage: 'images/banner_monhan.png', bannerButtonText: 'MORE', howToPage: 'how-to/monster-hunter.md' },
    { id: 'manga', title: '漫画風聖地巡礼図鑑', icon: 'images/app_icon_manga.png', url: 'https://kiyunero.github.io/manga_seitijunrei/', showOnBanner: true, bannerImage: 'images/banner_manga.png', bannerButtonText: 'MORE', howToPage: 'how-to/manga.md' },
];

// =============================================
// ゲームキャラクター関連のデータと状態管理
// =============================================
const characters = [
    { id: 'char01', name: 'ユイナ', iconUrl: 'images/yuina.gif', selectIconUrl: 'images/select_yuina.png' },
    { id: 'char02', name: 'チョコ', iconUrl: 'images/tyoko.gif', selectIconUrl: 'images/select_tyoko.png' },
    { id: 'char03', name: 'アズ', iconUrl: 'images/char_mage.png', selectIconUrl: 'images/select_azu.png' },
    { id: 'char04', name: 'マイ', iconUrl: 'images/char_mage.png', selectIconUrl: 'images/select_mai.png' },
    { id: 'char05', name: 'キョウカ', iconUrl: 'images/char_mage.png', selectIconUrl: 'images/select_kyouka.png' },
    { id: 'char06', name: '係長', iconUrl: 'images/char_mage.png', selectIconUrl: 'images/select_sarari-man.png' },
    { id: 'char07', name: '？？？', iconUrl: 'images/char_mage.png', selectIconUrl: 'images/select_baka.png' }, // IDの重複を修正
    // 他のキャラクターをここに追加
];

let playerState = {
    currentCharacterId: 'char01',
    unlockedCharacters: ['char01'] // 初期キャラクターのみ解放済み
};

function savePlayerState() {
    localStorage.setItem('playerState', JSON.stringify(playerState));
}

function loadPlayerState() {
    const savedState = localStorage.getItem('playerState');
    if (savedState) {
        playerState = JSON.parse(savedState);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // (DOM要素の取得などは変更ありません)
    const bannerWrapper = document.querySelector('.banner-swiper .swiper-wrapper');
    const appGrid = document.getElementById('app-grid');
    const mainContents = document.getElementById('main-contents');
    const pageViewer = document.getElementById('page-viewer');
    const pageContent = document.getElementById('page-content');
    const backButton = document.getElementById('back-button');
    const appContainer = document.getElementById('app-container');
    const appFrame = document.getElementById('app-frame');
    const closeAppButton = document.getElementById('close-app-button');
    const contactButton = document.getElementById('contact-button');
    const gameContainer = document.getElementById('game-container');
    const backToPortalButton = document.getElementById('back-to-portal-button');
    const portalHeader = document.querySelector('.site-header');
    const portalFooter = document.querySelector('.site-footer');
    const gameCanvas = document.getElementById('game-canvas');
    const qrScannerContainer = document.getElementById('qr-scanner-container');
    const qrCancelButton = document.getElementById('qr-cancel-button');
    let mySwiper;
    let map;
    let playerMarker = null;
    let destinationMarkers = [];
    let html5QrCode = null;

    const characterButton = document.getElementById('character-button');
    const characterSelectModal = document.getElementById('character-select-modal');
    const closeModalButton = document.getElementById('close-modal-button');
    const characterGrid = document.getElementById('character-grid');

    loadPlayerState(); // アプリ起動時にプレイヤーの状態を読み込む

    // =============================================
    // ゲーム（Googleマップ）の初期化と制御
    // =============================================
    async function initGame() {
        const { Map } = await google.maps.importLibrary("maps");

        // ▼▼▼ 修正 ▼▼▼
        const mapOptions = {
            center: { lat: 36.3910, lng: 139.0609 },
            zoom: 15,
            disableDefaultUI: true,
            // Google Cloud Consoleで作成した新しいマップIDをここに貼り付けます
            mapId: '99dd0dbc4f056e1f512df909'
        };
        // ▲▲▲ 修正 ▲▲▲
        
        console.log("新しいマップIDでマップを初期化します:", mapOptions.mapId);
        map = new Map(gameCanvas, mapOptions);
    
        startGpsTracking();
        fetchDestinationsAndPlaceMarkers();
    }

    function destroyGame() {
        if (playerMarker) {
            playerMarker.map = null; 
            playerMarker = null;
        }
        destinationMarkers.forEach(marker => {
            marker.map = null;
        });
        destinationMarkers = [];
        
        map = null;
        gameCanvas.innerHTML = "";
    }

    // =============================================
    // キャラクター選択モーダルの制御
    // =============================================
    function openCharacterSelectModal() {
        characterGrid.innerHTML = ''; // グリッドを初期化

        characters.forEach(char => {
            const isUnlocked = playerState.unlockedCharacters.includes(char.id);
            const isSelected = playerState.currentCharacterId === char.id;

            const item = document.createElement('div');
            item.className = 'character-item';
            if (!isUnlocked) {
                item.classList.add('locked');
            }
            if (isSelected) {
                item.classList.add('selected');
            }
            item.dataset.charId = char.id;

            const icon = document.createElement('img');
            icon.src = char.selectIconUrl; // 選択画面用の画像を使用
            icon.alt = char.name;
            icon.className = 'character-icon';

            const name = document.createElement('span');
            name.className = 'character-name';
            name.textContent = isUnlocked ? char.name : '???';

            item.appendChild(icon);
            item.appendChild(name);
            characterGrid.appendChild(item);
        });

        characterSelectModal.classList.remove('hidden');
    }

    function closeCharacterSelectModal() {
        characterSelectModal.classList.add('hidden');
    }

    function handleCharacterSelect(event) {
        const selectedItem = event.target.closest('.character-item');
        if (!selectedItem || selectedItem.classList.contains('locked')) {
            return;
        }

        const charId = selectedItem.dataset.charId;
        playerState.currentCharacterId = charId;
        savePlayerState();
        updatePlayerMarkerIcon();
        closeCharacterSelectModal();
    }
    
    // =============================================
    // 目的地マーカーの設置
    // =============================================
    async function placeDestinationMarkers(locations) {
        const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
        
        locations.forEach(location => {
            const img = document.createElement('img');
            img.src = location.icon;
            img.className = 'destination-marker';

            const marker = new AdvancedMarkerElement({
                position: { lat: location.lat, lng: location.lng },
                map: map,
                content: img,
                title: location.name
            });

            marker.customInfo = location;
            marker.isScannable = false; 
            destinationMarkers.push(marker);
        });
    }

    async function fetchDestinationsAndPlaceMarkers() { try { const snapshot = await db.collection('destinations').get(); const locations = []; snapshot.forEach(doc => { const data = doc.data(); data.id = doc.id; locations.push(data); }); await placeDestinationMarkers(locations); } catch (error) { console.error("Error fetching destinations: ", error); alert("目的地のデータの読み込みに失敗しました。"); } }

    // =============================================
    // GPS追跡機能
    // =============================================
    async function startGpsTracking() {
        if (!navigator.geolocation) {
            alert("お使いのブラウザは位置情報機能に対応していません。");
            return;
        }
        
        const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

        navigator.geolocation.watchPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                const currentPos = { lat, lng };

                if (!playerMarker) {
                    const selectedCharacter = characters.find(c => c.id === playerState.currentCharacterId);
                    const playerImg = document.createElement('img');
                    playerImg.src = selectedCharacter.iconUrl; // マップ用のアイコンを反映
                    playerImg.className = 'player-marker';

                    playerMarker = new AdvancedMarkerElement({
                        position: currentPos,
                        map: map,
                        content: playerImg,
                        title: "現在地"
                    });
                    map.setCenter(currentPos);
                } else {
                    playerMarker.position = currentPos;
                }

                checkProximity(currentPos);
            },
            (error) => {
                let errorMessage = "";
                switch(error.code) {
                    case 1: errorMessage = "位置情報の利用が許可されていません。"; break;
                    case 2: errorMessage = "位置情報を特定できませんでした。"; break;
                    case 3: errorMessage = "位置情報の取得がタイムアウトしました。"; break;
                    default: errorMessage = "原因不明のエラーが発生しました。"; break;
                }
                alert(errorMessage);
            },
            {
                enableHighAccuracy: true,
            }
        );
    }

    // プレイヤーアイコンを更新する関数
    async function updatePlayerMarkerIcon() {
        if (!playerMarker) return;
        const selectedCharacter = characters.find(c => c.id === playerState.currentCharacterId);
        if (!selectedCharacter) return;

        const newImg = playerMarker.content.cloneNode(true);
        newImg.src = selectedCharacter.iconUrl; // マップ用のアイコンを反映
        playerMarker.content = newImg;
    }
    
    // =============================================
    // 目的地への近接判定
    // =============================================
    function checkProximity(currentPos) {
        const arrivalThreshold = 50; 

        destinationMarkers.forEach(marker => {
            const destPos = marker.position;
            if (!destPos) return;

            google.maps.importLibrary("geometry").then(geometry => {
                const distance = geometry.spherical.computeDistanceBetween(currentPos, destPos);
                const markerElement = marker.content;
    
                if (!markerElement) return;
    
                if (distance <= arrivalThreshold && !marker.isScannable) {
                    markerElement.classList.add('glow-effect');
                    marker.isScannable = true;
    
                    markerElement.addEventListener('click', () => {
                        startQrScanner(marker);
                    });
    
                } else if (distance > arrivalThreshold && marker.isScannable) {
                    markerElement.classList.remove('glow-effect');
                    marker.isScannable = false;
                    
                    const newElement = markerElement.cloneNode(true);
                    if (markerElement.parentNode) {
                        markerElement.parentNode.replaceChild(newElement, markerElement);
                    }
                    marker.content = newElement;
                }
            });
        });
    }

    // =============================================
    // QRコードスキャナーの制御
    // =============================================
    function startQrScanner(targetMarker) {
        qrScannerContainer.classList.remove('hidden');
        html5QrCode = new Html5Qrcode("qr-reader");

        const qrCodeSuccessCallback = (decodedText, decodedResult) => {
            stopQrScanner();

            // Firestoreのデータに 'unlockableCharacterId' が設定されているかチェック
            const unlockableCharacterId = targetMarker.customInfo.unlockableCharacterId;

            if (unlockableCharacterId && !playerState.unlockedCharacters.includes(unlockableCharacterId)) {
                // 新しいキャラクターをアンロック
                playerState.unlockedCharacters.push(unlockableCharacterId);
                savePlayerState(); // 状態を永続化

                const unlockedChar = characters.find(c => c.id === unlockableCharacterId);
                alert(`QRコードをスキャンしました！\n\n新しいキャラクター「${unlockedChar.name}」が仲間になりました！`);

            } else {
                 alert(`「${targetMarker.title}」でQRコードをスキャンしました！\n内容： ${decodedText}`);
            }
        };
        const config = { fps: 10, qrbox: { width: 250, height: 250 } };
        html5QrCode.start({ facingMode: "environment" }, config, qrCodeSuccessCallback)
            .catch(err => {
                alert("カメラの起動に失敗しました。カメラの使用を許可してください。");
                stopQrScanner();
            });
    }

    function stopQrScanner() { if (html5QrCode && html5QrCode.isScanning) { html5QrCode.stop().then(ignore => { console.log("QR Code scanning stopped."); }).catch(err => { console.error("Failed to stop QR Code scanning.", err); }); } qrScannerContainer.classList.add('hidden'); }
    qrCancelButton.addEventListener('click', stopQrScanner);

    // (ポータルサイト関連の関数群は変更ありません)
    const preloadedUrls = new Set();
    function preloadResources(urls) { urls.forEach(url => { if (!url || preloadedUrls.has(url)) return; const link = document.createElement('link'); link.rel = 'prefetch'; link.href = url; if (url.endsWith('.mp4')) { link.as = 'video'; } else { link.as = 'fetch'; } document.head.appendChild(link); preloadedUrls.add(url); }); }
    function preloadAllBannerContents() { const resourcesToPreload = []; appDatabase.forEach(app => { if (app.showOnBanner) { if (app.howToPage) resourcesToPreload.push(app.howToPage); if (app.videoUrl && app.videoUrl !== '') resourcesToPreload.push(app.videoUrl); if (app.url && app.url !== '') resourcesToPreload.push(app.url); } }); preloadResources(resourcesToPreload); }
    function launchApp(url) { if (!url) { alert('このアプリは現在準備中です。'); return; } appFrame.src = url; mainContents.classList.add('hidden'); pageViewer.classList.add('hidden'); appContainer.classList.remove('hidden'); }
    function closeApp() { appContainer.classList.add('hidden'); mainContents.classList.remove('hidden'); appFrame.src = ""; if (mySwiper) mySwiper.destroy(); initializeSwiper(); }
    async function showPage(pagePath) { if (!pagePath) return; try { const response = await fetch(pagePath); if (!response.ok) { throw new Error('Network response was not ok.'); } const markdown = await response.text(); pageContent.innerHTML = marked.parse(markdown); const video = pageContent.querySelector('video'); if (video) { video.volume = 0.5; video.play().catch(e => console.log("Autoplay was prevented.")); } mainContents.classList.add('hidden'); pageViewer.classList.remove('hidden'); window.scrollTo(0, 0); } catch (error) { console.error('Error fetching or parsing page:', error); pageContent.innerHTML = '<h2>Page failed to load</h2>'; mainContents.classList.add('hidden'); pageViewer.classList.remove('hidden'); } }
    function showMainContents() { pageViewer.classList.add('hidden'); appContainer.classList.add('hidden'); mainContents.classList.remove('hidden'); }
    function generateBanners() { const bannerApps = appDatabase.filter(app => app.showOnBanner); bannerApps.forEach(app => { const slide = document.createElement('div'); slide.className = 'swiper-slide'; slide.innerHTML = `<a href="#" data-page="${app.howToPage}"><img src="${app.bannerImage}" alt="${app.title}"><div class="slide-overlay"><span class="slide-title">${app.title}</span><button class="slide-button">${app.bannerButtonText}</button></div></a>`; bannerWrapper.appendChild(slide); }); bannerWrapper.addEventListener('click', (event) => { const link = event.target.closest('a'); if (link && link.dataset.page) { event.preventDefault(); showPage(link.dataset.page); } }); }
    function generateAppGrid() { appDatabase.forEach(app => { const link = document.createElement('a'); link.href = "#"; link.className = 'app-item'; link.addEventListener('click', (event) => { event.preventDefault(); launchApp(app.url); }); const icon = document.createElement('img'); icon.src = app.icon; icon.alt = app.title; icon.className = 'app-icon'; const title = document.createElement('span'); title.className = 'app-title'; title.textContent = app.title; link.appendChild(icon); link.appendChild(title); appGrid.appendChild(link); }); }
    function initializeSwiper() { mySwiper = new Swiper('.banner-swiper', { loop: true, speed: 1500, autoplay: { delay: 2000, disableOnInteraction: false }, centeredSlides: true, slidesPerView: 3, spaceBetween: 20, breakpoints: { 0: { slidesPerView: 1.2, spaceBetween: 10 }, 768: { slidesPerView: 3, spaceBetween: 20 }, }, observer: true, observeParents: true, pagination: { el: '.swiper-pagination', clickable: true }, }); }
    if (contactButton) { contactButton.addEventListener('click', (event) => { event.preventDefault(); portalHeader.classList.add('hidden'); mainContents.classList.add('hidden'); pageViewer.classList.add('hidden'); appContainer.classList.add('hidden'); portalFooter.classList.add('hidden'); gameContainer.classList.remove('hidden'); if (typeof google !== 'undefined' && google.maps) { initGame(); } else { console.error("Google Maps API is not loaded yet."); alert("マップの読み込みに失敗しました。時間をおいて再度お試しください。"); } }); }
    if (backToPortalButton) { backToPortalButton.addEventListener('click', () => { gameContainer.classList.add('hidden'); portalHeader.classList.remove('hidden'); mainContents.classList.remove('hidden'); portalFooter.classList.remove('hidden'); destroyGame(); }); }
    
    // 新機能のイベントリスナー
    characterButton.addEventListener('click', openCharacterSelectModal);
    closeModalButton.addEventListener('click', closeCharacterSelectModal);
    characterGrid.addEventListener('click', handleCharacterSelect);

    generateBanners();
    generateAppGrid();
    initializeSwiper();
    preloadAllBannerContents();
    closeAppButton.addEventListener('click', closeApp);
    backButton.addEventListener('click', () => { const video = pageContent.querySelector('video'); if (video) { video.pause(); video.currentTime = 0; } showMainContents(); if (mySwiper) mySwiper.destroy(); initializeSwiper(); });
});