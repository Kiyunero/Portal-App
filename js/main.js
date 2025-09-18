// Firebase設定
const firebaseConfig = {
    apiKey: "AIzaSyC0CAJL4tR7DI5qglKYYP6Mw-0ds6FC6vU",
    authDomain: "chaos-map-data-f2395.firebaseapp.com",
    projectId: "chaos-map-data-f2395",
    storageBucket: "chaos-map-data-f2395.firebasestorage.app",
    messagingSenderId: "372157587318",
    appId: "1:372157587318:web:ee075f0ae1391af43aa457"
  };
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

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
    },
    {
        id: 'mebuku',
        title: 'サンデンRS',
        icon: 'https://www.sanden-rs.com/company/sprati0000002xb3-img/kaishagaiyou.jpg',
        url: 'https://kiyunero.github.io/uxitti-zu-point-koukan-system-jihanki-/',
        showOnBanner: true,
        bannerImage: 'images/banner_mebuku.png',
        bannerButtonText: 'MORE',
        howToPage: 'how-to/mebuku.md',
    },
    {
        id: 'mebuku-sumaho',
        title: 'めぶく前橋(スマホ)',
        icon: 'images/app_icon_mebuku.png',
        url: 'https://kiyunero.github.io/uxitti-zu-point-koukan-system-sumaho/',
        showOnBanner: false,
        bannerImage: 'images/banner_mebuku.png',
        bannerButtonText: 'MORE',
        howToPage: 'how-to/mebuku-sumaho.md',
    },
    {
        id: 'maebasi-wiches',
        title: '前橋ウィッチーズ',
        icon: 'images/app_icon_witch.png',
        url: 'https://kiyunero.github.io/uxitti-zu_61/',
        showOnBanner: true,
        bannerImage: 'images/banner_witch.png',
        bannerButtonText: 'MORE',
        howToPage: 'how-to/maebashi-witches.md',
    },
    {
        id: 'zasupa',
        title: 'ザスパ草津選手名鑑',
        icon: 'images/app_icon_zasupa.png',
        url: 'https://kiyunero.github.io/zasupa_sensyuzukan/',
        showOnBanner: true,
        bannerImage: 'images/banner_zasupa.png',
        bannerButtonText: 'MORE',
        howToPage: 'how-to/zasupa.md',
    },
    {
        id: 'monster-hunter',
        title: 'Monster Hunter Wilds',
        icon: 'images/app_icon_monhan.png',
        url: 'https://www.monsterhunter.com/wilds/ja-jp/',
        showOnBanner: true,
        bannerImage: 'images/banner_monhan.png',
        bannerButtonText: 'MORE',
        howToPage: 'how-to/monster-hunter.md',
    },
    {
        id: 'manga',
        title: 'Seichi GO!',
        icon: 'images/app_icon_manga.png',
        url: 'https://kiyunero.github.io/manga_seitijunrei/',
        showOnBanner: true,
        bannerImage: 'images/banner_manga.png',
        bannerButtonText: 'MORE',
        howToPage: 'how-to/manga.md',
    },
    {
        id: 'sanden-jikkenntou',
        title: 'サンデン実験室探検',
        icon: 'https://www.sanden-rs.com/company/sprati0000000mq7-img/AP_kyoten_240.png',
        url: 'https://kiyunero.github.io/sandenRS-MAP-sumaho/',
        showOnBanner: false,
        bannerImage: 'images/banner_ASJ.png',
        bannerButtonText: 'MORE',
        howToPage: 'how-to/asj-hotel.md',
    },
];

const characterGroups = [
    {
        groupName: '前橋ウィッチーズ',
        characters: [
            { id: 'char02', name: 'ユイナ', iconUrl: 'images/yuina.gif', selectIconUrl: 'images/select_yuina.png' },
            { id: 'char03', name: 'チョコ', iconUrl: 'images/tyoko.gif', selectIconUrl: 'images/select_tyoko.png' },
            { id: 'char04', name: 'アズ', iconUrl: 'images/azu.gif', selectIconUrl: 'images/select_azu.png' },
            { id: 'char05', name: 'マイ', iconUrl: 'images/mai.gif', selectIconUrl: 'images/select_mai.png' },
            { id: 'char06', name: 'キョウカ', iconUrl: 'images/kyouka.gif', selectIconUrl: 'images/select_kyouka.png' },
        ]
    },
    {
        groupName: 'その他',
        characters: [
            { id: 'char01', name: '自販機ロボ', iconUrl: 'images/jihanki.gif', selectIconUrl: 'images/select_jihanki.png' },
            { id: 'char07', name: '係長', iconUrl: 'images/sarari-manneo.gif', selectIconUrl: 'images/select_sarari-man.png' },
            { id: 'char08', name: '間抜作', iconUrl: 'images/nukesaku.gif', selectIconUrl: 'images/select_baka.png' },
            { id: 'char09', name: 'オスカル', iconUrl: 'images/osukaru.gif', selectIconUrl: 'images/select_osukaru.png' },
        ]
    }
];

const characters = characterGroups.flatMap(group => group.characters);

let playerState = {
    currentCharacterId: 'char01',
    unlockedCharacters: ['char01','char02','char03','char04','char05','char06']
};

// ▼▼▼ ここから追加 ▼▼▼
// Firebaseから取得したキャラクターと合言葉のペアを保存する配列
let characterPasswords = [];
// ▲▲▲ ここまで追加 ▲▲▲

async function savePlayerState() {
    const user = auth.currentUser;
    if (user) {
        try {
            await db.collection('players').doc(user.uid).set(playerState, { merge: true });
        } catch (error) {
            console.error("プレイヤーデータの保存に失敗しました: ", error);
        }
    }
}

async function loadPlayerState() {
    const user = auth.currentUser;
    if (user) {
        const docRef = db.collection('players').doc(user.uid);
        const doc = await docRef.get();
        if (doc.exists) {
            playerState = doc.data();
            console.log("プレイヤーデータをFirestoreから読み込みました。");
        } else {
            console.log("新規ユーザーです。初期データを作成します。");
            await savePlayerState();
        }
    }
}

// ▼▼▼ ここから追加 ▼▼▼
/**
 * Firebaseの`characters`コレクションから合言葉データを取得する関数
 * @returns {Promise<void>}
 */
async function fetchCharacterPasswords() {
    try {
        const snapshot = await db.collection('characters').get();
        // ドキュメントIDをキャラクターIDとして、データを格納
        characterPasswords = snapshot.docs.map(doc => ({
            id: doc.id,
            password: doc.data().password
        }));
        console.log("キャラクターの合言葉データを読み込みました。", characterPasswords);
    } catch (error) {
        console.error("キャラクターの合言葉データの読み込みに失敗しました: ", error);
        alert("キャラクターの合言葉データの読み込みに失敗しました。");
    }
}
// ▲▲▲ ここまで追加 ▲▲▲


async function signInAnonymously() {
    try {
        await auth.signInAnonymously();
        console.log("匿名認証に成功しました。UID:", auth.currentUser.uid);
    } catch (error) {
        console.error("匿名認証に失敗しました:", error);
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    // DOM要素の取得
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
    const passwordModal = document.getElementById('password-modal');
    const passwordInput = document.getElementById('password-input');
    const passwordSubmitButton = document.getElementById('password-submit-button');
    const passwordCancelButton = document.getElementById('password-cancel-button');
    let mySwiper;
    let map;
    let playerMarker = null;
    let destinationMarkers = [];
    let watchId = null;

    const characterButton = document.getElementById('character-button');
    const characterSelectModal = document.getElementById('character-select-modal');
    const closeModalButton = document.getElementById('close-modal-button');
    const characterGrid = document.getElementById('character-grid');

    // ▼▼▼ ここから追加 ▼▼▼
    const unlockButton = document.getElementById('unlock-button');
    // ▲▲▲ ここまで追加 ▲▲▲

    await signInAnonymously();
    await loadPlayerState();
    // ▼▼▼ ここから追加 ▼▼▼
    await fetchCharacterPasswords(); // 合言葉リストを取得
    // ▲▲▲ ここまで追加 ▲▲▲

    async function initGame() {
        const { Map } = await google.maps.importLibrary("maps");
        const mapOptions = {
            center: { lat: 36.3910, lng: 139.0609 },
            zoom: 15,
            disableDefaultUI: true,
            mapId: '99dd0dbc4f056e1f512df909'
        };
        map = new Map(gameCanvas, mapOptions);
        startGpsTracking();
        fetchDestinationsAndPlaceMarkers();
    }

    function destroyGame() {
        if (watchId !== null) {
            navigator.geolocation.clearWatch(watchId);
            watchId = null;
            console.log("GPS追跡を停止しました。");
        }
        if (playerMarker) {
            playerMarker.map = null; 
            playerMarker = null;
        }
        destinationMarkers.forEach(marker => { marker.map = null; });
        destinationMarkers = [];
        map = null;
        gameCanvas.innerHTML = "";
    }

    function openCharacterSelectModal() {
        characterGrid.innerHTML = '';
        characterGroups.forEach(group => {
            const groupContainer = document.createElement('div');
            groupContainer.className = 'character-group';
            const groupTitle = document.createElement('h3');
            groupTitle.className = 'character-group-title';
            groupTitle.textContent = group.groupName;
            groupContainer.appendChild(groupTitle);
            const groupGrid = document.createElement('div');
            groupGrid.className = 'character-group-grid';
            group.characters.forEach(char => {
                const isUnlocked = playerState.unlockedCharacters.includes(char.id);
                const isSelected = playerState.currentCharacterId === char.id;
                const item = document.createElement('div');
                item.className = 'character-item';
                if (!isUnlocked) item.classList.add('locked');
                if (isSelected) item.classList.add('selected');
                item.dataset.charId = char.id;
                const icon = document.createElement('img');
                icon.src = char.selectIconUrl;
                icon.alt = char.name;
                icon.className = 'character-icon';
                const name = document.createElement('span');
                name.className = 'character-name';
                name.textContent = isUnlocked ? char.name : '???';
                item.appendChild(icon);
                item.appendChild(name);
                groupGrid.appendChild(item);
            });
            groupContainer.appendChild(groupGrid);
            characterGrid.appendChild(groupContainer);
        });
        characterSelectModal.classList.remove('hidden');
    }

    function closeCharacterSelectModal() {
        characterSelectModal.classList.add('hidden');
    }

    function handleCharacterSelect(event) {
        const selectedItem = event.target.closest('.character-item');
        if (!selectedItem || selectedItem.classList.contains('locked')) return;
        const charId = selectedItem.dataset.charId;
        playerState.currentCharacterId = charId;
        savePlayerState();
        updatePlayerMarkerIcon();
        closeCharacterSelectModal();
    }
    
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
            destinationMarkers.push(marker);
        });
    }

    async function fetchDestinationsAndPlaceMarkers() {
        try {
            const snapshot = await db.collection('destinations').get();
            const locations = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            await placeDestinationMarkers(locations);
        } catch (error) {
            console.error("Error fetching destinations: ", error);
            alert("目的地のデータの読み込みに失敗しました。");
        }
    }

    async function startGpsTracking() {
        if (!navigator.geolocation) {
            alert("お使いのブラウザは位置情報機能に対応していません。");
            return;
        }
        const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
        if (watchId !== null) navigator.geolocation.clearWatch(watchId);
        watchId = navigator.geolocation.watchPosition(
            (position) => {
                const currentPos = { lat: position.coords.latitude, lng: position.coords.longitude };
                if (!playerMarker) {
                    const selectedCharacter = characters.find(c => c.id === playerState.currentCharacterId);
                    const playerImg = document.createElement('img');
                    playerImg.src = selectedCharacter.iconUrl;
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
                const messages = { 1: "位置情報の利用が許可されていません。", 2: "位置情報を特定できませんでした。", 3: "位置情報の取得がタイムアウトしました。" };
                alert(messages[error.code] || "原因不明のエラーが発生しました。");
            },
            { enableHighAccuracy: true }
        );
    }

    async function updatePlayerMarkerIcon() {
        if (!playerMarker) return;
        const selectedCharacter = characters.find(c => c.id === playerState.currentCharacterId);
        if (!selectedCharacter) return;
        const newImg = playerMarker.content.cloneNode(true);
        newImg.src = selectedCharacter.iconUrl;
        playerMarker.content = newImg;
    }
    
    // ▼▼▼ ここから変更 ▼▼▼
    // 距離に応じた処理は不要になったため、関数の中身を空にするか、マーカーを光らせるだけの視覚効果に留める
    // ここでは、念のため関数自体は残しておく
    function checkProximity(currentPos) {
        // この関数はキャラクター開放ロジックとは無関係になった
        const arrivalThreshold = 50; 
        destinationMarkers.forEach(marker => {
            const destPos = marker.position;
            if (!destPos) return;
            google.maps.importLibrary("geometry").then(geometry => {
                const distance = geometry.spherical.computeDistanceBetween(currentPos, destPos);
                const markerElement = marker.content;
                if (!markerElement) return;

                // 視覚効果としてマーカーを光らせる場合は以下のコードを残す
                if (distance <= arrivalThreshold) {
                    markerElement.classList.add('glow-effect');
                } else {
                    markerElement.classList.remove('glow-effect');
                }
            });
        });
    }
    // ▲▲▲ ここまで変更 ▲▲▲

    // ▼▼▼ ここから変更 ▼▼▼
    // パスワードモーダルのロジックを修正
    
    function openPasswordModal() {
        passwordInput.value = "";
        passwordModal.classList.remove('hidden');
        passwordInput.focus();
    }
    
    function closePasswordModal() {
        passwordModal.classList.add('hidden');
    }

    /**
     * 入力された合言葉を検証し、キャラクターをアンロックする関数
     */
    function handlePasswordSubmit() {
        const enteredPassword = passwordInput.value;
        if (enteredPassword.length !== 6) {
            alert("合言葉は６桁で入力してください。");
            return;
        }

        // 入力された合言葉に一致するキャラクターを探す
        const targetCharacter = characterPasswords.find(char => char.password === enteredPassword);

        if (targetCharacter) {
            // 合言葉が一致した場合
            const characterId = targetCharacter.id;
            
            if (playerState.unlockedCharacters.includes(characterId)) {
                // すでに開放済みの場合
                alert("このキャラクターはすでに仲間になっています！");
            } else {
                // 新しく開放する場合
                playerState.unlockedCharacters.push(characterId);
                savePlayerState(); // Firestoreに保存
                const unlockedCharInfo = characters.find(c => c.id === characterId);
                const characterName = unlockedCharInfo ? unlockedCharInfo.name : "新しい仲間";
                alert(`正解！\n\n「${characterName}」が仲間になりました！`);
            }
            closePasswordModal();
        } else {
            // 合言葉が一致しなかった場合
            alert("合言葉が違います。");
            passwordInput.value = "";
            passwordInput.focus();
        }
    }
    // ▲▲▲ ここまで変更 ▲▲▲
    
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
    
    // イベントリスナー
    passwordSubmitButton.addEventListener('click', handlePasswordSubmit);
    passwordCancelButton.addEventListener('click', closePasswordModal);
    // ▼▼▼ ここから追加 ▼▼▼
    unlockButton.addEventListener('click', openPasswordModal);
    // ▲▲▲ ここまで追加 ▲▲▲
    if (contactButton) { contactButton.addEventListener('click', (event) => { event.preventDefault(); portalHeader.classList.add('hidden'); mainContents.classList.add('hidden'); pageViewer.classList.add('hidden'); appContainer.classList.add('hidden'); portalFooter.classList.add('hidden'); gameContainer.classList.remove('hidden'); if (typeof google !== 'undefined' && google.maps) { initGame(); } else { alert("マップの読み込みに失敗しました。時間をおいて再度お試しください。"); } }); }
    if (backToPortalButton) { backToPortalButton.addEventListener('click', () => { gameContainer.classList.add('hidden'); portalHeader.classList.remove('hidden'); mainContents.classList.remove('hidden'); portalFooter.classList.remove('hidden'); destroyGame(); }); }
    characterButton.addEventListener('click', openCharacterSelectModal);
    closeModalButton.addEventListener('click', closeCharacterSelectModal);
    characterGrid.addEventListener('click', handleCharacterSelect);
    closeAppButton.addEventListener('click', closeApp);
    backButton.addEventListener('click', () => { const video = pageContent.querySelector('video'); if (video) { video.pause(); video.currentTime = 0; } showMainContents(); if (mySwiper) mySwiper.destroy(); initializeSwiper(); });
    
    // 初期化処理
    generateBanners();
    generateAppGrid();
    initializeSwiper();
    preloadAllBannerContents();
});