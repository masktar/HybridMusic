// --- js/main.js ---

// ================= 1. KHỞI TẠO =================
let currentPlaylist = [];
let songIndex = 0;
let currentKey = 'home';
let isPlaying = false;
let isShuffle = false;
let isRepeat = false;
let isDraggingProgress = false;
let isDraggingVolume = false;

// DOM Elements
const audio = document.getElementById('audio');
const playBtn = document.getElementById('btn-play');
const playIcon = playBtn.querySelector('i');
const prevBtn = document.getElementById('btn-prev');
const nextBtn = document.getElementById('btn-next');
const shuffleBtn = document.getElementById('btn-shuffle');
const repeatBtn = document.getElementById('btn-repeat');
const songNameEl = document.getElementById('player-song-name');
const artistNameEl = document.getElementById('player-artist-name');
const focusSongEl = document.getElementById('focus-song-info');
const playerImgEl = document.querySelector('.player-img');
const progressContainer = document.querySelector('.progress-bar');
const progressFill = document.querySelector('.progress-fill');
const timeCurrent = document.querySelector('.time-text:first-child');
const timeDuration = document.querySelector('.time-text:last-child');
const volumeContainer = document.querySelector('.volume-bar');
const volumeFill = document.querySelector('.volume-fill');
const volumeIcon = document.querySelector('.fa-volume-high');

// Lấy danh sách tim từ bộ nhớ
let favorites = JSON.parse(localStorage.getItem('myFavorites')) || [];

// ================= 2. CONTROLLER =================

// Hàm CHÍNH để chuyển đổi giữa các trang
// --- File js/main.js ---

function switchPlaylist(key) {
    currentKey = key;

    // --- LOGIC 1: MỤC YÊU THÍCH ---
    if (key === 'favorites') {
        let likedNames = JSON.parse(localStorage.getItem('myFavorites')) || [];
        let uniqueFavoriteSongs = [];
        let seenNames = new Set();

        for (let k in allPlaylists) {
            if (allPlaylists[k].songs) {
                allPlaylists[k].songs.forEach(song => {
                    if (likedNames.includes(song.name) && !seenNames.has(song.name)) {
                        uniqueFavoriteSongs.push(song);
                        seenNames.add(song.name);
                    }
                });
            }
        }
        currentPlaylist = uniqueFavoriteSongs;
        playlistHeader.style.display = 'none';
        renderFavoritesPage();
        renderSidebar();
        
        // GỌI HÀM CUỘN TRANG (ĐÃ FIX)
        scrollToTop(); 
        
        return;
    }

    // --- LOGIC 2: CÁC MỤC KHÁC ---
    const data = allPlaylists[key];
    currentPlaylist = data.songs;

    if (data.type === 'home' || data.type === 'artist') playlistHeader.style.display = 'none';
    else { playlistHeader.style.display = 'flex'; playlistTitle.innerText = data.title; }

    if (data.type === 'home') renderHomePage();
    else if (data.type === 'artist') renderArtistPage(data);
    else renderVerticalList();
    renderSidebar();

    // GỌI HÀM CUỘN TRANG (ĐÃ FIX)
    scrollToTop();
}

// --- HÀM PHỤ TRỢ: CUỘN LÊN ĐẦU (Thêm hàm này vào cuối file main.js) ---
function scrollToTop() {
    // Dùng setTimeout để đợi 50ms cho giao diện vẽ xong hẳn rồi mới cuộn
    setTimeout(() => {
        const container = document.getElementById('playlist-container');
        
        // 1. Cuộn bản thân container (nếu nó có scroll)
        if (container) container.scrollTop = 0;
        
        // 2. QUAN TRỌNG: Cuộn thẻ CHA của nó (thường là nơi chứa thanh cuộn thật sự)
        if (container && container.parentElement) {
            container.parentElement.scrollTop = 0;
        }

        // 3. Cuộn toàn trang (dự phòng)
        window.scrollTo(0, 0);
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
        
        // 4. Tìm thẻ main-view (nếu bạn đặt class này trong HTML)
        const mainView = document.querySelector('.main-view'); // Hoặc class chứa thanh cuộn của bạn
        if (mainView) mainView.scrollTop = 0;

    }, 1); // Độ trễ 50ms là đủ để mắt thường không nhận ra nhưng máy tính xử lý kịp
}
function playSpecificSong(index) {
    songIndex = index;
    loadSong(currentPlaylist[songIndex]);
    playSong();

    // Highlight bài đang phát
    if (allPlaylists[currentKey].type === 'artist') renderArtistPage(allPlaylists[currentKey]);
    else if (allPlaylists[currentKey].type !== 'home' && currentKey !== 'favorites') renderVerticalList();
    // Lưu ý: Home và Favorites không cần vẽ lại highlight list vì chúng dùng giao diện Grid/Custom
}

function playRandomAndExpand() {
    if (currentPlaylist.length === 0 && allPlaylists['home'].songs) {
        currentPlaylist = allPlaylists['home'].songs;
    }
    songIndex = Math.floor(Math.random() * currentPlaylist.length);
    loadSong(currentPlaylist[songIndex]);
    playSong();
    openNowPlaying();
}

function openNowPlaying() {
    const currentSong = currentPlaylist[songIndex];
    if (!currentSong) return;
    let artistData = null;
    if (allPlaylists[currentKey] && allPlaylists[currentKey].type === 'artist') {
        artistData = allPlaylists[currentKey];
    } else {
        // Tìm artist data thủ công
        for (let key in allPlaylists) {
            if (allPlaylists[key].title === currentSong.artist) { artistData = allPlaylists[key]; break; }
        }
    }
    renderSongDetailPage(currentSong, artistData);
}

function restorePreviousView() { switchPlaylist(currentKey); }

function loadSong(song) {
    songNameEl.innerText = song.name;
    artistNameEl.innerText = song.artist;
    audio.src = song.src;
    if (focusSongEl) focusSongEl.innerText = `Đang phát: ${song.name} - ${song.artist}`;
}

function playSong() { isPlaying = true; audio.play(); playIcon.className = 'fa-solid fa-pause'; }
function pauseSong() { isPlaying = false; audio.pause(); playIcon.className = 'fa-solid fa-play'; }
function togglePlay() {
    if (!audio.src || audio.src === "") {
        if (allPlaylists['home']) { currentKey = 'home'; currentPlaylist = allPlaylists['home'].songs; playSpecificSong(0); }
    } else { isPlaying ? pauseSong() : playSong(); }
}

function nextSong() {
    if (isShuffle) {
        let newIndex;
        do { newIndex = Math.floor(Math.random() * currentPlaylist.length); } while (newIndex === songIndex && currentPlaylist.length > 1);
        songIndex = newIndex;
    } else {
        songIndex++;
        if (songIndex > currentPlaylist.length - 1) songIndex = 0;
    }
    loadSong(currentPlaylist[songIndex]); playSong(); updateInterfaceAfterChange();
}

function prevSong() {
    songIndex--;
    if (songIndex < 0) songIndex = currentPlaylist.length - 1;
    loadSong(currentPlaylist[songIndex]); playSong(); updateInterfaceAfterChange();
}

function updateInterfaceAfterChange() {
    if (document.querySelector('.song-detail-page')) openNowPlaying();
    else if (allPlaylists[currentKey].type === 'artist') renderArtistPage(allPlaylists[currentKey]);
    else if (allPlaylists[currentKey].type !== 'home' && currentKey !== 'favorites') renderVerticalList();
}
function onSongEnded() { isRepeat ? playSpecificSong(songIndex) : nextSong(); }

// ================= 3. HELPER & FEATURES =================
function formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
}
function calculateGlobalPercent(e, container) {
    const rect = container.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    let percent = clickX / rect.width;
    if (percent < 0) percent = 0; if (percent > 1) percent = 1;
    return percent;
}
function handleProgressDrag(e) {
    const percent = calculateGlobalPercent(e, progressContainer);
    progressFill.style.width = `${percent * 100}%`;
    if (audio.duration) { const seekTime = percent * audio.duration; timeCurrent.innerText = formatTime(seekTime); audio.currentTime = seekTime; }
}
function handleVolumeDrag(e) {
    const percent = calculateGlobalPercent(e, volumeContainer);
    audio.volume = percent;
    volumeFill.style.width = `${percent * 100}%`;
    volumeIcon.className = percent === 0 ? 'fa-solid fa-volume-xmark' : 'fa-solid fa-volume-high';
}

function checkIsLiked(songName) { return favorites.includes(songName); }

function toggleHeart(songName, event) {
    if (event) event.stopPropagation(); // Ngăn click thẻ
    const btn = event.target;
    const index = favorites.indexOf(songName);

    if (index > -1) {
        favorites.splice(index, 1);
        btn.classList.remove('liked', 'fa-solid'); btn.classList.add('fa-regular');
    } else {
        favorites.push(songName);
        btn.classList.add('liked', 'fa-solid'); btn.classList.remove('fa-regular');
    }
    localStorage.setItem('myFavorites', JSON.stringify(favorites));
}

// --- TÍNH NĂNG: TÌM KIẾM ---
// --- Sửa trong file js/main.js (Phần Tính năng tìm kiếm) ---

const searchInput = document.querySelector('input[placeholder*="Tìm kiếm"]');
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const keyword = e.target.value.toLowerCase().trim();
        
        // Nếu ô tìm kiếm trống -> Trả về trang chủ
        if (keyword === '') { 
            switchPlaylist('home'); 
            return; 
        }

        // --- LOGIC MỚI: TÌM KIẾM CÓ LỌC TRÙNG ---
        let uniqueResults = [];
        let seenNames = new Set(); // Bộ nhớ để ghi lại những bài đã lấy

        // Quét qua tất cả playlist
        for (let key in allPlaylists) {
            if (allPlaylists[key].songs) {
                allPlaylists[key].songs.forEach(song => {
                    // 1. Kiểm tra từ khóa (Tên bài hát HOẶC Tên ca sĩ)
                    const isMatch = song.name.toLowerCase().includes(keyword) || 
                                  song.artist.toLowerCase().includes(keyword);
                    
                    // 2. Kiểm tra trùng lặp (Chưa có trong danh sách đã lấy)
                    if (isMatch && !seenNames.has(song.name)) {
                        uniqueResults.push(song); // Thêm vào kết quả
                        seenNames.add(song.name); // Đánh dấu là đã lấy
                    }
                });
            }
        }
        
        // Cập nhật playlist hiện tại là kết quả đã lọc
        currentPlaylist = uniqueResults; 
        renderHomePage(); // Vẽ lại giao diện (Nó sẽ dùng currentPlaylist mới)
        
        // Sửa tiêu đề
        const headerTitle = document.querySelector('.section-header span');
        if (headerTitle) headerTitle.innerText = `Kết quả tìm kiếm: "${keyword}"`;
    });
}

// --- TÍNH NĂNG: BÀN PHÍM ---
document.addEventListener('keydown', (e) => {
    if (document.activeElement.tagName === 'INPUT') return;
    switch (e.code) {
        case 'Space': e.preventDefault(); togglePlay(); break;
        case 'ArrowRight': nextSong(); break;
        case 'ArrowLeft': prevSong(); break;
        case 'ArrowUp': e.preventDefault(); if (audio.volume < 1) audio.volume = Math.min(1, audio.volume + 0.1); volumeFill.style.width = `${audio.volume * 100}%`; break;
        case 'ArrowDown': e.preventDefault(); if (audio.volume > 0) audio.volume = Math.max(0, audio.volume - 0.1); volumeFill.style.width = `${audio.volume * 100}%`; break;
    }
});

// ================= 4. GẮN SỰ KIỆN =================
playBtn.addEventListener('click', togglePlay);
nextBtn.addEventListener('click', nextSong);
prevBtn.addEventListener('click', prevSong);
audio.addEventListener('ended', onSongEnded);
if (playerImgEl) { playerImgEl.style.cursor = 'pointer'; playerImgEl.onclick = openNowPlaying; }
if (songNameEl) { songNameEl.style.cursor = 'pointer'; songNameEl.onclick = openNowPlaying; }

shuffleBtn.onclick = () => { isShuffle = !isShuffle; shuffleBtn.classList.toggle('icon-active', isShuffle); if (isShuffle) { isRepeat = false; repeatBtn.classList.remove('icon-active'); } };
repeatBtn.onclick = () => { isRepeat = !isRepeat; repeatBtn.classList.toggle('icon-active', isRepeat); if (isRepeat) { isShuffle = false; shuffleBtn.classList.remove('icon-active'); } };

audio.addEventListener('timeupdate', (e) => {
    if (isDraggingProgress) return;
    const { duration, currentTime } = e.srcElement;
    if (!isNaN(duration)) {
        const percent = (currentTime / duration) * 100;
        progressFill.style.width = `${percent}%`;
        timeCurrent.innerText = formatTime(currentTime);
        timeDuration.innerText = formatTime(duration);
    }
});
progressContainer.addEventListener('mousedown', (e) => { isDraggingProgress = true; handleProgressDrag(e); });
volumeContainer.addEventListener('mousedown', (e) => { isDraggingVolume = true; handleVolumeDrag(e); });
document.addEventListener('mousemove', (e) => { if (isDraggingProgress) handleProgressDrag(e); if (isDraggingVolume) handleVolumeDrag(e); });
document.addEventListener('mouseup', () => { isDraggingProgress = false; isDraggingVolume = false; });

// ================= 5. START =================
const IDLE_TIME = 10000; let idleTimer;
const uiLayer = document.getElementById('mainInterface');
const clockEl = document.getElementById('clock');
const dateEl = document.getElementById('date');
function updateClock() { const now = new Date(); if (clockEl) clockEl.innerText = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`; if (dateEl) dateEl.innerText = now.toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'numeric' }); }
setInterval(updateClock, 1000);
function goFocus() { if (uiLayer) uiLayer.classList.add('hide-ui'); }
function wakeUp() { if (uiLayer) uiLayer.classList.remove('hide-ui'); clearTimeout(idleTimer); idleTimer = setTimeout(goFocus, IDLE_TIME); }

window.onload = () => { switchPlaylist('home'); updateClock(); wakeUp(); audio.volume = 0.5; volumeFill.style.width = '50%'; };
document.onmousemove = wakeUp; document.onkeypress = wakeUp; document.onclick = wakeUp;